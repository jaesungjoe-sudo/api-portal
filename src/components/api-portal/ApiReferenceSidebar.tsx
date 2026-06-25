"use client";

import { useState } from "react";
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
import { API_REFERENCE_LINKS, API_REFERENCE_NAV, METHOD_ABBR, type ApiRefGroup } from "@/lib/api-reference-nav";
import { Badge } from "@/components/ui/badge";
import { METHOD_VARIANT } from "@/components/api-portal/MethodBadge";

function GroupItem({
  group,
  pathname,
  onNavigate,
}: {
  group: ApiRefGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  // Figma 정합: 그룹은 기본 펼침(전 엔드포인트 노출). 접이식은 유지.
  const [open, setOpen] = useState<string[]>([group.label]);

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
                  className={`flex h-9 items-center gap-2 rounded-sm pl-4 pr-2 text-sm text-sidebar-foreground transition-colors ${
                    active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`}
                >
                  <span className="flex w-12 shrink-0 justify-start">
                    <Badge
                      variant={METHOD_VARIANT[sub.method]}
                      className="px-1.5 py-0 text-2xs font-medium leading-none"
                    >
                      {METHOD_ABBR[sub.method]}
                    </Badge>
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
        {API_REFERENCE_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <div key={link.href} className="px-2 py-1">
              <Link
                href={link.href}
                onClick={onNavigate}
                className={`flex h-9 items-center rounded-sm px-2 text-sm font-medium text-sidebar-foreground transition-colors ${
                  active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                }`}
              >
                {link.label}
              </Link>
            </div>
          );
        })}
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
          className="w-[272px] border-r border-sidebar-border bg-background p-0"
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
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-[272px] shrink-0 overflow-y-auto border-r border-sidebar-border bg-background md:block">
      <SidebarBody />
    </aside>
  );
}
