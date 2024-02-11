'use client';

import { useGameState } from '@/components/context/game-state.context';
import { GAMES } from '@/config';
import Image from 'next/image';
import { GamePoints } from './game-points';
import { GameHeadline } from './typography/game-headline';
import { GameSubheader } from './typography/game-subheader';

export const GameRules = () => {
  const { actualGame: game } = useGameState();
  const gameDetails = GAMES.find((g) => g.id === game.kind);
  if (!gameDetails) return null;

  return (
    <div className='mx-auto mb-2  flex w-full max-w-2xl flex-col items-center gap-0 bg-slate-200 text-center md:flex-row md:items-start md:gap-2 md:text-left'>
      <Image
        className='shrink grow-0 rounded'
        src={`/assets/games/${game.kind}.webp`}
        alt={''}
        width={128}
        height={128}
      />
      <div className='grow p-2'>
        <GameHeadline>{gameDetails.title}</GameHeadline>
        <GameSubheader>{gameDetails.description}</GameSubheader>
      </div>
      <div className='shrink-0 p-2 md:pr-4'>
        <GameHeadline>Points</GameHeadline>
        <GameSubheader>
          <GamePoints game={game} />
        </GameSubheader>
      </div>
    </div>
  );
};
