import { METHOD_BG_CLASS } from "@/lib/method-colors";
import type { AnalyticsPeriod, TopApi } from "@/lib/mock-analytics-data";

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  "6m": "Last 6 months",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};

export function AnalyticsTopApisChart({
  data,
  period,
}: {
  data: TopApi[];
  period: AnalyticsPeriod;
}) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">Top 5 APIs</h3>
        <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((row) => (
          <div key={row.endpoint + row.method} className="flex items-center gap-3">
            <span className="w-[200px] shrink-0 truncate text-xs text-foreground">{row.endpoint}</span>
            <span className="w-10 shrink-0 text-xs text-muted-foreground">{row.count}</span>
            <span className="w-14 shrink-0 text-xs text-muted-foreground">{row.method}</span>
            <div className="flex h-7 flex-1 items-center">
              <div
                className={`h-7 rounded-xs ${METHOD_BG_CLASS[row.method]}`}
                style={{ width: `${(row.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
