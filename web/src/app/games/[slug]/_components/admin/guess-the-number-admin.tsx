'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useGamemasterAbi } from '@/components/context/gamemaster.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GuessTheNumberActions } from '@/lib/game-actions/guess-the-number-actions';
import { useEffect, useState } from 'react';

const MAX_NUMBER = 255;
export const GuessTheNumberAdmin = () => {
  const [secretNumber, setSecretNumber] = useState(0);

  useEffect(() => {
    setSecretNumber(Math.floor(Math.random() * MAX_NUMBER));
  }, []);

  const abi = useGamemasterAbi();
  const identity = useIdentity();
  const { engineKeys, contractId } = useGameState();

  if (!identity) return null;

  const actions = new GuessTheNumberActions(identity.address, abi, engineKeys);
  const rpc = actions.secretNumberInput(-(MAX_NUMBER - 1) / 2);

  return (
    <>
      <div className='my-5 w-full items-center space-y-5 text-sm font-semibold'>
        <Label htmlFor='secret-number'>Secret number: {secretNumber}</Label>

        <Slider
          id='secret-number'
          value={[secretNumber]}
          min={0}
          max={MAX_NUMBER}
          step={1}
          className='mx-auto max-w-sm'
          onValueChange={(value) => setSecretNumber(value[0])}
        />
        <ChainActionButton
          action={{
            contract: contractId,
            payload: rpc.toString('hex'),
            payloadType: 'hex_payload',
          }}
        >
          Set Secret Number
        </ChainActionButton>
      </div>
    </>
  );
};
