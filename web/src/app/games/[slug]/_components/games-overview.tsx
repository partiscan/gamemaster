"use client";

import { useGameState } from "@/components/context/game-state.context";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const GamesOverview = () => {
  const {
    gameState: { games, currentGame },
  } = useGameState();

  return (
    <div className="text-gray-500 text-sm flex justify-center">
      {games.map((game, i) => (
        <div
          key={game.kind}
          className={cn("p-2 transition-all bg-white rounded-lg", {
            ["bg-slate-300"]: currentGame.index === i,
            ["opacity-50"]: currentGame.index !== i,
          })}
        >
          <Image
            className="rounded"
            src={`/assets/games/${game.kind}.webp`}
            alt={""}
            width={64}
            height={64}
          />
        </div>
      ))}
    </div>
  );
};
