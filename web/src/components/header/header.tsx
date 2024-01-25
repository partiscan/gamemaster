import Link from 'next/link';
import { FC, Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';
import { GamemasterLogo } from './gamemaster-logo';
import { Profile } from './profile';

export const Header: FC = async () => {
  return (
    <header className='border-b bg-primary-foreground dark:bg-slate-800'>
      <nav
        className='grid grid-cols-3 items-center justify-between px-6 py-2 lg:px-8'
        aria-label='Global'
      >
        <div className='flex items-center gap-6'>
          <Link
            className='flex items-center gap-2 text-2xl font-semibold'
            href='/'
          >
            <GamemasterLogo className='text-blue stroke-red w-14 bg-primary fill-primary-foreground ' />
            <span className='hidden md:block'>Gamemaster</span>
          </Link>
        </div>
        <div className='flex items-center gap-4 text-sm mx-auto'>
        </div>
        <div className='justify-self-end'>
          <Suspense
            fallback={
              <Skeleton className='ml-auto h-10 w-32 bg-muted-foreground/30' />
            }
          >
            <Profile />
          </Suspense>
        </div>
      </nav>
    </header>
  );
};
