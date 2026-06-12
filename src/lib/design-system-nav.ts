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
      {
        label: "Focus Ring",
        href: "/design-system/foundations/focus-ring",
        doc: "design-system/rules/focus-ring.md",
      },
      {
        label: "Motion",
        href: "/design-system/foundations/motion",
        doc: "design-system/rules/motion.md",
      },
      {
        label: "Z-Index",
        href: "/design-system/foundations/z-index",
        doc: "design-system/rules/z-index.md",
      },
    ],
  },
  {
    label: "Primitives",
    items: [
      {
        label: "Breadcrumb",
        href: "/design-system/primitives/breadcrumb",
        doc: "design-system/components/breadcrumb.md",
      },
      {
        label: "Button",
        href: "/design-system/primitives/button",
        doc: "design-system/components/button.md",
      },
      {
        label: "DropdownMenu",
        href: "/design-system/primitives/dropdown-menu",
        doc: "design-system/components/dropdown-menu.md",
      },
      {
        label: "Skeleton",
        href: "/design-system/primitives/skeleton",
        doc: "design-system/components/skeleton.md",
      },
      {
        label: "Sonner (Toast)",
        href: "/design-system/primitives/sonner",
        doc: "design-system/components/sonner.md",
      },
      {
        label: "Tooltip",
        href: "/design-system/primitives/tooltip",
        doc: "design-system/components/tooltip.md",
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
      {
        label: "A11y / Interaction",
        href: "/design-system/rules/a11y",
        doc: "design-system/rules/a11y.md",
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
  { id: "P2-4", label: "Component doc coverage (24 primitives)", priority: "P2", status: "🔵 In progress", note: "15 / 24 documented (priority 4 added: breadcrumb, dropdown-menu, sonner, tooltip)" },
  { id: "P2-5", label: "Typography role → class mapping", priority: "P2", status: "✅ Done" },
  { id: "P2-6", label: "a11y / interaction baseline", priority: "P2", status: "✅ Done" },
  { id: "P3-7", label: "design-system/README.md index + page template", priority: "P3", status: "⏳ Pending" },
  { id: "P3-8", label: "Token gaps (z-index, motion, focus-ring)", priority: "P3", status: "✅ Done", note: "Code tokens + 9 outliers cleaned up + 3 rules + 3 catalog pages. Figma library work split out as a designer handoff." },
  { id: "P3-9", label: "Small inconsistencies (users.md raw RGB, etc.)", priority: "P3", status: "✅ Done" },
];
