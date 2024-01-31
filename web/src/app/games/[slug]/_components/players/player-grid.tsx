'use client';

import { useGameState } from '@/components/context/game-state.context';
import { Player } from './player';

export const PlayerGrid = () => {
  const { gameState } = useGameState();

  if (!gameState.players.length) {
    return (
      <div className='mt-4'>
        <h3 className='font-medium'>Players</h3>
        No players yet!
      </div>
    );
  }

  return (
    <div className='mt-4 w-full max-w-screen-xl'>
      <h3 className='font-medium'>Players</h3>
      <div className='grid grid-cols-sabotage-players gap-2'>
        {gameState.players.map((player, i) => (
          <Player key={player} address={player} playerIndex={i} />
        ))}
      </div>
    </div>
  );
};