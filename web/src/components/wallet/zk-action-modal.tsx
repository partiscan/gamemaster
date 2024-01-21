import { FC, PropsWithChildren } from 'react';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useGameState } from '../context/game-state.context';

type Props = PropsWithChildren<{
  payload: Buffer;
}>;

export const ZkActionModal: FC<Props> = ({ children }) => {
  const { contractId } = useGameState();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send secret input</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Choose a game to add to the collection of games.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
