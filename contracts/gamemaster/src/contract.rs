#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

mod contract_state;
mod games;
mod zk_compute;

use core::panic;

use bitvec::prelude::*;
use games::game_behaviour::GameBehaviour;

use contract_state::{ContractState, CurrentGame, Game, GameStatus, PlayerOutcome, SecretVarType};
use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::shortname::ShortnameZkComputation;
use pbc_contract_common::zk::ZkState;
use pbc_contract_common::zk::{ZkClosed, ZkInputDef, ZkStateChange};
use pbc_zk::{Sbi8, SecretVarId};
use read_write_rpc_derive::ReadWriteRPC;

#[derive(CreateTypeSpec, ReadWriteRPC)]
enum GameSettings {
    #[discriminant(0)]
    GuessTheNumberGame { winner_point: u32 },
    #[discriminant(1)]
    Sabotage {
        sabotage_point: u32,
        protect_point_cost: u32,
    },
}

#[init(zk = true)]
fn initialize(
    ctx: ContractContext,
    zk_state: ZkState<SecretVarType>,
    games: Vec<GameSettings>,
) -> (ContractState, Vec<EventGroup>) {
    let games: Vec<Game> = games
        .into_iter()
        .map(|game| match game {
            GameSettings::GuessTheNumberGame { winner_point } => Game::GuessTheNumber {
                winner_point,
                wrong_guesses: vec![],
                winner: None,
                ready_to_start: false,
            },
            GameSettings::Sabotage {
                sabotage_point,
                protect_point_cost,
            } => Game::Sabotage {
                sabotage_point,
                protect_point_cost,
                result: vec![],
            },
        })
        .collect();

    let state = ContractState {
        administrator: ctx.sender,
        players: vec![],
        games,
        current_game: CurrentGame {
            index: 0,
            status: GameStatus::NotStarted {},
        },
        points: vec![],
    };

    (state, vec![])
}

fn is_game_started(state: &ContractState) -> bool {
    state.current_game.index != 0 || state.current_game.status != GameStatus::NotStarted {}
}

#[action(shortname = 0x00, zk = true)]
fn sign_up(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>) {
    assert!(!is_game_started(&state), "Game is already active");
    assert!(
        !state.players.contains(&context.sender),
        "Player already signed up"
    );

    state.players.push(context.sender);

    (state, vec![])
}

#[action(shortname = 0x01, zk = true)]
fn next_game(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>) {
    if !is_game_started(&state) {
        assert!(state.players.len() >= 2, "Not enough players");
        assert!(!state.games.is_empty(), "No games available");
        assert!(
            state.games[0].can_game_start(),
            "Game is not ready to start"
        );

        state.current_game.status = GameStatus::InProgress {};
        return (state, vec![]);
    }

    state.current_game.index += 1;

    state.current_game.status = if state.current_game.index >= state.games.len() as u32 {
        GameStatus::Finished {}
    } else {
        let game = &state.games[state.current_game.index as usize];
        if game.can_game_start() {
            GameStatus::InProgress {}
        } else {
            GameStatus::NotStarted {}
        }
    };

    (state, vec![])
}

#[action(shortname = 0x02, zk = true)]
fn end_game(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert!(
        context.sender == state.administrator,
        "Action only for administrator"
    );
    assert!(
        state.current_game.status == GameStatus::InProgress {},
        "No game active"
    );

    let mut zk_events: Vec<ZkStateChange> = vec![];

    if let Game::Sabotage { .. } = &mut state.games[state.current_game.index as usize] {
        zk_events.push(ZkStateChange::start_computation(
            ShortnameZkComputation::from_u32(0x61),
            vec![SecretVarType::SabotageGameResult {}],
        ));
    }

    state.current_game.status = GameStatus::Finished {};

    (state, vec![], zk_events)
}

#[action(shortname = 0x10, zk = true)]
fn guess(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    guess: u8,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let game = &state.games[state.current_game.index as usize];

    assert!(
        state.current_game.status == GameStatus::InProgress {},
        "Game isn't active"
    );
    assert!(
        state.players.contains(&context.sender),
        "Only active players can send actions"
    );

    if let Game::GuessTheNumber { .. } = game {
        return (
            state,
            vec![],
            vec![zk_compute::guess_start(
                guess as u16,
                &SecretVarType::GuessTheNumberGuess {
                    address: context.sender,
                    guess,
                    pad: 0,
                },
            )],
        );
    }

    panic!("Game is not GuessTheNumberGame");
}

