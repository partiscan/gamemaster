'use client';

import { Button } from '@/components/ui/button';
import { signTransaction } from '@/lib/partisia';
import { deployGame } from '@/server/create-arcade/deploy-game';
import { useRouter } from 'next/navigation';

const ZK_CONTRACT = '018bc1ccbb672b87710327713c97d43204905082cb';

export const DeployButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const gamePayload = await deployGame();

        const message = await signTransaction(ZK_CONTRACT, gamePayload);
        if (!message) {
          console.error('Failed to get the transaction hash');
          return;
        }

        router.push(`/deploying/${message.trxHash}`);
      }}
    >
      Deploy
    </Button>
  );
};
