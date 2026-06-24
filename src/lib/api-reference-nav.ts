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

export type ApiRefLink = {
  label: string;
  href: string;
};

/** Top-level leaf links rendered above the resource groups. */
export const API_REFERENCE_LINKS: ApiRefLink[] = [
  { label: "Introduction", href: "/api-reference/introduction" },
];

/**
 * Resource groups — Figma `API Reference/Introduction` (node 2259:28074) 정합.
 * 신규 엔드포인트 페이지는 아직 미구현 — href 는 slug 로 pre-wire (페이지 추가 시 라우트만 생성).
 */
export const API_REFERENCE_NAV: ApiRefGroup[] = [
  {
    label: "Auth",
    items: [
      { label: "Create access token", href: "/api-reference/create-access-token", method: "POST" },
    ],
  },
  {
    label: "Teams",
    items: [
      { label: "List teams", href: "/api-reference/list-teams", method: "GET" },
      { label: "Show team", href: "/api-reference/show-team", method: "GET" },
      { label: "Create team", href: "/api-reference/create-team", method: "POST" },
      { label: "Update team", href: "/api-reference/update-team", method: "PATCH" },
      { label: "Delete team", href: "/api-reference/delete-team", method: "DELETE" },
    ],
  },
  {
    label: "Team Members",
    items: [
      { label: "List team members", href: "/api-reference/list-team-members", method: "GET" },
      { label: "Add team member", href: "/api-reference/add-team-member", method: "POST" },
      { label: "Remove team member", href: "/api-reference/remove-team-member", method: "DELETE" },
    ],
  },
  {
    label: "Team Settings",
    items: [
      { label: "Show contact list", href: "/api-reference/show-contact-list", method: "GET" },
      { label: "Update contact list", href: "/api-reference/update-contact-list", method: "PATCH" },
      { label: "Show agent assist", href: "/api-reference/show-agent-assist", method: "GET" },
      { label: "Update agent assist", href: "/api-reference/update-agent-assist", method: "PATCH" },
      { label: "Show agent deflection", href: "/api-reference/show-agent-deflection", method: "GET" },
      { label: "Update agent deflection", href: "/api-reference/update-agent-deflection", method: "PATCH" },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "List users", href: "/api-reference/list-users", method: "GET" },
      { label: "Show user", href: "/api-reference/show-user", method: "GET" },
      { label: "Create user", href: "/api-reference/create-user", method: "POST" },
      { label: "Update user", href: "/api-reference/update-user", method: "PATCH" },
      { label: "Delete user", href: "/api-reference/delete-user", method: "DELETE" },
      { label: "Resend invite", href: "/api-reference/resend-invite", method: "POST" },
      { label: "Show user roles", href: "/api-reference/show-user-roles", method: "GET" },
    ],
  },
];

/** Sidebar method 태그 약어 — Figma 정합 (DELETE→DEL, 그 외 동일). */
export const METHOD_ABBR: Record<HttpMethod, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DEL",
};
