'use client';

import { logout } from '@/server/user/auth';
import { LogOut } from 'lucide-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

export const DropdownMenuItemLogout = () => {
  return (
    <DropdownMenuItem onClick={() => logout()}>
      <LogOut className='mr-2 h-4 w-4' />
      Logout
    </DropdownMenuItem>
  );
};
