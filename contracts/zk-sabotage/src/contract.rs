#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

mod zk_compute;

use bitvec::prelude::*;
use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::shortname::ShortnameZkComputation;
use pbc_contract_common::zk::{ZkClosed, ZkInputDef, ZkState, ZkStateChange};
use pbc_zk::SecretVarId;
use read_write_rpc_derive::ReadWriteRPC;
use read_write_state_derive::ReadWriteState;

#[derive(ReadWriteState, ReadWriteRPC, Debug)]
#[repr(C)]
enum SecretVarType {
    #[discriminant(0)]
    SecretAction {},

    #[discriminant(1)]
    GameResult {},
}

#[repr(C)]
#[derive(CreateTypeSpec, ReadWriteState)]
struct PlayerOutcome {
    sabotage: bool,
    protect: bool,
}

#[derive(CreateTypeSpec, ReadWriteState, ReadWriteRPC, PartialEq)]
pub enum GameStatus {
    #[discriminant(0)]
    NotStarted {},
    #[discriminant(1)]
    InProgress {},
    #[discriminant(2)]
    Finished {},
}

#[derive(ReadWriteState)]
pub struct GameResult {
    pub points: Vec<u32>,
}

#[state]
struct ContractState {
    administrator: Address,
    players: Vec<Address>,
    result: Vec<PlayerOutcome>,
    status: GameStatus,
}

#[init(zk = true)]
fn initialize(ctx: ContractContext, zk_state: ZkState<SecretVarType>) -> ContractState {
    ContractState {
        administrator: ctx.sender,
        players: vec![],
        status: GameStatus::NotStarted {},
        result: vec![],
    }
}

#[action(shortname = 0x50, zk = true)]
fn start_game(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    players: Vec<Address>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert!(
        context.sender == state.administrator,
        "Action only for administrator"
    );
    assert!(
        state.status == GameStatus::NotStarted {},
        "Game is already active"
    );
    state.players = players;
    state.status = GameStatus::InProgress {};

    (state, vec![], vec![])
}

#[action(shortname = 0x51, zk = true)]
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
        state.status == GameStatus::InProgress {},
        "Game isn't active"
    );

    state.status = GameStatus::Finished {};

    (
        state,
        vec![],
        vec![ZkStateChange::start_computation(
            ShortnameZkComputation::from_u32(0x60),
            vec![SecretVarType::GameResult {}],
        )],
    )
}

#[zk_on_secret_input(shortname = 0x40)]
fn send_action(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>, ZkInputDef<SecretVarType>) {
    assert!(
        state.status == GameStatus::InProgress {},
        "Game isn't active"
    );
    assert!(
        state.players.contains(&context.sender),
        "Only active players can send actions"
    );

    let input_def = ZkInputDef {
        seal: false,
        metadata: SecretVarType::SecretAction {},
        expected_bit_lengths: vec![8],
    };

    (state, vec![], input_def)
}

#[zk_on_compute_complete]
fn open_game_result(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    output_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let mut variables_to_open = vec![];
    for variable_id in output_variables {
        let variable = zk_state.get_variable(variable_id).unwrap();
        if let SecretVarType::GameResult {} = variable.metadata {
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

#[zk_on_variables_opened]
fn game_result_available(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    opened_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let mut zk_state_changes = vec![];

    for variable_id in opened_variables {
        let variable = zk_state.get_variable(variable_id).unwrap();
        if let SecretVarType::GameResult {} = variable.metadata {
            state.result = read_game_result(variable);
            zk_state_changes = vec![ZkStateChange::ContractDone];
        }
    }

    (state, vec![], zk_state_changes)
}

fn read_game_result(result: &ZkClosed<SecretVarType>) -> Vec<PlayerOutcome> {
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
