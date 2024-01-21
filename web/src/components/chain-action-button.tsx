"use client";

import {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import { ChainAction } from "@/server/chain-actions/types";
import { fetchIdentity } from "@/server/user/cookie-auth";
import { SpinnerButton } from "./spinner-button";
import { getPartisiaSdk } from "@/lib/partisia";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ConnectWallet } from "./wallet/connect-wallet";

type Props = PropsWithChildren<
  ComponentProps<typeof SpinnerButton> & {
    action: ChainAction | (() => Promise<ChainAction>);
    revalidatePath?: string;
    onSuccess?: () => void;
  }
>;

export const ChainActionButton = ({
  revalidatePath: path,
  action,
  onSuccess,
  ...rest
}: Props) => {
  const [showModal, setShowModal] = useState(false);

  const onClick = useCallback(async () => {
    const resolvedAction =
      typeof action === "function" ? await action() : action;

    const identity = await fetchIdentity();
    if (!identity) {
      setShowModal(true);
      return false;
    }

    if (identity.kind === "partisia") {
      const sdk = getPartisiaSdk(identity);

      await sdk.signMessage({
        contract: resolvedAction.contract,
        payload: resolvedAction.payload,
        payloadType: resolvedAction.payloadType,
        dontBroadcast: false,
      });
      onSuccess?.();
      return true;
    }

    throw new Error("");
  }, [action, onSuccess]);

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign transaction</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You need to connect your wallet to sign this transaction.
          </DialogDescription>
          <ConnectWallet />
        </DialogContent>
      </Dialog>
      <SpinnerButton onClick={onClick} {...rest} />
    </>
  );
};
