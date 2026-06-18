import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SummaryCard } from "@/lib/mock-analytics-data";

export function AnalyticsSummaryCard({ card }: { card: SummaryCard }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium text-foreground">{card.label}</p>
        {card.info && (
          <Tooltip>
            <TooltipTrigger
              aria-label={`About ${card.label}`}
              className="inline-flex text-muted-foreground"
            >
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{card.info}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="text-2xl font-semibold leading-8 text-foreground">{card.value}</p>
    </div>
  );
}
