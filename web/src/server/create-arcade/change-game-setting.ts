'use server';

import { getPendingGameSettings } from './get-pending-game-settings';
import { setStorage } from './storage';
import { GameSetting } from './types';

export const changeGameSetting = (newSetting: GameSetting) => {
  const gameSettings = getPendingGameSettings();

  const index = gameSettings.findIndex(
    (setting) => setting.settingId === newSetting.settingId,
  );

  if (index === -1) return;

  gameSettings[index] = newSetting;

  setStorage(gameSettings);
};
