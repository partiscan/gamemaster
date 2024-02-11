'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { endGame, nextGame } from '@/contracts_gen/clients/gamemaster';
import { FC } from 'react';
import { GuessTheNumberAdmin } from './guess-the-number-admin';
import { AdminActionBox } from './admin-action-box';

type Props = {};

export const NextGameButton: FC<Props> = ({}) => {
  const {
    gameState: { currentGame, games },
    isAdmin,
    contractId,
    actualGame: game,
    isGameEnded,
  } = useGameState();
  const identity = useIdentity();

  if (!identity || !isAdmin || isGameEnded) return null;

  const status = currentGame.status;

  // For this game, it will start when we input a secret number
  if (game.kind === 'guess-the-number' && status === 'not-started') {
    return <GuessTheNumberAdmin />;
  }

  if (status === 'in-progress') {
    return (
      <AdminActionBox>
        <ChainActionButton
          action={{
            contract: contractId,
            payload: endGame().toString('hex'),
            payloadType: 'hex_payload',
          }}
        >
          End Game!
        </ChainActionButton>
      </AdminActionBox>
    );
  }

  return (
    <AdminActionBox>
      <ChainActionButton
        action={{
          contract: contractId,
          payload: nextGame().toString('hex'),
          payloadType: 'hex_payload',
        }}
      >
        Start Game!
      </ChainActionButton>
    </AdminActionBox>
  );
};
