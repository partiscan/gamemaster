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

use contract_state::{
    ContractState, CurrentGame, Game, GameStatus, PlayerOutcome, SecretVarType,
    SplitOrConquerOutcome, SplitOrConquerPlayerDecision,
};
use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::shortname::ShortnameZkComputation;
use pbc_contract_common::zk::ZkState;
use pbc_contract_common::zk::{ZkClosed, ZkInputDef, ZkStateChange};
use pbc_zk::{Sbi8, SecretVarId};
use read_write_rpc_derive::ReadWriteRPC;

use crate::contract_state::SplitDecision;

#[derive(CreateTypeSpec, ReadWriteRPC)]
enum GameSettings {
    #[discriminant(0)]
    GuessTheNumberGame { winner_point: u32 },
    #[discriminant(1)]
    Sabotage {
        sabotage_point: u32,
        protect_point_cost: u32,
    },
    #[discriminant(2)]
    SplitOrConquer { split_points: u16 },
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
                result: None,
            },
            GameSettings::SplitOrConquer { split_points } => Game::SplitOrConquer {
                split_points,
                result: None,
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
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    if !is_game_started(&state) {
        assert!(state.players.len() >= 2, "Not enough players");
        assert!(!state.games.is_empty(), "No games available");
        assert!(
            state.games[0].can_game_start(),
            "Game is not ready to start"
        );

        state.current_game.status = GameStatus::InProgress {};
        return (state, vec![], vec![]);
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

    let variables_to_delete = zk_state.secret_variables.iter().map(|(k, _)| k).collect();

    let delete_variables_state_change = ZkStateChange::DeleteVariables {
        variables_to_delete,
    };

    (state, vec![], vec![delete_variables_state_change])
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
        state.current_game.status == GameStatus::InProgress {}
            || state.current_game.status == GameStatus::Calculating {},
        "No game active"
    );

    let mut zk_events: Vec<ZkStateChange> = vec![];

    if let Game::Sabotage { .. } = &mut state.games[state.current_game.index as usize] {
        zk_events.push(ZkStateChange::start_computation(
            ShortnameZkComputation::from_u32(0x61),
            vec![SecretVarType::SabotageGameResult {}],
        ));

        state.current_game.status = GameStatus::Calculating {};
    } else if let Game::SplitOrConquer { .. } = &mut state.games[state.current_game.index as usize]
    {
        zk_events.push(ZkStateChange::start_computation(
            ShortnameZkComputation::from_u32(0x62),
            vec![SecretVarType::SplitOrConquerResult {}],
        ));

        state.current_game.status = GameStatus::Calculating {};
    } else {
        let current_game_index = state.current_game.index;
        if state.points.len() <= current_game_index as usize {
            let points = vec![0; state.players.len()];
            add_points(&mut state.points, &points);
        }

        state.current_game.status = GameStatus::Finished {};
    }

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
    let player = state.players.iter().position(|&p| p == context.sender);
    assert!(player.is_some(), "Only active players can send actions");

    if let Game::GuessTheNumber { .. } = game {
        return (
            state,
            vec![],
            vec![zk_compute::guess_start(
                guess as u16,
                &SecretVarType::GuessTheNumberGuess {
                    player: player.unwrap() as u32,
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
        if let SecretVarType::GuessTheNumberGuess { player, guess, pad } = variable.metadata {
            variables_to_open.push(variable_id);
        }

        if let SecretVarType::SabotageGameResult {} = variable.metadata {
            variables_to_open.push(variable_id);
        }

        if let SecretVarType::SplitOrConquerResult {} = variable.metadata {
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

#[zk_on_secret_input(shortname = 0x40, secret_type = "Sbi8")]
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
        Game::SplitOrConquer {
            split_points,
            result,
        } => {
            assert!(
                state.current_game.status == GameStatus::InProgress {},
                "Game isn't active"
            );
            let player = state.players.iter().position(|&p| p == context.sender);
            assert!(player.is_some(), "Only active players can send actions");

            assert!(
                zk_state
                    .secret_variables
                    .iter()
                    .chain(zk_state.pending_inputs.iter())
                    .all(|(_, v)| v.owner != context.sender),
                "Only one action per player is allowed"
            );

            let input_def = ZkInputDef::with_metadata(SecretVarType::SplitOrConquerSecretAction {
                player: player.unwrap() as u32,
            });

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
                if let SecretVarType::GuessTheNumberGuess { player, guess, pad } = variable.metadata
                {
                    let correct = read_variable_boolean(&variable);
                    if correct {
                        *winner = Some(player);
                        let mut points = vec![0; state.players.len()];
                        points[player as usize] = *winner_point as i32;

                        add_points(&mut state.points, &points);
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
                    *result = Some(read_sabotage_game_result(&variable));
                }
            }

            let game_points = calculate_sabotage_points(
                &state.players,
                result,
                *sabotage_point,
                *protect_point_cost,
            );

            add_points(&mut state.points, &game_points);
            state.current_game.status = GameStatus::Finished {};

            (state, vec![], vec![])
        }
        Game::SplitOrConquer {
            split_points,
            result,
        } => {
            for variable_id in opened_variables {
                let variable = zk_state.get_variable(variable_id).unwrap();
                if let SecretVarType::SplitOrConquerResult {} = variable.metadata {
                    *result = Some(read_split_or_conquer_game_result(
                        state.players.len(),
                        &variable,
                    ));
                }
            }

            if let Some(result) = result {
                let game_points =
                    calculate_split_or_conquer_points(&state.players, result, *split_points);

                add_points(&mut state.points, &game_points);
                state.current_game.status = GameStatus::Finished {};
            }

            (state, vec![], vec![])
        }
    }
}

fn calculate_split_or_conquer_points(
    players: &Vec<Address>,
    result: &Vec<SplitOrConquerOutcome>,
    split_points: u16,
) -> Vec<i32> {
    let split_points_i32 = i32::from(split_points);

    let mut points = result
        .iter()
        .enumerate()
        .flat_map(|(i, outcome)| {
            let player_a = &outcome.player_a.split;
            let player_b = &outcome.player_b.split;

            match player_a {
                SplitDecision::Conquer {} => {
                    // Both choose Conquer, so no one gets points
                    if let SplitDecision::Conquer {} = player_b {
                        return vec![0, 0];
                    }

                    // Player A is conquering and B is not, so player A gets all the points
                    return vec![split_points_i32 * 2, 0];
                }
                SplitDecision::Split {} => {
                    match player_b {
                        SplitDecision::Conquer {} => {
                            // Player A is splitting and B is conquering, so player B gets all the points
                            return vec![0, split_points_i32 * 2];
                        }
                        SplitDecision::Split {} => {
                            // Both players are splitting, so they get the split points
                            return vec![split_points_i32, split_points_i32];
                        }
                        SplitDecision::NoAction {} => {
                            // Player A is splitting and B had no action, so only player A gets points.
                            return vec![split_points_i32, 0];
                        }
                    }
                }
                SplitDecision::NoAction {} => {
                    match player_b {
                        SplitDecision::NoAction {} => {
                            // Both players had no action, so they get nothing
                            return vec![0, 0];
                        }
                        SplitDecision::Split {} => {
                            return vec![0, split_points_i32];
                        }
                        SplitDecision::Conquer {} => {
                            return vec![0, split_points_i32 * 2];
                        }
                    }
                }
            }
        })
        .collect::<Vec<i32>>();

    // Add points for missing player
    if points.len() != players.len() {
        points.push(split_points_i32)
    }

    points
}

fn calculate_sabotage_points(
    players: &Vec<Address>,
    result: &Option<Vec<PlayerOutcome>>,
    sabotage_points: u32,
    protect_point_cost: u32,
) -> Vec<i32> {
    players
        .iter()
        .enumerate()
        .map(|(i, _)| {
            let mut local_point = 0;
            if let Some(result) = result {
                let local_result = result.get(i).unwrap();
                if local_result.sabotage {
                    local_point -= sabotage_points as i32;
                } else if local_result.protect {
                    local_point -= protect_point_cost as i32;
                }
            }
            local_point
        })
        .collect()
}

fn add_points(state_points: &mut Vec<Vec<i32>>, points: &Vec<i32>) {
    let default_points = vec![];
    let previous_points = state_points.last().unwrap_or(&default_points);
    let new_points = points
        .iter()
        .enumerate()
        .map(|(i, p)| p + previous_points.get(i).unwrap_or(&0))
        .collect::<Vec<i32>>();

    state_points.push(new_points);
}

fn read_split_or_conquer_game_result(
    player_count: usize,
    result: &ZkClosed<SecretVarType>,
) -> Vec<SplitOrConquerOutcome> {
    let mut buffer = [0u8; 16];
    buffer.copy_from_slice(result.data.as_ref().unwrap().as_slice());

    let mut bits = buffer.view_bits::<Lsb0>().to_bitvec();
    bits.reverse();

    let max_games = player_count / 2;

    bits.chunks(2)
        .enumerate()
        .map(|(i, b)| {
            let decision = if b.get(0).unwrap() == true {
                SplitDecision::Conquer {}
            } else if b.get(1).unwrap() == true {
                SplitDecision::Split {}
            } else {
                SplitDecision::NoAction {}
            };

            SplitOrConquerPlayerDecision {
                player_index: i as u32,
                split: decision,
            }
        })
        .collect::<Vec<SplitOrConquerPlayerDecision>>()
        .chunks(2)
        .take(max_games)
        .enumerate()
        .map(|(i, p)| SplitOrConquerOutcome {
            player_a: p.get(0).unwrap().clone(),
            player_b: p.get(1).unwrap().clone(),
        })
        .collect::<Vec<SplitOrConquerOutcome>>()
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
