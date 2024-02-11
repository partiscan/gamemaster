import { ISdkConnection } from 'partisia-blockchain-applications-sdk/dist/sdk';

export type PartisiaWallet = {
  kind: 'partisia';
  seed: string;
  wallet: ISdkConnection;
  address: string;
};

export type WalletIdentity = PartisiaWallet;
