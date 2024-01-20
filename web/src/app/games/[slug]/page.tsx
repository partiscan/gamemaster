import { GameStateProvider } from "@/components/context/game-state.context";
import { GamemasterServerProvider } from "@/components/context/gamemaster-server-provider";
import { ServerIdentityProvider } from "@/components/context/identity/server-identity-provider";
import { getGameState } from "@/server/game/get-game-state";
import { GamesOverview } from "./_components/games-overview";
import { MainGameScreen } from "./_components/main-game-screen";
import { GameRules } from "./_components/game-rules";

const GamePage = async () => {
  const id = "test"; // TODO: get from router
  const state = getGameState(id);

  if (!state) return null;

  return (
    <GamemasterServerProvider>
      <ServerIdentityProvider>
        <GameStateProvider id="test" defaultGameState={state}>
          <div className="text-center p-4">
            <h2 className="text-lg font-semibold">Games</h2>
            <GamesOverview />
            <GameRules />
          </div>

          <div className="flex flex-col gap-2">
            <MainGameScreen />
          </div>
        </GameStateProvider>
      </ServerIdentityProvider>
    </GamemasterServerProvider>
  );
};

export default GamePage;
