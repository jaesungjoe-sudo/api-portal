"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DOCS_NAV, isDocsNavGroup, type DocsNavGroup } from "@/lib/docs-nav";

/* ── Item rendering ───────────────────────────────────────────
 * Figma 1518:13771 sidebar 정합:
 *   Sidebar_menu_item (Level 1): outer 8/8/4/4 padding, inner Label radius 6 (rounded-sm)
 *   Sidebar_menu_item (Level 2): outer 8/8/0/0 padding (no vertical), inner Label radius 6
 *   Color tokens: sidebar-foreground / sidebar-accent / sidebar-primary
 */

function LeafLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <div className="px-2 py-1">
      <Link
        href={href}
        className={`flex h-9 items-center rounded-sm px-2 text-sm font-medium text-sidebar-foreground transition-colors ${
          active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
        }`}
      >
        {label}
      </Link>
    </div>
  );
}

function GroupItem({ group, pathname }: { group: DocsNavGroup; pathname: string }) {
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
        {/* Trigger — outer wrapper로 4px vertical padding 부여 (Figma Level 1 spec) */}
        <div className="px-2 py-1">
          <AccordionTrigger className="flex h-9 items-center rounded-sm border-0 px-2 py-0 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
            {group.label}
          </AccordionTrigger>
        </div>
        {/* Content — Level 2 items have no outer vertical padding (Figma spec) */}
        <AccordionContent className="px-2 pb-1">
          <div className="flex flex-col">
            {group.items.map((sub) => {
              const active = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
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

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-[255px] shrink-0 overflow-y-auto border-r border-sidebar-border bg-background md:block">
      {/* Header — Figma 스펙엔 border-b 없음 */}
      <div className="p-2">
        <div className="flex items-center gap-2 p-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <FileText className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Documentation</p>
            <p className="truncate text-xs text-sidebar-foreground">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Menu — DOCS_NAV 순서 그대로 */}
      <nav className="flex flex-col">
        {DOCS_NAV.map((item) => {
          if (!isDocsNavGroup(item)) {
            const active = pathname === item.href;
            return <LeafLink key={item.label} href={item.href} label={item.label} active={active} />;
          }
          return <GroupItem key={item.label} group={item} pathname={pathname} />;
        })}
      </nav>
    </aside>
  );
}
