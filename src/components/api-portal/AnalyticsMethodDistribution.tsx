"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { METHOD_BG_CLASS } from "@/lib/method-colors";
import type {
  AnalyticsPeriod,
  HttpMethod,
  MethodShare,
} from "@/lib/mock-analytics-data";

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  "6m": "Last 6 months",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};

const METHOD_HSL: Record<HttpMethod, string> = {
  GET: "hsl(var(--success-chart))",
  POST: "hsl(var(--info-chart))",
  PATCH: "hsl(var(--highlight-chart))",
  PUT: "hsl(var(--warning-chart))",
  DELETE: "hsl(var(--destructive-chart))",
};

const config: ChartConfig = {
  percentage: { label: "Share" },
};

export function AnalyticsMethodDistribution({
  data,
  period,
}: {
  data: MethodShare[];
  period: AnalyticsPeriod;
}) {
  return (
    <div className="flex w-[420px] shrink-0 flex-col gap-6 rounded-xl border border-border bg-card px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">Method distribution</h3>
        <p className="text-sm text-muted-foreground">{PERIOD_LABEL[period]}</p>
      </div>
      <div className="flex items-center gap-6">
        <ChartContainer config={config} className="h-[192px] w-[192px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="method"
                innerRadius={0}
                outerRadius={96}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.method} fill={METHOD_HSL[entry.method]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-1 flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.method} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className={`h-2 w-2 rounded-xs ${METHOD_BG_CLASS[entry.method]}`} />
                {entry.method}
              </span>
              <span className="text-foreground">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
