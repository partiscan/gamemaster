export type ChainAction = {
  contract: string;
  payload: string;
  payloadType: 'hex_payload' | 'hex';
};
