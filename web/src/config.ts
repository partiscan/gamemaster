export type Game = {
  id: string;
  title: string;
  description: string;
};

export const GUESS_THE_NUMBER = {
  id: 'guess-the-number',
  title: 'Guess the Number',
  description:
    'The Game Master secretly inputs a number. Players try to guess it.',
} as const satisfies Game;

export const SABOTAGE = {
  id: 'sabotage',
  title: 'Sabotage',
  description: 'The players can secretly sabotage or protect.',
} as const satisfies Game;

export const SPLIT_OR_CONQUER = {
  id: 'split-or-conquer',
  title: 'Split or Conquer',
  description:
    'Players are paired, and can either Split or Conquer. If both Split, the points are shared. If both Conquer, no points are awarded. Otherwise, the Conquer takes all points.',
} as const satisfies Game;

export const GAMES = [GUESS_THE_NUMBER, SABOTAGE, SPLIT_OR_CONQUER] as const;
