import { GUESS_THE_NUMBER, SABOTAGE, SPLIT_OR_CONQUER } from '@/config';

type CommonGameSetting<T> = {
  settingId: string;
  gameType: T;
};

export type GuessTheNumberGameSetting = {
  winPoints: number;
} & CommonGameSetting<typeof GUESS_THE_NUMBER.id>;

export type SabotageGameSetting = {
  sabotagePoints: number;
  protectCostPoints: number;
} & CommonGameSetting<typeof SABOTAGE.id>;

export type SplitOrConquerGameSetting = {
  splitPoints: number;
} & CommonGameSetting<typeof SPLIT_OR_CONQUER.id>;

export type GameSetting = SabotageGameSetting | GuessTheNumberGameSetting | SplitOrConquerGameSetting;
