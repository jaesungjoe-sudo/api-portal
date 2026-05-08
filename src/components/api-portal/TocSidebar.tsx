"use client";

import { AlignLeft } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export type TocItem = { id: string; label: string };

export function TocSidebar({ items }: { items: TocItem[] }) {
  const ids = items.map((i) => i.id);
  const activeId = useScrollSpy(ids);

  return (
    <aside className="sticky top-[89px] hidden h-fit w-[265px] shrink-0 self-start lg:block">
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
