import Link from 'next/link';
import { FC, Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';
import { Profile } from './profile';

export const Header: FC = async () => {
  return (
    <header className='flex h-20 w-full items-center justify-between border-b bg-primary-foreground px-4 md:px-6 dark:bg-slate-800'>
      <div className='flex items-center gap-6'>
        <Link
          className='flex items-center gap-2 text-2xl font-semibold'
          href='/'
        >
          <span>GameMaster</span>
        </Link>
        <div className='flex items-center gap-4 text-sm'>
          <Link href={'/games'}>Games</Link>
          <Link href={'/orchestrate-game'}>Orchestrate</Link>
        </div>
      </div>
      <Suspense
        fallback={
          <Skeleton className='ml-auto h-10 w-32 bg-muted-foreground/30' />
        }
      >
        <Profile />
      </Suspense>
    </header>
  );
};
