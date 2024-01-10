use create_type_spec_derive::CreateTypeSpec;
use pbc_contract_common::address::Address;
use read_write_rpc_derive::{ReadRPC, ReadWriteRPC};
use read_write_state_derive::ReadWriteState;

use crate::__PBC_IS_ZK_CONTRACT;

#[derive(ReadWriteState, ReadWriteRPC, Debug)]
#[repr(C)]
pub enum SecretVarType {
    /// Guess The Number
    #[discriminant(0)]
    SecretNumber {},

    #[discriminant(1)]
    Guess {
        guess: u8,
        address: Address,
        pad: u8,
    },

    #[discriminant(2)]
    SecretAction {},

    #[discriminant(3)]
    GameResult {},
}

#[repr(C)]
#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState)]
pub struct PlayerOutcome {
    pub sabotage: bool,
    pub protect: bool,
}

#[derive(Debug, CreateTypeSpec, ReadWriteState, Clone)]
pub enum Game {
    #[discriminant(0)]
    GuessTheNumber {
        winner_point: u32,
        wrong_guesses: Vec<u8>,
        winner: Option<Address>,
        ready_to_start: bool,
    },
    #[discriminant(1)]
    Sabotage {
        sabotage_point: u32,
        protect_point_cost: u32,
        result: Vec<PlayerOutcome>,
    },
}

#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState, ReadWriteRPC, PartialEq)]
pub enum GameStatus {
    #[discriminant(0)]
    NotStarted {},
    #[discriminant(1)]
    InProgress {},
    #[discriminant(2)]
    Finished {},
}

#[derive(CreateTypeSpec, Debug, Clone, ReadWriteState, ReadRPC)]
pub struct CurrentGame {
    pub index: u32,
    pub status: GameStatus,
}

#[state]
#[derive(Clone, Debug)]
pub(crate) struct ContractState {
    pub administrator: Address,
    pub players: Vec<Address>,
    pub current_game: CurrentGame,
    pub games: Vec<Game>,
    pub points: Vec<u32>,
}
