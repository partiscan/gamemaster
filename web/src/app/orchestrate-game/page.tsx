import { getPendingGameSettings } from "@/server/orchestrate-game/get-pending-game-settings";
import { AddGameModal } from "./_components/add-game-modal";
import { GameSetting } from "./_components/game-setting/game-setting";
import { StartGameButton } from "./_components/start-game-button";

export default async function OrchestrateGame() {
  const settings = getPendingGameSettings();

  return (
    <>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl mb-6">Orchestrate your games</h1>
        {settings.length > 0 && <StartGameButton />}
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {settings.map((setting) => (
          <GameSetting key={setting.settingId} setting={setting} />
        ))}
        <AddGameModal />
      </div>
    </>
  );
}
