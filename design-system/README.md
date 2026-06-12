# API Portal — Design System

> Start-here index for developers implementing UI. **Figma is the source of truth; this repo is how that truth becomes code consistently.**
>
> Maintained by the design owner (Figma library + rules + tokens). Developers consume it: use the existing primitives/patterns, follow the rules, and let the tooling catch mistakes.

---

## 🚀 Start here (3-minute version)

Before you write any UI, internalize these **non-negotiables** (full list: [`../CLAUDE.md`](../CLAUDE.md) → "Design principles"):

1. **Tokens, not hardcoding.** Use semantic Tailwind classes (`bg-primary`, `text-foreground`). No `#hex`/`rgb()`, no arbitrary values (`text-[14px]`, `bg-[#...]`), no `var(--color-*)` directly. → [`rules/color.md`](./rules/color.md)
2. **Figma is truth.** Only apply tokens/variants/states that exist in Figma. Don't invent variants "because it'd be handy." → [`rules/figma-reading.md`](./rules/figma-reading.md)
3. **Reuse before building.** Check `src/components/ui/` (primitives) and [`patterns/`](./patterns) first. A new reusable component follows the tier model → [`rules/component-artifacts.md`](./rules/component-artifacts.md)
4. **No fixed-px widths.** `w-full` + parent padding/max-width.

If you use **Claude Code** (we all do), the harness enforces most of this automatically — see [Tooling](#-tooling-claude-code) below.

---

## 🗺️ What's here

| Layer | Location | What it is |
|---|---|---|
| **Catalog** (visual) | `/design-system` (run app) | Live, browsable demos of tokens, primitives, patterns, rules |
| **Rules** | [`rules/`](./rules) (14) | How to read Figma, use tokens, layout, states, a11y, motion, etc. |
| **Components** | [`components/`](./components) (17) | Per-primitive specs: variants, Figma node IDs, tokens, anti-patterns |
| **Patterns** | [`patterns/`](./patterns) (5) | Composed multi-component recipes (form dialog, table page, etc.) |
| **Pages** | [`pages/`](./pages) (5) | Full page specs (analytics, api-keys, users, …) |
| **Tokens** | [`tokens/`](./tokens) | Source JSON → generated CSS (see [Tokens](#-tokens)) |
| **Tooling** | [`../.claude/`](../.claude) | Claude Code agents + hooks that guide/enforce the rules |

---

## 🖥️ The catalog

The visual reference. **This is the fastest way to see what exists.**

```bash
npm run dev      # then open http://localhost:3000/design-system
```

- **Production**: `https://api-portal-amber-tau.vercel.app/design-system` (behind Basic Auth — ask the design owner for credentials).
- Sections: **Foundations** (tokens / focus-ring / motion / z-index) · **Primitives** (button, badge, skeleton, …) · **Patterns** · **Rules**.
- Sidebar items link to the corresponding spec doc on GitHub.

---

## 🧱 How to build a component

Follow the 7-step process in [`../.claude/CLAUDE.md`](../.claude/CLAUDE.md): understand → analyze → explore → **plan (get approval)** → implement → verify → done.

**Where files go (artifact tiers)** — full rules in [`rules/component-artifacts.md`](./rules/component-artifacts.md):

| Tier | Artifacts required | For |
|---|---|---|
| Tier 1 | impl `.tsx` | one-off internal helper |
| Tier 2 | impl + spec `.md` | simple/upstream primitive |
| Tier 3 | impl + spec + catalog page + nav entry | reusable primitive with variants/states |
| Domain composition | impl + a `patterns/*.md` | app-specific compositions (dialogs, etc.) |

Components are **promoted** as reuse grows (e.g. imported in 2+ places → add a spec; gains a 2nd variant → add a catalog page). The artifact check is **warn-only** and only nudges on *new* files — existing gaps are backlog, not violations.

**Need a component that doesn't exist?** Open a component request (see [Workflow](#-workflow--ownership)) — don't fork/invent variants ad hoc.

---

## 🎨 Tokens

- **Use:** semantic Tailwind classes — `bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, `shadow-sm`. Never raw hex/rgb or arbitrary values.
- **Source of truth:** Figma library variables → `tokens/colors.json` + `tokens/misc.json` → `npm run sync-tokens` → `src/styles/tokens.generated.css`. **Never edit `tokens.generated.css` by hand.**
- **Verify in sync:** `npm run sync-tokens:check`.
- Full token catalog: `/design-system/foundations/tokens`. Sync workflow + direction: [`rules/figma-token-sync.md`](./rules/figma-token-sync.md).

---

## 🤖 Tooling (Claude Code)

We all use Claude Code, so the harness works for everyone. Run `./install.sh` once to verify it's wired.

**Agents** (`.claude/agents/`) — invoke for design-system work:
- **`figma-implementer`** — give it a Figma URL/node; it implements (5-step: clarify → gather → plan → generate → evaluate), using the rules above.
- **`token-checker`** — compares Figma tokens vs code, fixes on approval (via `sync-tokens`).
- **`design-qa`** — 8-point pre-release check (build / types / token sync / lint / hardcoding / artifacts / a11y / Figma fidelity). Reports only.
- **`design-reviewer`** — code-only scan for hardcoding / arbitrary values / fixed px / `dark:`.

**Hooks** (auto-fire on file save, `.claude/settings.json`):
- `protect-files` — blocks edits to `.env*` (secrets).
- `check-design-tokens` — warns on hardcoded colors/arbitrary values in `.tsx`.
- `check-catalog-exists` — warns when a new reusable primitive is missing its artifacts.

> Hooks are advisory (warn, non-blocking) and local to Claude Code. The **CI pipeline is the enforced floor** for everyone (build / types / token-sync / lint) — keep your PR green.

---

## 🔄 Workflow & ownership

- **Design owner** maintains the Figma library (truth), the rules/specs here, and token definitions; reviews design fidelity on PRs.
- **Developers** implement features using existing primitives/patterns, follow the tier/promotion rules, and keep CI green.
- **Token change** → design owner updates Figma → `token-checker`/`sync-tokens` → PR.
- **New component** → open a component-request issue → design owner specs it in Figma (+ spec/catalog if reusable) → developer implements.

> A fuller `CONTRIBUTING.md` + PR template (with a design-fidelity checklist) is planned — see roadmap.

---

## 📌 Status & roadmap

Maturity roadmap and current progress live in [`../PROGRESS.md`](../PROGRESS.md) ("Design system maturity roadmap"). Open items include `CONTRIBUTING`/PR template and remaining component-doc coverage.

---

## 📇 Full index

- **Rules**: [`rules/`](./rules) — color, figma-reading, shadcn, layout, states, responsive, typography, a11y, motion, z-index, focus-ring, instance-variant, figma-token-sync, component-artifacts
- **Components**: [`components/`](./components) — alert, badge, breadcrumb, button, dialog, dropdown-menu, empty-state, input, pagination, popover, select, skeleton, sonner, table, tabs, toggle-group, tooltip
- **Patterns**: [`patterns/`](./patterns) — form-dialog, confirm-dialog, table-list-page, docs-page-shell, clickable-card-with-menu
- **Pages**: [`pages/`](./pages) — analytics, api-keys, create-call, tutorials, users
- **Project rules**: [`../CLAUDE.md`](../CLAUDE.md) · **Process**: [`../.claude/CLAUDE.md`](../.claude/CLAUDE.md) · **Narrative**: [`../docs/DESIGN.md`](../docs/DESIGN.md)
