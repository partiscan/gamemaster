import { GameState } from "@/server/game/get-game-state";
import { FC } from "react";

type Props = {
  game: GameState["games"][number];
};

export const GamePoints: FC<Props> = ({ game }) => {
  if (game.kind === "guess-the-number") {
    return <>Winner gets {game.winnerPoint} points</>;
  }

  if (game.kind === "sabotage") {
    return (
      <>
        <div>Protection costs {game.protectPointCost} points</div>
        <div>Sabotage takes {game.sabotagePoint} points</div>
      </>
    );
  }

  return null;
};
