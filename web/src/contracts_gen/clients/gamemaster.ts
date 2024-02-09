/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BN from "bn.js";
import {
  AbiParser,
  AbstractBuilder, BigEndianReader,
  FileAbi, FnKinds, FnRpcBuilder, RpcReader,
  ScValue,
  ScValueEnum, ScValueOption,
  ScValueStruct,
  StateReader, TypeIndex,
  StateBytes,
  BlockchainAddress
} from "@partisiablockchain/abi-client";
import {BigEndianByteOutput} from "@secata-public/bitmanipulation-ts";

const fileAbi: FileAbi = new AbiParser(Buffer.from(
  "5042434142490b000005040000000018020000000c47616d6553657474696e677300000003000001010002020003010000001247756573735468654e756d62657247616d65000000010000000c77696e6e65725f706f696e740301000000085361626f74616765000000020000000e7361626f746167655f706f696e74030000001270726f746563745f706f696e745f636f737403010000000e53706c69744f72436f6e71756572000000010000000c73706c69745f706f696e747302010000000d506c617965724f7574636f6d6500000002000000087361626f746167650c0000000770726f746563740c020000000d53706c69744465636973696f6e0000000300000601000702000801000000084e6f416374696f6e00000000010000000553706c6974000000000100000007436f6e7175657200000000010000001c53706c69744f72436f6e71756572506c617965724465636973696f6e000000020000000c706c617965725f696e646578030000000573706c69740005010000001553706c69744f72436f6e717565724f7574636f6d650000000200000008706c617965725f61000900000008706c617965725f620009020000000447616d650000000300000c01000d02000e010000000e47756573735468654e756d626572000000040000000c77696e6e65725f706f696e74030000000d77726f6e675f677565737365730e010000000677696e6e657212030000000e72656164795f746f5f73746172740c01000000085361626f74616765000000030000000e7361626f746167655f706f696e74030000001270726f746563745f706f696e745f636f73740300000006726573756c74120e0004010000000e53706c69744f72436f6e71756572000000020000000c73706c69745f706f696e74730200000006726573756c74120e000a020000000a47616d6553746174757300000003000010010011020012010000000a4e6f745374617274656400000000010000000a496e50726f677265737300000000010000000846696e697368656400000000010000000b43757272656e7447616d650000000200000005696e6465780300000006737461747573000f010000000d436f6e74726163745374617465000000050000000d61646d696e6973747261746f720d00000007706c61796572730e0d0000000c63757272656e745f67616d6500130000000567616d65730e000b00000006706f696e74730e0e08010000000b536563726574566172496400000001000000067261775f69640301000000134576656e74537562736372697074696f6e496400000001000000067261775f696408010000000f45787465726e616c4576656e74496400000001000000067261775f69640800000008010000000a696e697469616c697a65ffffffff0f000000010000000567616d65730e000002000000077369676e5f7570000000000002000000096e6578745f67616d6501000000000200000008656e645f67616d6502000000000200000005677565737310000000010000000567756573730113000000136f6e5f636f6d707574655f636f6d706c657465a8dadeeb0a00000000170000000f6f6e5f7365637265745f696e70757440000000000000000c7365637265745f696e7075740614000000136f6e5f7661726961626c65735f6f70656e65649fc99a8f04000000000014",
  "hex"
)).parseAbi();

type Option<K> = K | undefined;

export type GameSettings = 
  | GameSettingsGuessTheNumberGame
  | GameSettingsSabotage
  | GameSettingsSplitOrConquer;

export enum GameSettingsD {
  GuessTheNumberGame = 0,
  Sabotage = 1,
  SplitOrConquer = 2
}

function buildRpcGameSettings(val: GameSettings, builder: AbstractBuilder) {
  if (val.discriminant === GameSettingsD.GuessTheNumberGame) {
    buildRpcGameSettingsGuessTheNumberGame(val, builder);
  }
  if (val.discriminant === GameSettingsD.Sabotage) {
    buildRpcGameSettingsSabotage(val, builder);
  }
  if (val.discriminant === GameSettingsD.SplitOrConquer) {
    buildRpcGameSettingsSplitOrConquer(val, builder);
  }
}

