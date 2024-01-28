import { StateBytes } from '@partisiablockchain/abi-client';

export type ContractType = 'PUBLIC' | 'ZERO_KNOWLEDGE';

export interface ContractData<Type extends ContractType, WrapperState> {
  type: Type;
  address: string;
  jarHash: string;
  storageLength: number;
  abi: string;
  serializedContract: WrapperState;
}

type ZkEngine = {
  identity: string;
  publicKey: string;
  restInterface: string;
};

type ZkStateWrapper<State> = {
  attestations: [];
  calculationStatus: 'WAITING';
  engines: {
    engines: Array<ZkEngine>;
  };
  finishedComputations: [];
  nextAttestationId: number;
  nextVariableId: number;
  nodeRegistryContract: string;
  openState: {
    avlTrees: [];
    openState: {
      data: State;
    };
  };
  pendingInput: [];
  pendingOnChainOpen: [];
  preProcessMaterials: [];
  preprocessContract: string;
  variables: [];
  zkComputationDeadline: string;
};

export type ZkContractState<State> = ContractData<
  'ZERO_KNOWLEDGE',
  ZkStateWrapper<State>
>;
export type PublicContractState<State> = ContractData<
  'PUBLIC',
  {
    avlTrees: [];
    state: {
      data: State;
    };
  }
>;

const numberOfShards = 3;

const READER_URL = 'https://node1.testnet.partisiablockchain.com';
export const getContractState = async <T = string>(
  contract: string,
  stateMapper?: (state: StateBytes) => T,
): Promise<ZkContractState<T> | PublicContractState<T>> => {
  const shard = getShardByAddress(contract);
  const response = await fetch(
    `${READER_URL}/shards/Shard${shard}/blockchain/contracts/${contract}?requireContractState=true`,
  );
  if (!response.ok) throw new Error('Unable to find game');

  const data: ZkContractState<string> | PublicContractState<string> =
    await response.json();
  if (!stateMapper) return data as any;

  if (data.type === 'ZERO_KNOWLEDGE') {
    let state = Buffer.from(
      data.serializedContract.openState.openState.data,
      'base64',
    );
    let unserialized = data as ZkContractState<T>;
    unserialized.serializedContract.openState.openState.data = stateMapper({
      state,
    });
    return unserialized;
  }

  if (data.type === 'PUBLIC') {
    let state = Buffer.from(data.serializedContract.state.data, 'base64');
    let unserialized = data as PublicContractState<T>;
    unserialized.serializedContract.state.data = stateMapper({
      state,
    });
    return unserialized;
  }

  throw new Error('Unsupported contract type');
};

const getShardByAddress = (address: string) => {
  const buffer = Buffer.from(address, 'hex');
  const shardIndex = Math.abs(buffer.readInt32BE(17)) % numberOfShards;
  return shardIndex;
};
