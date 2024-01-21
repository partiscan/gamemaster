import { ChainActionButton } from "@/components/chain-action-button";
import { useGameState } from "@/components/context/game-state.context";
import { signUp } from "@/contracts_gen/clients/gamemaster";
import { GameHeadline } from "../typography/game-headline";
import { GameSubheader } from "../typography/game-subheader";

export const PreGameScreen = () => {
  const { isAdmin, isInGame, contractId} = useGameState();

  if (isAdmin) {
    return (
      <div className="text-center">
        <GameHeadline>You are the administrator!</GameHeadline>
        <GameSubheader>Start the game when you are ready.</GameSubheader>
      </div>
    );
  }

  if (!isInGame) {
    return (
      <div className="text-center">
        <ChainActionButton
          action={{
            contract: contractId,
            payload: signUp().toString("hex"),
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
    </div>
  );
};
