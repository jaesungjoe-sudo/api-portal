import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  AnalyticsPeriod,
  StatusCodeShare,
  StatusFamily,
  StatusHealth,
} from "@/lib/mock-analytics-data";

const FAMILY_LABEL: Record<StatusFamily, string> = {
  "2xx": "Success",
  "4xx": "Client error",
  "5xx": "Server error",
};

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
};

const FAMILY_BG: Record<StatusFamily, string> = {
  "2xx": "bg-success-chart",
  "4xx": "bg-warning-chart",
  "5xx": "bg-destructive-chart",
};

export function AnalyticsStatusCodeDistribution({
  data,
  health,
  period,
}: {
  data: StatusCodeShare[];
  health: StatusHealth;
  period: AnalyticsPeriod;
}) {
  const total = data.reduce((sum, s) => sum + s.percentage, 0);

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">Status code</h3>
        <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Health chips */}
        <div className="flex items-center gap-6 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success-chart" />
            <span className="font-medium text-foreground">{health.successRate}%</span>
            <span className="text-muted-foreground">success</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-destructive-chart" />
            <span className="font-medium text-foreground">{health.errorRate}%</span>
            <span className="text-muted-foreground">
              errors · {health.errorCount.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Segmented status bar — each segment reveals its code on hover */}
        <div className="flex h-6 gap-px overflow-hidden rounded-md">
          {data.map((s) => (
            <Tooltip key={s.code}>
              <TooltipTrigger
                aria-label={`${s.code} ${FAMILY_LABEL[s.family]}: ${s.percentage}%`}
                className={`h-full min-w-0 p-0 ${FAMILY_BG[s.family]}`}
                style={{ width: `${(s.percentage / total) * 100}%` }}
              />
              <TooltipContent>
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-xs ${FAMILY_BG[s.family]}`} />
                  {s.code} · {FAMILY_LABEL[s.family]} · {s.percentage}%
                </span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Status code legend */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
          {data.map((s) => (
            <div key={s.code} className="flex items-center gap-1.5 text-xs">
              <span className={`h-2.5 w-2.5 rounded-xs ${FAMILY_BG[s.family]}`} />
              <span className="text-foreground">{s.code}</span>
              <span className="text-muted-foreground">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
