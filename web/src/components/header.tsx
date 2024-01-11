import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";

export const Header: FC = () => {
  return (
    <header className="flex h-20 w-full items-center px-4 md:px-6 bg-primary-foreground border-b dark:bg-slate-800 gap-6">
      <Link className="flex items-center gap-2 font-semibold text-2xl" href="/">
        <span>GameMaster</span>
      </Link>
      <div className="text-sm flex items-center gap-4">
        <Link href={"/games"}>Games</Link>
        <Link href={"/orchestrate-game"}>Orchestrate</Link>
      </div>
      <Button className="ml-auto flex space-x-4">Connect Wallet</Button>
    </header>
  );
};
