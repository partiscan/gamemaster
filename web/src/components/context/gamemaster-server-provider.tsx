import fs from 'fs';
import React, { PropsWithChildren } from 'react';
import { GamemasterProvider } from './gamemaster.context';

const gamemasterAbi = fs.readFileSync(
  process.cwd() + '/src/contracts_gen/gamemaster/gamemaster.abi',
);

export const GamemasterServerProvider: React.FC<PropsWithChildren> = async ({
  children,
}) => {
  return (
    <GamemasterProvider abiBuffer={gamemasterAbi.toString('base64')}>
      {children}
    </GamemasterProvider>
  );
};