function fromScValueGameSettings(enumValue: ScValueEnum): GameSettings {
  const item = enumValue.item;
  if (item.name === "GuessTheNumberGame") {
    return fromScValueGameSettingsGuessTheNumberGame(item);
  }
  if (item.name === "Sabotage") {
    return fromScValueGameSettingsSabotage(item);
  }
  if (item.name === "SplitOrConquer") {
    return fromScValueGameSettingsSplitOrConquer(item);
  }
  throw Error("Should not happen");
}

export interface GameSettingsGuessTheNumberGame {
  discriminant: GameSettingsD.GuessTheNumberGame;
  winnerPoint: number;
}

export function newGameSettingsGuessTheNumberGame(winnerPoint: number): GameSettingsGuessTheNumberGame {
  return {discriminant: 0, winnerPoint, };
}

function buildRpcGameSettingsGuessTheNumberGame(value: GameSettingsGuessTheNumberGame, builder: AbstractBuilder) {
  const enumVariantBuilder = builder.addEnumVariant(GameSettingsD.GuessTheNumberGame);
  enumVariantBuilder.addU32(value.winnerPoint);
}

function fromScValueGameSettingsGuessTheNumberGame(structValue: ScValueStruct): GameSettingsGuessTheNumberGame {
  return {
    discriminant: GameSettingsD.GuessTheNumberGame,
    winnerPoint: structValue.getFieldValue("winner_point")!.asNumber(),
  };
}

export interface GameSettingsSabotage {
  discriminant: GameSettingsD.Sabotage;
  sabotagePoint: number;
  protectPointCost: number;
}

export function newGameSettingsSabotage(sabotagePoint: number, protectPointCost: number): GameSettingsSabotage {
  return {discriminant: 1, sabotagePoint, protectPointCost, };
}

function buildRpcGameSettingsSabotage(value: GameSettingsSabotage, builder: AbstractBuilder) {
  const enumVariantBuilder = builder.addEnumVariant(GameSettingsD.Sabotage);
  enumVariantBuilder.addU32(value.sabotagePoint);
  enumVariantBuilder.addU32(value.protectPointCost);
}

function fromScValueGameSettingsSabotage(structValue: ScValueStruct): GameSettingsSabotage {
  return {
    discriminant: GameSettingsD.Sabotage,
    sabotagePoint: structValue.getFieldValue("sabotage_point")!.asNumber(),
    protectPointCost: structValue.getFieldValue("protect_point_cost")!.asNumber(),
  };
}

export interface GameSettingsSplitOrConquer {
  discriminant: GameSettingsD.SplitOrConquer;
  splitPoints: number;
}

export function newGameSettingsSplitOrConquer(splitPoints: number): GameSettingsSplitOrConquer {
  return {discriminant: 2, splitPoints, };
}

function buildRpcGameSettingsSplitOrConquer(value: GameSettingsSplitOrConquer, builder: AbstractBuilder) {
  const enumVariantBuilder = builder.addEnumVariant(GameSettingsD.SplitOrConquer);
  enumVariantBuilder.addU16(value.splitPoints);
}

function fromScValueGameSettingsSplitOrConquer(structValue: ScValueStruct): GameSettingsSplitOrConquer {
  return {
    discriminant: GameSettingsD.SplitOrConquer,
    splitPoints: structValue.getFieldValue("split_points")!.asNumber(),
  };
}

export interface PlayerOutcome {
  sabotage: boolean;
  protect: boolean;
}

export function newPlayerOutcome(sabotage: boolean, protect: boolean): PlayerOutcome {
  return {sabotage, protect};
}

function fromScValuePlayerOutcome(structValue: ScValueStruct): PlayerOutcome {
  return {
    sabotage: structValue.getFieldValue("sabotage")!.boolValue(),
    protect: structValue.getFieldValue("protect")!.boolValue(),
  };
}

export type SplitDecision = 
  | SplitDecisionNoAction
  | SplitDecisionSplit
  | SplitDecisionConquer;

