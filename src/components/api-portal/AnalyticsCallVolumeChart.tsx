"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { AnalyticsPeriod, CallVolumePoint } from "@/lib/mock-analytics-data";

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  "6m": "Total for the last 6 months",
  "30d": "Total for the last 30 days",
  "7d": "Total for the last 7 days",
};

const config: ChartConfig = {
  read: {
    label: "Read",
    color: "hsl(var(--success-chart))",
  },
  write: {
    label: "Write",
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
        <h3 className="text-base font-semibold text-foreground">Call volume trend</h3>
        <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
      </div>
      <div className="px-6 pt-6">
        <ChartContainer config={config} className="h-[200px] w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRead" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success-chart))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--success-chart))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillWrite" x1="0" y1="0" x2="0" y2="1">
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
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="write"
                type="monotone"
                stackId="a"
                stroke="hsl(var(--info-chart))"
                fill="url(#fillWrite)"
                strokeWidth={2}
              />
              <Area
                dataKey="read"
                type="monotone"
                stackId="a"
                stroke="hsl(var(--success-chart))"
                fill="url(#fillRead)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="flex items-center gap-4 px-6 pb-6 pt-2">
        <LegendItem swatchClass="bg-success-chart" primary="Read" secondary="GET" />
        <LegendItem swatchClass="bg-info-chart" primary="Write" secondary="POST · PUT · PATCH · DELETE" />
      </div>
    </div>
  );
}

function LegendItem({
  swatchClass,
  primary,
  secondary,
}: {
  swatchClass: string;
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-xs ${swatchClass}`} />
      <span className="font-medium text-foreground">{primary}</span>
      <span className="text-muted-foreground">{secondary}</span>
    </div>
  );
}
