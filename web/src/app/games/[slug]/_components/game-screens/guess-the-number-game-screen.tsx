'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useGuessTheNumberActions } from '@/lib/game-actions/actions.hook';
import { GuessTheNumberGame } from '@/server/game/get-game-state';
import { FC, useState } from 'react';

type Props = {
  game: GuessTheNumberGame;
};

export const GuessTheNumberGameScreen: FC<Props> = ({ game }) => {
  const [guess, setGuess] = useState(0);

  const {
    gameState: {
      currentGame: { status },
    },
    isInGame,
  } = useGameState();
  const address = useIdentity()?.address;
  const actions = useGuessTheNumberActions();
  if (!address || !isInGame || status === 'not-started') return null;

  const gameIsFinished = status === 'finished';

  return (
    <div className='p-4 text-center'>
      {isInGame && status === 'in-progress' && (
        <div className='mx-auto w-full max-w-sm items-center space-y-5 text-sm font-semibold'>
          <Label htmlFor='guess-number'>Guess: {guess}</Label>
          <Slider
            id='guess-number'
            value={[guess]}
            onValueChange={(value) => setGuess(value[0])}
            min={0}
            max={255}
            className='mx-auto min-w-48'
          />
          <ChainActionButton action={actions.guess(guess)}>
            Guess!
          </ChainActionButton>
        </div>
      )}
      {gameIsFinished && (
        <div>
          {game.winner && <div>Winner: {game.winner}</div>}
          {!game.winner && <div>There was no winner!</div>}
        </div>
      )}
    </div>
  );
};
