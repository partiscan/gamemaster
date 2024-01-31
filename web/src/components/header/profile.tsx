import { fetchIdentity } from '@/server/user/cookie-auth';
import { CircleUserRound, PackagePlus } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ConnectWallet } from '../wallet/connect-wallet';
import { DropdownMenuItemLogout } from './dropdown-menu-item-logout';

export const Profile: FC = async () => {
  const user = await fetchIdentity();

  if (!user) {
    return <ConnectWallet />;
  }

  return (
    <div className='flex items-center gap-2'>
      <Link href='/create-arcade'>
        <PackagePlus className='text-muted-foreground' />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <CircleUserRound className='text-muted-foreground' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-5'>
          <DropdownMenuItemLogout />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
