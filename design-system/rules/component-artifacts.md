# Component Artifacts — Tiers & promotion guide

> Defines the artifacts one component should have as "tiers". Not all 4 are forced on every component — as reusability grows, artifacts are **promoted**. Enforcement is at the **warn** level, and existing uncovered components are not violations but P2-4 backlog.

## The 4 artifacts (e.g. Button)

| # | Artifact | Path | Role |
|---|---|---|---|
| ① | Implementation | `src/components/{ui\|api-portal}/<Name>.tsx` | React component. cva variant + semantic Tailwind. Truth = Figma component set. |
| ② | Spec | `design-system/components/<name>.md` | variant/size mapping, Figma node IDs, tokens, anti-patterns, WRONG/CORRECT. |
| ③ | Catalog | `src/app/(design-system)/design-system/primitives/<name>/page.tsx` | Live visual demo (Storybook substitute). |
| ④ | nav registration | `src/lib/design-system-nav.ts` | Exposes ③ in the sidebar (paired with ③). |

## Tier model

| Tier | Requires | Target |
|---|---|---|
| **Tier 1** | ① | Single-use internal helpers with no variants (mostly one-off domain) |
| **Tier 2** | ①② | Simple/upstream primitives (separator·skeleton·label) or shared components that don't need a live demo |
| **Tier 3** | ①②③④ | Reusable design-system primitives with variants/states |
| **Domain composites** | ① + `patterns/<pattern>.md` | App composites (dialogs etc.). No individual catalog. |

## Promotion triggers → actions

| Trigger | Action |
|---|---|
| Imported from **2 or more** different places | Add ② spec (Tier 1 → 2) |
| **2nd variant** or an interactive state added | Promote to Tier 3: add ③ catalog + ④ nav |
| A one-off gets **copied/forked** and spreads | Extract to a shared location, then re-apply the criteria |

## Promotion procedure (checklist)

1. Write `design-system/components/<name>.md` (follow the existing spec structure: variant table / Figma nodes / tokens / anti-patterns).
2. If Tier 3, create `src/app/(design-system)/design-system/primitives/<name>/page.tsx` (refer to the existing button/page.tsx structure, `mx-auto max-w-4xl px-6 py-10 md:px-10` wrapper).
3. Add `{label, href, doc}` to the Primitives group in `src/lib/design-system-nav.ts` (alphabetical order).
4. Confirm `npx tsc --noEmit && npx next build` passes.

## Enforcement level

- Missing = **warn**, not blocking. `check-catalog-exists.mjs` (harness hook, introduced in Phase B) warns only on **git-untracked (new) ui files**.
- Existing uncovered (19 / 24 uncovered primitives + 32 domain) are not violations.

> **The canonical source for hardcoding detection is the hook `check-design-tokens.mjs`** (per-file, on new edits). The grep in `design-qa`/`design-reviewer` is an advisory approximation (superset) — fixed widths specified by Figma (`sm:max-w-[423px]`/`512px`, `calc(...)`, layout offsets) are allowed by principle 11, so they are **expected warnings** (triage manually). Just catch new violations.

## Cross-refs

- Token rules: `rules/color.md`, CLAUDE.md design principle 3.
- Patterns (domain composites): `patterns/*.md`.
- Catalog coverage roadmap: `PROGRESS.md` P2-4.
