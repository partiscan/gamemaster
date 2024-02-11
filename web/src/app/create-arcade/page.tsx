import { ServerIdentityProvider } from '@/components/context/identity/server-identity-provider';
import { getPendingGameSettings } from '@/server/create-arcade/get-pending-game-settings';
import { AddGameModal } from './_components/add-game-modal';
import { DeployButton } from './_components/deploy-button';
import { GameSetting } from './_components/game-setting/game-setting';

export default async function CreateArcade() {
  const settings = getPendingGameSettings();

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='mb-6 text-2xl font-bold'>Create an Arcade</h1>
        {settings.length > 0 && (
          <ServerIdentityProvider>
            <DeployButton />
          </ServerIdentityProvider>
        )}
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
