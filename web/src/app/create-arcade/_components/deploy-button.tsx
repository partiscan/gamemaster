'use client';

import { ChainActionButton } from '@/components/chain-action-button';
import { useIdentity } from '@/components/context/identity/identity.context';
import { deployGame } from '@/server/create-arcade/deploy-game';
import { useRouter } from 'next/navigation';

const ZK_CONTRACT = '018bc1ccbb672b87710327713c97d43204905082cb';

export const DeployButton = () => {
  const router = useRouter();
  const identity = useIdentity();
  if (!identity) return;

  return (
    <ChainActionButton
      action={() => deployGame(identity.address, ZK_CONTRACT)}
      onSuccess={(txHash) => {
        router.push(`/deploying/${txHash}`);
      }}
    >
      Deploy
    </ChainActionButton>
  );
};
