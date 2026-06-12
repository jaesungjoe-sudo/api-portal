# shadcn / design token usage rules

> Per-component variant·size·usage patterns are in `design-system/components/<component>.md`.
> This file holds only the design token rules that apply commonly across all of shadcn.

## Per-component detailed rules

- Button: `design-system/components/button.md`
- Badge: `design-system/components/badge.md`
- Dialog: `design-system/components/dialog.md`
- Alert: `design-system/components/alert.md`
- Table: `design-system/components/table.md`
- Input / Label: `design-system/components/input.md`
- Select: `design-system/components/select.md`
- Popover (includes Menulist spec): `design-system/components/popover.md`
- Pagination: `design-system/components/pagination.md`
- ToggleGroup: `design-system/components/toggle-group.md`

---

## Base UI conversion conventions

This project's `src/components/ui/*.tsx` are **all `@base-ui/react` wrappings**. Zero Radix dependency. New primitives follow the same rule.

### Principles

1. **Don't adopt the official shadcn registry (`npx shadcn add <component>`) directly** — it pulls in a Radix dependency (`@radix-ui/react-*`) and splits the dependency family.
2. **shadcn.com code is for reference**: borrow only the variant structure / cva pattern / className mapping. Always rewrite imports and primitive calls to `@base-ui/react/<subpath>`.
3. **Don't depend on two libraries in the same component family at once** — Base UI is the single truth.

### Conversion checklist

| Radix (shadcn original) | Base UI (this project) |
|---|---|
| `import * as X from "@radix-ui/react-x"` | `import { X } from "@base-ui/react/x"` |
| `<X.Content>` | `<X.Popup>` (some components like Dialog/Popover/Menu) |
| `data-state="open"` | `data-open` |
| `data-state="closed"` | (attribute absent) |
| `data-state="checked"` | `data-checked` |
| `data-state="on"` (Toggle) | `data-pressed` |
| Tailwind `data-[state=open]:bg-foo` | `data-[open]:bg-foo` |
| direct `forwardRef` wrapping | `React.RefAttributes<...>` (Base UI handles it itself) |

### Data attribute pattern difference (the biggest substantive change)

- **Radix**: an enum value on one attribute (`data-state="open" | "closed" | "checked" | ...`)
- **Base UI**: **separate bool attributes** (`data-open`, `data-pressed`, `data-checked`, `data-disabled`)
- Base UI is much cleaner for Tailwind variant mapping. When multiple states are caught at once (open + disabled etc.), selector combination is natural.

### Controlled API differences (vary per component)

Some components have different prop signatures. If there's a single vs array difference, **absorb it in the wrapper**.

**Example: ToggleGroup** — Base UI is `value: string[]` / `onValueChange: (v: string[]) => void` (multi-select friendly). The single-select wrapper converts array ↔ single:

```tsx
<BaseToggleGroup
  value={value !== undefined ? [value] : undefined}
  onValueChange={(next) => onValueChange?.(next[0] ?? "")}
  multiple={false}
  ...
/>
```

Detailed case: `src/components/ui/toggle-group.tsx`.

### Workflow for adding a new primitive

1. Open the component page on shadcn.com and capture the cva variant / className pattern
2. Check whether `node_modules/@base-ui/react/<component>` has that primitive (grasp the prop signature from the `.d.ts` interface)
3. Write the shadcn-style file structure (`src/components/ui/<component>.tsx`). Swap only the imports to `@base-ui/react/*`, and convert the data attr selectors per the table above
4. If there's a controlled API difference, absorb it in the wrapper
5. Separate per-variant use cases into `design-system/components/<component>.md`
6. Add the component name / where used to the "shadcn primitives" section of CLAUDE.md

### Anti-pattern

- Adding a `@radix-ui/react-*` import — splits the dependency family
- Using `data-state` selectors — not caught in Base UI
- A component Base UI doesn't provide (especially beyond Form) → review and decide with the user. Writing your own is usually the answer.

---

## Border Radius rules

Based on Figma tw/border-radius:

| Class | Value | Usage |
|--------|-----|------|
| `rounded-none` | 0px | Sharp corners |
| `rounded-xs` | 2px | — |
| `rounded-sm` | 6px | Sidebar menu, input |
| `rounded-md` | 8px | Card, panel, button |
| `rounded-lg` | 10px | Modal, dropdown, **badge** |
| `rounded-xl` | 14px | Large card (TeamCard) |
| `rounded-2xl` | 18px | Section |
| `rounded-3xl` | 22px | — |
| `rounded-4xl` | 26px | — |
| `rounded-full` | 9999px | Avatar, chip (number badge / StatusBadge pill override) |

