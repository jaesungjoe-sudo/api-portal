# EmptyState

> A self-defined baseline since the library has no dedicated component. This document is the component spec. For lifecycle conditions, see `rules/states.md` §1 — once added to the library, migrate to the library spec.

## Usage context

- The standard representation for every case where a surface body is empty. A plain `<p>No data</p>` text fallback is forbidden.
- For the container's vertical-padding delegation rule, see `rules/states.md` §4.2 (table `py-16`, chart `py-10`, form `py-8`, widget `py-6`).
- Usage surfaces: empty tables, empty card grids, empty charts, in-card widgets, and (when needed) empty forms.

---

## 1. Anatomy

Vertically centered. Top → bottom order:

```
┌──────────────────────────┐
│      (icon)              │  ← per variant (no-data: required / no-results: optional)
│       title              │  ← required, text-base font-medium
│  description (opt, max-w-sm) │  ← optional, text-sm text-muted-foreground
│        [CTA]             │  ← optional, per-variant policy
└──────────────────────────┘
```

- **It has no outer padding** — that's the container's responsibility. (See anti-patterns §6)
- Horizontal alignment: `items-center`; text alignment: `text-center`.

---

## 2. Variants

### 2.1 `no-data` — no data exists yet

- **Icon**: required.
- **Title**: active copy ("No API keys yet", "No teams yet", etc.).
- **Description**: guides the next action (optional but recommended).
- **CTA**: `primary` Button (an active action like create/invite).

> **Icon choice — don't hardcode a recommended list.** Each page's EmptyState icon uses **the Figma design inspection result for that screen** verbatim. For example, the API Keys empty state uses the icon confirmed in Figma (e.g. `Key`), the Users empty state uses the icon confirmed in Figma (e.g. `UserPlus`), etc. — **checking the real design is required**. Don't just drop in a guessed lucide icon. Follow the 4-step workflow in `icons.md` (Figma inspect → lucide import → ask if missing → update the table) exactly.

### 2.2 `no-results` — no search/filter results

- **Icon**: optional. If used, `Search` is recommended.
- **Title**: `No results found` (or equivalent copy).
- **Description**: guides adjusting the search term/filters (e.g. "Try adjusting your filters.").
- **CTA**: omit it or use a `ghost` Button ("Clear filters", etc.). A primary CTA is forbidden (§6 anti-patterns).

---

## 3. Props

```tsx
type EmptyStateProps = {
  variant: "no-data" | "no-results";
  /** Icon node. Required for no-data, optional for no-results. */
  icon?: React.ReactNode;
  /** Required. */
  title: string;
  /** Optional. Wraps at max-w-sm. */
  description?: string;
  /** Optional. Use per the variant policy. */
  action?: {
    label: string;
    onClick: () => void;
    /** no-data → "default" recommended. no-results → "ghost" recommended. Defaults automatically per variant. */
    variant?: "default" | "ghost" | "outline" | "secondary";
  };
};
```

- `icon` is a node (JSX). The component applies tokens like `text-muted-foreground size-10` internally.
- If `action.variant` isn't specified, EmptyState uses a sensible default based on its `variant` (no-data → `default`, no-results → `ghost`).

---

## 4. Tokens

| Area | Class |
|---|---|
| Container | `flex flex-col items-center text-center gap-3` |
| Icon | `text-muted-foreground size-10` (40×40) |
| Title | `text-base font-medium text-foreground` |
| Description | `text-sm text-muted-foreground max-w-sm` |
| CTA | `mt-2` (adds 8px on top of gap-3) |

> **Typography role mapping** (matches `rules/typography.md`):
> - Title `text-base font-medium text-foreground` → role `card-title`
> - Description `text-sm text-muted-foreground` → role `body-sm`
>
> This spec uses the classes for the roles above directly. For semantic lookup, see `rules/typography.md` (Tailwind utilities are used as-is — this project runs typography roles as a documentation convention).

- Color tokens use semantic tokens only. Raw RGB/hex/palette classes are forbidden (CLAUDE.md).
- `gap-3` (12px) — spacing between icon, title, and description. Only the CTA gets an extra `mt-2` step.

---

## 5. Examples

### 5.1 Empty table (no-data) — API Keys

```tsx
import { EmptyState } from "@/components/api-portal/EmptyState";
import { Key } from "lucide-react"; // ← In real pages, use the icon from the Figma inspection result

<TableBody>
  <TableRow>
    <TableCell colSpan={COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<Key />}
        title="No API keys yet"
        description="Create your first key to start integrating with the API."
        action={{ label: "Create API key", onClick: openCreate }}
      />
    </TableCell>
  </TableRow>
</TableBody>
```

### 5.2 No search results (no-results) — Users

```tsx
import { Search } from "lucide-react"; // ← Based on the Figma inspection result

<div className="py-16">
  <EmptyState
    variant="no-results"
    icon={<Search />}
    title="No results found"
    description="Try adjusting your search or filters."
    action={{ label: "Clear filters", onClick: clearFilters, variant: "ghost" }}
  />
</div>
```

### 5.3 In-card widget (small area) — Analytics chart empty data

```tsx
// The widget container keeps it small with py-6
<Card className="p-6">
  <CardHeader>
    <CardTitle>Top APIs</CardTitle>
  </CardHeader>
  <CardContent className="py-6">
    <EmptyState
      variant="no-data"
      icon={<BarChart3 />} // ← Based on the Figma inspection result
      title="No data for this period"
      description="Try a longer time range."
    />
  </CardContent>
</Card>
```

> The icons in the code blocks above (`Key` / `Search` / `BarChart3`) are **examples only**; when implementing real pages, inspect each screen's Figma node and use the resulting icon. See the `icons.md` workflow.

---

## 6. Anti-patterns

| ❌ | Reason |
|---|---|
| Replacing EmptyState with plain text like `<p>No data</p>` | Breaks the per-surface visual hierarchy and CTA policy. Breaks consistency on new screens. |
| Setting padding directly on EmptyState itself (`<EmptyState className="py-16" />`) | Padding is the container's responsibility. Bypasses the per-surface padding table (`rules/states.md` §4.2). |
| Omitting the icon in `no-data` | no-data needs a visual signal that "something belongs here." The icon is that signal. |
| A primary CTA in `no-results` | With no search results, the user is already mid active action (searching). A primary CTA is too heavy in the visual hierarchy. If needed, a `ghost` "Clear filters" is enough. |
| Exposing a raw backend error directly in EmptyState/Alert, like `<AlertDescription>{err.message}</AlertDescription>` | Security/UX. Generalize into the user's language (`rules/states.md` §5.5). |

---

## Related docs

- `rules/states.md` — the main state rules. §1 lifecycle conditions, §4 Empty details, §4.2 container padding delegation.
- `icons.md` — the 4-step icon-selection workflow (Figma inspect → lucide → ask if missing → update the table).
- `components/button.md` — Button variant/size rules for CTAs.
