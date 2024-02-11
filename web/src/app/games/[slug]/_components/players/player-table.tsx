import { useGameState } from '@/components/context/game-state.context';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon } from 'lucide-react';
import Image from 'next/image';
import { FC, Fragment } from 'react';
import { Player } from './player';

type Props = {
  players: number[];
};

export const PlayerTable: FC<Props> = ({ players }) => {
  const {
    gameState: { secretVariablesOwners, players: playerAddresses },
  } = useGameState();

  return (
    <div className='relative h-36 w-48'>
      {players.map((player, i) => (
        <Fragment key={player}>
          <Player
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
          {secretVariablesOwners.some((p) => p === playerAddresses[player]) && (
            <CheckCircle2Icon
              className={cn(
                'absolute bottom-16 z-40 w-6 fill-green-200 text-green-800',
                {
                  'left-16': i === 0,
                  'right-16': i === 1,
                },
              )}
            />
          )}
        </Fragment>
      ))}
      <div className='absolute bottom-0 left-1/2 z-10 h-24 w-24 -translate-x-1/2 transform'>
        <Image src={`/assets/table.webp`} alt={''} fill />
      </div>
    </div>
  );
};
