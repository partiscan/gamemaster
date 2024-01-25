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
import { guess as gamemasterGuess } from '@/contracts_gen/clients/gamemaster';
import { ChainAction } from '@/server/chain-actions/types';

export class GuessTheNumberActions extends BaseActions {
  constructor(
    public readonly contract: string,
    public readonly address: string | undefined | null,
    public readonly abi: ContractAbi,
    public readonly engineKeys: BlockchainPublicKey[],
  ) {
    super(contract, address, abi, engineKeys);
  }

  public secretNumberInput(secret: number): ChainAction {
    const rpc = this.inputZkSecret('on_secret_input', secret);
    return this.actionWithHexPayload(rpc);
  }

  public guess(guess: number): ChainAction {
    const rpc = gamemasterGuess(guess);
    return this.actionWithHexPayload(rpc);
  }
}
