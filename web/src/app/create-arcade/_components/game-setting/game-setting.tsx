import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GAMES } from '@/config';
import { removeGame } from '@/server/create-arcade/remove-game';
import { GameSetting as GameSettingType } from '@/server/create-arcade/types';
import { Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import { GuessTheNumberGameSetting } from './guess-the-number-game-setting';
import { SabotageGameSetting } from './sabotage-game-setting';

type Props = {
  setting: GameSettingType;
};

export const GameSetting: FC<Props> = ({ setting }) => {
  const game = GAMES.find((game) => game.id === setting.gameType);
  if (!game) return null;

  return (
    <Card className='relative'>
      <CardHeader className='flex md:flex-row md:gap-4'>
        <Image
          className='shrink-0 grow-0 rounded'
          src={`/assets/games/${game.id}.webp`}
          alt={''}
          width={128}
          height={128}
        />
        <div className='gap-2 flex flex-col'>
          <CardTitle>{game.title}</CardTitle>
          <CardDescription>{game.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {setting.gameType === 'sabotage' && (
          <SabotageGameSetting setting={setting} />
        )}
        {setting.gameType === 'guess-the-number' && (
          <GuessTheNumberGameSetting setting={setting} />
        )}
      </CardContent>

      <form
        action={async () => {
          'use server';
          removeGame(setting.settingId);
        }}
        className='absolute right-5 top-5 opacity-50'
      >
        <button>
          <Trash2Icon size='16' />
        </button>
      </form>
    </Card>
  );
};
