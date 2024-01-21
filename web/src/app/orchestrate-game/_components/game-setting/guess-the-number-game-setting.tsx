'use client';

import { Input } from '@/components/ui/input';
import { changeGameSetting } from '@/server/orchestrate-game/change-game-setting';
import { GuessTheNumberGameSetting as GuessTheNumberGameSettingType } from '@/server/orchestrate-game/types';
import { Label } from '@radix-ui/react-label';
import { ChangeEvent, FC } from 'react';

type Props = {
  setting: GuessTheNumberGameSettingType;
};

export const GuessTheNumberGameSetting: FC<Props> = ({ setting }) => {
  const updateWinningPoints = async (event: ChangeEvent<HTMLInputElement>) => {
    const winPoints = +event.target.value;
    changeGameSetting({
      ...setting,
      winPoints,
    });
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1 text-sm font-semibold'>
      <Label htmlFor='winning-points'>Points for winning</Label>
      <Input
        type='number'
        id='winning-points'
        value={setting.winPoints}
        onChange={updateWinningPoints}
      />
    </div>
  );
};
