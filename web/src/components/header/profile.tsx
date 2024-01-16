import { fetchIdentity } from "@/server/user/cookie-auth";
import { CircleUserRound } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { ConnectWallet } from "../wallet/connect-wallet";
import { DropdownMenuItemLogout } from "./dropdown-menu-item-logout";

export const Profile = async () => {
  const user = await fetchIdentity();

  if (!user) {
    return <ConnectWallet />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <CircleUserRound className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5">
        <DropdownMenuItemLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
