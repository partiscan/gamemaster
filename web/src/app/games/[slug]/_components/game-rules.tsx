"use client";

import { useGameState } from "@/components/context/game-state.context";
import { GAMES } from "@/config";
import Image from "next/image";
import { GamePoints } from "./game-points";
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
    <div className="bg-slate-200 w-full  max-w-2xl mx-auto flex flex-col items-center md:items-start text-center md:flex-row md:text-left gap-0 md:gap-2">
      <Image
        className="rounded shrink grow-0"
        src={`/assets/games/${game.kind}.webp`}
        alt={""}
        width={128}
        height={128}
      />
      <div className="p-2 grow">
        <GameHeadline>{gameDetails.title}</GameHeadline>
        <GameSubheader>{gameDetails.description}</GameSubheader>
      </div>
      <div className="p-2 shrink-0">
        <GameHeadline>Points</GameHeadline>
        <GameSubheader>
          <GamePoints game={game} />
        </GameSubheader>
      </div>
    </div>
  );
};
