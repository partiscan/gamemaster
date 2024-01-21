"use client";

import { useGameState } from "@/components/context/game-state.context";
import { Button } from "@/components/ui/button";
import { SabotageGame } from "@/server/game/get-game-state";
import { ShieldHalf, SwordIcon } from "lucide-react";
import { FC } from "react";
import { Player } from "../players/player";

type Props = {
  game: SabotageGame;
};

export const SabotageGameScreen: FC<Props> = ({ game }) => {
  const { gameState } = useGameState();
  const calculating =
    gameState.currentGame.status === "finished" && !game.result;

  return (
    <div className="max-w-screen-xl w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2">
        {gameState.players.map((player, i) => (
          <Button key={player} variant="ghost" className="h-fit relative">
            <Player address={player} points={0}>
              <div className="absolute top-0 -right-7">
                {game.result?.[i]?.sabotage === true && (
                  <SwordIcon className="w-6 h-6 text-red-800 fill-red-400" />
                )}

                {game.result?.[i]?.protect === true && (
                  <ShieldHalf className="w-6 h-6 text-green-800 fill-green-600" />
                )}
              </div>
            </Player>
          </Button>
        ))}
      </div>
    </div>
  );
};
