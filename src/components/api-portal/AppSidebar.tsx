"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Analytics", href: "/analytics" },
  { label: "User & Team management", href: "/users" },
  { label: "API Keys", href: "/api-keys" },
  { label: "Webhooks", href: "/webhooks" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    // collapsible="none"은 border-r을 자동 제거함 → 반드시 명시
    <Sidebar collapsible="none" className="border-r border-sidebar-border">
      <SidebarHeader>
        {/* SidebarHeader의 기본 padding을 건드리지 않음.
            내부 구조는 래퍼 div로 제어. */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">Dashboard</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Figma: 각 아이템 wrapper가 padding t4 r8 b4 l8.
            SidebarMenu 기본 p-2(=py-2 px-2) 중 수직만 py-1로 축소 → 4px top/bottom.
            좌우 px-2(8px)는 유지. gap-2로 아이템 간 8px 확보. */}
        <SidebarMenu className="gap-2 py-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  className={cn(
                    "h-9 text-sm font-medium",
                    isActive
                      ? "bg-sidebar-accent text-blue-700 hover:bg-sidebar-accent hover:text-blue-700"
                      : "text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
