import { PlayerOutcome } from '@/contracts_gen/clients/gamemaster';

export type GuessTheNumberGame = {
  kind: 'guess-the-number';
  winnerPoint: number;
  wrongGuesses: number[];
  winner: string | undefined;
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
  points: Array<number>;
  engineKeys: string[];
};

export const getGameState = (id: string): GameState => {
  if (id === 'test' || id === '000000000000000000000000000000000000000000')
    return getTestState();

  return null as any;
};

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
  points: [],
  engineKeys: [
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
    'Ax3kZlMV9JW6EE/74YO9X8Y7zVeD8TubNlBaY+IMfARg',
  ],
});
