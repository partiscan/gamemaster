'use client';

import { useGameState } from '@/components/context/game-state.context';
import { GuessTheNumberGameScreen } from './game-screens/guess-the-number-game-screen';
import { PreGameScreen } from './game-screens/pre-game-screen';
import { SabotageGameScreen } from './game-screens/sabotage-game-screen';
import { SplitOrConquerGameScreen } from './game-screens/split-or-conquer-game-screen';

export const MainGameScreen = () => {
  const { gameState, actualGame: game } = useGameState();
  const { currentGame } = gameState;

  if (currentGame.index === 0 && currentGame.status === 'not-started') {
    return <PreGameScreen />;
  }

  if (game.kind === 'guess-the-number') {
    return <GuessTheNumberGameScreen game={game} />;
  }

  if (game.kind === 'sabotage') {
    return <SabotageGameScreen game={game} />;
  }

  if (game.kind === 'split-or-conquer') {
    return <SplitOrConquerGameScreen game={game} />;
  }

  return null;
};
