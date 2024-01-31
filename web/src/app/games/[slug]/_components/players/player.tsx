'use client';

import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { cn } from '@/lib/utils';
import { AwardIcon } from 'lucide-react';
import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';
import { YouArrow } from './you-arrow';

type Props = PropsWithChildren<{
  address: string;
  playerIndex: number;
}>;

export const Player: FC<Props> = ({ address, children, playerIndex }) => {
  const {
    gameState: { currentGame, points },
  } = useGameState();
  const identity = useIdentity();
  const isYou = identity?.address === address;

  const currentIndex = Math.min(currentGame.index, points.length - 1);

  const currentGamePoints = points[currentIndex]?.[playerIndex] ?? 0;
  const previousGamePoints = points[currentIndex - 1]?.[playerIndex] ?? 0;

  const gotPointsForCurrentGame = currentIndex === currentGame.index;

  return (
    <div className='relative flex w-16 flex-col items-center justify-center gap-1'>
      {isYou && (
        <>
          <div className='absolute -top-5 left-10'>
            <YouArrow className='z-10 h-16 w-10' />
          </div>
          <div className='absolute -right-6 top-1 font-semibold text-[#328421]'>
            You
          </div>
        </>
      )}
      <Image
        src={`/assets/avatars/avatar-${playerIndex + 1}.png`}
        width={64}
        height={64}
        alt={''}
      />
      <div className='flex w-full flex-col gap-1 text-green-900'>
        <span className='overflow-hidden text-ellipsis font-mono text-xs'>
          {address}
        </span>
        <div className='mx-auto flex w-fit grid-cols-2 items-center justify-center rounded-full border bg-green-300 px-2 py-1 text-xs'>
          <AwardIcon size={16} />

          {gotPointsForCurrentGame && <span>{previousGamePoints} -&gt;&nbsp;</span>}

          <span>{currentGamePoints}</span>
        </div>
      </div>
      <div className={cn('absolute right-0 top-0', { ['top-6']: isYou })}>
        {children}
      </div>
    </div>
  );
};
