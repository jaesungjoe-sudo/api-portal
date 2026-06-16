# Search

> A search input: a leading magnifier icon over an Input. Used in list-page toolbars (API Keys, Users, Team detail). **Figma**: the library `Search` component. **Code**: the `SearchInput` component (`src/components/api-portal/SearchInput.tsx`).

## Figma

- Library component **`Search`** (Design Library API file, Input page). **Default-only** variant — no focus/filled states (none exist in the design; principle 12).
- Tokens (variable-bound): background `background`, border `input` (border-input), radius `radius-md` (8), leading icon `lucide/search` + placeholder text `muted-foreground`. Height 32.
- Replaces 36 previously hand-built search frames (now instances of this component).

## Code

Use the `SearchInput` component — it encapsulates the wrapper + icon + Input:

```tsx
import { SearchInput } from "@/components/api-portal/SearchInput";

<SearchInput placeholder="Search API Key" />
<SearchInput placeholder="Search User" wrapperClassName="w-full" />   {/* width override */}
```

- Forwards all Input props (`placeholder`, `value`, `onChange`, …); extra `className` merges onto the Input via `cn()`.
- `wrapperClassName` overrides the default `w-60` wrapper width.

What it wraps (per `patterns/table-list-page.md` §5):

```tsx
<div className="relative w-60">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-8 h-8 text-sm" />
</div>
```

- **Icon**: lucide `Search`, absolute `left-2.5` (10px), `h-4 w-4`, `text-muted-foreground`.
- **Input**: `pl-8` (32px — room for the icon), `h-8` (32), `text-sm`.

## Tokens

| Area | Class / variable |
|---|---|
| Background | `background` (Input default) |
| Border | `input` (border-input) |
| Radius | `rounded-md` / `radius-md` (8) |
| Icon | `text-muted-foreground`, `h-4 w-4` |
| Placeholder | `text-muted-foreground`, `text-sm` |
| Height | `h-8` (32) |

## Rules

- **Placeholder**: `Search {Entity}` in singular — "Search API Key", "Search User", "Search Team". **Never a bare `"Search"`.**
- Icon sits in the Input's left padding (`pl-8` reserves the room); never overlapping the typed text.
- Use the shared `Input` primitive — don't rebuild the field.

## Anti-patterns

| ❌ | Reason |
|---|---|
| Bare `placeholder="Search"` | State the entity (singular) so the scope is clear. |
| Hardcoding the icon offset with arbitrary values (`left-[11px]`) | Use the standard `left-2.5`. |
| Re-inlining the `relative w-60` + icon + Input composition | Use `SearchInput`. Re-inlining reintroduces drift / divergence. |
| An absolutely-positioned icon inside a Figma auto-layout frame | Drifts on reflow — use the in-flow `Search` component instead. (This was the original bug across 36 frames.) |

## Related docs

- `patterns/table-list-page.md` §5 — Toolbar (Search + CTA), the canonical usage.
- `components/input.md` — the underlying Input primitive.
- Figma: `Search` component (Design Library API).
- Catalog: `/design-system/primitives/search`.