#[zk_on_compute_complete]
fn on_compute_complete(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    output_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let mut variables_to_open = vec![];
    for variable_id in output_variables {
        let variable = zk_state.get_variable(variable_id).unwrap();
        if let SecretVarType::GuessTheNumberGuess {
            address,
            guess,
            pad,
        } = variable.metadata
        {
            variables_to_open.push(variable_id);
        }

        if let SecretVarType::SabotageGameResult {} = variable.metadata {
            variables_to_open.push(variable_id);
        }
    }

    (
        state,
        vec![],
        vec![ZkStateChange::OpenVariables {
            variables: variables_to_open,
        }],
    )
}

#[zk_on_secret_input(shortname = 0x40)]
fn on_secret_input(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (
    ContractState,
    Vec<EventGroup>,
    ZkInputDef<SecretVarType, Sbi8>,
) {
    let game = state
        .games
        .get_mut(state.current_game.index as usize)
        .unwrap();
    match game {
        Game::GuessTheNumber { .. } => {
            assert!(
                state.current_game.status == GameStatus::NotStarted {},
                "Game is already active"
            );
            assert!(
                state.administrator == context.sender,
                "Only the administrator can input secret number"
            );

            let input_def = ZkInputDef::with_metadata(SecretVarType::GuessTheNumberSecretNumber {});
            state.current_game.status = GameStatus::InProgress {};
            (state, vec![], input_def)
        }
        Game::Sabotage { .. } => {
            assert!(
                state.current_game.status == GameStatus::InProgress {},
                "Game isn't active"
            );
            assert!(
                state.players.contains(&context.sender),
                "Only active players can send actions"
            );

            let input_def = ZkInputDef::with_metadata(SecretVarType::SabotageSecretAction {});
            (state, vec![], input_def)
        }
    }
}

#[zk_on_variables_opened]
fn on_variables_opened(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    opened_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let game = state
        .games
        .get_mut(state.current_game.index as usize)
        .unwrap();

    match game {
        Game::GuessTheNumber {
            winner_point,
            wrong_guesses,
            winner,
            ready_to_start,
        } => {
            let zk_state_changes = vec![];

            for variable_id in opened_variables {
                let variable = zk_state.get_variable(variable_id).unwrap();
                if let SecretVarType::GuessTheNumberGuess {
                    address,
                    guess,
                    pad,
                } = variable.metadata
                {
                    let correct = read_variable_boolean(&variable);
                    if correct {
                        *winner = Some(address);
                        state.current_game.status = GameStatus::Finished {};
                    } else {
                        wrong_guesses.push(guess);
                    }
                }
            }

            return (state.clone(), vec![], zk_state_changes);
        }
        Game::Sabotage {
            sabotage_point,
            protect_point_cost,
            result,
        } => {
            for variable_id in opened_variables {
                let variable = zk_state.get_variable(variable_id).unwrap();
                if let SecretVarType::SabotageGameResult {} = variable.metadata {
                    *result = read_sabotage_game_result(&variable);
                }
            }

            (state, vec![], vec![])
        }
    }
}

fn read_sabotage_game_result(result: &ZkClosed<SecretVarType>) -> Vec<PlayerOutcome> {
    let mut buffer = [0u8; 16];
    buffer.copy_from_slice(result.data.as_ref().unwrap().as_slice());

    let mut bits = buffer.view_bits::<Lsb0>().to_bitvec();
    bits.reverse();

    let chunks = bits.chunks(2);

    let mut player_outcomes: Vec<PlayerOutcome> = vec![];
    for (i, v) in chunks.enumerate() {
        let is_protected = v.get(0).unwrap() == true;
        let is_sabotaged = v.get(1).unwrap() == true;
        player_outcomes.push(PlayerOutcome {
            protect: is_protected,
            sabotage: is_sabotaged,
        })
    }

    player_outcomes
}

fn read_variable_boolean(guess_variable: &ZkClosed<SecretVarType>) -> bool {
    *guess_variable.data.as_ref().unwrap().first().unwrap() == 1u8
}
