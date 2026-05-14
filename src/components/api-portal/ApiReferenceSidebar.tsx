"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2 } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { API_REFERENCE_NAV, type ApiRefGroup } from "@/lib/api-reference-nav";
import { MethodBadge } from "@/components/api-portal/MethodBadge";

function GroupItem({
  group,
  pathname,
  onNavigate,
}: {
  group: ApiRefGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
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
                  className={`flex h-9 items-center gap-2 rounded-sm px-2 text-sm text-sidebar-foreground transition-colors ${
                    active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`}
                >
                  <span className="flex w-14 shrink-0 justify-start">
                    <MethodBadge method={sub.method} />
                  </span>
                  <span>{sub.label}</span>
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
      <div className="p-2">
        <div className="flex items-center gap-2 p-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <Code2 className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              API Reference
            </p>
            <p className="truncate text-xs text-sidebar-foreground">v1.0.0</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col">
        {API_REFERENCE_NAV.map((group) => (
          <GroupItem
            key={group.label}
            group={group}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </>
  );
}

export function ApiReferenceSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          className="w-[255px] border-r border-sidebar-border bg-background p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>API Reference navigation</SheetTitle>
          </SheetHeader>
          <SidebarBody onNavigate={() => setOpenMobile(false)} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-[255px] shrink-0 overflow-y-auto border-r border-sidebar-border bg-background md:block">
      <SidebarBody />
    </aside>
  );
}
