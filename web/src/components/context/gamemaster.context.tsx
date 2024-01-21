'use client';

import { AbiParser, ContractAbi } from '@partisiablockchain/abi-client';
import React, { PropsWithChildren, useState } from 'react';

type GamemasterContextType = {
  abi: ContractAbi;
};

const GamemasterContext = React.createContext<GamemasterContextType>(
  null as any,
);

export const useGamemasterAbi = (): ContractAbi =>
  React.useContext(GamemasterContext)!.abi;

export const GamemasterProvider: React.FC<
  PropsWithChildren<{ abiBuffer: string }>
> = ({ abiBuffer, children }) => {
  const [abi] = useState(() => {
    return new AbiParser(Buffer.from(abiBuffer, 'base64')).parseAbi().contract;
  });

  return (
    <GamemasterContext.Provider value={{ abi }}>
      {children}
    </GamemasterContext.Provider>
  );
};
