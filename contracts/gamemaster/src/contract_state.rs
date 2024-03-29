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
    GuessTheNumberSecretNumber {},

    #[discriminant(1)]
    GuessTheNumberGuess { guess: u8, player: u32, pad: u8 },

    /// Sabotage
    #[discriminant(2)]
    SabotageSecretAction {},

    #[discriminant(3)]
    SabotageGameResult {},

    /// Split or Conquer
    #[discriminant(4)]
    SplitOrConquerSecretAction { player: u32 },

    #[discriminant(5)]
    SplitOrConquerResult {},
}

#[repr(C)]
#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState)]
pub struct PlayerOutcome {
    pub sabotage: bool,
    pub protect: bool,
}

#[derive(Debug, ReadWriteState, CreateTypeSpec, Clone)]
#[repr(C)]
pub enum SplitDecision {
    #[discriminant(0)]
    NoAction {},
    #[discriminant(1)]
    Split {},
    #[discriminant(2)]
    Conquer {},
}

#[repr(C)]
#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState)]
pub struct SplitOrConquerPlayerDecision {
    pub player_index: u32,
    pub split: SplitDecision,
}

#[repr(C)]
#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState)]
pub struct SplitOrConquerOutcome {
    pub player_a: SplitOrConquerPlayerDecision,
    pub player_b: SplitOrConquerPlayerDecision,
}

#[derive(Debug, CreateTypeSpec, ReadWriteState, Clone)]
pub enum Game {
    #[discriminant(0)]
    GuessTheNumber {
        winner_point: u32,
        wrong_guesses: Vec<u8>,
        winner: Option<u32>,
        ready_to_start: bool,
    },
    #[discriminant(1)]
    Sabotage {
        sabotage_point: u32,
        protect_point_cost: u32,
        result: Option<Vec<PlayerOutcome>>,
    },
    #[discriminant(2)]
    SplitOrConquer {
        split_points: u16,
        result: Option<Vec<SplitOrConquerOutcome>>,
    },
}

#[derive(Debug, CreateTypeSpec, Clone, ReadWriteState, ReadWriteRPC, PartialEq)]
pub enum GameStatus {
    #[discriminant(0)]
    NotStarted {},
    #[discriminant(1)]
    InProgress {},
    #[discriminant(2)]
    Calculating {},
    #[discriminant(3)]
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
    pub points: Vec<Vec<i32>>,
}
