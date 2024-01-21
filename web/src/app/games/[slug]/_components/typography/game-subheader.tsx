import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export const GameSubheader: FC<Props> = ({ children }) => {
  return (
    <div className='mx-auto max-w-md text-sm text-gray-500'>{children}</div>
  );
};
