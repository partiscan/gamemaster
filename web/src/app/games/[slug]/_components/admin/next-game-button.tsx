'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { nextGame } from '@/contracts_gen/clients/gamemaster';
import { FC } from 'react';
import { GuessTheNumberAdmin } from './guess-the-number-admin';

type Props = {};

export const NextGameButton: FC<Props> = ({}) => {
  const {
    gameState: { games, currentGame },
    isAdmin,
    contractId,
  } = useGameState();
  const identity = useIdentity();

  if (!identity || !isAdmin || currentGame.status !== 'not-started')
    return null;

  const game = games[currentGame.index];

  // For this game, it will start when we input a secret number
  if (game.kind === 'guess-the-number') {
    return <GuessTheNumberAdmin />;
  }

  return (
    <ChainActionButton
      action={{
        contract: contractId,
        payload: nextGame().toString('hex'),
        payloadType: 'hex_payload',
      }}
    >
      Start!
    </ChainActionButton>
  );
};
