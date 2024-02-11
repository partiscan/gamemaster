'use client';

import { useGameState } from '@/components/context/game-state.context';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { useLayoutEffect } from 'react';
import { Player } from './player';

export const PlayerProdium = () => {
  const {
    gameState: { players, points },
    isGameEnded,
  } = useGameState();

  useLayoutEffect(() => {
    if (isGameEnded) {
      confetti();
    }
  }, [isGameEnded]);

  if (!isGameEnded) return null;

  const sortedPlayers = players
    .map((player, i) => ({
      player,
      index: i,
      points: points[points.length - 1][i],
    }))
    .sort((a, b) => b.points - a.points);

  const first = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];

  return (
    <div className='mx-auto mt-4 w-full max-w-screen-xl'>
      <h3 className='mb-4 text-xl font-medium'>Winners!</h3>
      <div className='relative mx-auto h-40 w-60'>
        {first && <Player playerIndex={first.index} hidePoints />}
        {second && (
          <Player
            playerIndex={second.index}
            hidePoints
            className='absolute bottom-12 left-2'
          />
        )}
        {third && (
          <Player
            playerIndex={third.index}
            hidePoints
            className='absolute bottom-12 right-2'
          />
        )}

        <div className='absolute bottom-0 h-24 w-full'>
          <Image src='/assets/podium.webp' fill alt={'podium'} />
        </div>
      </div>
    </div>
  );
};
