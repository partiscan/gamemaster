import { ChainActionButton } from "@/components/chain-action-button";
import { useGameState } from "@/components/context/game-state.context";
import { NextGameButton } from "../admin/next-game-button";
import { GameHeadline } from "../typography/game-headline";
import { GameSubheader } from "../typography/game-subheader";

export const PreGameScreen = () => {
  const { isAdmin, isInGame } = useGameState();

  if (isAdmin) {
    return (
      <div className="text-center">
        <GameHeadline>You are the administrator!</GameHeadline>
        <GameSubheader>Start the game when you are ready.</GameSubheader>

        <NextGameButton />
      </div>
    );
  }

  if (!isInGame) {
    return (
      <div className="text-center">
        <GameHeadline>Sign up!</GameHeadline>
        <GameSubheader>Sign up! Game will start soon</GameSubheader>

        <ChainActionButton
          action={{
            contract: "",
            payload: "",
            payloadType: "hex",
          }}
          className="mt-4"
        >
          Sign up
        </ChainActionButton>
      </div>
    );
  }

  return (
    <div className="text-center">
      <GameHeadline>You are signed up!</GameHeadline>
      <GameSubheader>Game might start soon</GameSubheader>
    </div>
  );
};
