"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
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
  "6m": "Total for the last 6 months",
  "30d": "Total for the last 30 days",
  "7d": "Total for the last 7 days",
};

const METHOD_ORDER: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const config: ChartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--info-chart))",
  },
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
      <div className="flex flex-col gap-1.5 px-6 pt-6">
        <h3 className="text-base font-semibold text-foreground">Request volume trend</h3>
        <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
      </div>
      <div className="px-6 pb-6 pt-6">
        <ChartContainer config={config} className="h-[200px] w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
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
              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                content={(props) => <RequestVolumeTooltip {...props} />}
              />
              <Area
                dataKey="total"
                type="monotone"
                stroke="hsl(var(--info-chart))"
                fill="url(#fillTotal)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

function RequestVolumeTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as CallVolumePoint;

  return (
    <div className="min-w-[180px] rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="mb-2 flex items-center justify-between gap-4 border-b border-border pb-1.5">
        <span className="font-medium text-popover-foreground">{label}</span>
        <span className="font-semibold text-popover-foreground">{point.total.toLocaleString()}</span>
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
      </ul>
    </div>
  );
}
