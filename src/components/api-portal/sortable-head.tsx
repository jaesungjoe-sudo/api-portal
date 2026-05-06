"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type SortDir = "asc" | "desc";

export function SortableHead<K extends string>({
  children,
  col,
  sortKey,
  sortDir,
  onSort,
}: {
  children: React.ReactNode;
  col: K;
  sortKey: K | null;
  sortDir: SortDir;
  onSort: (c: K) => void;
}) {
  const active = sortKey === col;
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      onClick={() => onSort(col)}
      className={`flex items-center gap-1 text-sm font-medium hover:text-foreground ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      {children}
      <Icon className={`h-3 w-3 ${active ? "" : "text-muted-foreground"}`} />
    </button>
  );
}
