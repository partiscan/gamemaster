/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BN from 'bn.js';
import {
  AbiParser,
  AbstractBuilder,
  BigEndianReader,
  FileAbi,
  FnKinds,
  FnRpcBuilder,
  RpcReader,
  ScValue,
  ScValueEnum,
  ScValueOption,
  ScValueStruct,
  StateReader,
  TypeIndex,
  StateBytes,
  BlockchainAddress,
  Hash,
} from '@partisiablockchain/abi-client';
import { BigEndianByteOutput } from '@secata-public/bitmanipulation-ts';

const fileAbi: FileAbi = new AbiParser(
  Buffer.from(
    '5042434142490900000501000000000501000000175265616c4465706c6f79436f6e74726163745374617465000000050000000762696e64657273120f12081200010000000c6e65787442696e6465724964080000000a70726550726f63657373120d0000001373797374656d55706461746541646472657373120d0000000e7a6b4e6f64655265676973747279120d010000000a42696e646572496e666f000000040000000a62696e64696e674a6172120e0100000017737570706f727465645a6b626356657273696f6e4d6178120003000000137573656450726f746f636f6c56657273696f6e1200030000000f76657273696f6e496e74657276616c120002010000001e537570706f7274656442696e64657256657273696f6e496e74657276616c0000000200000019737570706f7274656442696e64657256657273696f6e4d617812000300000019737570706f7274656442696e64657256657273696f6e4d696e120003010000001553656d616e74696356657273696f6e24537461746500000003000000056d616a6f7208000000056d696e6f720800000005706174636808010000001353656d616e74696356657273696f6e2452706300000003000000056d616a6f7208000000056d696e6f720800000005706174636808000000090100000006637265617465ffffffff0f000000080000000a62696e64696e674a61720e010000000a70726550726f636573730d0000000e7a6b4e6f646552656769737472790d0000001373797374656d557064617465416464726573730d00000018737570706f7274656450726f746f636f6c56657273696f6e000400000019737570706f7274656442696e64657256657273696f6e4d696e000400000019737570706f7274656442696e64657256657273696f6e4d6178000400000017737570706f727465645a6b626356657273696f6e4d6178000402000000106465706c6f79436f6e7472616374563100000000040000000b636f6e74726163744a61720e010000000e696e697469616c697a6174696f6e0e01000000036162690e010000000e72657175697265645374616b65730902000000106465706c6f79436f6e7472616374563201000000050000000b636f6e74726163744a61720e010000000e696e697469616c697a6174696f6e0e01000000036162690e010000000e72657175697265645374616b65730900000014616c6c6f7765644a7572697364696374696f6e730e0e0802000000106465706c6f79436f6e7472616374563302000000060000000b636f6e74726163744a61720e010000000e696e697469616c697a6174696f6e0e01000000036162690e010000000e72657175697265645374616b65730900000014616c6c6f7765644a7572697364696374696f6e730e0e0800000008756e69717565496408020000000961646442696e64657203000000050000000a62696e64696e674a61720e0100000019737570706f7274656442696e64657256657273696f6e4d696e000400000019737570706f7274656442696e64657256657273696f6e4d61780004000000137573656450726f746f636f6c56657273696f6e000400000017737570706f727465645a6b626356657273696f6e4d61780004020000000c72656d6f766542696e64657204000000010000000862696e64657249640802000000106465706c6f79436f6e7472616374563405000000070000000b636f6e74726163744a61720e010000000e696e697469616c697a6174696f6e0e01000000036162690e010000000e72657175697265645374616b65730900000014616c6c6f7765644a7572697364696374696f6e730e0e0800000008756e6971756549640800000017726571756972656445766d436861696e537570706f72740e0b03000000136e6f64655265717565737443616c6c6261636b00000000060000000f636f6e7472616374416464726573730d0000000b636f6e74726163744a61720e010000000e696e697469616c697a6174696f6e0e01000000036162690e0100000016746f6b656e734c6f636b6564546f436f6e74726163740900000008756e6971756549640803000000127361766542696e64657243616c6c6261636b01000000050000000a62696e646572486173681300000019737570706f7274656442696e64657256657273696f6e4d696e000400000019737570706f7274656442696e64657256657273696f6e4d61780004000000137573656450726f746f636f6c56657273696f6e000400000017737570706f727465645a6b626356657273696f6e4d617800040000',
    'hex',
  ),
).parseAbi();

