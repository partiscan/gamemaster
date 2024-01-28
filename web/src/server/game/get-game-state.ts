import {
  GameD,
  GameStatusD,
  PlayerOutcome,
  deserializeContractState,
} from '@/contracts_gen/clients/gamemaster';
import { getContractState } from '../partisia.client';

export type GuessTheNumberGame = {
  kind: 'guess-the-number';
  winnerPoint: number;
  wrongGuesses: number[];
  winner: number | undefined;
};

export type SabotageGame = {
  kind: 'sabotage';
  sabotagePoint: number;
  protectPointCost: number;
  result: PlayerOutcome[] | undefined | null;
};

export type GameState = {
  administrator: string;
  players: string[];
  currentGame: {
    index: number;
    status: 'not-started' | 'in-progress' | 'finished';
  };
  games: Array<GuessTheNumberGame | SabotageGame>;
  points: Array<Array<number>>;
  engineKeys: string[];
};

export const getGameState = async (id: string): Promise<GameState | null> => {
  try {
    if (id === 'test' || id === '000000000000000000000000000000000000000000')
      return getTestState();

    const contractState = await getContractState(id, deserializeContractState);
    if (contractState.type !== 'ZERO_KNOWLEDGE') {
      throw new Error('Invalid contract type');
    }
    
    const state = contractState.serializedContract.openState.openState.data;
    return {
      administrator: state.administrator.asString(),
      currentGame: {
        index: state.currentGame.index,
        status: toGameStatus(state.currentGame.status.discriminant),
      },
      players: state.players.map((player) => player.asString()),
      engineKeys: contractState.serializedContract.engines.engines.map(
        (e) => e.publicKey,
      ),
      games: state.games.map((game) => {
        if (game.discriminant === GameD.GuessTheNumber) {
          return {
            kind: 'guess-the-number',
            winnerPoint: game.winnerPoint,
            wrongGuesses: [...game.wrongGuesses],
            winner: game.winner,
          };
        } else if (game.discriminant === GameD.Sabotage) {
          return {
            kind: 'sabotage',
            sabotagePoint: game.sabotagePoint,
            protectPointCost: game.protectPointCost,
            result: game.result,
          };
        }

        throw new Error('Unknown game kind ' + game);
      }),
      points: state.points,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

function toGameStatus(
  discriminant: GameStatusD,
): 'not-started' | 'in-progress' | 'finished' {
  if (discriminant === GameStatusD.NotStarted) return 'not-started';
  if (discriminant === GameStatusD.InProgress) return 'in-progress';
  if (discriminant === GameStatusD.Finished) return 'finished';

  throw new Error('Unknown game state ' + discriminant);
}

const getTestState = (): GameState => ({
  administrator: '00527092bfb4b35a0331fe066199a41d45c213c368',
  currentGame: {
    index: 2,
    status: 'finished',
  },
  players: [
    '00527092bfb4b35a0331fe066199a41d45c213c368',
    '00527092bfb4b35a0331fe066199a41d45c213c367',
    '00527092bfb4b35a0331fe066199a41d45c213c366',
    '00527092bfb4b35a0331fe066199a41d45c213c365',
    '00527092bfb4b35a0331fe066199a41d45c213c364',
    '00527092bfb4b35a0331fe066199a41d45c213c363',
    '00527092bfb4b35a0331fe066199a41d45c213c362',
    '00527092bfb4b35a0331fe066199a41d45c213c361',
    '00527092bfb4b35a0331fe066199a41d45c213c360',
  ],
  games: [
    {
      kind: 'sabotage',
      protectPointCost: 0,
      result: [{ sabotage: true, protect: true }],
      sabotagePoint: 0,
    },
    {
      kind: 'guess-the-number',
      winnerPoint: 0,
      wrongGuesses: [],
      winner: undefined,
    },
    {
      kind: 'sabotage',
      protectPointCost: 0,
      result: [{ sabotage: true, protect: true }],
      sabotagePoint: 0,
    },
  ],
  points: [[1, 1, 1]],
  engineKeys: [
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
  ],
});
