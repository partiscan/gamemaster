'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGuessTheNumberActions } from '@/lib/game-actions/actions.hook';
import { GuessTheNumberGame } from '@/server/game/get-game-state';
import { FC, useState } from 'react';
import { PlayerGrid } from '../players/player-grid';
import { Player } from '../players/player';

type Props = {
  game: GuessTheNumberGame;
};

export const GuessTheNumberGameScreen: FC<Props> = ({ game }) => {
  const [guess, setGuess] = useState(0);

  const {
    gameState: {
      currentGame: { status },
      players,
    },
    isInGame,
  } = useGameState();
  const address = useIdentity()?.address;
  const actions = useGuessTheNumberActions();
  if (status === 'not-started') return null;

  const gameIsFinished = status === 'finished';

  return (
    <div className='w-full text-center'>
      <div>
        <span className='text-sm font-medium'>Wrong guesses:</span>{' '}
        <span className='font-mono text-sm'>
          {game.wrongGuesses.length > 0
            ? game.wrongGuesses.join(', ')
            : 'None yet'}
        </span>
      </div>
      {address && isInGame && status === 'in-progress' && (
        <div className='mx-auto mt-4 w-full max-w-sm items-center space-y-5 border border-gray-300 bg-gray-50 p-5 text-sm font-semibold'>
          <Label htmlFor='guess-number'>Guess: {guess}</Label>
          <Slider
            id='guess-number'
            value={[guess]}
            onValueChange={(value) => setGuess(value[0])}
            min={0}
            max={255}
            className='mx-auto min-w-48'
          />
          <ChainActionButton action={() => actions.guess(guess)}>
            Guess!
          </ChainActionButton>
        </div>
      )}
      {gameIsFinished && (
        <div>
          {game.winner !== undefined && <div className='w-fit mx-auto'>Winner! <Player playerIndex={game.winner} /></div>}
          {game.winner === undefined && <div>There was no winner!</div>}
        </div>
      )}

      <PlayerGrid />
    </div>
  );
};
