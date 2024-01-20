"use client";

import { useGameState } from "@/components/context/game-state.context";
import { GAMES } from "@/config";
import Image from "next/image";
import { GameHeadline } from "./typography/game-headline";
import { GameSubheader } from "./typography/game-subheader";

export const GameRules = () => {
  const {
    gameState: { currentGame, games },
  } = useGameState();
  const game = games[currentGame.index];

  const gameDetails = GAMES.find((g) => g.id === game.kind);
  if (!gameDetails) return null;

  return (
    <div className="bg-slate-200 w-full max-w-2xl mx-auto flex flex-col items-center md:items-start text-center md:flex-row mt-2 md:text-left gap-0 md:gap-2">
      <Image
        className="rounded"
        src={`/assets/games/${game.kind}.webp`}
        alt={""}
        width={128}
        height={128}
      />
      <div className="p-2">
        <GameHeadline>{gameDetails.title}</GameHeadline>
        <GameSubheader>{gameDetails.description}</GameSubheader>
      </div>
    </div>
  );
};
