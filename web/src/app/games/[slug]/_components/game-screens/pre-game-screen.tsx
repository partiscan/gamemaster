import { ChainActionButton } from '@/components/chain-action-button';
import { useGameState } from '@/components/context/game-state.context';
import { signUp } from '@/contracts_gen/clients/gamemaster';
import { PlayerGrid } from '../players/player-grid';
import { GameHeadline } from '../typography/game-headline';

export const PreGameScreen = () => {
  const { isInGame, contractId, isAdmin} = useGameState();

  if (isAdmin) {
    return <PlayerGrid />;
  }

  if (!isInGame) {
    return (
      <div className='text-center'>
        <ChainActionButton
          action={{
            contract: contractId,
            payload: signUp().toString('hex'),
            payloadType: 'hex_payload',
          }}
          className='mt-4'
        >
          Sign up
        </ChainActionButton>
        <PlayerGrid />
      </div>
    );
  }

  return (
    <div className='text-center'>
      <GameHeadline>You are signed up!</GameHeadline>
      <PlayerGrid />
    </div>
  );
};
