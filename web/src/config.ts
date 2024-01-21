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
  description:
    'The players can secretly sabotage or protect. Protection costs points. Sabotage takes points.',
} as const satisfies Game;

export const GAMES = [GUESS_THE_NUMBER, SABOTAGE] as const;
