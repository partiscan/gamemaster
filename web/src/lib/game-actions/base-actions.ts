import { ChainAction } from '@/server/chain-actions/types';
import {
  ContractAbi,
  FnRpcBuilder,
  ZkInputBuilder,
} from '@partisiablockchain/abi-client';
import {
  BlockchainAddress,
  BlockchainPublicKey,
  ZkRpcBuilder,
} from '@partisiablockchain/zk-client';

export class BaseActions {
  constructor(
    public readonly contract: string,
    public readonly address: string | null | undefined,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {}

  public actionWithHexPayload(payload: Buffer): ChainAction {
    return {
      contract: this.contract,
      payload: payload.toString('hex'),
      payloadType: 'hex_payload',
    };
  }

  public inputZkSecret(method: string, secret: number): Buffer {
    const fnBuilder = new FnRpcBuilder(method, this.abi);
    const additionalRpc = fnBuilder.getBytes();

    const secretInputBuilder = ZkInputBuilder.createZkInputBuilder(
      method,
      this.abi,
    );
    secretInputBuilder.addI8(secret);
    const compactBitArray = secretInputBuilder.getBits();

    return ZkRpcBuilder.zkInputOnChain(
      BlockchainAddress.fromString(this.address!),
      compactBitArray,
      additionalRpc,
      this.engineKeys,
    );
  }
}
