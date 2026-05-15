"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
    <ToggleGroup
      variant="outlined"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as AnalyticsPeriod);
      }}
    >
      {TABS.map((tab) => (
        <ToggleGroupItem key={tab.value} value={tab.value}>
          <span className="md:hidden">{tab.shortLabel}</span>
          <span className="hidden md:inline">{tab.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
