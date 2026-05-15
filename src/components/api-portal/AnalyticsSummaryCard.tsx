import { TrendingUp } from "lucide-react";
import type { SummaryCard } from "@/lib/mock-analytics-data";

export function AnalyticsSummaryCard({ card }: { card: SummaryCard }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{card.label}</p>
        {card.kind === "with-trend" && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
            <TrendingUp className="h-3 w-3" />
            {card.chip}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold leading-8 text-foreground">{card.value}</p>
      <p className="-mt-4 flex items-center gap-1 text-xs text-foreground">
        {card.kind === "with-trend" && <TrendingUp className="h-3.5 w-3.5" />}
        {card.trend}
      </p>
    </div>
  );
}
