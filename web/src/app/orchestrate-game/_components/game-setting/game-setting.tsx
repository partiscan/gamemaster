import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GAMES } from "@/config";
import { removeGame } from "@/server/orchestrate-game/remove-game";
import { GameSetting as GameSettingType } from "@/server/orchestrate-game/types";
import { Trash2Icon } from "lucide-react";
import { FC } from "react";
import { GuessTheNumberGameSetting } from "./guess-the-number-game-setting";
import { SabotageGameSetting } from "./sabotage-game-setting";

type Props = {
  setting: GameSettingType;
};

export const GameSetting: FC<Props> = ({ setting }) => {
  const game = GAMES.find((game) => game.id === setting.gameType);
  if (!game) return null;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {setting.gameType === "sabotage" && (
          <SabotageGameSetting setting={setting} />
        )}
        {setting.gameType === "guess-the-number" && (
          <GuessTheNumberGameSetting setting={setting} />
        )}
      </CardContent>

      <form
        action={async () => {
          "use server";
          removeGame(setting.settingId);
        }}
        className="absolute top-5 right-5 opacity-50"
      >
        <button>
          <Trash2Icon size="16" />
        </button>
      </form>
    </Card>
  );
};
