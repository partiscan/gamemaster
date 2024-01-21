'use client';

import { useGameState } from '@/components/context/game-state.context';

export const GameStatus = () => {
  const {
    gameState: { currentGame, games },
  } = useGameState();

  const lastGame =
    games.length - 1 === currentGame.index && currentGame.status === 'finished';

  if (currentGame.status === 'not-started') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Game starting soon
      </div>
    );
  }

  if (currentGame.status === 'in-progress') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Game is started!
      </div>
    );
  }

  if (currentGame.status === 'finished') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Game finished {!lastGame && ' - next game starting soon'}
      </div>
    );
  }

  return null;
};
