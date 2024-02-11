'use client';

import { GameState, getGameState } from '@/server/game/get-game-state';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useIdentity } from './identity/identity.context';
import { BlockchainPublicKey } from '@partisiablockchain/zk-client';

type GameStateContextType = {
  gameState: GameState;
  isAdmin: boolean;
  isInGame: boolean;
  contractId: string;
  engineKeys: BlockchainPublicKey[];
  actualGame: GameState['games'][number];
  isGameEnded: boolean;
} | null;

const GameStateContext = React.createContext<GameStateContextType>(null);

export const useGameState = (): NonNullable<GameStateContextType> =>
  React.useContext(GameStateContext)!;

const REFRESH_INTERVAL = 5_000;
export const GameStateProvider: React.FC<
  PropsWithChildren<{ id: string; defaultGameState: GameState }>
> = ({ children, id, defaultGameState }) => {
  const [gameState, setGameState] = React.useState<GameState>(defaultGameState);

  useEffect(() => {
    const interval = setInterval(async () => {
      const nextState = await getGameState(id);
      if (!nextState) return;

      setGameState(nextState);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [id]);

  const engineKeys = useMemo(
    () =>
      gameState.engineKeys.map((key) =>
        BlockchainPublicKey.fromBuffer(Buffer.from(key, 'base64')),
      ),
    [gameState],
  );

  const identity = useIdentity();
  const isAdmin = gameState?.administrator === identity?.address;
  const isInGame = gameState?.players.includes(identity?.address ?? '');
  const actualGame =
    gameState?.games?.[
      Math.min(gameState.currentGame.index, gameState.games.length - 1)
    ];

  const isGameEnded =
    gameState.currentGame.status === 'finished' &&
    gameState.currentGame.index >= gameState.games.length - 1;

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        contractId: id,
        isAdmin,
        isInGame,
        engineKeys,
        actualGame,
        isGameEnded,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
