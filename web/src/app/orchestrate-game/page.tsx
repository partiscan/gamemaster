import { getPendingGameSettings } from "@/server/orchestrate-game/get-pending-game-settings";
import { AddGameModal } from "./_components/add-game-modal";
import { GameSetting } from "./_components/game-setting/game-setting";

export default async function OrchestrateGame() {
  const settings = getPendingGameSettings();

  return (
    <>
      <h1 className="font-bold text-2xl mb-6">Orchestrate your games</h1>
      <div className="grid xl:grid-cols-2 gap-8">
        {settings.map((setting) => (
          <GameSetting key={setting.settingId} setting={setting} />
        ))}
        <AddGameModal />
      </div>
    </>
  );
}
