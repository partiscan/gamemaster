"use client";

import { useGameState } from "@/components/context/game-state.context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GuessTheNumberGame } from "@/server/game/get-game-state";
import { FC, useState } from "react";
import { EndGameButton } from "../admin/end-game-button";

type Props = {
  game: GuessTheNumberGame;
};

export const GuessTheNumberGameScreen: FC<Props> = ({ game }) => {
  const [guess, setGuess] = useState(0);

  const { gameState, isInGame} = useGameState();

  const gameIsFinished = gameState.currentGame.status === "finished";

  return (
    <div className="text-center p-4">
      {isInGame && gameState.currentGame.status === "in-progress" && (
        <div className="mx-auto w-full max-w-sm items-center text-sm font-semibold my-5 space-y-5">
          <Label htmlFor="guess-number">Guess: {guess}</Label>
          <Slider
            id="guess-number"
            value={[guess]}
            onValueChange={(value) => setGuess(value[0])}
            min={0}
            max={255}
          />
          <Button>Guess!</Button>
        </div>
      )}
      {gameIsFinished && (
        <div>
          <div>Winner: {game.winner}</div>
        </div>
      )}
    </div>
  );
};
