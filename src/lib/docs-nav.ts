// Documentation 사이드바 네비 데이터 — Figma 597:9198 기준.
// Phase1: Inbound Calls 단일 페이지 완전 구현. 그 외는 빈 페이지로 노출.

export type DocsNavLeaf = { label: string; href: string };
export type DocsNavGroup = { label: string; items: DocsNavLeaf[] };
export type DocsNavItem = DocsNavLeaf | DocsNavGroup;

export const DOCS_NAV: DocsNavItem[] = [
  { label: "Getting Started", href: "/documentation" },
  { label: "Best Practices", href: "/documentation/best-practices" },
  {
    label: "Overview",
    items: [
      // Teams 만 구현됨. 나머지는 Figma 정합용 pre-wire (페이지 추가 시 라우트 생성).
      { label: "Teams", href: "/documentation/teams" },
      { label: "Team Members", href: "/documentation/team-members" },
      { label: "Team Settings", href: "/documentation/team-settings" },
      { label: "Users", href: "/documentation/users" },
    ],
  },
];

export function isDocsNavGroup(item: DocsNavItem): item is DocsNavGroup {
  return "items" in item;
}
