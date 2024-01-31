'use client';

import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GAMES } from '@/config';
import { FC } from 'react';
import { GamePreviewCard } from './game-preview-card';

export const AddGameModal: FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Card className='relative flex h-full w-full cursor-pointer items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary'>
            <div className='m-8 text-xl font-semibold'>Add game</div>
          </Card>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a game</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Choose a game to add to the Arcade.
        </DialogDescription>
        {GAMES.map((game) => (
          <GamePreviewCard key={game.title} game={game} />
        ))}
      </DialogContent>
    </Dialog>
  );
};