type Option<K> = K | undefined;

export interface RealDeployContractState {
  binders: Option<Map<Option<number>, Option<BinderInfo>>>;
  nextBinderId: number;
  preProcess: Option<BlockchainAddress>;
  systemUpdateAddress: Option<BlockchainAddress>;
  zkNodeRegistry: Option<BlockchainAddress>;
}

export function newRealDeployContractState(
  binders: Option<Map<Option<number>, Option<BinderInfo>>>,
  nextBinderId: number,
  preProcess: Option<BlockchainAddress>,
  systemUpdateAddress: Option<BlockchainAddress>,
  zkNodeRegistry: Option<BlockchainAddress>,
): RealDeployContractState {
  return {
    binders,
    nextBinderId,
    preProcess,
    systemUpdateAddress,
    zkNodeRegistry,
  };
}

function fromScValueRealDeployContractState(
  structValue: ScValueStruct,
): RealDeployContractState {
  return {
    binders: structValue
      .getFieldValue('binders')!
      .optionValue()
      .valueOrUndefined(
        (sc1) =>
          new Map(
            [...sc1.mapValue().map].map(([k2, v3]) => [
              k2.optionValue().valueOrUndefined((sc4) => sc4.asNumber()),
              v3
                .optionValue()
                .valueOrUndefined((sc5) =>
                  fromScValueBinderInfo(sc5.structValue()),
                ),
            ]),
          ),
      ),
    nextBinderId: structValue.getFieldValue('nextBinderId')!.asNumber(),
    preProcess: structValue
      .getFieldValue('preProcess')!
      .optionValue()
      .valueOrUndefined((sc6) =>
        BlockchainAddress.fromBuffer(sc6.addressValue().value),
      ),
    systemUpdateAddress: structValue
      .getFieldValue('systemUpdateAddress')!
      .optionValue()
      .valueOrUndefined((sc7) =>
        BlockchainAddress.fromBuffer(sc7.addressValue().value),
      ),
    zkNodeRegistry: structValue
      .getFieldValue('zkNodeRegistry')!
      .optionValue()
      .valueOrUndefined((sc8) =>
        BlockchainAddress.fromBuffer(sc8.addressValue().value),
      ),
  };
}

export function deserializeRealDeployContractState(
  state: StateBytes,
): RealDeployContractState {
  const scValue = new StateReader(
    state.state,
    fileAbi.contract,
    state.avlTrees,
  ).readState();
  return fromScValueRealDeployContractState(scValue);
}

export interface BinderInfo {
  bindingJar: Option<Buffer>;
  supportedZkbcVersionMax: Option<SemanticVersion$State>;
  usedProtocolVersion: Option<SemanticVersion$State>;
  versionInterval: Option<SupportedBinderVersionInterval>;
}

export function newBinderInfo(
  bindingJar: Option<Buffer>,
  supportedZkbcVersionMax: Option<SemanticVersion$State>,
  usedProtocolVersion: Option<SemanticVersion$State>,
  versionInterval: Option<SupportedBinderVersionInterval>,
): BinderInfo {
  return {
    bindingJar,
    supportedZkbcVersionMax,
    usedProtocolVersion,
    versionInterval,
  };
}

function fromScValueBinderInfo(structValue: ScValueStruct): BinderInfo {
  return {
    bindingJar: structValue
      .getFieldValue('bindingJar')!
      .optionValue()
      .valueOrUndefined((sc9) => sc9.vecU8Value()),
    supportedZkbcVersionMax: structValue
      .getFieldValue('supportedZkbcVersionMax')!
      .optionValue()
      .valueOrUndefined((sc10) =>
        fromScValueSemanticVersion$State(sc10.structValue()),
      ),
    usedProtocolVersion: structValue
      .getFieldValue('usedProtocolVersion')!
      .optionValue()
      .valueOrUndefined((sc11) =>
        fromScValueSemanticVersion$State(sc11.structValue()),
      ),
    versionInterval: structValue
      .getFieldValue('versionInterval')!
      .optionValue()
      .valueOrUndefined((sc12) =>
        fromScValueSupportedBinderVersionInterval(sc12.structValue()),
      ),
  };
}

