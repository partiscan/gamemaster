'use server';

import { cookies } from 'next/headers';
import { getPendingGameSettings } from './get-pending-game-settings';
import { setStorage } from './storage';

export const removeGame = (id: string) => {
  const settings = getPendingGameSettings();

  const newSettings = settings.filter((setting) => setting.settingId !== id);

  setStorage(newSettings);
};
