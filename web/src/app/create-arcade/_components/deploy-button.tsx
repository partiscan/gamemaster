'use client';

import { Button } from '@/components/ui/button';
import { signTransaction } from '@/lib/partisia';
import { deployGame } from '@/server/create-arcade/deploy-game';

const ZK_CONTRACT = '018bc1ccbb672b87710327713c97d43204905082cb';

export const DeployButton = () => {
  return (
    <Button
      onClick={async () => {
        const gamePayload = await deployGame();

        const message = await signTransaction(ZK_CONTRACT, gamePayload);

        console.log(message);
      }}
    >
      Deploy
    </Button>
  );
};
