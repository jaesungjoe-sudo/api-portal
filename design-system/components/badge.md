# Badge

> Matches the Figma library component set (`1603:86622` / Library file `SmO9fsWrxriuCofc7T3b1S` node `665:2024`).

## Import

```tsx
import { Badge } from "@/components/ui/badge"
```

## Variants

Color is determined by the `Badge` primitive's `variant` prop. Don't inject a color className directly.

| `variant` | Background | Text | Usage |
|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | Default solid (matches Type=primary) |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | Type=secondary, Property=default |
| `destructive` | `bg-destructive-subtle` | `text-destructive` | Revoked / danger-state label (Type=secondary, Property=destructive) |
| `outline` | none (border) | `text-foreground` | Outline only |
| `success` | `bg-success-subtle` | `text-success` | Healthy states such as Active |
| `warning` | `bg-warning-subtle` | `text-warning` | Caution states such as Verified |
| `info` | `bg-info-subtle` | `text-info` | Info states such as Invited |
| `highlight` | `bg-highlight-subtle` | `text-highlight` | PATCH method, purple emphasis (Figma `Property=highlight`) |
| `muted` | `bg-muted` | `text-muted-foreground` | Inactive states such as Deactivated / Expired |
| `ghost` / `link` | — | — | Special (shadcn leftovers) |

Default shape: `h-5`, `rounded-lg` (10px — Figma library cornerRadius), `px-2 py-0.5`, `text-xs font-medium`.

## 4 wrappers — thin wrappers over the Badge primitive

```
StatusBadge       → User Status (Active/Verified/Invited/Deactivated)
ApiKeyStatusBadge → API Key Status (Active/Expired/Revoked)
MethodBadge       → HTTP Method (GET/POST/PATCH/PUT/DELETE)
CodeBadge         → code/identifier emphasis (destructive variant + font-mono)
```

All call `<Badge variant={...}>`. They don't inject a color className directly.

### State ↔ variant mapping

| Wrapper | Value | variant |
|---|---|---|
| `StatusBadge` | `Active` | `success` |
| 〃 | `Verified` | `warning` |
| 〃 | `Invited` | `info` |
| 〃 | `Deactivated` | `muted` |
| `ApiKeyStatusBadge` | `Active` | `success` |
| 〃 | `Expired` | `muted` |
| 〃 | `Revoked` | `destructive` |
| `MethodBadge` | `GET` | `success` |
| 〃 | `POST` | `info` |
| 〃 | `PATCH` | `highlight` |
| 〃 | `PUT` | `warning` |
| 〃 | `DELETE` | `destructive` |

### Wrapper className overrides

`StatusBadge` / `ApiKeyStatusBadge` use a pill shape per page convention:

```tsx
<Badge variant={STATUS_VARIANT[status]} className="border-0 font-medium rounded-full px-2.5">
  {status}
</Badge>
```

`MethodBadge` / `CodeBadge` keep the Badge primitive's default `rounded-lg`.
`CodeBadge` adds only `font-mono` as a className.

## Count Badge (tab count)

The count shown next to a tab is a separate component — `Type=*_number` variant in the Figma library. The current code uses an inline `<span>`:

```tsx
<span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-xs font-medium min-w-[18px] h-[18px] px-1">
  {count}
</span>
```

(Could later be consolidated into a number-variant branch of `<Badge variant="default" />`.)

## How to identify in Figma

- `mainComponent.parent.name` === `"Badge"` (componentSet id `665:2024`)
- `componentProperties.Type.value` ∈ `primary | secondary | destructive | outline | default_number | destructive_number | secondary_number`
- `componentProperties.Property.value` ∈ `default | success | info | warning | destructive | muted | highlight`

→ Determine the `variant` from the mapping table above.

## Notes

- **Don't inject a color className directly** — use only `variant`. Tailwind palette colors like `bg-green-100` / `bg-blue-100` are forbidden (migrate any found leftover from early Phase1 code).
- When adding a new state: check the Figma instance's `Property` variant → pick the `variant` per the mapping table above → add a new wrapper or extend an existing wrapper's mapping object.
- New wrappers must also go through shadcn `<Badge>`. Don't recreate the raw `<span>` + color className pattern.
- `rounded-lg` matches Figma (cornerRadius=10). Check the design before any arbitrary `rounded-4xl` / `rounded-full` override.
