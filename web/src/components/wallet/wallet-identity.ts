import { ISdkConnection } from 'partisia-sdk/dist/sdk';

export type PartisiaWallet = {
  kind: 'partisia';
  seed: string;
  wallet: ISdkConnection;
  address: string;
};

export type WalletIdentity = PartisiaWallet;