> Truth is the Figma library `radius-*` Variables. Auto-reflected via `misc.json` → `npm run sync-tokens`. Check the standard token before using an arbitrary value (`rounded-[Npx]`).

---

## Font rules

```
Body:    font-sans     (Inter)
Code:    font-mono     (Geist Mono / JetBrains Mono)
```

```
❌ Forbidden              ✅ Correct usage
text-[14px]               text-sm
font-[600]                font-semibold
leading-[1.5]             leading-6
```

---

## Shadow rules

> Unlike Figma Variables, Effect Styles can't be auto-extracted. Apply manually using the rules below.

| Component | shadow class | Reason |
|---|---|---|
| Button (default, secondary, outline, destructive) | `shadow-xs` | Depth for interactive controls |
| Button (ghost, link) | none | Flat style that blends into the background |
| Input, SelectTrigger | `shadow-xs` | Depth for form fields |
| Dialog, Modal | `shadow-xl` | Topmost layer |
| Dropdown, SelectContent, Popover | `shadow-md` | Mid-layer popover |
| Tooltip | `shadow-md` | Popover |
| Sheet (Drawer) | `shadow-xl` | Side panel |
| Card | `shadow-sm` | Content card |

```
❌ Forbidden              ✅ Correct usage
shadow-[0_1px_2px_...]    shadow-xs
writing box-shadow directly   use shadow-* utilities
shadow-xs on a ghost button   ghost/link have no shadow
```

---

## Spacing rules (8px grid)

```
❌ Forbidden              ✅ Correct usage
p-[13px]                  p-3 (12px)
mt-[22px]                 mt-6 (24px)
gap-[7px]                 gap-2 (8px)
```

Use the Tailwind default spacing scale:
`0, 0.5(2px), 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px), 12(48px)`

---

## Custom component location

Import components not in shadcn from `/src/components/api-portal/`. Component decisions — which variant was added/modified and why, what pattern it's used in — are tracked in the following locations:

- **`design-system/patterns/*.md`** — composition patterns (form-dialog / confirm-dialog / table-list-page / docs-page-shell / clickable-card-with-menu). *How* components combine to work + the decision background.
- **`design-system/components/*.md`** — individual component specs. variant·size·props definitions + Figma alignment decisions.
- **git commit history** — primitive changes (e.g. commit 0aad508 that changed `DialogContent.showCloseButton` default from `true` → `false`) record the decision background in the commit message.

---

## Principle of not adding styles (don't add color·emphasis without Figma verification)

**Don't add color·weight·background by UX convention (destructive action is red, success is green, etc.). Apply only after confirming that node's actual token in Figma.**

### Why this is needed

If you tack on styles by convention — "it's Delete so text-destructive", "it's Error so bold" — unnecessary emphasis creeps in even when the designer intentionally chose a *neutral style*. This case:

- The "Delete API Key" text color of the Figma Row Action dropdown = `popover-foreground` (normal text)
- During implementation, the "destructive action = red" convention added `text-destructive` → mismatch with Figma

### Checklist

Before applying **color/weight/emphasis** to a text node·icon·background:

1. **Check that node's `fills` / `strokes` in Figma**
   - Read the token name (`popover-foreground`, `destructive`, `muted-foreground`, etc.) directly
2. **Only when the token is a semantic token** like `destructive`/`warning`/`success`, apply the corresponding Tailwind class
3. **If it's a base token (`foreground`, `popover-foreground`, etc.), don't add any color** — inherit by default

### Decision matrix

