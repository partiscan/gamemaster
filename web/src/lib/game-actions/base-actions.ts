import { endGame } from '@/contracts_gen/clients/gamemaster';
import { ChainAction } from '@/server/chain-actions/types';
import { payloadToChainAction } from '@/server/partisia.client';
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

// If there is no address, we can just default to the 00 one
const DEFAULT_ADDRESS = Array(21).fill('00').join('');

export class BaseActions {
  public readonly address: string;

  constructor(
    public readonly contract: string,
    address: string | null | undefined,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {
    this.address = address ?? DEFAULT_ADDRESS;
  }

  public endGame(): ChainAction {
    return {
      contract: this.contract,
      payload: endGame().toString('hex'),
      payloadType: 'hex_payload',
    };
  }

  public async actionWithHexPayload(
    payload: Buffer,
    settings?: {
      cost?: number;
      expirationInSeconds?: number;
    },
  ): Promise<ChainAction> {
    return payloadToChainAction(this.address, this.contract, payload, settings);
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
      BlockchainAddress.fromString(this.address),
      compactBitArray,
      additionalRpc,
      this.engineKeys,
    );
  }
}
