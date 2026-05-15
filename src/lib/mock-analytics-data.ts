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
  total: number;
  get: number;
  post: number;
  put: number;
  patch: number;
  delete: number;
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
      label: "Total Requests",
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
    { month: "Jan", total: 180, get: 63, post: 45, patch: 36, delete: 27, put: 9 },
    { month: "Feb", total: 220, get: 77, post: 55, patch: 44, delete: 33, put: 11 },
    { month: "Mar", total: 265, get: 93, post: 66, patch: 53, delete: 40, put: 13 },
    { month: "Apr", total: 310, get: 109, post: 78, patch: 62, delete: 47, put: 14 },
    { month: "May", total: 370, get: 130, post: 92, patch: 74, delete: 56, put: 18 },
    { month: "Jun", total: 435, get: 152, post: 109, patch: 87, delete: 65, put: 22 },
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
      label: "Total Requests",
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
    { month: "Week 1", total: 56, post: 19, get: 16, put: 10, patch: 7, delete: 4 },
    { month: "Week 2", total: 68, post: 23, get: 19, put: 12, patch: 8, delete: 6 },
    { month: "Week 3", total: 88, post: 30, get: 25, put: 16, patch: 11, delete: 6 },
    { month: "Week 4", total: 100, post: 34, get: 28, put: 18, patch: 12, delete: 8 },
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
      label: "Total Requests",
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
    { month: "Mon", total: 10, put: 4, get: 3, patch: 2, post: 1, delete: 0 },
    { month: "Tue", total: 13, put: 5, get: 4, patch: 2, post: 1, delete: 1 },
    { month: "Wed", total: 16, put: 6, get: 4, patch: 3, post: 2, delete: 1 },
    { month: "Thu", total: 12, put: 4, get: 3, patch: 2, post: 2, delete: 1 },
    { month: "Fri", total: 19, put: 7, get: 5, patch: 3, post: 3, delete: 1 },
    { month: "Sat", total: 7, put: 3, get: 2, patch: 1, post: 1, delete: 0 },
    { month: "Sun", total: 6, put: 2, get: 2, patch: 1, post: 1, delete: 0 },
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
