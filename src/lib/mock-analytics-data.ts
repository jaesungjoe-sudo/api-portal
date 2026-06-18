export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AnalyticsPeriod = "7d" | "30d" | "6m";

export type SummaryCard = {
  label: string;
  value: string;
  /** Optional info-tooltip text shown next to the label (e.g. Failed Requests). */
  info?: string;
};

export type CallVolumePoint = {
  month: string;
  total: number;
  get: number;
  post: number;
  put: number;
  patch: number;
  delete: number;
  /** Error rate for the point, in percent. Plotted on a secondary axis. */
  errorRate: number;
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

export type StatusFamily = "2xx" | "4xx" | "5xx";

export type StatusCodeShare = {
  code: string;
  percentage: number;
  family: StatusFamily;
};

export type StatusHealth = {
  /** Percent of requests that succeeded (2xx). */
  successRate: number;
  /** Percent of requests that errored (4xx + 5xx). */
  errorRate: number;
  /** Absolute count of errored requests. */
  errorCount: number;
};

export type AnalyticsData = {
  summary: SummaryCard[];
  callVolume: CallVolumePoint[];
  /** Full ranked list — the dashboard shows the top 5, the See-all page shows all. */
  topApis: TopApi[];
  methodDistribution: MethodShare[];
  statusCodes: StatusCodeShare[];
  statusHealth: StatusHealth;
};

const FAILED_REQUESTS_INFO =
  "Requests that returned a 4xx (client) or 5xx (server) error in the selected period.";

// Shared status-code distribution shape (sums to 100; errors = 4.2% to match health).
const STATUS_CODES: StatusCodeShare[] = [
  { code: "200", percentage: 88.5, family: "2xx" },
  { code: "201", percentage: 5.1, family: "2xx" },
  { code: "204", percentage: 2.2, family: "2xx" },
  { code: "429", percentage: 1.4, family: "4xx" },
  { code: "400", percentage: 0.9, family: "4xx" },
  { code: "404", percentage: 0.7, family: "4xx" },
  { code: "401", percentage: 0.4, family: "4xx" },
  { code: "500", percentage: 0.5, family: "5xx" },
  { code: "503", percentage: 0.3, family: "5xx" },
];

const ANALYTICS_6M: AnalyticsData = {
  summary: [
    { label: "Total Requests", value: "1,252" },
    { label: "Active APIs", value: "14" },
    { label: "Active API keys", value: "135" },
    { label: "Failed Requests", value: "53", info: FAILED_REQUESTS_INFO },
  ],
  callVolume: [
    { month: "Jan", total: 180, get: 63, post: 45, patch: 36, delete: 27, put: 9, errorRate: 5.2 },
    { month: "Feb", total: 220, get: 77, post: 55, patch: 44, delete: 33, put: 11, errorRate: 4.8 },
    { month: "Mar", total: 265, get: 93, post: 66, patch: 53, delete: 40, put: 13, errorRate: 4.1 },
    { month: "Apr", total: 310, get: 109, post: 78, patch: 62, delete: 47, put: 14, errorRate: 3.6 },
    { month: "May", total: 370, get: 130, post: 92, patch: 74, delete: 56, put: 18, errorRate: 3.9 },
    { month: "Jun", total: 435, get: 152, post: 109, patch: 87, delete: 65, put: 22, errorRate: 3.2 },
  ],
  topApis: [
    { endpoint: "/users/{id}/profile", count: 142, method: "GET" },
    { endpoint: "/orders/{id}/items", count: 98, method: "POST" },
    { endpoint: "/organizations/{orgId}/members", count: 92, method: "PATCH" },
    { endpoint: "/auth/login", count: 81, method: "POST" },
    { endpoint: "/projects/{id}/settings", count: 75, method: "GET" },
    { endpoint: "/products/{id}", count: 74, method: "GET" },
    { endpoint: "/users/{id}/orders", count: 68, method: "GET" },
    { endpoint: "/payments/process", count: 61, method: "POST" },
    { endpoint: "/notifications/{id}", count: 55, method: "PATCH" },
    { endpoint: "/search/results", count: 49, method: "GET" },
    { endpoint: "/files/{id}/download", count: 44, method: "GET" },
    { endpoint: "/workspaces/{id}/invitations", count: 42, method: "DELETE" },
    { endpoint: "/analytics/events", count: 39, method: "POST" },
    { endpoint: "/teams/{id}/members", count: 35, method: "GET" },
    { endpoint: "/reports/generate", count: 31, method: "POST" },
    { endpoint: "/settings/preferences", count: 27, method: "PUT" },
    { endpoint: "/messages/{id}", count: 23, method: "DELETE" },
    { endpoint: "/categories/list", count: 19, method: "GET" },
    { endpoint: "/subscriptions/{id}", count: 15, method: "PATCH" },
    { endpoint: "/audit/logs", count: 12, method: "GET" },
  ],
  methodDistribution: [
    { method: "GET", percentage: 35 },
    { method: "POST", percentage: 25 },
    { method: "PATCH", percentage: 20 },
    { method: "DELETE", percentage: 15 },
    { method: "PUT", percentage: 5 },
  ],
  statusCodes: STATUS_CODES,
  statusHealth: { successRate: 95.8, errorRate: 4.2, errorCount: 53 },
};

const ANALYTICS_30D: AnalyticsData = {
  summary: [
    { label: "Total Requests", value: "312" },
    { label: "Active APIs", value: "11" },
    { label: "Active API keys", value: "128" },
    { label: "Failed Requests", value: "13", info: FAILED_REQUESTS_INFO },
  ],
  callVolume: [
    { month: "Week 1", total: 56, post: 19, get: 16, put: 10, patch: 7, delete: 4, errorRate: 4.6 },
    { month: "Week 2", total: 68, post: 23, get: 19, put: 12, patch: 8, delete: 6, errorRate: 4.3 },
    { month: "Week 3", total: 88, post: 30, get: 25, put: 16, patch: 11, delete: 6, errorRate: 3.8 },
    { month: "Week 4", total: 100, post: 34, get: 28, put: 18, patch: 12, delete: 8, errorRate: 4.0 },
  ],
  topApis: [
    { endpoint: "/orders/{id}/items", count: 56, method: "POST" },
    { endpoint: "/users/{id}/profile", count: 48, method: "GET" },
    { endpoint: "/auth/login", count: 41, method: "POST" },
    { endpoint: "/billing/invoices", count: 33, method: "GET" },
    { endpoint: "/products/{id}", count: 28, method: "GET" },
    { endpoint: "/auth/sessions", count: 24, method: "PUT" },
    { endpoint: "/notifications/{id}", count: 19, method: "PATCH" },
    { endpoint: "/search/results", count: 16, method: "GET" },
    { endpoint: "/workspaces/{id}/invitations", count: 14, method: "DELETE" },
    { endpoint: "/audit/logs", count: 11, method: "GET" },
  ],
  methodDistribution: [
    { method: "POST", percentage: 34 },
    { method: "GET", percentage: 28 },
    { method: "PUT", percentage: 18 },
    { method: "PATCH", percentage: 12 },
    { method: "DELETE", percentage: 8 },
  ],
  statusCodes: STATUS_CODES,
  statusHealth: { successRate: 95.8, errorRate: 4.2, errorCount: 13 },
};

const ANALYTICS_7D: AnalyticsData = {
  summary: [
    { label: "Total Requests", value: "74" },
    { label: "Active APIs", value: "9" },
    { label: "Active API keys", value: "126" },
    { label: "Failed Requests", value: "3", info: FAILED_REQUESTS_INFO },
  ],
  callVolume: [
    { month: "Mon", total: 10, put: 4, get: 3, patch: 2, post: 1, delete: 0, errorRate: 3.1 },
    { month: "Tue", total: 13, put: 5, get: 4, patch: 2, post: 1, delete: 1, errorRate: 4.4 },
    { month: "Wed", total: 16, put: 6, get: 4, patch: 3, post: 2, delete: 1, errorRate: 5.0 },
    { month: "Thu", total: 12, put: 4, get: 3, patch: 2, post: 2, delete: 1, errorRate: 3.7 },
    { month: "Fri", total: 19, put: 7, get: 5, patch: 3, post: 3, delete: 1, errorRate: 4.2 },
    { month: "Sat", total: 7, put: 3, get: 2, patch: 1, post: 1, delete: 0, errorRate: 2.6 },
    { month: "Sun", total: 6, put: 2, get: 2, patch: 1, post: 1, delete: 0, errorRate: 2.1 },
  ],
  topApis: [
    { endpoint: "/auth/sessions", count: 18, method: "PUT" },
    { endpoint: "/users/{id}/profile", count: 14, method: "GET" },
    { endpoint: "/products/{id}", count: 12, method: "GET" },
    { endpoint: "/notifications/preferences", count: 9, method: "PATCH" },
    { endpoint: "/orders/{id}/items", count: 8, method: "POST" },
    { endpoint: "/search/results", count: 6, method: "GET" },
    { endpoint: "/files/{id}", count: 5, method: "DELETE" },
    { endpoint: "/audit/logs", count: 4, method: "GET" },
    { endpoint: "/reports/generate", count: 3, method: "POST" },
    { endpoint: "/categories/list", count: 2, method: "GET" },
  ],
  methodDistribution: [
    { method: "PUT", percentage: 36 },
    { method: "GET", percentage: 28 },
    { method: "PATCH", percentage: 18 },
    { method: "POST", percentage: 12 },
    { method: "DELETE", percentage: 6 },
  ],
  statusCodes: STATUS_CODES,
  statusHealth: { successRate: 95.8, errorRate: 4.2, errorCount: 3 },
};

export function getAnalyticsData(period: AnalyticsPeriod): AnalyticsData {
  if (period === "30d") return ANALYTICS_30D;
  if (period === "6m") return ANALYTICS_6M;
  return ANALYTICS_7D;
}
