# Figma → tokens/colors.json Sync Workflow

> The workflow for reflecting changes a designer makes to the Figma Library Variables into the `semantic` section of `design-system/tokens/colors.json`.
> A **semi-automated procedure run by Claude Code**. Based on the Plugin API (MCP), not the REST API (Enterprise only).

---

## Overall flow

```
Figma Library (Variables)
      │
      │  figma.teamLibrary / figma.variables (MCP)
      ▼
tokens/colors.json  (update semantic section)
      │
      │  npm run sync-tokens
      ▼
src/styles/tokens.generated.css
      │
      │  @import
      ▼
globals.css → browser render
```

Each arrow **passes after human review**. Not an unattended cron.

---

## Trigger

- When you receive a request from the designer: "the tokens changed, please reflect them"
- Checking the latest state before starting a new page implementation
- The `/sync-figma-tokens` slash command (in a Claude Code session)

---

## Prerequisites

1. **Figma Desktop running** + access to the library file (`SmO9fsWrxriuCofc7T3b1S`)
2. **Desktop Bridge plugin Running** (Plugins → Development → Figma Desktop Bridge)
3. MCP connection OK (verify with `figma_get_status`)

## Scope (clarifying the authority boundary)

**Figma Variables are authoritative**:
- All COLOR-type semantic tokens in the `mode` collection
- Mapping: if Figma has a value, use that value. On drift detection, Figma wins.

**Not authoritative from Figma Variables (maintained manually)**:
- `destructive-foreground` — not in Figma but kept for shadcn compatibility. Excluded from sync.
- `overlay` — treats Figma `background-color` as a reference but we rename it. Keeps alpha 0.3.
- `palette` section — Tailwind default palette. Assumed 1:1 with Figma `tw/colors`. If it changes, discuss separately.
- `misc.json` — currently not a sync target except radius.base.

---

## Procedure (run by Claude Code)

### STEP 1 — Verify connection

```
figma_get_status (probe:true) → verify websocket connection
```

On failure: guide the user to "run Figma Desktop + Desktop Bridge", then `figma_reconnect`.

### STEP 2 — Read the mode collection

```js
// Find the mode collection in the library subscriptions
const libs = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const modeCollection = libs.find(c => c.libraryName.includes("Design System API") && c.name === "mode");
const modeKey = modeCollection.key;   // currently: 7070bf9909f47cf6901d8216ea6ec4c429b09f00

// Metadata for all variables in the collection
const metaList = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(modeKey);
// returns: [{ name, key, resolvedType }, ...] — currently 59 total
```

### STEP 3 — Resolve each variable

```js
for (const meta of metaList) {
  if (meta.resolvedType !== "COLOR") continue;   // skip FLOAT (out of misc.json scope)

  const imported = await figma.variables.importVariableByKeyAsync(meta.key);
  const collection = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId);

  for (const mode of collection.modes) {
    // mode.name: "light mode" | "dark mode"
    const raw = imported.valuesByMode[mode.modeId];

    if (raw?.type === "VARIABLE_ALIAS") {
      // resolve alias → actual variable (usually the tw/colors palette)
      const aliased = await figma.variables.getVariableByIdAsync(raw.id);
      // aliased.name: "red/600", "neutral/950", "white", etc.
      // check whether it's tw/colors via aliased.variableCollectionId
    } else {
      // raw RGB — can't be expressed as a palette alias. hsla allowed if it has alpha.
    }
  }
}
```

### STEP 4 — Name mapping (auto-strip the slash prefix)

Inside the STEP 3 loop, normalize the name with the function below. No separate manual work needed.

```js
/**
 * Auto-strips the group prefix from a Figma variable name.
 *   "success/success"        → "success"
 *   "success/success-border" → "success-border"
 *   "warning/warning-subtle" → "warning-subtle"
 *   "background"             → "background"  (kept as-is if no slash)
 */
function normalizeTokenName(figmaName) {
  const slashIdx = figmaName.indexOf("/");
  if (slashIdx === -1) return figmaName;
  return figmaName.slice(slashIdx + 1);
}
```

Applied in the STEP 3 loop:

```js
for (const meta of metaList) {
  if (meta.resolvedType !== "COLOR") continue;

  const tokenName = normalizeTokenName(meta.name);   // ← auto-converted here
  if (EXCLUDE.has(meta.name)) continue;              // STEP 5 exclude list

  // ... resolve & compare
}
```

