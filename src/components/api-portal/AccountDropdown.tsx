"use client";

import { useState } from "react";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileDialog } from "./ProfileDialog";
import { useAuth } from "@/lib/auth-context";

// Mock: 실제로는 세션/유저 컨텍스트에서 가져옴
const CURRENT_USER = {
  email: "jaesung.joe@api.com",
  initial: "J",
};

export function AccountDropdown() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-600 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {CURRENT_USER.initial}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 rounded-md border border-border"
        >
          {/* Base UI: GroupLabel은 반드시 Group 안에 있어야 함 (Radix와 차이) */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-muted-foreground">
              {CURRENT_USER.email}
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="gap-2 px-2 py-1.5"
              onClick={() => setProfileOpen(true)}
            >
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="gap-2 px-2 py-1.5" onClick={logout}>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
