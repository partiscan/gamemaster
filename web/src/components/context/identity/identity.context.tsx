'use client';

import React, { PropsWithChildren } from 'react';
import { WalletIdentity } from '../../wallet/wallet-identity';

type IdentityContextType = {
  identity: WalletIdentity | null;
};

const IdentityContext = React.createContext<IdentityContextType>({
  identity: null,
});

export const useIdentity = () => React.useContext(IdentityContext).identity;

export const IdentityProvider: React.FC<
  PropsWithChildren<IdentityContextType>
> = ({ children, identity }) => {
  return (
    <IdentityContext.Provider value={{ identity }}>
      {children}
    </IdentityContext.Provider>
  );
};
