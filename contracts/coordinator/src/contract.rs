#![doc = include_str!("../README.md")]
#![allow(unused_variables)]

#[macro_use]
extern crate pbc_contract_codegen;
extern crate pbc_contract_common;
extern crate pbc_lib;

use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::{Address, AddressType};
use pbc_contract_common::context::{CallbackContext, ContractContext};
use pbc_contract_common::events::EventGroup;
use pbc_contract_common::shortname::Shortname;
use read_write_rpc_derive::ReadRPC;

const ZK_DEPLOY_ADDRESS: Address = Address {
    address_type: AddressType::SystemContract,
    identifier: [
        0x8b, 0xc1, 0xcc, 0xbb, 0x67, 0x2b, 0x87, 0x71, 0x03, 0x27, 0x71, 0x3c, 0x97, 0xd4, 0x32,
        0x04, 0x90, 0x50, 0x82, 0xcb,
    ],
};

const START_GAME_SHORTNAME: Shortname = Shortname::from_u32(0x50);
const END_GAME_SHORTNAME: Shortname = Shortname::from_u32(0x51);

#[derive(CreateTypeSpec, ReadRPC)]
struct GameContract {
    wasm: Vec<u8>,
    abi: Vec<u8>,
    init_bytes: Vec<u8>,
}

#[state]
struct ContractState {
    administrator: Address,
    players: Vec<Address>,
    current_game: Option<u32>,
    games: Vec<Address>,
    points: Vec<u32>,
}

#[init]
fn initialize(ctx: ContractContext, games: Vec<GameContract>) -> (ContractState, Vec<EventGroup>) {
    let state = ContractState {
        administrator: ctx.sender,
        players: vec![],
        games: vec![],
        current_game: None,
        points: vec![],
    };

    let mut builder = EventGroup::builder();

    for game in games {
        builder
            .call(ZK_DEPLOY_ADDRESS, Shortname::from_u32(1))
            .argument(game.wasm)
            .argument(game.abi)
            .argument(game.init_bytes)
            .done();
    }

    (state, vec![builder.build()])
}

#[action(shortname = 0x00)]
fn sign_up(
    context: ContractContext,
    mut state: ContractState,
    players: Vec<Address>,
) -> (ContractState, Vec<EventGroup>) {
    assert!(state.current_game == None, "Game is already active");

    state.players.push(context.sender);

    (state, vec![])
}

/// Proceed to next game
/// If no game is active, start the first one
/// If a game is active, end it get points and start the next one
/// If no more games are available, end it and get points
#[action(shortname = 0x01)]
fn next_game(
    context: ContractContext,
    mut state: ContractState,
) -> (ContractState, Vec<EventGroup>) {
    // Game is starting
    if state.current_game == None {
        assert!(state.players.len() >= 2, "Not enough players");
        assert!(!state.games.is_empty(), "No games available");

        

        state.current_game = Some(0);
        return (state, vec![]);
    }

    let next_game = state.current_game.unwrap() + 1;

    // No more games
    if next_game >= state.games.len() as u32 {
        state.current_game = None;
        return (state, vec![]);
    }

    // Move to next game
    state.current_game = Some(next_game);

    (state, vec![])
}

#[callback(shortname = 0x10)]
fn game_started(
    context: ContractContext,
    callback_ctx: CallbackContext,
    mut state: ContractState,
) -> (ContractState, Vec<EventGroup>) {
    assert!(state.current_game != None, "No game is active");
    assert!(
        state.games.len() > state.current_game.unwrap() as usize,
        "Invalid game id"
    );

    let game = state.games[state.current_game.unwrap() as usize];

    let mut builder = EventGroup::builder();

    builder
        .call(game, Shortname::from_u32(0))
        .argument(state.players.clone())
        .done();

    builder.build();

    (state, vec![])
}

#[callback(shortname = 0x11)]
fn game_ended(
    context: ContractContext,
    callback_ctx: CallbackContext,
    mut state: ContractState,
    game_id: u32,
    points: Vec<u32>,
) -> (ContractState, Vec<EventGroup>) {
    assert!(state.current_game == Some(game_id), "Invalid game id");

    state.points = points;

    (state, vec![])
}
