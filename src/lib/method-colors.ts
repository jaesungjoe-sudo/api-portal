import type { HttpMethod } from "@/lib/mock-analytics-data";

export const METHOD_TOKEN: Record<HttpMethod, string> = {
  GET: "success-chart",
  POST: "info-chart",
  PATCH: "highlight-chart",
  PUT: "warning-chart",
  DELETE: "destructive-chart",
};

export const METHOD_BG_CLASS: Record<HttpMethod, string> = {
  GET: "bg-success-chart",
  POST: "bg-info-chart",
  PATCH: "bg-highlight-chart",
  PUT: "bg-warning-chart",
  DELETE: "bg-destructive-chart",
};

export const METHOD_TEXT_CLASS: Record<HttpMethod, string> = {
  GET: "text-success-chart",
  POST: "text-info-chart",
  PATCH: "text-highlight-chart",
  PUT: "text-warning-chart",
  DELETE: "text-destructive-chart",
};