### STEP 5 — Exclude list

Figma variables currently not reflected into tokens/colors.json:

| Figma name | Reason |
|---|---|
| `semantic-foreground` | skip until the purpose is confirmed |
| `semantic-background` | skip until the purpose is confirmed |
| `semantic-border` | skip until the purpose is confirmed |
| `background-color` | renamed to `overlay`, already in tokens/colors.json. Just check the alpha value |
| `radius-*`, `border-width`, `stroke-width` | FLOAT. misc.json scope — out of current scope |

### STEP 6 — Convert values to the colors.json schema

**alias → palette ref string**:
- Figma `aliased.name = "red/600"` + `aliased.collection = "tw/colors"` → `"palette/red/600"`
- Figma `aliased.name = "white"` + `aliased.collection = "tw/colors"` → `"palette/white"`

**raw RGB → HSL or hex directly**:
- raw with alpha == 1 is a custom color not in the palette → warning log + request designer confirmation
- raw with alpha < 1 (e.g. `overlay`) uses the existing alpha syntax like `"palette/black@0.3"`

### STEP 7 — Drift report

Compare the current colors.json with the Figma results:

```
✓ Matching tokens: N
⚠ Changed tokens:
  - destructive (light): palette/red/600 → palette/red/700
  - muted (dark): palette/neutral/800 → palette/neutral/700
➕ New tokens only in Figma: ...
➖ Tokens only in colors.json: ...
```

If there are changes, **request user confirmation**. No automatic overwrite.

### STEP 8 — Apply + regenerate the generated CSS

After user approval:

1. Update the `semantic` section of `tokens/colors.json` with the new values (manual Edit or script)
2. Run `npm run sync-tokens` → regenerate `tokens.generated.css`
3. Verify consistency with `npm run sync-tokens:check`
4. Confirm `/users`, `/api-keys` render in the browser (visual)
5. Print a change summary message to the user

### STEP 9 — Pre-PR checklist

- [ ] `git diff design-system/tokens/colors.json` contains only the intended changes
- [ ] `src/styles/tokens.generated.css` is updated too (must be included if there's a difference)
- [ ] `npm run sync-tokens:check` exit 0
- [ ] Visual regression check (especially destructive, status badge, dialog overlay)

---

## Known limitations

1. **The designer cannot run it directly**. Claude Code is required. For designer self-service, the workflow would need to be reorganized into a Figma Plugin.
2. **Desktop Bridge disconnects**. Reconnection is needed when Figma Desktop is quit/restarted.
3. **FLOAT type unsupported**. Numeric tokens like the radius scale are not currently a sync target.
4. **Palette drift not detected**. If the `tw/colors` palette itself changes, it diverges from tokens/colors.json.palette, but this workflow can't detect it.

## Candidates for future improvement

- Decide whether to include the 3 `semantic-*` in sync after determining their purpose
- FLOAT tokens (radius-*, border-width, stroke-width) → expand misc.json
- Detect drift of the `tw/colors` palette itself (additional STEP)
- Promote to REST API-based CI automation once an Enterprise plan is secured

---

## Token sync directions (added 2026-06-02)

The Figma library ↔ code sync method differs per token group. Agreed in P3-8:

| Token group | Sync direction | Note |
|---|---|---|
| colors | Figma → code (bidirectional) | `colors.json` is the mirror. Figma `tw/colors` + mode collection is the source. |
| radius | Figma → code (bidirectional) | `misc.json#radius`. Figma `radius-*` variables (aligned 2026-05-08). |
| shadow | code is truth (alignment planned) | Currently defined directly in `globals.css`'s `@theme inline`. Effect styles exist in the Figma library but the sync workflow is undefined. |
| ring-width | Figma → code (bidirectional, designer work pending) | `misc.json#ring.width = 3px`. A `ring/width` Number variable to be newly created in the Figma library (P3-8 designer handoff). |
| motion | code is truth (one-way) | `misc.json#motion`. The Figma library only has a spec page (for designer reference). |
| z-index | code only | Not modeled in Figma. Agreed to keep only a memo page in the library (P3-8 designer handoff). |

> For designer handoff details, see `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md` §6.
