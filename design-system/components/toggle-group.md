# ToggleGroup

A primitive for a single-select segmented control. Wraps Base UI `@base-ui/react/toggle-group` + `@base-ui/react/toggle`.

## Import

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
```

## Variants

| variant | Shape | Usage |
|---|---|---|
| `outlined` | border-joined segmented (`first:rounded-l-md` / `last:rounded-r-md` / `-ml-px`) | Analytics page period tabs |
| `pill` | border wrapper + `p-0.5` + each item `rounded-sm` | In-card toggles like Home Metrics |

## Size

| size | Applied to | Value |
|---|---|---|
| `default` | outlined | item h-9 / px-4 / text-sm |
| `sm` | pill | item h-8 / px-3 / text-xs |

(Each variant has a different default height, so size is for secondary adjustment)

## API

```tsx
<ToggleGroup
  variant="outlined"          // or "pill"
  size="default"              // or "sm"
  value={selected}            // single value (string)
  onValueChange={setSelected} // (next: string) => void
>
  <ToggleGroupItem value="a">Option A</ToggleGroupItem>
  <ToggleGroupItem value="b">Option B</ToggleGroupItem>
</ToggleGroup>
```

Internally wraps Base UI's `value: string[]` array as a single value. Multi-select needs a separate wrapper.

## Automatic side effects (Base UI)

- Keyboard arrow / Home / End key navigation
- `data-pressed` + `aria-pressed="true"` on the active item
- Standard handling of the `disabled` attribute
- focus ring (`focus-visible:ring-3 focus-visible:ring-ring/50`)

## Button vs ToggleGroup

| Item | Button | ToggleGroup |
|---|---|---|
| Role | Single action (Save / Cancel) | Option selection (Last 6 months, etc.) |
| Active state | None (runs an action on click) | Keeps `data-pressed` on one item |
| A11y | `<button>` | `<button aria-pressed>` |

## Where used

- `src/components/api-portal/AnalyticsTabs.tsx` — outlined
- `src/components/api-portal/HomeMetricsChart.tsx` — pill, sm
