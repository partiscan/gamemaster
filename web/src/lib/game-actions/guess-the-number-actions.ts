import { guess as gamemasterGuess } from '@/contracts_gen/clients/gamemaster';
import { ChainAction } from '@/server/chain-actions/types';
import {
  ContractAbi
} from '@partisiablockchain/abi-client';
import {
  BlockchainPublicKey
} from '@partisiablockchain/zk-client';
import { BaseActions } from './base-actions';

export class GuessTheNumberActions extends BaseActions {
  constructor(
    public readonly contract: string,
    address: string | undefined | null,
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
