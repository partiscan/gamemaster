"use client";

import { ComponentProps, PropsWithChildren } from "react";
import { ChainAction } from "@/server/chain-actions/types";
import { fetchIdentity } from "@/server/user/cookie-auth";
import { SpinnerButton } from "./spinner-button";
import { getPartisiaSdk } from "@/lib/partisia";

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
  return (
    <SpinnerButton
      onClick={async () => {
        const resolvedAction =
          typeof action === "function" ? await action() : await action;

        const identity = await fetchIdentity();
        const sdk = getPartisiaSdk(identity!);

        await sdk.signMessage({
          contract: resolvedAction.contract,
          payload: resolvedAction.payload,
          payloadType: resolvedAction.payloadType,
          dontBroadcast: false,
        });
        onSuccess?.();
        return true;
      }}
      {...rest}
    />
  );
};
