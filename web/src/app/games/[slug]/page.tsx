import { GameStateProvider } from '@/components/context/game-state.context';
import { GamemasterServerProvider } from '@/components/context/gamemaster-server-provider';
import { ServerIdentityProvider } from '@/components/context/identity/server-identity-provider';
import { getGameState } from '@/server/game/get-game-state';
import { NextGameButton } from './_components/admin/next-game-button';
import { GameRules } from './_components/game-rules';
import { GameStatus } from './_components/game-status';
import { GamesOverview } from './_components/games-overview';
import { MainGameScreen } from './_components/main-game-screen';
import { PlayerProdium } from './_components/players/player-podium';

type PageProps = {
  params: { slug: string };
};

const GamePage = async ({ params }: PageProps) => {
  const id =
    params.slug === 'test'
      ? '000000000000000000000000000000000000000000'
      : params.slug;
  const state = await getGameState(id);
  if (!state) return null;

  return (
    <GamemasterServerProvider>
      <ServerIdentityProvider>
        <GameStateProvider id={id} defaultGameState={state}>
          <div className='flex w-full flex-col items-stretch gap-2 text-center'>
            <h2 className='text-lg font-semibold'>Games</h2>
            <GamesOverview />
            <GameRules />
            <GameStatus />
            <PlayerProdium />
            <NextGameButton />
            <MainGameScreen />
          </div>
        </GameStateProvider>
      </ServerIdentityProvider>
    </GamemasterServerProvider>
  );
};

export default GamePage;
