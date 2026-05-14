"use client";

import { AlignLeft, ChevronRight } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export type TocItem = { id: string; label: string };

export function TocSidebar({ items }: { items: TocItem[] }) {
  const ids = items.map((i) => i.id);
  const activeId = useScrollSpy(ids);

  return (
    <aside className="sticky top-[89px] hidden h-fit w-[265px] shrink-0 self-start xl:block">
      <div className="mb-4 flex items-center gap-2">
        <AlignLeft className="h-5 w-5 text-foreground" />
        <p className="text-sm font-semibold text-foreground">On This Page</p>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-sm transition-colors ${
                active
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

/**
 * Mobile collapsible TOC — xl 미만에서 본문 상단에 표시.
 * <details> 사용 (JS 없이 동작, 접근성 기본 제공).
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  return (
    <details className="group mb-8 rounded-md border border-border bg-background xl:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <AlignLeft className="h-4 w-4" />
        On This Page
        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>
      <nav className="flex flex-col gap-2 border-t border-border px-4 py-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
