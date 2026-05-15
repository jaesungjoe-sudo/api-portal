"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Period = "3m" | "30d" | "7d";

const PERIOD_TABS: { value: Period; label: string }[] = [
  { value: "3m", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
];

const DATA_3M = [
  { date: "Apr 2", v: 120 },
  { date: "Apr 8", v: 145 },
  { date: "Apr 14", v: 175 },
  { date: "Apr 21", v: 160 },
  { date: "Apr 28", v: 185 },
  { date: "May 5", v: 220 },
  { date: "May 12", v: 240 },
  { date: "May 19", v: 215 },
  { date: "May 25", v: 198 },
  { date: "Jun 2", v: 230 },
  { date: "Jun 8", v: 245 },
  { date: "Jun 15", v: 265 },
  { date: "Jun 22", v: 250 },
  { date: "Jun 30", v: 278 },
];

const DATA_30D = [
  { date: "Jun 1", v: 38 },
  { date: "Jun 8", v: 46 },
  { date: "Jun 15", v: 58 },
  { date: "Jun 22", v: 64 },
  { date: "Jun 30", v: 71 },
];

const DATA_7D = [
  { date: "Mon", v: 7 },
  { date: "Tue", v: 9 },
  { date: "Wed", v: 11 },
  { date: "Thu", v: 8 },
  { date: "Fri", v: 13 },
  { date: "Sat", v: 5 },
  { date: "Sun", v: 4 },
];

const PERIOD_LABEL: Record<Period, string> = {
  "3m": "Total for the last 3 months",
  "30d": "Total for the last 30 days",
  "7d": "Total for the last 7 days",
};

const config: ChartConfig = {
  v: { label: "Activity", color: "hsl(var(--info-chart))" },
};

export function HomeMetricsChart() {
  const [period, setPeriod] = useState<Period>("3m");
  const data = period === "3m" ? DATA_3M : period === "30d" ? DATA_30D : DATA_7D;

  return (
    <div className="mt-12 w-full rounded-xl border border-border bg-card p-6 text-left shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Total Activity</h3>
          <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
        </div>
        <ToggleGroup
          variant="pill"
          size="sm"
          value={period}
          onValueChange={(next) => {
            if (next) setPeriod(next as Period);
          }}
        >
          {PERIOD_TABS.map((t) => (
            <ToggleGroupItem key={t.value} value={t.value}>
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="mt-6">
        <ChartContainer config={config} className="h-[240px] w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--info-chart))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--info-chart))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="v"
                type="monotone"
                stroke="hsl(var(--info-chart))"
                fill="url(#fillActivity)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
