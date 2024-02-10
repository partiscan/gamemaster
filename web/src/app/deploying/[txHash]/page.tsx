'use client';

import { Spinner } from '@/components/spinner';
import { getGameContractByTransaction } from '@/server/game/get-game-contract-by-transaction';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {
  params: {
    txHash: string;
  };
};

const REFRESH_TIME = 5_000;
const MAX_TRIES = 6;

export default function DeployingPage({ params: { txHash } }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const tries = useRef(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tries.current > MAX_TRIES) {
        clearInterval(interval);
        setError(
          'Could not find the contract by transaction hash. Try again later.',
        );
        return;
      }

      try {
        const result = await getGameContractByTransaction(txHash);
        if (result.result === 'success') {
          clearInterval(interval);
          router.replace(`/games/${result.contract}`);
        }

        if (result.result === 'execution-failed') {
          setError(
            'The deployment of this contract failed. Maybe there is not enough gas.',
          );
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }

      tries.current += 1;
    }, REFRESH_TIME);

    return () => clearInterval(interval);
  }, [router, txHash]);

  return (
    <>
      <h1 className='mb-10 text-2xl font-bold sm:text-center'>Deploying...</h1>

      {error ? (
        <div className='mx-auto text-center text-red-800 font-medium'>{error}</div>
      ) : (
        <>
          <Spinner className='mx-auto mb-5 h-16 w-16 fill-black' />

          <div className='flex flex-col  gap-2 text-center text-secondary-foreground'>
            <div className='font-medium'>
              Searching for contract by transaction hash
            </div>
            <div className='mx-auto w-fit font-mono text-xs'>{txHash}</div>
          </div>
        </>
      )}
    </>
  );
}
