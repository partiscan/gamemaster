import Image from 'next/image';
import { FC } from 'react';
import { Player } from './player';
import { cn } from '@/lib/utils';

type Props = {
  players: number[];
};

export const PlayerTable: FC<Props> = ({ players }) => {
  return (
    <div className='relative h-48 w-48'>
      {players.map((player, i) => (
        <Player
          key={player}
          className={cn('absolute', {
            'left-7 top-2 ': i === 0,
            'right-7 top-2 ': i === 1,
          })}
          imageClassName={cn('z-10', {
            'skew-x-[10deg] skew-y-[-28deg]': i === 0,
            'skew-x-[-10deg] skew-y-[28deg]': i === 1,
          })}
          playerIndex={player}
          hidePoints
        />
      ))}
      <div className='absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform'>
        <Image src={`/assets/table.webp`} alt={''} fill />
      </div>
    </div>
  );
};
