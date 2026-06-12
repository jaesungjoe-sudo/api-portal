# Motion — Duration & easing

> **Code is truth.** The Figma library only keeps a spec page (one-way reference) — no automatic sync. Determine the transition of new components within the vocabulary of the 3 durations × 1 easing below.

---

## 1. Duration matrix

| Token | Value | Tailwind | Where used |
|---|---|---|---|
| `--duration-fast` | 100ms | `duration-100` | Popover / Dropdown / Select / Dialog / Tooltip open·close |
| `--duration-base` | 200ms | `duration-200` | Sheet, Sidebar collapse·expand, Accordion |
| `--duration-slow` | 300ms | `duration-300` | NavigationMenu large transitions, hero motion |

> **150ms absorption decision**: the 150ms remaining in some backdrops / Accordions is absorbed into `--duration-base` (200ms). The visual difference is effectively none — keeping a single source takes priority.

---

## 2. Easing matrix

| Token | Value | Tailwind | Where used |
|---|---|---|---|
| (default) | `linear` | `ease-linear` | Sidebar etc. simple size/position interpolation (default) |
| `--ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-emphasized` | NavigationMenu, large transitions needing a "spring feel" |

The easing default (`linear`) is not tokenized — Tailwind's `ease-linear` is effectively the default. Only the one place that needs alignment (emphasized) gets a new token.

---

## 3. Tailwind v4 integration

- **Duration**: Tailwind's native `duration-100/200/300` are directly equivalent to our canonical values (`--duration-fast/base/slow`). No extra registration needed — in code you write `duration-300` directly. The `--duration-*` CSS vars are for reference in rule docs + when writing custom CSS.
- **Easing**: a single line in `globals.css`'s `@theme inline` — `--ease-emphasized: var(--ease-emphasized);` — activates the `ease-emphasized` Tailwind utility key. The value itself is defined once in the `:root` of `tokens.generated.css`.

```css
/* globals.css @theme inline */
--ease-emphasized: var(--ease-emphasized);  /* value lives in tokens.generated.css */
```

---

## 4. `prefers-reduced-motion` policy

> ⚠️ **No global handler currently — a follow-up item under review.**
> Agreed policy: when the user enables Reduce motion in the OS, shorten all transitions to `0ms`. When implementing, add a global rule to `globals.css`:
>
> ```css
> @media (prefers-reduced-motion: reduce) {
>   *, ::before, ::after {
>     animation-duration: 0.01ms !important;
>     transition-duration: 0.01ms !important;
>   }
> }
> ```
>
> Out of scope for this P3-8. Until introduced, note that the catalog demos also ignore reduce motion.

---

## 5. Usage guide

- **popup** (Tooltip / Popover / Dropdown / Select / Dialog) → `duration-100`
- **drawer / sidebar / accordion** → `duration-200`
- **nav / hero** large transitions → `duration-300 ease-emphasized`

---

## 6. Anti-patterns

- ❌ Literal ms — arbitrary values like `duration-[180ms]`. Absorb into the 3-tier vocabulary.
- ❌ Using 5 or more durations — expanding beyond the scale. If a new value is truly needed, add a token after a spec agreement.
- ❌ Mismatched pairing — `duration-100` (fast) + `ease-emphasized`. Emphasized matches large transitions (slow).
- ❌ Always-on animation that ignores `prefers-reduced-motion` (after the policy is introduced).
- ❌ Mixing 200ms and 150ms — if 150 remains in one place, that's cleanup material (absorb into `--duration-base`).

---

## 7. Cross-refs

- Sync policy: [`figma-token-sync.md`](./figma-token-sync.md) — motion = code is truth (one-way).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- Catalog: `/design-system/foundations/motion` (duration 3-box toggle + easing curve + live demo).