export interface SupportedBinderVersionInterval {
  supportedBinderVersionMax: Option<SemanticVersion$State>;
  supportedBinderVersionMin: Option<SemanticVersion$State>;
}

export function newSupportedBinderVersionInterval(
  supportedBinderVersionMax: Option<SemanticVersion$State>,
  supportedBinderVersionMin: Option<SemanticVersion$State>,
): SupportedBinderVersionInterval {
  return { supportedBinderVersionMax, supportedBinderVersionMin };
}

function fromScValueSupportedBinderVersionInterval(
  structValue: ScValueStruct,
): SupportedBinderVersionInterval {
  return {
    supportedBinderVersionMax: structValue
      .getFieldValue('supportedBinderVersionMax')!
      .optionValue()
      .valueOrUndefined((sc13) =>
        fromScValueSemanticVersion$State(sc13.structValue()),
      ),
    supportedBinderVersionMin: structValue
      .getFieldValue('supportedBinderVersionMin')!
      .optionValue()
      .valueOrUndefined((sc14) =>
        fromScValueSemanticVersion$State(sc14.structValue()),
      ),
  };
}

export interface SemanticVersion$State {
  major: number;
  minor: number;
  patch: number;
}

export function newSemanticVersion$State(
  major: number,
  minor: number,
  patch: number,
): SemanticVersion$State {
  return { major, minor, patch };
}

function fromScValueSemanticVersion$State(
  structValue: ScValueStruct,
): SemanticVersion$State {
  return {
    major: structValue.getFieldValue('major')!.asNumber(),
    minor: structValue.getFieldValue('minor')!.asNumber(),
    patch: structValue.getFieldValue('patch')!.asNumber(),
  };
}

export interface SemanticVersion$Rpc {
  major: number;
  minor: number;
  patch: number;
}

export function newSemanticVersion$Rpc(
  major: number,
  minor: number,
  patch: number,
): SemanticVersion$Rpc {
  return { major, minor, patch };
}

function fromScValueSemanticVersion$Rpc(
  structValue: ScValueStruct,
): SemanticVersion$Rpc {
  return {
    major: structValue.getFieldValue('major')!.asNumber(),
    minor: structValue.getFieldValue('minor')!.asNumber(),
    patch: structValue.getFieldValue('patch')!.asNumber(),
  };
}

function buildRpcSemanticVersion$Rpc(
  value: SemanticVersion$Rpc,
  builder: AbstractBuilder,
) {
  const structBuilder = builder.addStruct();
  structBuilder.addI32(value.major);
  structBuilder.addI32(value.minor);
  structBuilder.addI32(value.patch);
}

export function create(
  bindingJar: Buffer,
  preProcess: BlockchainAddress,
  zkNodeRegistry: BlockchainAddress,
  systemUpdateAddress: BlockchainAddress,
  supportedProtocolVersion: SemanticVersion$Rpc,
  supportedBinderVersionMin: SemanticVersion$Rpc,
  supportedBinderVersionMax: SemanticVersion$Rpc,
  supportedZkbcVersionMax: SemanticVersion$Rpc,
): Buffer {
  const fnBuilder = new FnRpcBuilder('create', fileAbi.contract);
  fnBuilder.addVecU8(bindingJar);
  fnBuilder.addAddress(preProcess.asBuffer());
  fnBuilder.addAddress(zkNodeRegistry.asBuffer());
  fnBuilder.addAddress(systemUpdateAddress.asBuffer());
  buildRpcSemanticVersion$Rpc(supportedProtocolVersion, fnBuilder);
  buildRpcSemanticVersion$Rpc(supportedBinderVersionMin, fnBuilder);
  buildRpcSemanticVersion$Rpc(supportedBinderVersionMax, fnBuilder);
  buildRpcSemanticVersion$Rpc(supportedZkbcVersionMax, fnBuilder);
  return fnBuilder.getBytes();
}

export function deployContractV1(
  contractJar: Buffer,
  initialization: Buffer,
  abi: Buffer,
  requiredStakes: BN,
): Buffer {
  const fnBuilder = new FnRpcBuilder('deployContractV1', fileAbi.contract);
  fnBuilder.addVecU8(contractJar);
  fnBuilder.addVecU8(initialization);
  fnBuilder.addVecU8(abi);
  fnBuilder.addI64(requiredStakes);
  return fnBuilder.getBytes();
}

