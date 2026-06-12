# Focus ring — Width & color tokens

> `--ring-width` will be bidirectionally synced with the `ring/width` Number variable in the Figma library (after the designer handoff). Current value on the code side = **3px**. The color reuses the existing `--ring` / `--destructive` tokens — only the width is new.

This document covers only the **visual tokens** of focus. The *behavior* (autoFocus blocking, dialog focus restoration, sr-only absorption) lives in [`a11y.md`](./a11y.md) §3.

---

## 1. Token table

| Token | Value | Implementation (Tailwind) | Usage |
|---|---|---|---|
| `--ring-width` | 3px | `ring-3` | All focus-visible |
| `--ring-color-default` | `var(--ring) / 50%` | `ring-ring/50` | Normal focus |
| `--ring-color-invalid` | `var(--destructive) / 20%` | `ring-destructive/20` | aria-invalid focus |

`--ring-width` is defined in the `:root` of `tokens.generated.css` (`misc.json#ring.width` → `sync-tokens.ts`). The two colors are expressed with existing tokens + alpha, without introducing new CSS vars.

---

## 2. Standard cva pattern

Input / Select / Button / Badge / Checkbox / Toggle all use the same pattern:

```ts
// normal focus-visible
"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// aria-invalid automatic color switch (border + ring together)
"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
```

When `aria-invalid` is true, both the border and ring colors switch to destructive together — changing only the ring and missing the border leaks visually.

---

## 3. When to use `outline-none`

Base UI primitives have their own outline, so it must be explicitly removed (`outline-none` / `outline-hidden`). However, **you must always replace it with a `focus-visible` ring for keyboard users** — removing the outline without a ring hides keyboard focus, which is an accessibility violation.

---

## 4. Anti-patterns

- ❌ `ring-2` or `ring-[Npx]` literal — violates width unification. All `ring-3`.
- ❌ `outline-none` alone with no ring — blocks keyboard users.
- ❌ Using `focus:` — shows the ring on mouse click too. Use `focus-visible:`.
- ❌ Applying the aria-invalid color to the ring only and missing the border — visual leak.
- ❌ Arbitrary alpha other than `ring-ring/50` (`/40`, `/60`, etc.) — breaks the agreement.

---

## 5. Cross-refs

- Behavior (focus management): [`a11y.md`](./a11y.md) §3 — autoFocus blocking, dialog focus restoration, sr-only absorption.
- Sync policy: [`figma-token-sync.md`](./figma-token-sync.md) — ring-width = Figma → code (designer work pending).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- Catalog: `/design-system/foundations/focus-ring` (Tab traversal + ring-2 vs ring-3 comparison + aria-invalid demo).
