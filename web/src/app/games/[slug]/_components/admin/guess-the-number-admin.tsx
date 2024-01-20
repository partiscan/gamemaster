"use client";

import { useGameState } from "@/components/context/game-state.context";
import { useGamemasterAbi } from "@/components/context/gamemaster.context";
import { useIdentity } from "@/components/context/identity/identity.context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ZkActionModal } from "@/components/wallet/zk-action-modal";
import { GuessTheNumberActions } from "@/lib/game-actions/guess-the-number-actions";
import { useState } from "react";

const MAX_NUMBER = 255;
export const GuessTheNumberAdmin = () => {
  const [secretNumber, setSecretNumber] = useState(
    Math.floor(Math.random() * MAX_NUMBER)
  );

  const abi = useGamemasterAbi();
  const identity = useIdentity();
  const { engineKeys } = useGameState();

  if (!identity) return null;

  const actions = new GuessTheNumberActions(identity.address, abi, engineKeys);
  const rpc = actions.secretNumberInput( - (MAX_NUMBER - 1) / 2);

  return (
    <>
      <div className="w-full items-center text-sm font-semibold my-5 space-y-5">
        <Label htmlFor="secret-number">Secret number: {secretNumber}</Label>

        <Slider
          id="secret-number"
          value={[secretNumber]}
          min={0}
          max={MAX_NUMBER}
          step={1}
          className="max-w-sm mx-auto"
          onValueChange={(value) => setSecretNumber(value[0])}
          suppressHydrationWarning
        />
        <ZkActionModal payload={rpc}>
          <Button>Set Secret Number</Button>
        </ZkActionModal>
      </div>
    </>
  );
};
