"use server";

import { Game } from "@/config";
import { nanoid } from "nanoid";
import { getStorage, setStorage } from "./storage";
import { GameSetting } from "./types";

const makeSetting = (game: Game): GameSetting => {
  const settingId = nanoid();

  if (game.id === "guess-the-number") {
    return {
      settingId,
      gameType: game.id,
      winPoints: 0,
    };
  }

  if (game.id === "sabotage") {
    return {
      settingId,
      gameType: game.id,
      sabotagePoints: 0,
      protectCostPoints: 0,
    };
  }

  throw new Error("Invalid game type");
};

export const addGame = (game: Game) => {
  const settings = getStorage();

  const newSettings = [...settings, makeSetting(game)];

  setStorage(newSettings);
};
