'use client';

import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { useSplitOrConquerActions } from '@/lib/game-actions/actions.hook';
import { SplitOrConquerGame } from '@/server/game/get-game-state';
import { FC } from 'react';
import { PlayerTable } from '../players/player-table';
import { ChainActionButton } from '@/components/chain-action-button';
import { PlayerGrid } from '../players/player-grid';

type Props = {
  game: SplitOrConquerGame;
};

export const SplitOrConquerGameScreen: FC<Props> = ({ game }) => {
  const { gameState } = useGameState();
  const address = useIdentity()?.address;

  const actions = useSplitOrConquerActions();

  const currentPlayer = gameState.players.findIndex(
    (player) => player === address,
  );

  const pairs = chunks(
    gameState.players.map((_, i) => i),
    2,
  );

  if (gameState.currentGame.status === 'finished') {
    return <PlayerGrid />;
  }

  return (
    <div>
      {currentPlayer >= 0 && (
        <div className='mb-8 flex items-center justify-center gap-5'>
          <ChainActionButton action={actions.inputAction('split')}>
            Split
          </ChainActionButton>

          <span className='text-sm font-bold'>OR</span>

          <ChainActionButton action={actions.inputAction('conquer')}>
            Conquer
          </ChainActionButton>
        </div>
      )}

      <div className='mx-auto flex w-full max-w-screen-xl flex-wrap justify-around gap-10'>
        {pairs.map((pair, i) => (
          <PlayerTable key={i} players={pair} />
        ))}
      </div>
    </div>
  );
};

function chunks<T>(arr: Array<T>, chunkSize: number) {
  const results = [];
  while (arr.length) {
    results.push(arr.splice(0, chunkSize));
  }
  return results;
}
