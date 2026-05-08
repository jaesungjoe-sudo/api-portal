// Documentation 사이드바 네비 데이터 — Figma 597:9198 기준.
// Phase1: Inbound Calls 단일 페이지 완전 구현. 그 외는 빈 페이지로 노출.

export type DocsNavLeaf = { label: string; href: string };
export type DocsNavGroup = { label: string; items: DocsNavLeaf[] };
export type DocsNavItem = DocsNavLeaf | DocsNavGroup;

export const DOCS_NAV: DocsNavItem[] = [
  { label: "Quick Start", href: "/documentation" },
  { label: "Tutorials", href: "/documentation/tutorials" },
  {
    label: "Calls",
    items: [
      { label: "Inbound Calls", href: "/documentation/inbound-calls" },
      { label: "Outbound Calls", href: "/documentation/outbound-calls" },
      { label: "Call Recording", href: "/documentation/call-recording" },
    ],
  },
  {
    label: "Queues",
    items: [
      { label: "Queue Configuration", href: "/documentation/queues" },
      { label: "IVR Menu Setup", href: "/documentation/ivr-menu" },
    ],
  },
  {
    label: "Agents",
    items: [
      { label: "Managing Agent Status", href: "/documentation/agents" },
      { label: "Bulk User Management", href: "/documentation/bulk-users" },
    ],
  },
  { label: "Chat", href: "/documentation/chat" },
  { label: "SMS", href: "/documentation/sms" },
];

export function isDocsNavGroup(item: DocsNavItem): item is DocsNavGroup {
  return "items" in item;
}
