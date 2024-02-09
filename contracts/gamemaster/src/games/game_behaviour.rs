use crate::contract_state::Game;

pub trait GameBehaviour {
    fn start(&mut self);
    fn can_game_start(&self) -> bool;
}

impl GameBehaviour for Game {
    fn start(&mut self) {
        match self {
            Game::GuessTheNumber { ready_to_start, .. } => {
                *ready_to_start = true;
            }
            Game::Sabotage { .. } => {}
            Game::SplitOrConquer {
                split_points,
                result,
            } => {}
        }
    }

    fn can_game_start(&self) -> bool {
        match self {
            Game::GuessTheNumber { ready_to_start, .. } => *ready_to_start,
            Game::Sabotage { result, .. } => true,
            Game::SplitOrConquer {
                split_points,
                result,
            } => true,
        }
    }
}
