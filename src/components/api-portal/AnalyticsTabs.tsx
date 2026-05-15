"use client";

import type { AnalyticsPeriod } from "@/lib/mock-analytics-data";

const TABS: { value: AnalyticsPeriod; label: string; shortLabel: string }[] = [
  { value: "6m", label: "Last 6 months", shortLabel: "6m" },
  { value: "30d", label: "Last 30 days", shortLabel: "30d" },
  { value: "7d", label: "Last 7 days", shortLabel: "7d" },
];

export function AnalyticsTabs({
  value,
  onChange,
}: {
  value: AnalyticsPeriod;
  onChange: (next: AnalyticsPeriod) => void;
}) {
  return (
    <div className="inline-flex h-9 items-center">
      {TABS.map((tab, i) => {
        const isActive = tab.value === value;
        const isFirst = i === 0;
        const isLast = i === TABS.length - 1;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`flex h-9 items-center justify-center border border-border px-4 text-sm font-medium text-foreground transition-colors ${
              isActive ? "bg-accent" : "bg-background hover:bg-accent"
            } ${isFirst ? "rounded-l-md" : "-ml-px"} ${isLast ? "rounded-r-md" : ""}`}
          >
            <span className="md:hidden">{tab.shortLabel}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
