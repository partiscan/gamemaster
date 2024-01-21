'use client';

import { useGameState } from '@/components/context/game-state.context';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const GamesOverview = () => {
  const {
    gameState: { games, currentGame },
  } = useGameState();

  return (
    <div className='flex justify-center text-sm text-gray-500'>
      {games.map((game, i) => (
        <div
          key={game.kind}
          className={cn('rounded-lg bg-white p-2 transition-all', {
            ['bg-slate-300']: currentGame.index === i,
            ['opacity-50']: currentGame.index !== i,
          })}
        >
          <Image
            className='rounded'
            src={`/assets/games/${game.kind}.webp`}
            alt={''}
            width={64}
            height={64}
          />
        </div>
      ))}
    </div>
  );
};
