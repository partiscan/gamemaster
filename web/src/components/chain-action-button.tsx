'use client';

import { getPartisiaSdk } from '@/lib/partisia';
import { ChainAction } from '@/server/chain-actions/types';
import { fetchIdentity } from '@/server/user/cookie-auth';
import {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { SpinnerButton } from './spinner-button';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ConnectWallet } from './wallet/connect-wallet';

type MaybePromise<T> = T | Promise<T> | PromiseLike<T>;

type Props = PropsWithChildren<
  ComponentProps<typeof SpinnerButton> & {
    action: MaybePromise<ChainAction> | (() => MaybePromise<ChainAction>);
    revalidatePath?: string;
    onSuccess?: (txHash: string) => void;
    disableLoading?: boolean;
  }
>;

export const ChainActionButton = ({
  revalidatePath: path,
  action,
  onSuccess,
  disableLoading,
  ...rest
}: Props) => {
  const [showModal, setShowModal] = useState(false);

  const onClick = useCallback(async () => {
    const resolvedAction = await (typeof action === 'function'
      ? action()
      : action);

    const identity = await fetchIdentity();
    if (!identity) {
      setShowModal(true);
      return false;
    }

    if (identity.kind === 'partisia') {
      const sdk = getPartisiaSdk(identity);

      const result = await sdk.signMessage({
        contract: resolvedAction.contract,
        payload: resolvedAction.payload,
        payloadType: resolvedAction.payloadType,
        dontBroadcast: false,
      });

      onSuccess?.(result.trxHash);
      return true;
    }

    throw new Error('');
  }, [action, onSuccess]);

  const Component = disableLoading ? Button : SpinnerButton;

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You need to connect your wallet to sign this transaction.
          </DialogDescription>
          <ConnectWallet />
        </DialogContent>
      </Dialog>
      <Component onClick={onClick} {...rest} />
    </>
  );
};
