import { getPendingGameSettings } from '@/server/create-arcade/get-pending-game-settings';
import { AddGameModal } from './_components/add-game-modal';
import { GameSetting } from './_components/game-setting/game-setting';
import { DeployButton } from './_components/deploy-button';

export default async function CreateArcade() {
  const settings = getPendingGameSettings();

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='mb-6 text-2xl font-bold'>Create an Arcade</h1>
        {settings.length > 0 && <DeployButton />}
      </div>
      <div className='grid gap-8 md:grid-cols-2'>
        {settings.map((setting) => (
          <GameSetting key={setting.settingId} setting={setting} />
        ))}
        <AddGameModal />
      </div>
    </>
  );
}
