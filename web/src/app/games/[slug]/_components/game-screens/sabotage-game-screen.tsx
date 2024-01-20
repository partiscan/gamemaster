"use client";

import { useGameState } from "@/components/context/game-state.context";
import { Button } from "@/components/ui/button";
import { SabotageGame } from "@/server/game/get-game-state";
import { FC } from "react";
import { EndGameButton } from "../admin/end-game-button";
import { Player } from "../players/player";
import { GameHeadline } from "../typography/game-headline";
import { GameSubheader } from "../typography/game-subheader";

type Props = {
  game: SabotageGame;
};

export const SabotageGameScreen: FC<Props> = ({ game }) => {
  const { gameState, isInGame, isAdmin } = useGameState();
  const calculating =
    gameState.currentGame.status === "finished" && !game.result;

  return (
    <div className="text-center p-4">
      <div className="mt-2">
        <EndGameButton />
      </div>
      <div className="grid grid-cols-2  sm:grid-cols-4 xl:grid-cols-6 gap-2 mt-2">
        {gameState.players.map((player, i) => (
          <Button key={player} variant="ghost" className="h-fit relative">
            <Player address={player} points={0} />
            <div className="absolute bottom-1/2 left-1/2">
              {game.result?.[i]?.sabotage === true && (
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              )}

              {game.result?.[i]?.protect === true && (
                <div className="w-4 h-4 bg-green-700 rounded-full"></div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
