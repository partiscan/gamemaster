import { StateBytes } from '@partisiablockchain/abi-client';
import { partisiaCrypto } from 'partisia-blockchain-applications-crypto';
import { ChainAction } from './chain-actions/types';

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

type WithKey<T> = { key: number; value: T };

type SecretVariable = {
  id: number;
  information: { data: string };
  inputMaskOffset: number;
  maskedInputShare: { data: string };
  owner: string;
  sealed: boolean;
  shareBitLengths: number[];
  transaction: string;
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
  variables: Array<WithKey<SecretVariable>>;
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
    {
      next: {
        revalidate: 30,
      },
    },
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

export const getNonce = async (
  account: string,
): Promise<{
  nonce: number;
}> => {
  if (!account) throw new Error('Missing account or shard');

  const shard = getShardByAddress(account);
  const baseUrl = `${READER_URL}/shards/Shard${shard}`;
  const response = await fetch(`${baseUrl}/blockchain/account/${account}`, {
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Couldnt get nonce');

  return await response.json();
};

const DEFAULT_COST = 9000;
const DEFAULT_EXPIRATION_IN_SECONDS = 1 * 60;
export const payloadToChainAction = async (
  address: string,
  contract: string,
  payload: Buffer,
  settings?: {
    cost?: number;
    expirationInSeconds?: number;
  },
): Promise<ChainAction> => {
  if (settings) {
    const { nonce } = await getNonce(address);

    const serialized = partisiaCrypto.transaction.serializedTransaction(
      {
        cost: settings.cost ?? DEFAULT_COST,
        nonce,
        validTo: (Date.now() +
          (settings?.expirationInSeconds ?? DEFAULT_EXPIRATION_IN_SECONDS) *
            1000) as any,
      },
      { contract },
      payload,
    );

    return {
      contract,
      payload: serialized.toString('hex'),
      payloadType: 'hex',
    };
  }

  return {
    contract,
    payload: payload.toString('hex'),
    payloadType: 'hex_payload',
  };
};

const getShardByAddress = (address: string) => {
  const buffer = Buffer.from(address, 'hex');
  const shardIndex = Math.abs(buffer.readInt32BE(17)) % numberOfShards;
  return shardIndex;
};
