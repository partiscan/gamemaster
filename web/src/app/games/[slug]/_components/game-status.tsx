'use client';

import { useGameState } from '@/components/context/game-state.context';

export const GameStatus = () => {
  const {
    gameState: { currentGame, games },
    isGameEnded,
  } = useGameState();

  if (currentGame.status === 'not-started') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Starting soon
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

  if (currentGame.status === 'calculating') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Calculating results
      </div>
    );
  }

  if (currentGame.status === 'finished') {
    return (
      <div className='text-center text-xl font-semibold uppercase'>
        Game finished
        <div className='text-base text-muted-foreground'>
          {!isGameEnded && 'next game starting soon'}
        </div>
      </div>
    );
  }

  return null;
};
