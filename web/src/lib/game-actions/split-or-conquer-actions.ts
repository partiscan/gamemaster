import { ChainAction } from '@/server/chain-actions/types';
import { ContractAbi } from '@partisiablockchain/abi-client';
import { BlockchainPublicKey } from '@partisiablockchain/zk-client';
import { BaseActions } from './base-actions';

const SPLIT_ACTION = 0b0000_0001;
const CONQUER_ACTION = 0b0000_0010;

export class SplitOrConquerActions extends BaseActions {
  constructor(
    public readonly contract: string,
    address: string | null | undefined,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {
    super(contract, address, abi, engineKeys);
  }

  public inputAction(action: 'split' | 'conquer'): ChainAction {
    const secret = action === 'split' ? SPLIT_ACTION : CONQUER_ACTION;
    const rpc = this.inputZkSecret('on_secret_input', secret);
    return this.actionWithHexPayload(rpc);
  }
}
