import { GameStateProvider } from "@/components/context/game-state.context";
import { GamemasterServerProvider } from "@/components/context/gamemaster-server-provider";
import { ServerIdentityProvider } from "@/components/context/identity/server-identity-provider";
import { getGameState } from "@/server/game/get-game-state";
import { NextGameButton } from "./_components/admin/next-game-button";
import { GameRules } from "./_components/game-rules";
import { GameStatus } from "./_components/game-status";
import { GamesOverview } from "./_components/games-overview";
import { MainGameScreen } from "./_components/main-game-screen";

const GamePage = async () => {
  const id = "test"; // TODO: get from router
  const state = getGameState(id);

  if (!state) return null;

  return (
    <GamemasterServerProvider>
      <ServerIdentityProvider>
        <GameStateProvider
          id="000000000000000000000000000000000000000000"
          defaultGameState={state}
        >
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-lg font-semibold">Games</h2>
            <GamesOverview />
            <GameRules />
            <GameStatus />
            <NextGameButton />
            <MainGameScreen />
          </div>
        </GameStateProvider>
      </ServerIdentityProvider>
    </GamemasterServerProvider>
  );
};

export default GamePage;
