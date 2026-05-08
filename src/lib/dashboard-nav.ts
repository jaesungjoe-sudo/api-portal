// Dashboard 사이드바 네비 데이터.
// 구조는 Documentation 사이드바와 동일 (leaf / group with Level 2)
// 현재는 모두 Level 1 leaf — 향후 그룹 추가 시 동일 타입 패턴으로 확장 가능.

export type SidebarNavLeaf = { label: string; href: string };
export type SidebarNavGroup = { label: string; items: SidebarNavLeaf[] };
export type SidebarNavItem = SidebarNavLeaf | SidebarNavGroup;

export const DASHBOARD_NAV: SidebarNavItem[] = [
  { label: "Analytics", href: "/analytics" },
  { label: "User & Team management", href: "/users" },
  { label: "API Keys", href: "/api-keys" },
  { label: "Webhooks", href: "/webhooks" },
];

export function isSidebarNavGroup(item: SidebarNavItem): item is SidebarNavGroup {
  return "items" in item;
}
