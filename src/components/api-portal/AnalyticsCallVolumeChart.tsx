"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { METHOD_BG_CLASS } from "@/lib/method-colors";
import type {
  AnalyticsPeriod,
  CallVolumePoint,
  HttpMethod,
} from "@/lib/mock-analytics-data";

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "6m": "Last 6 months",
};

const METHOD_ORDER: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const config: ChartConfig = {
  total: { label: "Request volume", color: "hsl(var(--info-chart))" },
  errorRate: { label: "Error rate", color: "hsl(var(--destructive-chart))" },
};

export function AnalyticsCallVolumeChart({
  data,
  period,
}: {
  data: CallVolumePoint[];
  period: AnalyticsPeriod;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 px-6 pt-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold text-foreground">
            Request volume &amp; error rate
          </h3>
          <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-info-chart" />
            Request volume
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-destructive-chart" />
            Error rate
          </span>
        </div>
      </div>
      <div className="px-6 pb-6 pt-6">
        <ChartContainer config={config} className="h-[200px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--info-chart))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--info-chart))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis yAxisId="volume" hide />
              <YAxis
                yAxisId="error"
                orientation="right"
                hide
                domain={[0, (max: number) => Math.max(max * 2, 1)]}
              />
              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                content={(props) => <RequestVolumeTooltip {...props} />}
              />
              <Area
                yAxisId="volume"
                dataKey="total"
                type="monotone"
                stroke="hsl(var(--info-chart))"
                fill="url(#fillTotal)"
                strokeWidth={2}
              />
              <Line
                yAxisId="error"
                dataKey="errorRate"
                type="monotone"
                stroke="hsl(var(--destructive-chart))"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

function RequestVolumeTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as CallVolumePoint;

  return (
    <div className="min-w-[180px] rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-2 flex items-center justify-between gap-4 border-b border-border pb-1.5">
        <span className="font-medium text-popover-foreground">{label}</span>
        <span className="font-semibold text-popover-foreground">
          {point.total.toLocaleString()}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {METHOD_ORDER.map((method) => {
          const value = point[method.toLowerCase() as Lowercase<HttpMethod>];
          return (
            <li key={method} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className={`h-2 w-2 rounded-xs ${METHOD_BG_CLASS[method]}`} />
                {method}
              </span>
              <span className="text-popover-foreground">{value.toLocaleString()}</span>
            </li>
          );
        })}
        <li className="mt-1 flex items-center justify-between gap-3 border-t border-border pt-1.5">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-0.5 w-4 rounded-full bg-destructive-chart" />
            Error rate
          </span>
          <span className="text-popover-foreground">{point.errorRate}%</span>
        </li>
      </ul>
    </div>
  );
}
