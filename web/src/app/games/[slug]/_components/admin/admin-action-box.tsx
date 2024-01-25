import { FC, PropsWithChildren } from 'react';
import { GameHeadline } from '../typography/game-headline';

type Props = PropsWithChildren<{}>;

export const AdminActionBox: FC<Props> = ({ children }) => {
  return (
    <div className='mt-2 min-w-60 flex flex-col items-center border border-rose-200 bg-rose-50 px-5 py-2 text-center'>
      <GameHeadline>Admin Actions</GameHeadline>
      <div className='py-2'>{children}</div>
    </div>
  );
};
