#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

mod zk_compute;

use bitvec::prelude::*;
use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::shortname::ShortnameZkComputation;
use pbc_contract_common::zk::{ZkClosed, ZkState, ZkStateChange, ZkInputDef};
use pbc_zk::SecretVarId;
use create_type_spec_derive::CreateTypeSpec;
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

#[state]
struct ContractState {
    administrator: Address,
    players: Vec<Address>,
    is_active: bool,
    result: Vec<PlayerOutcome>,
}

#[init(zk = true)]
fn initialize(ctx: ContractContext, zk_state: ZkState<SecretVarType>) -> ContractState {
    ContractState {
        administrator: ctx.sender,
        players: vec![],
        is_active: false,
        result: vec![],
    }
}

#[action(shortname = 0x00, zk = true)]
fn start_game(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    players: Vec<Address>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert!(!state.is_active, "Game is already active");
    state.players = players;
    state.is_active = true;

    (state, vec![], vec![])
}

#[action(shortname = 0x01, zk = true)]
fn end_game(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert!(state.is_active, "Game isn't active");

    state.is_active = false;

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
    assert!(state.is_active, "Game isn't active");
    assert!(state.players.contains(&context.sender), "Only active players can send actions");

    let input_def = ZkInputDef {
        seal: false,
        metadata: SecretVarType::SecretAction { },
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
    let mut player_outcomes: Vec<PlayerOutcome> = vec![];

    let zk_result = BitVec::from_vec(result.data.as_ref().unwrap().to_vec());
    let bits: bitvec::slice::Chunks<'_, u8, Msb0> = zk_result.chunks(2);
    for (i, v) in bits.enumerate() {
        let is_protected = v.get(0).unwrap() == true;
        let is_sabotaged = v.get(1).unwrap() == true;
        player_outcomes.push(PlayerOutcome {
            protect: is_protected,
            sabotage: is_sabotaged,
        })
    }

    player_outcomes
}
