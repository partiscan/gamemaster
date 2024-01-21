'use client';

import { useIdentity } from '@/components/context/identity/identity.context';
import Image from 'next/image';
import { FC, PropsWithChildren } from 'react';
import { YouArrow } from './you-arrow';
import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
  address: string;
  points: number;
}>;

export const Player: FC<Props> = ({ address, points, children }) => {
  const identity = useIdentity();
  const isYou = identity?.address === address;

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
        src={`/assets/avatars/avatar-${random(1, 30)}.png`}
        width={64}
        height={64}
        alt={''}
      />
      <div className='flex w-full flex-col'>
        <span className='overflow-hidden text-ellipsis font-mono text-xs'>
          {address}
        </span>
        <span>Points: {points}</span>
      </div>
      <div className={cn('absolute right-0 top-0', { ['top-6']: isYou })}>
        {children}
      </div>
    </div>
  );
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
