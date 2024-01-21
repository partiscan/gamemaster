'use server';

import { WalletIdentity } from '@/components/wallet/wallet-identity';
import { defaults, seal, unseal } from 'iron-webcrypto';
import { cookies } from 'next/headers';

import 'server-only';

const secret = process.env.COOKIE_SECRET!;
const cookieName = 'identity';

export const saveIdentity = async (
  identity: WalletIdentity,
): Promise<WalletIdentity> => {
  const cookieStore = cookies();

  const sealed = await seal(crypto, identity, secret, defaults);
  cookieStore.set(cookieName, sealed);

  return identity;
};

export const fetchIdentity = async (): Promise<WalletIdentity | null> => {
  try {
    const cookieStore = cookies();

    const identity = cookieStore.get(cookieName)?.value;
    if (!identity) return null;

    const unsealed = await unseal(crypto, identity, secret, defaults);
    return unsealed as WalletIdentity;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteIdentity = () => {
  cookies().delete(cookieName);
};
