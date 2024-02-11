'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { useSabotageActions } from '@/lib/game-actions/actions.hook';
import { SabotageGame } from '@/server/game/get-game-state';
import { ShieldHalf, SwordIcon } from 'lucide-react';
import { FC } from 'react';
import { Player } from '../players/player';

type Props = {
  game: SabotageGame;
};

export const SabotageGameScreen: FC<Props> = ({ game }) => {
  const { gameState } = useGameState();
  const address = useIdentity()?.address;
  const calculating =
    gameState.currentGame.status === 'finished' && !game.result;

  const actions = useSabotageActions();

  const currentPlayer = gameState.players.findIndex(
    (player) => player === address,
  );

  return (
    <div className='mx-auto w-full max-w-screen-xl'>
      <div className='grid grid-cols-sabotage-players gap-2'>
        {gameState.players.map((player, i) => (
          <ChainActionButton
            key={player}
            variant='ghost'
            className='relative h-fit'
            action={actions.inputAction(
              i,
              i === currentPlayer ? 'protect' : 'sabotage',
            )}
            disabled={
              currentPlayer < 0 ||
              gameState.currentGame.status !== 'in-progress'
            }
            disableLoading
          >
            <Player playerIndex={i}>
              <div className='absolute -right-7 top-0'>
                {game.result?.[i]?.sabotage === true && (
                  <SwordIcon className='h-6 w-6 fill-red-400 text-red-800' />
                )}

                {game.result?.[i]?.protect === true && (
                  <ShieldHalf className='h-6 w-6 fill-green-600 text-green-800' />
                )}
              </div>
            </Player>
          </ChainActionButton>
        ))}
      </div>
    </div>
  );
};
