'use client';

import { PartisiaWallet } from '@/components/wallet/wallet-identity';
import { fetchIdentity } from '@/server/user/cookie-auth';
import PartisiaSdk from 'partisia-blockchain-applications-sdk';

export const getPartisiaSdk = ({ wallet, seed }: PartisiaWallet) =>
  new PartisiaSdk({
    seed,
    connection: wallet,
  });

export const signTransaction = async (contract: string, hexPayload: string) => {
  const identity = await fetchIdentity();
  if (!identity) return;

  const sdk = getPartisiaSdk(identity);

  if (!sdk) return;

  return await sdk.signMessage({
    contract,
    payload: hexPayload,
    payloadType: 'hex_payload',
    dontBroadcast: false,
  });
};
