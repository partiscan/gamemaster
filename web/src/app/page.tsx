import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoToGameInput } from './_components/go-to-game-input';

export default function Home() {
  return (
    <>
      <h1 className='mb-6 text-2xl font-bold'>Welcome</h1>

      <div className='text-secondary-foreground'>
        You can orchestrate your own game here, or you can join an existing
        game, if you know of an already deployed game contract.
      </div>
      <GoToGameInput />
    </>
  );
}
