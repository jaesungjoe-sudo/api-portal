"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AnalyticsTabs } from "@/components/api-portal/AnalyticsTabs";
import { AnalyticsSummaryCard } from "@/components/api-portal/AnalyticsSummaryCard";
import { AnalyticsCallVolumeChart } from "@/components/api-portal/AnalyticsCallVolumeChart";
import { AnalyticsTopApisChart } from "@/components/api-portal/AnalyticsTopApisChart";
import { AnalyticsMethodDistribution } from "@/components/api-portal/AnalyticsMethodDistribution";
import { getAnalyticsData, type AnalyticsPeriod } from "@/lib/mock-analytics-data";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("6m");
  const data = getAnalyticsData(period);

  return (
    <div className="flex flex-col gap-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
          <p className="text-base text-muted-foreground">
            All API traffic overview · Operator view
          </p>
        </div>
        <AnalyticsTabs value={period} onChange={setPeriod} />
      </div>

      <div className="flex items-stretch gap-4">
        {data.summary.map((card) => (
          <AnalyticsSummaryCard key={card.label} card={card} />
        ))}
      </div>

      <AnalyticsCallVolumeChart data={data.callVolume} period={period} />

      <div className="flex items-stretch gap-5">
        <AnalyticsTopApisChart data={data.topApis} period={period} />
        <AnalyticsMethodDistribution data={data.methodDistribution} period={period} />
      </div>
    </div>
  );
}
