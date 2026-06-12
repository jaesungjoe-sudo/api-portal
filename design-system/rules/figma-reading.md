# Figma node reading rules

## Figma MCP usage rules

### Basic principles
- Use Console MCP first for all Figma work
- Don't use the official MCP

### Console MCP usage
- Screen implementation: extract the node-id from the Figma link and read directly
- Token extraction: read all variables by file key
- Component exploration: explore directly by file key

### Figma file info
- Library file key: SmO9fsWrxriuCofc7T3b1S
- Design file key: F2lkYCId2xMqcd9RuXL20B

### Work order (token saving required)

**STEP 1 — Check the design-system/ cache first (required before reading Figma)**
- If `design-system/pages/<page>.md` exists → use that file without reading Figma
- If the needed info is in the cache, don't call figma_execute

**STEP 2 — Read only the info not in the cache from Figma**
- Don't read the whole parent frame → pinpoint-read only the node IDs of the needed section
- figma_execute reading order:
  1. First grasp only the children ID list with depth=1~2
  2. Read only the needed node IDs with depth=3~4
- Don't re-check already-implemented components (Navigation, Sidebar, Table, Dialog, etc.) in Figma

**STEP 3 — Save the read results immediately (required before ending the session)**
- When a new screen implementation is complete, always save to `design-system/pages/<page>.md`
- What to save: node IDs, column structure, spacing, colors, hidden node list
- If not saved, the same Figma reading repeats in the next session and wastes tokens

**STEP 4 — Don't use the official MCP (get_design_context)**

### Reading library Variables (token names/alias/dark mode)

The **Variables definitions** of a library file (token names like `success-chart`, palette aliases, light/dark mappings) can't be read via node inspection. Design file nodes only expose `boundVariables.id` (e.g. `VariableID:.../3299:109`), and a separate API is needed to know which named variable that ID is.

**The REST API is blocked** (no `file_variables:read` scope → 403). Use the Desktop Bridge workaround instead:

```
figma_get_variables({
  fileUrl: "<library file URL>",
  format: "filtered",
  namePattern: "<keyword>",      // e.g. "chart"
  useConsoleFallback: true,      // ← activate Desktop Bridge
  resolveAliases: true,          // auto-resolve the alias chain
  verbosity: "standard",
})
```

**Prerequisite**: **the library file must be open in the Figma Desktop app** (the Bridge accesses the currently active file's data). If it's not open, you get a "Desktop Bridge failed" error.

**Response example**:
```
{ id: "VariableID:3299:7368",
  name: "success/success-chart",
  valuesByMode: { "<light-mode-id>": { type:"VARIABLE_ALIAS", id:"VariableID:90:112" },
                  "<dark-mode-id>":  { type:"VARIABLE_ALIAS", id:"VariableID:90:111" } }, ... }
```

→ You get the token name (`success-chart`) and the light/dark alias IDs exactly.

**Forbidden**: guessing the token name from a design file node's `boundVariables.id` via hex. Guessing is only a last-resort fallback. Always try the method above first.

### design-system/ folder structure
```
design-system/
  tokens.json          ← Figma color/typography/spacing tokens
  pages/
    users.md           ← /users page design data ✓
    api-keys.md        ← /api-keys page (not written)
    webhooks.md        ← /webhooks page (not written)
    analytics.md       ← /analytics page (not written)
  components/          ← common component specs (add as needed)
```

---

## Figma hidden node handling rules

**Never implement hidden nodes in Figma.**

Hidden identification criteria — exclude from implementation if any of the following applies:
- `visible === false`
- opacity === 0
- Coordinates fully overlap another node (bounding box overlap) with no cell corresponding to actual row/cell data
- The column cell does not exist within the row cell coordinate range read via `figma_execute`

**Verification method**: don't look only at the header node — always compare against the actual **row cell x coordinates** to confirm whether the column exists before implementing.

**Required check when reading with figma_execute**: when extracting node content, don't read only the text/style — **always check the `node.visible` value too**. Exclude `visible: false` nodes from implementation even if they have text.

---

## Rule: fully enumerate container children

**When implementing a parent frame, map all direct children with `visible: true` in order.**

### Why this is needed

If you skip structural elements that "don't look like a menu" to the eye (divider, spacer, decorative Rectangle) via semantic filtering, they get omitted from implementation. Actual cases:

- In TopNav's `Frame 2` (HORIZONTAL, children=3), `Nav1 | Divider(1×20 Rectangle) | Nav2` — treating the Divider as "decoration" and skipping it → the two nav groups render stuck together.
- In the Team detail page Header (VERTICAL, children=2), Row 1 has two children `Title TEXT | Ellipsis INSTANCE`, but **extracting only text via `getVisibleTexts()`** dropped the 3-dot menu INSTANCE beside it → the Edit/Delete menu was missing from the header.

### Checklist

**Always do this** when reading a parent frame:

1. **Parent's own properties**: record `layoutMode`, `itemSpacing`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `visible`
2. **Child enumeration**: list the entire `children` array in order (name·type·width·height·visible)
3. **visible=false filtering**: exclude hidden nodes
4. **Map every remaining visible child to an implementation item, none omitted**
5. **Check the `fills` / `strokes` token names of text·icon·background** — if it's not a semantic token like `destructive`·`warning`·`success`, don't add that color by convention (details: `shadcn.md` "principle of not adding styles")

### Mandatory inspection of multi-tone layered cards (Tutorials BuildOverviewCard case)

When implementing a card where decorative tones are **nested 2+ layers deep** (outer panel / row/card / icon container inside the row, etc.), **inspect every layer's `fills[0].boundVariables.color` and `strokes[0].boundVariables.color` with `figma_execute` and write code from the results only**. Don't infer "where" the tone "sits" from a screenshot alone.

**Actual case (2026-05-14)**: when implementing the Tutorials page `BuildOverviewCard`, the purple tone appeared to cover the whole area in the screenshot, so it was judged as "the outer panel is purple", but the actual Figma was a "white outer card + purple (`highlight-subtle`) row + white circle inside the row + black icon" structure. It was merged with the purple location flipped inside-out.

**Workflow**:

```js
// 1. Inspect each layer's fill / stroke variable
async function inspectLayers(rootNodeId) {
  const root = await figma.getNodeByIdAsync(rootNodeId);
  async function resolveVar(id) {
    if (!id) return null;
    const v = await figma.variables.getVariableByIdAsync(id);
    return v?.name || null;
  }
  async function walk(n, path = '') {
    if (n.visible === false) return [];
    const out = [];
    const fillVar = await resolveVar(n.fills?.[0]?.boundVariables?.color?.id);
    const strokeVar = await resolveVar(n.strokes?.[0]?.boundVariables?.color?.id);
    if (fillVar || strokeVar) out.push({ path: path + '/' + n.name, fillVar, strokeVar, r: n.cornerRadius });
    if ('children' in n) for (const c of n.children) out.push(...(await walk(c, path + '/' + n.name)));
    return out;
  }
  return walk(root);
}
```

2. The result table should show the color change in outer→inner order. No guessing.
3. Check the icon container's `cornerRadius` and `width/height` too (e.g. `r=16777200` is Figma's "full pill" → `rounded-full`).
4. After implementing, compare the browser screenshot and the Figma screenshot 1:1 (especially multi-tone areas).

