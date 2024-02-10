'use client';

import { Input } from '@/components/ui/input';
import { changeGameSetting } from '@/server/create-arcade/change-game-setting';
import {
  SplitOrConquerGameSetting as SplitOrConquerGameSettingType
} from '@/server/create-arcade/types';
import { Label } from '@radix-ui/react-label';
import { ChangeEvent, FC } from 'react';

type Props = {
  setting: SplitOrConquerGameSettingType;
};

export const SplitOrConquerGameSetting: FC<Props> = ({ setting }) => {
  const updateSpitPoints = async (event: ChangeEvent<HTMLInputElement>) => {
    const splitPoints = +event.target.value;
    changeGameSetting({
      ...setting,
      splitPoints,
    });
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1 text-sm font-semibold'>
      <Label htmlFor='split-points'>Points for split</Label>
      <Input
        type='number'
        id='split-points'
        value={setting.splitPoints}
        onChange={updateSpitPoints}
      />
    </div>
  );
};
