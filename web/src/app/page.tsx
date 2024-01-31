import { Button } from '@/components/ui/button';
import { GoToGameInput } from './_components/go-to-game-input';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1 className='mb-6 sm:text-center text-2xl font-bold'>Welcome</h1>

      <div className='grid gap-4 sm:gap-12 md:gap-24 font-medium text-secondary-foreground sm:grid-cols-2'>
        <div className='space-y-2 sm:text-right'>
          <p>Start by creating your own Arcade</p>
          <Button asChild>
            <Link href='/create-arcade'>Create Arcade</Link>
          </Button>
        </div>
        <div className=''>
          Or join an existing game by entering the contract address below:
          <GoToGameInput />
        </div>
      </div>
    </>
  );
}
