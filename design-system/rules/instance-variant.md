# Rules for handling Figma component instances

**When you encounter a node where `node.type === 'INSTANCE'`, always follow the steps below.**

## STEP 1 — First check whether a matching component exists in `/src/components/ui/`

Look at the `mainComponent` name and decide whether a shadcn component can cover it.

| Figma mainComponent keyword | Component to use |
|---|---|
| Button, Buttons | `<Button>` |
| Badge | `<Badge>` |
| Alert, alert | `<Alert>` (if it exists); otherwise read the internal structure and implement |
| Input, Select, Checkbox | The corresponding shadcn component |
| Dialog, Modal | `<Dialog>` |
| Tooltip | `<Tooltip>` |
| Separator | `<Separator>` |
| Pagination | `<Pagination>` |

- If a matching component exists → use the shadcn component, don't re-implement its internal structure
- If none → go to STEP 2

## STEP 2 — Read the instance's internal structure too

If there is no matching component, **read children down to depth=3~4** to confirm the icon presence, text structure, and layout, then implement. Do not implement based on `componentProperties` and the `mainComponent` name alone.

## STEP 3 — Determine the variant by checking fills + strokes together

**For a node where `node.type === 'INSTANCE'`, always read `componentProperties` to confirm which variant it is.**

- `componentProperties` contains variant values like `Type=outline`, `Size=sm`, `State=hover`
- Don't infer the variant from text or position alone → always confirm explicitly
- Reading `mainComponent.name` together helps grasp the variant structure

```js
// ✅ Reading an instance's variant + color overrides
if (node.type === 'INSTANCE') {
  // 1. Read variant
  const props = node.componentProperties;
  const variantType = props?.Type?.value;       // "outline" | "default" | "destructive", etc.
  const variantSize = props?.Size?.value;       // "sm" | "default" | "lg", etc.
  const mainName = node.mainComponent?.name;    // "Type=outline, Size=sm, State=default"

  // 2. Check both fills + strokes (essential for variant inference)
  const hasFill = node.fills?.length > 0;
  const hasStroke = node.strokes?.length > 0;
  // ghost  → fills:[] + strokes:[] (no background, no border)
  // outline → fills:[] + strokes:[...] (no background, has border)
  // solid  → fills:[...] (has background)

  // 3. Check the instance's own fill/stroke override
  const instanceColor = await getColorToken(node);

  // 4. Check child node fill overrides (when the instance has no direct fill)
  if (!instanceColor || instanceColor.startsWith('rgb')) {
    for (const child of node.children || []) {
      if (child.fills?.length > 0) {
        const childColor = await getColorToken(child);
        // If childColor is a token name, an override was applied
      }
    }
  }
}
```

**Don't infer the variant from fills alone.** `fills: []` applies to both ghost and outline, so you must check `strokes` as well.

| fills | strokes | variant |
|---|---|---|
| empty | empty | `ghost` |
| empty | present | `outline` |
| present | n/a | `default` / `destructive` / `secondary`, etc. |

All colors must be used connected to a token. If an RGB fallback shows up, ask the designer to connect the token.

This rule applies to all component instances — Button, Badge, Input, etc.

---

## STEP 4 — For form field instances, always check the `State` variant

Form field instances like `Input`, `Select`, `Checkbox`, `Textarea` **have different HTML attributes depending on the `State` variant value, even under the same mainComponent name**. So when implementing dialogs/forms, always check each field instance's `componentProperties.State`.

| `State` variant | HTML attribute / meaning |
|---|---|
| `default` / `empty` | Empty state showing the placeholder |
| `filled` | Normal state with a value |
| `disabled` | Add the `disabled` prop — user can't edit |
| `readonly` | Add the `readOnly` prop — display only |
| `error` | Expose `aria-invalid` + error message |
| `focus` / `hover` | No implementation needed (handled automatically by CSS) |

```js
// ✅ Form field instance conversion order
for (const fieldInstance of formFieldInstances) {
  const state = fieldInstance.componentProperties?.State?.value;
  // state === "disabled" → disabled prop on the Input/Select component
  // state === "readonly" → readOnly prop
  // other states use the default implementation
}
```

**Warning: don't judge state from geometry (width/height) alone.** The same component can have a different height depending on state (presence of label/helper text), but inferring state from height differences is wrong. Always check `componentProperties.State` directly.

**Example — an actually missed case:**
In ProfileDialog the Role field was `State=disabled` in Figma, but a shallow inspection didn't read `componentProperties` and skipped it based only on the height (64) vs Team's height (68) difference, so the disabled prop was missing.
