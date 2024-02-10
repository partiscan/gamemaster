import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Game } from '@/config';
import Image from 'next/image';
import { FC } from 'react';

type Props = {
  game: Game;
  onClick: () => void;
};

export const GamePreviewCard: FC<Props> = ({ game, onClick }) => {
  const { title, description } = game;

  return (
    <button className='group w-full' onClick={onClick}>
      <Card className='group: flex cursor-pointer bg-primary-foreground transition-all hover:bg-primary hover:text-primary-foreground'>
        <Image
          className='shrink grow-0 rounded'
          src={`/assets/games/${game.id}.webp`}
          alt={''}
          width={128}
          height={128}
        />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className='group-hover:text-muted text-xs'>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
};