export enum SplitDecisionD {
  NoAction = 0,
  Split = 1,
  Conquer = 2
}

function fromScValueSplitDecision(enumValue: ScValueEnum): SplitDecision {
  const item = enumValue.item;
  if (item.name === "NoAction") {
    return fromScValueSplitDecisionNoAction(item);
  }
  if (item.name === "Split") {
    return fromScValueSplitDecisionSplit(item);
  }
  if (item.name === "Conquer") {
    return fromScValueSplitDecisionConquer(item);
  }
  throw Error("Should not happen");
}

export interface SplitDecisionNoAction {
  discriminant: SplitDecisionD.NoAction;
}

export function newSplitDecisionNoAction(): SplitDecisionNoAction {
  return {discriminant: 0, };
}

function fromScValueSplitDecisionNoAction(structValue: ScValueStruct): SplitDecisionNoAction {
  return {
    discriminant: SplitDecisionD.NoAction,
  };
}

export interface SplitDecisionSplit {
  discriminant: SplitDecisionD.Split;
}

export function newSplitDecisionSplit(): SplitDecisionSplit {
  return {discriminant: 1, };
}

function fromScValueSplitDecisionSplit(structValue: ScValueStruct): SplitDecisionSplit {
  return {
    discriminant: SplitDecisionD.Split,
  };
}

export interface SplitDecisionConquer {
  discriminant: SplitDecisionD.Conquer;
}

export function newSplitDecisionConquer(): SplitDecisionConquer {
  return {discriminant: 2, };
}

function fromScValueSplitDecisionConquer(structValue: ScValueStruct): SplitDecisionConquer {
  return {
    discriminant: SplitDecisionD.Conquer,
  };
}

export interface SplitOrConquerPlayerDecision {
  playerIndex: number;
  split: SplitDecision;
}

export function newSplitOrConquerPlayerDecision(playerIndex: number, split: SplitDecision): SplitOrConquerPlayerDecision {
  return {playerIndex, split};
}

function fromScValueSplitOrConquerPlayerDecision(structValue: ScValueStruct): SplitOrConquerPlayerDecision {
  return {
    playerIndex: structValue.getFieldValue("player_index")!.asNumber(),
    split: fromScValueSplitDecision(structValue.getFieldValue("split")!.enumValue()),
  };
}

export interface SplitOrConquerOutcome {
  playerA: SplitOrConquerPlayerDecision;
  playerB: SplitOrConquerPlayerDecision;
}

export function newSplitOrConquerOutcome(playerA: SplitOrConquerPlayerDecision, playerB: SplitOrConquerPlayerDecision): SplitOrConquerOutcome {
  return {playerA, playerB};
}

function fromScValueSplitOrConquerOutcome(structValue: ScValueStruct): SplitOrConquerOutcome {
  return {
    playerA: fromScValueSplitOrConquerPlayerDecision(structValue.getFieldValue("player_a")!.structValue()),
    playerB: fromScValueSplitOrConquerPlayerDecision(structValue.getFieldValue("player_b")!.structValue()),
  };
}

export type Game = 
  | GameGuessTheNumber
  | GameSabotage
  | GameSplitOrConquer;

export enum GameD {
  GuessTheNumber = 0,
  Sabotage = 1,
  SplitOrConquer = 2
}

function fromScValueGame(enumValue: ScValueEnum): Game {
  const item = enumValue.item;
  if (item.name === "GuessTheNumber") {
    return fromScValueGameGuessTheNumber(item);
  }
  if (item.name === "Sabotage") {
    return fromScValueGameSabotage(item);
  }
  if (item.name === "SplitOrConquer") {
    return fromScValueGameSplitOrConquer(item);
  }
  throw Error("Should not happen");
}

export interface GameGuessTheNumber {
  discriminant: GameD.GuessTheNumber;
  winnerPoint: number;
  wrongGuesses: Buffer;
  winner: Option<number>;
  readyToStart: boolean;
}

