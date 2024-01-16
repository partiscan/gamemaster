import Link from "next/link";
import { FC, Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { Profile } from "./profile";

export const Header: FC = async () => {
  return (
    <header className="flex justify-between h-20 w-full items-center px-4 md:px-6 bg-primary-foreground border-b dark:bg-slate-800">
      <div className="flex gap-6 items-center">
        <Link
          className="flex items-center gap-2 font-semibold text-2xl"
          href="/"
        >
          <span>GameMaster</span>
        </Link>
        <div className="text-sm flex items-center gap-4">
          <Link href={"/games"}>Games</Link>
          <Link href={"/orchestrate-game"}>Orchestrate</Link>
        </div>
      </div>
      <Suspense
        fallback={
          <Skeleton className="ml-auto h-10 w-32 bg-muted-foreground/30" />
        }
      >
        <Profile />
      </Suspense>
    </header>
  );
};
