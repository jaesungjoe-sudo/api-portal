# Skeleton

> A loading placeholder. Before data arrives, it shows the outline of the incoming content with a pulse animation. All loading placeholders use this primitive instead of raw `animate-pulse bg-muted`.

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

## Anatomy

```tsx
<Skeleton className="h-4 w-32" />
```

- A single `<div>` — `animate-pulse rounded-md bg-muted` + the caller's `className`.
- No variant/size prop. Size and shape are set entirely via `className` (`h-*`/`w-*`/`rounded-*`).

## Design tokens

| Property | Value |
|---|---|
| Background | `bg-muted` |
| radius | `rounded-md` (8px) — override at the call site with `rounded-full` (avatar/badge), etc. |
| Animation | `animate-pulse` |

Figma source: the library `Skeleton` component.

## Tier / artifacts

Skeleton is a **variant-less Tier-2 primitive** (`rules/component-artifacts.md`). In principle a catalog page is unnecessary, but since **loading *compositions* (table/dashboard combinations) are much clearer seen live than read about**, keeping a catalog demo page is a **deliberate exception**. → `/design-system/primitives/skeleton`.

## Usage rules

The single source of truth for policy is **`rules/states.md` §3 (Loading)**. Summary:

1. **Always `<Skeleton />`** — don't create new raw `animate-pulse bg-muted`.
2. Repeating units (row/card) use the **same height, radius, and spacing** as the real content → minimizes layout shift.
3. **Tables**: keep the header and replace only the body with row skeletons ×N.
4. **Sort / page transitions** (data context preserved): don't replace the whole row ❌. If the response is instant, no indicator is needed; if the server is slow, a 2px indeterminate bar above the header.
5. **Cache background revalidation** (SWR-style): no indicator.

## Per-surface recipes

```tsx
// Table row (keep the header)
<TableRow>
  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>  {/* badge */}
</TableRow>

// Dashboard summary card
<div className="rounded-md border border-border bg-card p-4">
  <Skeleton className="h-3.5 w-24" />     {/* label */}
  <Skeleton className="mt-3 h-7 w-20" />  {/* value */}
</div>

// Chart area
<Skeleton className="h-48 w-full rounded-md" />

// Avatar
<Skeleton className="size-10 rounded-full" />
```

## Anti-patterns

- ❌ raw `<div className="animate-pulse bg-muted h-4 w-32" />` — bypasses the primitive.
- ❌ A skeleton sized differently from the content → jumps (layout shift) when loading completes.
- ❌ Full row skeletons on context-preserving refetches like sort/pagination.
- ❌ Showing a skeleton during background revalidation after a cache hit.

## Cross-refs

- Rule: `rules/states.md` §3 (Loading)
- Pattern: `patterns/table-list-page.md` (table page skeleton)
- Catalog: `/design-system/primitives/skeleton`
