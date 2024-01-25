'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGuessTheNumberActions } from '@/lib/game-actions/actions.hook';
import { useEffect, useState } from 'react';
import { AdminActionBox } from './admin-action-box';

const MAX_NUMBER = 255;
export const GuessTheNumberAdmin = () => {
  const [secretNumber, setSecretNumber] = useState(0);

  useEffect(() => {
    setSecretNumber(Math.floor(Math.random() * MAX_NUMBER));
  }, []);

  const actions = useGuessTheNumberActions();

  return (
    <AdminActionBox>
      <div className='my-5 w-full items-center space-y-5 text-sm font-semibold'>
        <Label htmlFor='secret-number'>Secret number: {secretNumber}</Label>

        <Slider
          id='secret-number'
          value={[secretNumber]}
          min={0}
          max={MAX_NUMBER}
          step={1}
          className='mx-auto min-w-48'
          onValueChange={(value) => setSecretNumber(value[0])}
        />
        <ChainActionButton
          action={actions.secretNumberInput(-Math.floor((MAX_NUMBER - 1) / 2))}
        >
          Set Secret Number
        </ChainActionButton>
      </div>
    </AdminActionBox>
  );
};
