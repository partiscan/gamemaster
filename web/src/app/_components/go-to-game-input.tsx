'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { Input } from '@/components/ui/input';

export const GoToGameInput: FC = () => {
  const router = useRouter();

  return (
    <Input
      className='mt-2 max-w-80 font-mono text-xs'
      placeholder='Paste the game contract address'
      onChange={(e) => {
        const address = e.target.value;
        if (address) {
          router.push(`/games/${address}`);
        }
      }}
    />
  );
};
