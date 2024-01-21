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
import { BaseActions } from './base-actions';

export class GuessTheNumberActions extends BaseActions {
  constructor(
    public readonly address: string,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {
    super(address, abi, engineKeys);
  }

  public secretNumberInput(secret: number): Buffer {
    return this.inputZkSecret('on_secret_input', secret);
  }
}
