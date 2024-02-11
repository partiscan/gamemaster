'use client';

import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { cn } from '@/lib/utils';
import { AwardIcon } from 'lucide-react';
import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';
import { YouArrow } from './you-arrow';

type Props = PropsWithChildren<{
  playerIndex: number;
  className?: string;
  imageClassName?: string;
  hidePoints?: boolean;
}>;

export const Player: FC<Props> = ({
  children,
  playerIndex,
  className,
  hidePoints,
  imageClassName,
}) => {
  const {
    gameState: { currentGame, points, players },
  } = useGameState();
  const identity = useIdentity();

  const address = players[playerIndex];

  const isYou = identity?.address === address;

  const currentIndex = Math.min(currentGame.index, points.length - 1);

  const currentGamePoints = points[currentIndex]?.[playerIndex] ?? 0;
  const previousGamePoints = points[currentIndex - 1]?.[playerIndex] ?? 0;

  const gotPointsForCurrentGame = currentIndex === currentGame.index;

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1',
        className,
      )}
    >
      {isYou && (
        <>
          <div className='absolute -top-5 left-[65%] z-20'>
            <YouArrow className='z-10 h-16 w-10' />
            <div className='absolute -right-3 top-6 -rotate-12 font-semibold text-[#328421]'>
              You
            </div>
          </div>
        </>
      )}
      <Image
        className={cn('w-16', imageClassName)}
        src={`/assets/avatars/avatar-${playerIndex + 1}.png`}
        width={64}
        height={64}
        alt={''}
      />
      {!hidePoints && (
        <div className='flex w-full flex-col gap-1 text-green-900'>
          <span className='mx-auto w-16 overflow-hidden text-ellipsis font-mono text-xs'>
            {address}
          </span>
          <div className='mx-auto flex w-fit grid-cols-2 items-center justify-center rounded-full border bg-green-300 px-2 py-1 text-xs'>
            <AwardIcon size={16} />

            {gotPointsForCurrentGame && (
              <span>{previousGamePoints} -&gt;&nbsp;</span>
            )}

            <span>{currentGamePoints}</span>
          </div>
        </div>
      )}
      <div className={cn('absolute right-3 top-0 z-30', { ['top-6']: isYou })}>
        {children}
      </div>
    </div>
  );
};
