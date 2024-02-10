import { useGameState } from '@/components/context/game-state.context';
import { useGamemasterAbi } from '@/components/context/gamemaster.context';
import { useIdentity } from '@/components/context/identity/identity.context';
import { GuessTheNumberActions } from './guess-the-number-actions';
import { SabotageActions } from './sabotage-actions';
import { SplitOrConquerActions } from './split-or-conquer-actions';

export const useGuessTheNumberActions = () => {
  const address = useIdentity()?.address;
  const abi = useGamemasterAbi();
  const { contractId, engineKeys } = useGameState();

  return new GuessTheNumberActions(contractId, address, abi, engineKeys);
};

export const useSabotageActions = () => {
  const address = useIdentity()?.address;
  const abi = useGamemasterAbi();
  const { contractId, engineKeys } = useGameState();

  return new SabotageActions(contractId, address, abi, engineKeys);
};

export const useSplitOrConquerActions = () => {
  const address = useIdentity()?.address;
  const abi = useGamemasterAbi();
  const { contractId, engineKeys } = useGameState();

  return new SplitOrConquerActions(contractId, address, abi, engineKeys);
};
