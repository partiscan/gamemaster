import { GUESS_THE_NUMBER, SABOTAGE } from '@/config';

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

export type GameSetting = SabotageGameSetting | GuessTheNumberGameSetting;
