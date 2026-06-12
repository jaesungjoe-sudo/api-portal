# z-index — Layer stack

> **Code-only.** Not modeled in Figma. The layer agreement is owned by this doc as the single source of truth. Use Tailwind's `z-50` / `z-10` as-is, but this doc *specifies what layer each value means*.

---

## 1. 4-step scale

| Token | Value | Tailwind | Where used |
|---|---|---|---|
| `--z-base` | 0 | `z-0` (or default) | Page content |
| `--z-sticky` | 10 | `z-10` | Sidebar wrapper, sticky header |
| `--z-overlay` | 50 | `z-50` | Dialog / Sheet / Popover / Dropdown / Select / Sidebar rail |
| `--z-toast` | 100 | `z-[100]` (Sonner handles it) | Sonner toast |

The CSS variables are defined in the `:root` of `tokens.generated.css` (`misc.json#zIndex` → `sync-tokens.ts`).

---

## 2. Canonical-declaration pattern

This is the same approach as `rounded-lg` ≡ `--radius-lg`. In code, use the native Tailwind classes (`z-50`, `z-10`) as-is, and **this doc defines which of the 4 steps that value is**. That is, don't bulk-rename `z-50` to `z-[var(--z-overlay)]` — readability↓, shadcn upstream diff↑, behavior change 0.

When writing a new component, *deliberately pick* one of the 4 steps below and use that Tailwind value:

- Floating overlay (modal/dropdown/popover) → `z-50` (`--z-overlay`)
- sticky header / sidebar skeleton → `z-10` (`--z-sticky`)
- toast → Sonner handles the `100` level itself (no need to set z directly)

---

## 3. Usage guide

- **New overlay**: Dialog/Sheet/Popover/Dropdown/Select are all `z-50`. Don't invent a new layer arbitrarily.
- **Same-layer conflict**: when two overlays open at once, don't fight over precedence with z — resolve by **DOM order** (whatever mounts later is on top).
- **Sidebar rail**: the desktop skeleton is `z-10`, the mobile Sheet overlay is `z-50` (Sheet is the overlay layer).
- **Toast**: must be above (100) the overlay (50) so it's visible even over confirm/alert. Follows Sonner's default — we don't override z in the wrapper (`src/components/ui/sonner.tsx`).

---

## 4. Anti-patterns

- ❌ Extreme values like `z-[9999]` — ignores the step vocabulary. A "just put it on top" stopgap grows the next conflict.
- ❌ Arbitrary `z-[N]` literals (`z-[30]`, `z-[60]`, etc.) — bypasses the 4-step agreement.
- ❌ Fighting over precedence within the same layer — when two Popovers open at once, don't fight with z. Resolve naturally by DOM order.
- ❌ Putting Toast below the overlay — a confirm/alert dialog hides the toast and the user misses it. Not intended behavior.

---

## 5. Cross-refs

- Sync policy: [`figma-token-sync.md`](./figma-token-sync.md) — the "token sync direction" matrix (z-index = code-only).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- Catalog: `/design-system/foundations/z-index` (visual demo of the 4 overlapping layers).