export function deployContractV2(
  contractJar: Buffer,
  initialization: Buffer,
  abi: Buffer,
  requiredStakes: BN,
  allowedJurisdictions: number[][],
): Buffer {
  const fnBuilder = new FnRpcBuilder('deployContractV2', fileAbi.contract);
  fnBuilder.addVecU8(contractJar);
  fnBuilder.addVecU8(initialization);
  fnBuilder.addVecU8(abi);
  fnBuilder.addI64(requiredStakes);
  const vecBuilder15 = fnBuilder.addVec();
  for (const vecEntry16 of allowedJurisdictions) {
    const vecBuilder17 = vecBuilder15.addVec();
    for (const vecEntry18 of vecEntry16) {
      vecBuilder17.addI32(vecEntry18);
    }
  }
  return fnBuilder.getBytes();
}

export function deployContractV3(
  contractJar: Buffer,
  initialization: Buffer,
  abi: Buffer,
  requiredStakes: BN,
  allowedJurisdictions: number[][],
  uniqueId: number,
): Buffer {
  const fnBuilder = new FnRpcBuilder('deployContractV3', fileAbi.contract);
  fnBuilder.addVecU8(contractJar);
  fnBuilder.addVecU8(initialization);
  fnBuilder.addVecU8(abi);
  fnBuilder.addI64(requiredStakes);
  const vecBuilder19 = fnBuilder.addVec();
  for (const vecEntry20 of allowedJurisdictions) {
    const vecBuilder21 = vecBuilder19.addVec();
    for (const vecEntry22 of vecEntry20) {
      vecBuilder21.addI32(vecEntry22);
    }
  }
  fnBuilder.addI32(uniqueId);
  return fnBuilder.getBytes();
}

export function addBinder(
  bindingJar: Buffer,
  supportedBinderVersionMin: SemanticVersion$Rpc,
  supportedBinderVersionMax: SemanticVersion$Rpc,
  usedProtocolVersion: SemanticVersion$Rpc,
  supportedZkbcVersionMax: SemanticVersion$Rpc,
): Buffer {
  const fnBuilder = new FnRpcBuilder('addBinder', fileAbi.contract);
  fnBuilder.addVecU8(bindingJar);
  buildRpcSemanticVersion$Rpc(supportedBinderVersionMin, fnBuilder);
  buildRpcSemanticVersion$Rpc(supportedBinderVersionMax, fnBuilder);
  buildRpcSemanticVersion$Rpc(usedProtocolVersion, fnBuilder);
  buildRpcSemanticVersion$Rpc(supportedZkbcVersionMax, fnBuilder);
  return fnBuilder.getBytes();
}

export function removeBinder(binderId: number): Buffer {
  const fnBuilder = new FnRpcBuilder('removeBinder', fileAbi.contract);
  fnBuilder.addI32(binderId);
  return fnBuilder.getBytes();
}

export function deployContractV4(
  contractJar: Buffer,
  initialization: Buffer,
  abi: Buffer,
  requiredStakes: BN,
  allowedJurisdictions: number[][],
  uniqueId: number,
  requiredEvmChainSupport: string[],
): Buffer {
  const fnBuilder = new FnRpcBuilder('deployContractV4', fileAbi.contract);
  fnBuilder.addVecU8(contractJar);
  fnBuilder.addVecU8(initialization);
  fnBuilder.addVecU8(abi);
  fnBuilder.addI64(requiredStakes);
  const vecBuilder23 = fnBuilder.addVec();
  for (const vecEntry24 of allowedJurisdictions) {
    const vecBuilder25 = vecBuilder23.addVec();
    for (const vecEntry26 of vecEntry24) {
      vecBuilder25.addI32(vecEntry26);
    }
  }
  fnBuilder.addI32(uniqueId);
  const vecBuilder27 = fnBuilder.addVec();
  for (const vecEntry28 of requiredEvmChainSupport) {
    vecBuilder27.addString(vecEntry28);
  }
  return fnBuilder.getBytes();
}