export function newGameGuessTheNumber(winnerPoint: number, wrongGuesses: Buffer, winner: Option<number>, readyToStart: boolean): GameGuessTheNumber {
  return {discriminant: 0, winnerPoint, wrongGuesses, winner, readyToStart, };
}

function fromScValueGameGuessTheNumber(structValue: ScValueStruct): GameGuessTheNumber {
  return {
    discriminant: GameD.GuessTheNumber,
    winnerPoint: structValue.getFieldValue("winner_point")!.asNumber(),
    wrongGuesses: structValue.getFieldValue("wrong_guesses")!.vecU8Value(),
    winner: structValue.getFieldValue("winner")!.optionValue().valueOrUndefined((sc1) => sc1.asNumber()),
    readyToStart: structValue.getFieldValue("ready_to_start")!.boolValue(),
  };
}

export interface GameSabotage {
  discriminant: GameD.Sabotage;
  sabotagePoint: number;
  protectPointCost: number;
  result: Option<PlayerOutcome[]>;
}

export function newGameSabotage(sabotagePoint: number, protectPointCost: number, result: Option<PlayerOutcome[]>): GameSabotage {
  return {discriminant: 1, sabotagePoint, protectPointCost, result, };
}

function fromScValueGameSabotage(structValue: ScValueStruct): GameSabotage {
  return {
    discriminant: GameD.Sabotage,
    sabotagePoint: structValue.getFieldValue("sabotage_point")!.asNumber(),
    protectPointCost: structValue.getFieldValue("protect_point_cost")!.asNumber(),
    result: structValue.getFieldValue("result")!.optionValue().valueOrUndefined((sc2) => sc2.vecValue().values().map((sc3) => fromScValuePlayerOutcome(sc3.structValue()))),
  };
}

export interface GameSplitOrConquer {
  discriminant: GameD.SplitOrConquer;
  splitPoints: number;
  result: Option<SplitOrConquerOutcome[]>;
}

export function newGameSplitOrConquer(splitPoints: number, result: Option<SplitOrConquerOutcome[]>): GameSplitOrConquer {
  return {discriminant: 2, splitPoints, result, };
}

function fromScValueGameSplitOrConquer(structValue: ScValueStruct): GameSplitOrConquer {
  return {
    discriminant: GameD.SplitOrConquer,
    splitPoints: structValue.getFieldValue("split_points")!.asNumber(),
    result: structValue.getFieldValue("result")!.optionValue().valueOrUndefined((sc4) => sc4.vecValue().values().map((sc5) => fromScValueSplitOrConquerOutcome(sc5.structValue()))),
  };
}

export type GameStatus = 
  | GameStatusNotStarted
  | GameStatusInProgress
  | GameStatusFinished;

export enum GameStatusD {
  NotStarted = 0,
  InProgress = 1,
  Finished = 2
}

function fromScValueGameStatus(enumValue: ScValueEnum): GameStatus {
  const item = enumValue.item;
  if (item.name === "NotStarted") {
    return fromScValueGameStatusNotStarted(item);
  }
  if (item.name === "InProgress") {
    return fromScValueGameStatusInProgress(item);
  }
  if (item.name === "Finished") {
    return fromScValueGameStatusFinished(item);
  }
  throw Error("Should not happen");
}

export interface GameStatusNotStarted {
  discriminant: GameStatusD.NotStarted;
}

export function newGameStatusNotStarted(): GameStatusNotStarted {
  return {discriminant: 0, };
}

function fromScValueGameStatusNotStarted(structValue: ScValueStruct): GameStatusNotStarted {
  return {
    discriminant: GameStatusD.NotStarted,
  };
}

export interface GameStatusInProgress {
  discriminant: GameStatusD.InProgress;
}

export function newGameStatusInProgress(): GameStatusInProgress {
  return {discriminant: 1, };
}

function fromScValueGameStatusInProgress(structValue: ScValueStruct): GameStatusInProgress {
  return {
    discriminant: GameStatusD.InProgress,
  };
}

export interface GameStatusFinished {
  discriminant: GameStatusD.Finished;
}

