import { fetchIdentity } from '@/server/user/cookie-auth';
import { FC, PropsWithChildren } from 'react';
import { IdentityProvider } from './identity.context';

export const ServerIdentityProvider: FC<PropsWithChildren> = async ({
  children,
}) => {
  const identity = await fetchIdentity();

  return <IdentityProvider identity={identity}>{children}</IdentityProvider>;
};
