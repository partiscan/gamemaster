import { ChainAction } from '@/server/chain-actions/types';
import { ContractAbi } from '@partisiablockchain/abi-client';
import { BlockchainPublicKey } from '@partisiablockchain/zk-client';
import { BaseActions } from './base-actions';

const PROTECT_ACTION = 0b0000_0000;
const SABOTAGE_ACTION = 0b0100_0000;
const PLAYER_BITS = 0b0011_1111;

export class SabotageActions extends BaseActions {
  constructor(
    public readonly contract: string,
    address: string | null | undefined,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {
    super(contract, address, abi, engineKeys);
  }

  public inputAction(
    playerIndex: number,
    action: 'protect' | 'sabotage',
  ): Promise<ChainAction> {
    const actionBit = action === 'protect' ? PROTECT_ACTION : SABOTAGE_ACTION;
    const secret = actionBit | (playerIndex & PLAYER_BITS);
    const rpc = this.inputZkSecret('on_secret_input', secret);
    return this.actionWithHexPayload(rpc);
  }
}
