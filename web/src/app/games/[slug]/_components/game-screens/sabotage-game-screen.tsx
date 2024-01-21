'use client';

import { useGameState } from '@/components/context/game-state.context';
import { Button } from '@/components/ui/button';
import { SabotageGame } from '@/server/game/get-game-state';
import { ShieldHalf, SwordIcon } from 'lucide-react';
import { FC } from 'react';
import { Player } from '../players/player';

type Props = {
  game: SabotageGame;
};

export const SabotageGameScreen: FC<Props> = ({ game }) => {
  const { gameState } = useGameState();
  const calculating =
    gameState.currentGame.status === 'finished' && !game.result;

  return (
    <div className='w-full max-w-screen-xl'>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-6'>
        {gameState.players.map((player, i) => (
          <Button key={player} variant='ghost' className='relative h-fit'>
            <Player address={player} points={0}>
              <div className='absolute -right-7 top-0'>
                {game.result?.[i]?.sabotage === true && (
                  <SwordIcon className='h-6 w-6 fill-red-400 text-red-800' />
                )}

                {game.result?.[i]?.protect === true && (
                  <ShieldHalf className='h-6 w-6 fill-green-600 text-green-800' />
                )}
              </div>
            </Player>
          </Button>
        ))}
      </div>
    </div>
  );
};
