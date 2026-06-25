# Color token rules

## Color rules

```
❌ Forbidden                   ✅ Correct usage
bg-blue-600                    bg-primary
text-gray-500                  text-muted-foreground
border-gray-200                border-border
bg-white                       bg-background
text-black                     text-foreground
```

### Available color tokens (Neutral)
| Token | Usage |
|------|------|
| `bg-background` | Page background |
| `bg-card` | Card, panel background |
| `bg-primary` | Primary action button |
| `bg-secondary` | Secondary button, tag |
| `bg-muted` | Disabled, sub background |
| `bg-accent` | shadcn dropdown/popover hover, etc. |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text |
| `border-border` | Divider, border |
| `ring-ring` | Focus ring |

### Semantic colors (4-token set × 5 colors)

Each semantic color consists of a **4-token set**. Used in components such as `<Badge variant={...}>` / Alert / Toast.

| Semantic | solid bg / text | foreground | subtle bg | border |
|---|---|---|---|---|
| `destructive` (red) | `bg-destructive` / `text-destructive` | `text-destructive-foreground` | `bg-destructive-subtle` | `border-destructive-border` |
| `success` (green) | `bg-success` / `text-success` | `text-success-foreground` | `bg-success-subtle` | `border-success-border` |
| `warning` (amber) | `bg-warning` / `text-warning` | `text-warning-foreground` | `bg-warning-subtle` | `border-warning-border` |
| `info` (blue) | `bg-info` / `text-info` | `text-info-foreground` | `bg-info-subtle` | `border-info-border` |
| `highlight` (purple) | `bg-highlight` / `text-highlight` | `text-highlight-foreground` | `bg-highlight-subtle` | `border-highlight-border` |

**Usage patterns**:
- Badge: `<Badge variant="success">` etc. — use only the variant prop (do not inject color classNames directly)
- Alert/Callout: subtle background + semantic text (e.g. `bg-info-subtle text-info border-info-border`)
- Solid (`bg-success` etc.): limited use such as emphasis dots and small icon badges

### Chart colors (5 types)

Chart-only (line/bar/pie). Single tokens separate from semantics:

| Token | Mapping |
|------|------|
| `bg-success-chart` / `text-success-chart` | GET / green series |
| `bg-info-chart` / `text-info-chart` | POST / blue series |
| `bg-highlight-chart` / `text-highlight-chart` | (미사용 — PATCH 는 `warning-chart` 로 이동, 2026-06-24) |
| `bg-warning-chart` / `text-warning-chart` | PATCH / PUT / yellow series |
| `bg-destructive-chart` / `text-destructive-chart` | DELETE / red series |

### Brand (UJET brand color)
| Token | Value | Usage |
|------|-----|------|
| `bg-brand` / `text-brand` | `#00A2FF` (same in light/dark) | UJET signature blue |
| `text-brand-foreground` | `neutral/950` | Text on a brand background |

> Brand uses the same hex in light and dark modes (brand consistency policy). subtle/border variants are **not created** — the brand color is used only in limited areas.

#### Brand usage guide

✅ **Do use**
- Logo (UJET wordmark, symbol)
- Landing page headline emphasis
- Marketing banners / promotional areas
- "About UJET" / brand introduction sections

❌ **Don't use — replace with another token**
| Wrong usage | Correct token |
|---|---|
| Generic CTA button | `bg-primary` |
| Informational alert / badge (e.g. "Invited") | `<Badge variant="info">` |
| Sidebar active state | `bg-sidebar-accent` |
| Link text | `text-primary` or `text-foreground underline` |
| Form focus ring | `ring-ring` |

Scattering the brand color across general UI **dilutes its signature meaning**. When in doubt, ask the designer: "Is this really a brand-emphasis area?"

---

## Rules for reading Figma color tokens

**Two token systems coexist in Figma. The library uses Color Styles (legacy), so check `fillStyleId` first.**

| System | Access method | Characteristics |
|---|---|---|
| Color Styles (legacy) | `node.fillStyleId` → `figma.getStyleByIdAsync(id).name` | The method the current library uses |
| Variables (new) | `node.boundVariables?.fills?.[0]?.color` | Supports mode (dark/light) switching |

```js
// ✅ Correct method — Color Styles first, Variables second, RGB fallback
async function getColorToken(node) {
  // 1st priority: Color Styles (the method the library uses)
  const styleId = node.fillStyleId;
  if (styleId && typeof styleId === 'string') {
    const style = await figma.getStyleByIdAsync(styleId);
    if (style) return style.name; // "color/destructive", "Primary/500", etc.
  }

  // 2nd priority: Variables (new system)
  const bound = node.boundVariables?.fills?.[0]?.color;
  if (bound) {
    const variable = await figma.variables.getVariableByIdAsync(bound.id);
    if (variable) return variable.name;
  }

  // 3rd priority: RGB fallback (no token)
  const c = node.fills[0]?.color;
  return c ? `rgb(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)})` : null;
}
```

The same applies to fills, strokes, and text color (`fillStyleId` → `strokeStyleId` → `textStyleId`). A value read only as RGB cannot be mapped to a CSS variable token, so do not use it directly in implementation.
