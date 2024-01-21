import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { Button } from '@/components/ui/button';
import { FC } from 'react';

type Props = {};

export const EndGameButton: FC<Props> = ({}) => {
  const {
    gameState: { games, currentGame },
    isAdmin,
  } = useGameState();
  const identity = useIdentity();

  if (!identity || !isAdmin || currentGame.status !== 'in-progress')
    return null;

  return <Button>End game</Button>;
};