export function newGameStatusFinished(): GameStatusFinished {
  return {discriminant: 2, };
}

function fromScValueGameStatusFinished(structValue: ScValueStruct): GameStatusFinished {
  return {
    discriminant: GameStatusD.Finished,
  };
}

export interface CurrentGame {
  index: number;
  status: GameStatus;
}

export function newCurrentGame(index: number, status: GameStatus): CurrentGame {
  return {index, status};
}

function fromScValueCurrentGame(structValue: ScValueStruct): CurrentGame {
  return {
    index: structValue.getFieldValue("index")!.asNumber(),
    status: fromScValueGameStatus(structValue.getFieldValue("status")!.enumValue()),
  };
}

export interface ContractState {
  administrator: BlockchainAddress;
  players: BlockchainAddress[];
  currentGame: CurrentGame;
  games: Game[];
  points: number[][];
}

export function newContractState(administrator: BlockchainAddress, players: BlockchainAddress[], currentGame: CurrentGame, games: Game[], points: number[][]): ContractState {
  return {administrator, players, currentGame, games, points};
}

function fromScValueContractState(structValue: ScValueStruct): ContractState {
  return {
    administrator: BlockchainAddress.fromBuffer(structValue.getFieldValue("administrator")!.addressValue().value),
    players: structValue.getFieldValue("players")!.vecValue().values().map((sc6) => BlockchainAddress.fromBuffer(sc6.addressValue().value)),
    currentGame: fromScValueCurrentGame(structValue.getFieldValue("current_game")!.structValue()),
    games: structValue.getFieldValue("games")!.vecValue().values().map((sc7) => fromScValueGame(sc7.enumValue())),
    points: structValue.getFieldValue("points")!.vecValue().values().map((sc8) => sc8.vecValue().values().map((sc9) => sc9.asNumber())),
  };
}

export function deserializeContractState(state: StateBytes): ContractState {
  const scValue = new StateReader(state.state, fileAbi.contract, state.avlTrees).readState();
  return fromScValueContractState(scValue);
}

export interface SecretVarId {
  rawId: number;
}

export function newSecretVarId(rawId: number): SecretVarId {
  return {rawId};
}

function fromScValueSecretVarId(structValue: ScValueStruct): SecretVarId {
  return {
    rawId: structValue.getFieldValue("raw_id")!.asNumber(),
  };
}

export interface EventSubscriptionId {
  rawId: number;
}

export function newEventSubscriptionId(rawId: number): EventSubscriptionId {
  return {rawId};
}

function fromScValueEventSubscriptionId(structValue: ScValueStruct): EventSubscriptionId {
  return {
    rawId: structValue.getFieldValue("raw_id")!.asNumber(),
  };
}

export interface ExternalEventId {
  rawId: number;
}

export function newExternalEventId(rawId: number): ExternalEventId {
  return {rawId};
}

function fromScValueExternalEventId(structValue: ScValueStruct): ExternalEventId {
  return {
    rawId: structValue.getFieldValue("raw_id")!.asNumber(),
  };
}

export function initialize(games: GameSettings[]): Buffer {
  const fnBuilder = new FnRpcBuilder("initialize", fileAbi.contract);
  const vecBuilder10 = fnBuilder.addVec();
  for (const vecEntry11 of games) {
    buildRpcGameSettings(vecEntry11, vecBuilder10);
  }
  return fnBuilder.getBytes();
}

export function signUp(): Buffer {
  const fnBuilder = new FnRpcBuilder("sign_up", fileAbi.contract);
  return fnBuilder.getBytes();
}

export function nextGame(): Buffer {
  const fnBuilder = new FnRpcBuilder("next_game", fileAbi.contract);
  return fnBuilder.getBytes();
}

export function endGame(): Buffer {
  const fnBuilder = new FnRpcBuilder("end_game", fileAbi.contract);
  return fnBuilder.getBytes();
}

export function guess(guess: number): Buffer {
  const fnBuilder = new FnRpcBuilder("guess", fileAbi.contract);
  fnBuilder.addU8(guess);
  return fnBuilder.getBytes();
}

