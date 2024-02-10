'use server';

import { deployContractV3 } from '@/contracts_gen/clients/zk';
import {
  initialize,
  GameSettings as ContractGameSettings,
  GameSettingsD,
} from '@/contracts_gen/clients/gamemaster';
import { BN } from '@secata-public/bitmanipulation-ts';
import fs from 'fs';
import { getPendingGameSettings } from './get-pending-game-settings';

const gamemasterContract = fs.readFileSync(
  process.cwd() + '/src/contracts_gen/gamemaster/gamemaster.zkwa',
);

const gamemasterAbi = fs.readFileSync(
  process.cwd() + '/src/contracts_gen/gamemaster/gamemaster.abi',
);

const GAS_DECIMALS = 4;
const GAS_DECIMALS_MULTIPLIER = 10 ** GAS_DECIMALS;

export const deployGame = async (): Promise<string> => {
  const gameMasterInit = getGameMasterInit();
  const binderId = 5;

  const deployment = deployContractV3(
    gamemasterContract,
    gameMasterInit,
    gamemasterAbi,
    new BN(2000 * GAS_DECIMALS_MULTIPLIER),
    [],
    binderId,
  );

  return deployment.toString('hex');
};

const getGameMasterInit = (): Buffer => {
  const settings = getPendingGameSettings();

  const contractSettings = settings.map<ContractGameSettings>((setting) => {
    if (setting.gameType === 'guess-the-number') {
      return {
        discriminant: GameSettingsD.GuessTheNumberGame,
        winnerPoint: setting.winPoints,
      };
    }

    if (setting.gameType === 'sabotage') {
      return {
        discriminant: GameSettingsD.Sabotage,
        protectPointCost: setting.protectCostPoints,
        sabotagePoint: setting.sabotagePoints,
      };
    }

    if (setting.gameType === "split-or-conquer") {
      return {
        discriminant: GameSettingsD.SplitOrConquer,
        splitPoints: setting.splitPoints,
      }
    }

    throw new Error('Unknown game type');
  });

  return initialize(contractSettings);
};
