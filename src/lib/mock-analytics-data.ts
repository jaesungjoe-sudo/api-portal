export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AnalyticsPeriod = "6m" | "30d" | "7d";

export type SummaryCard =
  | {
      kind: "with-trend";
      label: string;
      value: string;
      chip: string;
      trend: string;
    }
  | {
      kind: "label-only";
      label: string;
      value: string;
      trend: string;
    };

export type CallVolumePoint = {
  month: string;
  read: number;
  write: number;
};

export type TopApi = {
  endpoint: string;
  count: number;
  method: HttpMethod;
};

export type MethodShare = {
  method: HttpMethod;
  percentage: number;
};

export type AnalyticsData = {
  summary: SummaryCard[];
  callVolume: CallVolumePoint[];
  topApis: TopApi[];
  methodDistribution: MethodShare[];
};

const ANALYTICS_6M: AnalyticsData = {
  summary: [
    {
      kind: "with-trend",
      label: "Total calls",
      value: "1,252",
      chip: "+12.5%",
      trend: "+12.4% vs last 6 months",
    },
    {
      kind: "label-only",
      label: "Active APIs",
      value: "14",
      trend: "APIs with traffic",
    },
    {
      kind: "with-trend",
      label: "Active API keys",
      value: "135",
      chip: "+8",
      trend: "+8 new",
    },
    {
      kind: "label-only",
      label: "Unused APIs",
      value: "8",
      trend: "Oldest: 12 days ago",
    },
  ],
  callVolume: [
    { month: "Jan", read: 120, write: 60 },
    { month: "Feb", read: 145, write: 75 },
    { month: "Mar", read: 175, write: 90 },
    { month: "Apr", read: 200, write: 110 },
    { month: "May", read: 240, write: 130 },
    { month: "Jun", read: 280, write: 155 },
  ],
  topApis: [
    { endpoint: "/users/{id}/profile", count: 142, method: "GET" },
    { endpoint: "/orders/{id}/items", count: 98, method: "POST" },
    { endpoint: "/organizations/{orgId}/members", count: 92, method: "PATCH" },
    { endpoint: "/projects/{id}/settings", count: 75, method: "GET" },
    { endpoint: "/workspaces/{id}/invitations", count: 42, method: "DELETE" },
  ],
  methodDistribution: [
    { method: "GET", percentage: 35 },
    { method: "POST", percentage: 25 },
    { method: "PATCH", percentage: 20 },
    { method: "DELETE", percentage: 15 },
    { method: "PUT", percentage: 5 },
  ],
};

const ANALYTICS_30D: AnalyticsData = {
  summary: [
    {
      kind: "with-trend",
      label: "Total calls",
      value: "312",
      chip: "+5.8%",
      trend: "+5.8% vs previous 30 days",
    },
    {
      kind: "label-only",
      label: "Active APIs",
      value: "11",
      trend: "APIs with traffic",
    },
    {
      kind: "with-trend",
      label: "Active API keys",
      value: "128",
      chip: "+3",
      trend: "+3 new",
    },
    {
      kind: "label-only",
      label: "Unused APIs",
      value: "11",
      trend: "Oldest: 9 days ago",
    },
  ],
  callVolume: [
    { month: "Week 1", read: 38, write: 18 },
    { month: "Week 2", read: 46, write: 22 },
    { month: "Week 3", read: 58, write: 30 },
    { month: "Week 4", read: 64, write: 36 },
  ],
  topApis: [
    { endpoint: "/orders/{id}/items", count: 56, method: "POST" },
    { endpoint: "/users/{id}/profile", count: 48, method: "GET" },
    { endpoint: "/billing/invoices", count: 33, method: "GET" },
    { endpoint: "/auth/sessions", count: 24, method: "PUT" },
    { endpoint: "/workspaces/{id}/invitations", count: 14, method: "DELETE" },
  ],
  methodDistribution: [
    { method: "POST", percentage: 34 },
    { method: "GET", percentage: 28 },
    { method: "PUT", percentage: 18 },
    { method: "PATCH", percentage: 12 },
    { method: "DELETE", percentage: 8 },
  ],
};

const ANALYTICS_7D: AnalyticsData = {
  summary: [
    {
      kind: "with-trend",
      label: "Total calls",
      value: "74",
      chip: "+2.1%",
      trend: "+2.1% vs previous 7 days",
    },
    {
      kind: "label-only",
      label: "Active APIs",
      value: "9",
      trend: "APIs with traffic",
    },
    {
      kind: "with-trend",
      label: "Active API keys",
      value: "126",
      chip: "+1",
      trend: "+1 new",
    },
    {
      kind: "label-only",
      label: "Unused APIs",
      value: "13",
      trend: "Oldest: 5 days ago",
    },
  ],
  callVolume: [
    { month: "Mon", read: 7, write: 3 },
    { month: "Tue", read: 9, write: 4 },
    { month: "Wed", read: 11, write: 5 },
    { month: "Thu", read: 8, write: 4 },
    { month: "Fri", read: 13, write: 6 },
    { month: "Sat", read: 5, write: 2 },
    { month: "Sun", read: 4, write: 2 },
  ],
  topApis: [
    { endpoint: "/auth/sessions", count: 18, method: "PUT" },
    { endpoint: "/users/{id}/profile", count: 12, method: "GET" },
    { endpoint: "/notifications/preferences", count: 9, method: "PATCH" },
    { endpoint: "/orders/{id}/items", count: 6, method: "POST" },
    { endpoint: "/files/{id}", count: 4, method: "DELETE" },
  ],
  methodDistribution: [
    { method: "PUT", percentage: 36 },
    { method: "GET", percentage: 28 },
    { method: "PATCH", percentage: 18 },
    { method: "POST", percentage: 12 },
    { method: "DELETE", percentage: 6 },
  ],
};

export function getAnalyticsData(period: AnalyticsPeriod): AnalyticsData {
  if (period === "30d") return ANALYTICS_30D;
  if (period === "7d") return ANALYTICS_7D;
  return ANALYTICS_6M;
}
