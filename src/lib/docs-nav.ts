// Documentation 사이드바 네비 데이터 — Figma 597:9198 기준.
// Phase1: Inbound Calls 단일 페이지 완전 구현. 그 외는 빈 페이지로 노출.

export type DocsNavLeaf = { label: string; href: string };
export type DocsNavGroup = { label: string; items: DocsNavLeaf[] };
export type DocsNavItem = DocsNavLeaf | DocsNavGroup;

export const DOCS_NAV: DocsNavItem[] = [
  { label: "Getting Started", href: "/documentation" },
  { label: "Best Practices", href: "/documentation/best-practices" },
  { label: "Teams", href: "/documentation/teams" },
];

export function isDocsNavGroup(item: DocsNavItem): item is DocsNavGroup {
  return "items" in item;
}
