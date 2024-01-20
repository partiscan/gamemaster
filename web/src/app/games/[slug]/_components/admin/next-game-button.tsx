import { useGameState } from "@/components/context/game-state.context";
import { useGamemasterAbi } from "@/components/context/gamemaster.context";
import { useIdentity } from "@/components/context/identity/identity.context";
import { FC } from "react";
import { GuessTheNumberAdmin } from "./guess-the-number-admin";

type Props = {};

export const NextGameButton: FC<Props> = ({}) => {
  const {
    gameState: { games, currentGame },
    isAdmin,
    engineKeys,
  } = useGameState();
  const abi = useGamemasterAbi();
  const identity = useIdentity();

  if (!identity || !isAdmin || currentGame.status !== "not-started")
    return null;

  const game = games[currentGame.index];

  // For this game, it will start when we input a secret number
  if (game.kind === "guess-the-number") {
    return <GuessTheNumberAdmin />;
  }

  return null; // todo: normal start action
};