| Figma text token | Tailwind | When to use |
|---|---|---|
| `foreground` / `popover-foreground` | (don't specify — inherit) | Normal text |
| `muted-foreground` | `text-muted-foreground` | Secondary text |
| `destructive` | `text-destructive` | When Figma explicitly specifies a destructive color |
| `success` | `text-success` | When Figma explicitly specifies a success color |

**"Red because it's Delete / Remove" must not be applied without Figma verification.**

### Verification script example

```js
// Check the text node's actual fill token
const fill = textNode.fills?.[0];
const varId = fill?.boundVariables?.color?.id;
const variable = varId ? await figma.variables.getVariableByIdAsync(varId) : null;
console.log(textNode.characters, '→', variable?.name); // e.g. "Delete API Key" → "popover-foreground"
```

---

## Principle of editing shadcn defaults (Figma truth)

When a shadcn default style differs from the Figma spec, **edit the `src/components/ui/` file directly**.
Don't work around it with a className override or a wrapper.

### Criteria

| Situation | Handling |
|---|---|
| shadcn default = Figma spec | Use as-is |
| shadcn default ≠ Figma spec | Edit `src/components/ui/*.tsx` directly |
| Mismatched same-state style between two components | Unify the edit per Figma |

### Application example — Input / Select disabled

Official shadcn has different `disabled` styles for Input and Select:

```
Input    → disabled:bg-input/50 disabled:opacity-50  (has background)
Select   → disabled:opacity-50                       (no background)
```

Per the Figma library (Input `State=disabled`):
- fill: `muted` token → `bg-muted`
- opacity: 0.5 → `opacity-50`
- Select has no disabled variant → apply the same pattern as Input

**Result of the edit (the two components unified):**

```
Input    → disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
Select   → disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Override-forbidden patterns

> When adding a className to a shadcn component, don't look only at "what I'm adding" —
> always check **"what I'm removing"** too. If removal is needed, solve it with a wrapper div.

### Principles

| Category | Description |
|---|---|
| ✅ Allowed | Changing larger than the default (`p-2` → `py-3`, `h-auto` → `h-11`) |
| ✅ Allowed | Adding an absent property (`border-r`, `text-sm`, `font-medium`) |
| ❌ Forbidden | Removing the default to 0 (`py-0`, `p-0`, `m-0`, `gap-0`) |
| ❌ Forbidden | Overwriting the default padding without reason |

If removal is needed → **adjust the internal structure with a wrapper div**.

---

### Known forbidden patterns

#### SidebarHeader — don't set `py-0` / `p-0` directly

`SidebarHeader`'s default `p-2` provides top breathing room.
Removing it with `py-0` makes the TopNav border and the content stick together.

```tsx
// ❌ Removing SidebarHeader padding directly
<SidebarHeader className="h-11 items-center py-0 px-4">
  <div>...</div>
</SidebarHeader>

// ✅ Keep SidebarHeader default padding + control internal structure with a wrapper div
<SidebarHeader>
  <div className="flex items-center gap-3">
    ...
  </div>
</SidebarHeader>
```

#### Sidebar `collapsible="none"` — always specify `border-r`

`collapsible="none"` renders as a plain div, so the default `border-r` disappears.
Don't use it standalone. Include the border in the wrapper component or specify it with className.

```tsx
// ❌ Standalone use without border
<Sidebar collapsible="none">

// ✅ border specified
<Sidebar collapsible="none" className="border-r border-sidebar-border">
```

#### DropdownMenuLabel — always use inside a `DropdownMenuGroup`

Base UI's `Menu.GroupLabel` requires the `Menu.Group` context (unlike Radix).
The shadcn default registry doesn't reflect this requirement, so using `DropdownMenuLabel` standalone causes a
runtime error: `MenuGroupRootContext is missing`.

```tsx
// ❌ Label used standalone — runtime error
<DropdownMenuContent>
  <DropdownMenuLabel>Account</DropdownMenuLabel>
  <DropdownMenuItem>Profile</DropdownMenuItem>
</DropdownMenuContent>

// ✅ Wrap with Group
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

#### `items-center` vs `justify-center` in a flex-col context

In `flex-col` the roles of the two classes are reversed.

| Class | Effect in flex-col |
|---|---|
| `items-center` | Horizontal (cross-axis) center → content drifts to the center of the width |
| `justify-center` | Vertical (main-axis) center → the desired effect |

In `SidebarHeader` (`flex-col`), use `justify-center` when vertical centering is needed.

---

### Separate repeated patterns into a wrapper component

Patterns that combine shadcn components and are reused repeatedly, like the sidebar,
are separated into a wrapper component in `src/components/api-portal/`.
Encapsulate project rules such as border·padding·active state inside that component.

```
src/components/api-portal/
  AppSidebar.tsx   ← encapsulates Sidebar + border-r + nav items
```

When a new side-effect pattern is found → add it to this section immediately.
