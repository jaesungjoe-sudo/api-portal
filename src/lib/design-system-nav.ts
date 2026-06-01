// Design System catalog sidebar navigation data.
// MVP: Overview + Tokens + Button + Form Dialog + States (5 routes).
// Additional items are added as their pages are filled in.

export type DesignSystemNavLeaf = {
  label: string;
  href: string;
  /** Optional GitHub cross-reference to the underlying .md spec. */
  doc?: string;
};

export type DesignSystemNavGroup = {
  label: string;
  items: DesignSystemNavLeaf[];
};

export type DesignSystemNavItem = DesignSystemNavLeaf | DesignSystemNavGroup;

export const DESIGN_SYSTEM_NAV: DesignSystemNavItem[] = [
  { label: "Overview", href: "/design-system" },
  {
    label: "Foundations",
    items: [
      {
        label: "Tokens",
        href: "/design-system/foundations/tokens",
        doc: "design-system/tokens/colors.json",
      },
    ],
  },
  {
    label: "Primitives",
    items: [
      {
        label: "Button",
        href: "/design-system/primitives/button",
        doc: "design-system/components/button.md",
      },
    ],
  },
  {
    label: "Patterns",
    items: [
      {
        label: "Form Dialog",
        href: "/design-system/patterns/form-dialog",
        doc: "design-system/patterns/form-dialog.md",
      },
      {
        label: "Confirm Dialog",
        href: "/design-system/patterns/confirm-dialog",
        doc: "design-system/patterns/confirm-dialog.md",
      },
      {
        label: "Table List Page",
        href: "/design-system/patterns/table-list-page",
        doc: "design-system/patterns/table-list-page.md",
      },
      {
        label: "Docs Page Shell",
        href: "/design-system/patterns/docs-page-shell",
        doc: "design-system/patterns/docs-page-shell.md",
      },
      {
        label: "Clickable Card with Menu",
        href: "/design-system/patterns/clickable-card-with-menu",
        doc: "design-system/patterns/clickable-card-with-menu.md",
      },
    ],
  },
  {
    label: "Rules",
    items: [
      {
        label: "States",
        href: "/design-system/rules/states",
        doc: "design-system/rules/states.md",
      },
      {
        label: "Responsive",
        href: "/design-system/rules/responsive",
        doc: "design-system/rules/responsive.md",
      },
      {
        label: "Typography",
        href: "/design-system/rules/typography",
        doc: "design-system/rules/typography.md",
      },
    ],
  },
];

export function isDesignSystemNavGroup(
  item: DesignSystemNavItem
): item is DesignSystemNavGroup {
  return "items" in item;
}

/** Maturity roadmap — mirrors the P1/P2/P3 list in PROGRESS.md. */
export type RoadmapItem = {
  id: string;
  label: string;
  priority: "P1" | "P2" | "P3";
  status: "✅ Done" | "🔵 In progress" | "⏳ Pending";
  note?: string;
};

export const ROADMAP: RoadmapItem[] = [
  { id: "P1-1", label: "patterns/ layer (5 patterns)", priority: "P1", status: "✅ Done", note: "5 / 5 complete — patterns layer fully established" },
  { id: "P1-2", label: "States — Loading / Empty / Error / Disabled", priority: "P1", status: "✅ Done" },
  { id: "P1-3", label: "Responsive / breakpoint guide", priority: "P1", status: "✅ Done" },
  { id: "P2-4", label: "Component doc coverage (24 primitives)", priority: "P2", status: "⏳ Pending", note: "11 / 24 documented" },
  { id: "P2-5", label: "Typography role → class mapping", priority: "P2", status: "✅ Done" },
  { id: "P2-6", label: "a11y / interaction baseline", priority: "P2", status: "⏳ Pending" },
  { id: "P3-7", label: "design-system/README.md index + page template", priority: "P3", status: "⏳ Pending" },
  { id: "P3-8", label: "Token gaps (z-index, motion, focus-ring)", priority: "P3", status: "⏳ Pending" },
  { id: "P3-9", label: "Small inconsistencies (users.md raw RGB, etc.)", priority: "P3", status: "⏳ Pending" },
];
