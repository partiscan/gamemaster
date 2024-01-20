"use client";

import { useIdentity } from "@/components/context/identity/identity.context";
import Image from "next/image";
import { FC } from "react";
import { YouArrow } from "./you-arrow";

type Props = {
  address: string;
  points: number;
};

export const Player: FC<Props> = ({ address, points }) => {
  const identity = useIdentity();
  const isYou = identity?.address === address;

  return (
    <div className="flex flex-col gap-1 justify-center items-center relative w-16">
      {isYou && (
        <>
          <div className="absolute left-10 -top-5">
            <YouArrow className="w-10 h-16 z-10" />
          </div>
          <div className="absolute -right-6 top-1 text-[#328421] font-semibold">You</div>
        </>
      )}
      <Image
        src="/assets/avatars/avatar-1.png"
        width={64}
        height={64}
        alt={""}
      />
      <div className="flex flex-col w-full">
        <span className="text-ellipsis overflow-hidden text-xs font-mono">{address}</span>
        <span>Points: {points}</span>
      </div>
    </div>
  );
};
