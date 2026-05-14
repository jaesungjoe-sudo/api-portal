"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DASHBOARD_NAV,
  isSidebarNavGroup,
  type SidebarNavGroup,
} from "@/lib/dashboard-nav";

/* ── Dashboard 사이드바 ───────────────────────────────────────
 * Figma 1456:16099 sidebar 정합 (custom <aside>)
 * + 모바일: shadcn Sheet drawer로 자동 전환 (useSidebar context 사용)
 *
 * SidebarProvider가 layout에서 wrap → 이 컴포넌트는 isMobile에 따라 분기
 */

function LeafLink({ href, label, active, onNavigate }: { href: string; label: string; active: boolean; onNavigate?: () => void }) {
  return (
    <div className="px-2 py-1">
      <Link
        href={href}
        onClick={onNavigate}
        className={`flex h-9 items-center rounded-sm px-2 text-sm font-medium text-sidebar-foreground transition-colors ${
          active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
        }`}
      >
        {label}
      </Link>
    </div>
  );
}

function GroupItem({ group, pathname, onNavigate }: { group: SidebarNavGroup; pathname: string; onNavigate?: () => void }) {
  const containsActive = group.items.some((sub) => sub.href === pathname);
  const [open, setOpen] = useState<string[]>(containsActive ? [group.label] : []);

  useEffect(() => {
    if (containsActive && !open.includes(group.label)) {
      setOpen((prev) => [...prev, group.label]);
    }
  }, [containsActive, group.label, open]);

  return (
    <Accordion value={open} onValueChange={(v) => setOpen(v as string[])}>
      <AccordionItem value={group.label} className="border-none">
        <div className="px-2 py-1">
          <AccordionTrigger className="flex h-9 items-center rounded-sm border-0 px-2 py-0 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
            {group.label}
          </AccordionTrigger>
        </div>
        <AccordionContent className="px-2 pb-1">
          <div className="flex flex-col">
            {group.items.map((sub) => {
              const active = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={onNavigate}
                  className={`flex h-9 items-center rounded-sm px-2 text-sm text-sidebar-foreground transition-colors ${
                    active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Header — Figma: gallery-vertical-end + "Dashboard", wrapper h-9 (Bottom=false도 36px 고정) */}
      <div className="p-2">
        <div className="flex items-center gap-2 p-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <GalleryVerticalEnd className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex h-9 min-w-0 flex-1 flex-col justify-center">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Menu — DASHBOARD_NAV 순서 그대로 */}
      <nav className="flex flex-col">
        {DASHBOARD_NAV.map((item) => {
          if (!isSidebarNavGroup(item)) {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return <LeafLink key={item.label} href={item.href} label={item.label} active={active} onNavigate={onNavigate} />;
          }
          return <GroupItem key={item.label} group={item} pathname={pathname} onNavigate={onNavigate} />;
        })}
      </nav>
    </>
  );
}

export function AppSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  // Mobile: shadcn Sheet drawer (자동으로 SidebarProvider context와 연동)
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-[255px] border-r border-sidebar-border bg-background p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard navigation</SheetTitle>
          </SheetHeader>
          <SidebarBody onNavigate={() => setOpenMobile(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: 기존 custom aside (Figma 정합 그대로)
  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-[255px] shrink-0 overflow-y-auto border-r border-sidebar-border bg-background md:block">
      <SidebarBody />
    </aside>
  );
}
