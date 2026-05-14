import type { HttpMethod } from "@/lib/mock-analytics-data";

export type ApiRefEndpoint = {
  label: string;
  href: string;
  method: HttpMethod;
};

export type ApiRefGroup = {
  label: string;
  items: ApiRefEndpoint[];
};

export const API_REFERENCE_NAV: ApiRefGroup[] = [
  {
    label: "Calls",
    items: [
      { label: "Create Call", href: "/api-reference/create-call", method: "POST" },
      { label: "Get Call", href: "/api-reference/get-call", method: "GET" },
      { label: "Update Call", href: "/api-reference/update-call", method: "PATCH" },
    ],
  },
  {
    label: "Queues",
    items: [],
  },
  {
    label: "Agents",
    items: [],
  },
];
