"use client";

import { useState } from "react";
import { AnalyticsTabs } from "@/components/api-portal/AnalyticsTabs";
import { AnalyticsSummaryCard } from "@/components/api-portal/AnalyticsSummaryCard";
import { AnalyticsCallVolumeChart } from "@/components/api-portal/AnalyticsCallVolumeChart";
import { AnalyticsTopApisChart } from "@/components/api-portal/AnalyticsTopApisChart";
import { AnalyticsMethodDistribution } from "@/components/api-portal/AnalyticsMethodDistribution";
import { AnalyticsStatusCodeDistribution } from "@/components/api-portal/AnalyticsStatusCodeDistribution";
import { getAnalyticsData, type AnalyticsPeriod } from "@/lib/mock-analytics-data";

export function AnalyticsView({
  topApisVariant = "preview",
}: {
  topApisVariant?: "preview" | "full";
}) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("7d");
  const data = getAnalyticsData(period);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
          <p className="text-base text-muted-foreground">
            All API traffic overview · Operator view
          </p>
        </div>
        <AnalyticsTabs value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.summary.map((card) => (
          <AnalyticsSummaryCard key={card.label} card={card} />
        ))}
      </div>

      <AnalyticsCallVolumeChart data={data.callVolume} period={period} />

      <AnalyticsTopApisChart data={data.topApis} period={period} variant={topApisVariant} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AnalyticsMethodDistribution data={data.methodDistribution} period={period} />
        <AnalyticsStatusCodeDistribution
          data={data.statusCodes}
          health={data.statusHealth}
          period={period}
        />
      </div>
    </>
  );
}
