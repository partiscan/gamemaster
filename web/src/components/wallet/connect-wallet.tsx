"use client";

import Link from "next/link";
import PartisiaSdk from "partisia-sdk";
import { FC, useState } from "react";
import { login } from "../../server/user/auth";
import { Button } from "../ui/button";

type Props = {
  text?: string;
  className?: string;
};

export const ConnectWallet: FC<Props> = ({ text, className }) => {
  const [error, setError] = useState<"no-wallet">();

  return (
    <div className={className}>
      {text && <p className="pb-2">{text}</p>}
      <Button
        onClick={async () => {
          try {
            const sdk = new PartisiaSdk();
            await sdk.connect({
              chainId: "Partisia Blockchain Testnet",
              permissions: ["sign" as any],
              dappName: "GameMaster",
            });

            setError(undefined);

            const { connection, seed } = sdk;
            if (!connection) return false;

            await login({
              kind: "partisia",
              address: connection.account.address,
              seed,
              wallet: connection,
            });
            return true;
          } catch (error: any) {
            console.log(error);
            if (error.message === "Extension not Found") {
              setError("no-wallet");
              return false;
            }
            return false;
          }
        }}
      >
        Connect Wallet
      </Button>
      {error === "no-wallet" && (
        <div>
          <p className="mt-2 text-sm font-medium text-red-700">
            Error: You need to install the{" "}
            <Link
              href={
                "https://chromewebstore.google.com/detail/partisia-wallet/gjkdbeaiifkpoencioahhcilildpjhgh"
              }
              target="_blank"
              className="font-semibold text-red-900 underline underline-offset-2"
            >
              Partisia Wallet
            </Link>{" "}
            to use this site.
          </p>
        </div>
      )}
    </div>
  );
};
