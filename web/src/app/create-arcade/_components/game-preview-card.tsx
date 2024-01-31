import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Game } from '@/config';
import { addGame } from '@/server/create-arcade/add-game';
import { FC } from 'react';
import Image from 'next/image';

type Props = {
  game: Game;
};

export const GamePreviewCard: FC<Props> = ({ game }) => {
  const { title, description } = game;

  return (
    <form
      action={() => {
        addGame(game);
      }}
    >
      <button className='group w-full'>
        <Card className='group: cursor-pointer bg-primary-foreground transition-all hover:bg-primary hover:text-primary-foreground flex'>
          <Image
            className='shrink grow-0 rounded'
            src={`/assets/games/${game.id}.webp`}
            alt={''}
            width={128}
            height={128}
          />
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription className='group-hover:text-muted'>
              {description}
            </CardDescription>
          </CardHeader>
        </Card>
      </button>
    </form>
  );
};
