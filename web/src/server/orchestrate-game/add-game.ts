"use server";

import { Game } from "@/config";
import { nanoid } from "nanoid";
import { getStorage, setStorage } from "./storage";
import { GameSetting } from "./types";

const DEFAULTS = {
  GUESS_THE_NUMBER: {
    WIN_POINTS: 100,
  },
  SABOTAGE: {
    SABOTAGE_POINTS: 50,
    PROTECTED_COST_POINTS: 10,
  },
};

const makeSetting = (game: Game): GameSetting => {
  const settingId = nanoid();

  if (game.id === "guess-the-number") {
    return {
      settingId,
      gameType: game.id,
      winPoints: DEFAULTS.GUESS_THE_NUMBER.WIN_POINTS,
    };
  }

  if (game.id === "sabotage") {
    return {
      settingId,
      gameType: game.id,
      sabotagePoints: DEFAULTS.SABOTAGE.SABOTAGE_POINTS,
      protectCostPoints: DEFAULTS.SABOTAGE.PROTECTED_COST_POINTS,
    };
  }

  throw new Error("Invalid game type");
};

export const addGame = (game: Game) => {
  const settings = getStorage();

  const newSettings = [...settings, makeSetting(game)];

  setStorage(newSettings);
};
