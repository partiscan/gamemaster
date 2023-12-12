#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

mod zk_compute;

use pbc_contract_common::address::Address;
use pbc_contract_common::context::ContractContext;
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::zk::ZkClosed;
use pbc_contract_common::zk::{SecretVarId, ZkInputDef, ZkState, ZkStateChange};
use read_write_rpc_derive::ReadWriteRPC;
use read_write_state_derive::ReadWriteState;

#[derive(ReadWriteState, ReadWriteRPC, Debug)]
#[repr(C)]
enum SecretVarType {
    #[discriminant(0)]
    SecretNumber {},

    #[discriminant(1)]
    Guess {
        guess: u8,
        address: Address,
        pad: u8,
    },
}

#[state]
struct ContractState {
    administrator: Address,
    winner: Option<Address>,
    wrong_guesses: Vec<u8>,
    is_active: bool,
}

#[init(zk = true)]
fn initialize(ctx: ContractContext, zk_state: ZkState<SecretVarType>) -> ContractState {
    ContractState {
        administrator: ctx.sender,
        winner: None,
        wrong_guesses: vec![],
        is_active: false,
    }
}

#[action(shortname = 0x00, zk = true)]
fn guess(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    guess: u8,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    assert!(state.is_active, "Game isn't active");
    (
        state,
        vec![],
        vec![zk_compute::guess_start(
            guess as u16,
            &SecretVarType::Guess {
                address: context.sender,
                guess,
                pad: 0,
            },
        )],
    )
}

#[zk_on_secret_input(shortname = 0x40)]
fn secret(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
) -> (ContractState, Vec<EventGroup>, ZkInputDef<SecretVarType>) {
    assert!(!state.is_active, "Game is already active");
    assert!(
        state.administrator == context.sender,
        "Only the administrator can input secret number"
    );

    let input_def = ZkInputDef {
        seal: false,
        metadata: SecretVarType::SecretNumber {},
        expected_bit_lengths: vec![8],
    };
    state.is_active = true;
    (state, vec![], input_def)
}

#[zk_on_compute_complete]
fn open_guess_result(
    context: ContractContext,
    state: ContractState,
    zk_state: ZkState<SecretVarType>,
    output_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let mut variables_to_open = vec![];
    for variable_id in output_variables {
        let variable = zk_state.get_variable(variable_id).unwrap();
        if let SecretVarType::Guess {
            address,
            guess,
            pad,
        } = variable.metadata
        {
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
fn guess_variables_opened(
    context: ContractContext,
    mut state: ContractState,
    zk_state: ZkState<SecretVarType>,
    opened_variables: Vec<SecretVarId>,
) -> (ContractState, Vec<EventGroup>, Vec<ZkStateChange>) {
    let mut zk_state_changes = vec![];

    for variable_id in opened_variables {
        let variable = zk_state.get_variable(variable_id).unwrap();
        if let SecretVarType::Guess {
            address,
            guess,
            pad,
        } = variable.metadata
        {
            let correct = read_variable_boolean(variable);
            if correct {
                state.winner = Some(address);
                state.is_active = false;
                zk_state_changes = vec![ZkStateChange::ContractDone];
            } else {
                state.wrong_guesses.push(guess);
            }
        }
    }

    (state, vec![], zk_state_changes)
}

fn read_variable_boolean(guess_variable: &ZkClosed<SecretVarType>) -> bool {
    *guess_variable.data.as_ref().unwrap().first().unwrap() == 1u8
}
