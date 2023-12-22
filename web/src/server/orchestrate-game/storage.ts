import { GAMES } from "@/config";
import { cookies } from "next/headers";
import { GameSetting } from "./types";

const COOKIE_NAME = "pending-game-setting";

export const setStorage = (settings: GameSetting[]) => {
  cookies().set(COOKIE_NAME, JSON.stringify(settings));
};

export const getStorage = (): GameSetting[] => {
  const storage = cookies();
  const currentGame = storage.get(COOKIE_NAME)?.value;
  if (!currentGame) return [];

  const parsed = JSON.parse(currentGame) as GameSetting[] | string;
  if (!Array.isArray(parsed)) return [];

  return parsed.filter((setting) =>
    GAMES.some((game) => game.id === setting.gameType)
  );
};
