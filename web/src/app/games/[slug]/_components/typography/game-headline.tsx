import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren;

export const GameHeadline: FC<Props> = ({ children }) => {
  return <h2 className='text-lg font-semibold'>{children}</h2>;
};
