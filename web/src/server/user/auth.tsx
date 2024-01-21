'use server';

import { WalletIdentity } from '@/components/wallet/wallet-identity';

import 'server-only';
import { deleteIdentity, saveIdentity } from './cookie-auth';

export const login = async (wallet: WalletIdentity) => {
  // Currently trusts frontend
  // TODO: Add verify wallet signature
  return saveIdentity(wallet);
};

export const logout = async () => deleteIdentity();
