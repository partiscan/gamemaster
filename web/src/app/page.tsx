import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <h1 className='mb-6 text-2xl font-bold'>Orchestrate your games</h1>
      <div className='flex h-64 items-center justify-center rounded-lg border bg-primary-foreground text-gray-500'>
        <p className='text-center'>Some game</p>
      </div>
      <div className='mx-auto mt-8 w-fit'>
        <Button size='lg'>Add Game</Button>
      </div>
    </>
  );
}
