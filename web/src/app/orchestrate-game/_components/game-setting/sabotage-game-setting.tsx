'use client';

import { Input } from '@/components/ui/input';
import { changeGameSetting } from '@/server/orchestrate-game/change-game-setting';
import { SabotageGameSetting as SabotageGameSettingType } from '@/server/orchestrate-game/types';
import { Label } from '@radix-ui/react-label';
import { ChangeEvent, FC } from 'react';

type Props = {
  setting: SabotageGameSettingType;
};

export const SabotageGameSetting: FC<Props> = ({ setting }) => {
  const updateSabotagePoints = async (event: ChangeEvent<HTMLInputElement>) => {
    const sabotagePoints = +event.target.value;
    changeGameSetting({
      ...setting,
      sabotagePoints,
    });
  };

  const updateProtectedCost = async (event: ChangeEvent<HTMLInputElement>) => {
    const protectCostPoints = +event.target.value;
    changeGameSetting({
      ...setting,
      protectCostPoints,
    });
  };

  return (
    <div className='grid w-full max-w-sm items-center gap-1 text-sm font-semibold'>
      <Label htmlFor='sabotage-points'>Cost of being sabotaged</Label>
      <Input
        type='number'
        id='sabotage-points'
        value={setting.sabotagePoints}
        onChange={updateSabotagePoints}
      />
      <Label htmlFor='protected-fee'>Cost of being protected</Label>
      <Input
        type='number'
        id='protected-fee'
        value={setting.protectCostPoints}
        onChange={updateProtectedCost}
      />
    </div>
  );
};
