# Alert (warning block)

> If the shadcn `Alert` component is unavailable, implement with the pattern below.
> The Figma library uses a single Alert component with `Type=warning / info / success / destructive` variants.

## Default warning Alert pattern

```tsx
import { TriangleAlert } from "lucide-react"

<div className="flex items-center gap-3 rounded-md border border-border bg-warning-subtle px-4 py-3 text-sm font-medium text-warning">
  <TriangleAlert className="h-4 w-4 shrink-0" />
  <span>{message}</span>
</div>
```

## Core spec (based on Figma 1175:24309)

| Item | Value | Class |
|---|---|---|
| Layout | HORIZONTAL | `flex items-center` |
| gap (icon ↔ text) | 12px | `gap-3` |
| padding | 16px / 12px | `px-4 py-3` |
| Background | warning-subtle | `bg-warning-subtle` |
| Text/icon color | warning | `text-warning` |
| Border | border-border 1px | `border border-border` |
| radius | 6px | `rounded-md` |
| Icon size | 16×16 | `h-4 w-4 shrink-0` |

## Tokens per variant

| Type | Background | Text/icon | Icon |
|---|---|---|---|
| warning | `bg-warning-subtle` | `text-warning` | `TriangleAlert` |
| info | `bg-info-subtle` | `text-info` | `Info` |
| success | `bg-success-subtle` | `text-success` | `CheckCircle` |
| destructive | `bg-destructive/10` | `text-destructive` | `AlertCircle` |

## How to identify in Figma

- `mainComponent` name: "alert", "Alert"
- `componentProperties.Type.value`: `warning` / `info` / `success` / `destructive`
- **Always read children down to depth=3** — the icon (`lucide/triangle-alert`, etc.) lives in children as an instance. Looking only at `componentProperties` misses the icon.

## Notes

- Don't implement as a plain background block without an icon. Figma designs always have a border + icon.
- Don't hardcode color tokens (`bg-yellow-50`, `text-yellow-800`, etc.). Always use the `warning-subtle` / `warning` tokens.
- Exclude `visible=false` children under `Type=destructive` (e.g. a title + description combination) from the implementation.