→ The moment a tone is visually confusing about "which layer it sits on", immediately inspect with `figma_execute`. This applies the multi-layer case of CLAUDE.md principle 1 "**Figma is truth**".

### Don't call only `getVisibleTexts()`

If, at the child enumeration step, you rely on a helper that extracts only text (`findAll(n => n.type === 'TEXT')` / `getVisibleTexts()`), INSTANCE/FRAME/RECTANGLE children get omitted entirely.

| Helper type | Where to use |
|---|---|
| `getVisibleTexts(n)` | Only when confirming text content is correct (label matching) |
| **Child enumeration** (below) | **Grasping the layout structure — always do this first** |

```js
// ✅ Enumerate all children with type/visible (grasp layout)
return n.children.map(c => ({
  name: c.name, type: c.type, visible: c.visible,
  w: Math.round(c.width), h: Math.round(c.height),
  text: c.type === 'TEXT' ? c.characters : undefined,
}));
```

Text matching is done **after first drawing the layout** from the enumeration result, as a supplement.

### When a Rectangle node is suspicious — divider identification criteria

A Rectangle with an extreme aspect ratio is mostly a divider. Don't assume it's decoration.

| Hint | Interpretation |
|---|---|
| width=1 or height=1 | Vertical/horizontal divider |
| A narrow Rectangle that is rotated (rotation ≠ 0) | Rotated divider (e.g. 20×1 + rotation=-90 → 1×20 vertical line) |
| A small Rectangle positioned between two groups | Section divider |
| Only stroke, fills=[] | Linear element (divider/border) |

### Implementation mapping example

```
Frame 2 (HORIZONTAL, gap=12, visible=true, children=3):
  [0] Nav1 (INSTANCE, visible=true)
  [1] Divider (RECTANGLE 20×1, rotation=-90, stroke=sidebar-border, visible=true)
  [2] Nav2 (INSTANCE, visible=true)
```

↓

```tsx
<nav className="flex items-center gap-3">
  <Nav1 />
  <div className="h-5 w-px bg-sidebar-border" />  {/* ← don't drop the divider */}
  <Nav2 />
</nav>
```

---

## Figma layout direction reading rules

**Always check `layoutMode` before implementing a frame with multiple children.**

| Figma `layoutMode` | Code |
|---|---|
| `HORIZONTAL` | `flex flex-row` |
| `VERTICAL` | `flex flex-col` |
| `NONE` | no flex (absolute or block) |

When reading a node via `figma_execute`, always include the following properties in the extraction:

```js
{
  layoutMode: node.layoutMode,
  primaryAxisAlignItems: node.primaryAxisAlignItems,  // justify-*
  counterAxisAlignItems: node.counterAxisAlignItems,  // items-*
  itemSpacing: node.itemSpacing,                      // gap
  visible: node.visible,
}
```

Don't arbitrarily decide `flex-col` / `flex-row` without checking the layout direction.
