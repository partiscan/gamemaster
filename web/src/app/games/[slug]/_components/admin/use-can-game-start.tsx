import { useGameState } from '@/components/context/game-state.context';

export const useCanGameStart = () => {
  const { gameState } = useGameState();

  return gameState.players.length >= 2;
};
