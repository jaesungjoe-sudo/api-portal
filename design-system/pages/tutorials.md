# Tutorials page spec

> Figma: `[Phase1] Design` → `Documentation/tutorials` (node `1630:27361`)
> Code: `src/app/(docs)/documentation/tutorials/page.tsx`

## Layout

3-column docs layout (DocsLayout common):
- Sidebar 255w (DocsSidebar)
- Body 760w (max-width container, left/right padding)
- Right TOC 305w (TocSidebar)

## Body composition (11 sections)

| # | TOC id | Section title | Note |
|---|---|---|---|
| 1 | `what-youll-build` | What You'll Build | `BuildOverviewCard` (SETUP 4-step + LIVE DEMO 1-step card group inside a highlight-subtle panel) |
| 2 | `prerequisites` | Prerequisites | 4 items (Sign up / API key / phone / 5 min) |
| 3 | `step-1` | Step 1. Get your phone number | `NumberedStep` 1, Request/Response code + WhatYouGet + TestPhoneField |
| 4 | `step-2` | Step 2. Create Agent | `NumberedStep` 2, Request/Response + AgentCard |
| 5 | `step-3` | Step 3. Create Queue | `NumberedStep` 3, Request/Response + IVR prompt box |
| 6 | `step-4` | Step 4. Assign agent to queue | `NumberedStep` 4, Request/Response + AgentCard (assigned queue list) |
| 7 | `step-5` | Step 5. Make a test call | `NumberedStep` 5, 4 sub-steps + Ready badge + Callout "Why deflection?" |
| 8 | `view-call-data` | View your call data | 4-item bullet |
| 9 | `accomplished` | What you accomplished | 5-item checklist ✓ |
| 10 | `continue-learning` | Continue learning | 4 next-steps |
| 11 | `need-help` | Need Help? | 3 links |

Page footer nav: Prev = `Quick Start` (/documentation), Next = `Inbound Calls` (/documentation/inbound-calls).

## BuildOverviewCard color fidelity (Figma inspection truth)

- **Outer panel**: `bg-background border-border` (white card + regular border)
- **SETUP 4 rows**: `bg-highlight-subtle border-highlight-border` (purple tone)
- **LIVE DEMO row**: `bg-success-subtle border-success-border` (green tone)
- **Icon container** (common to all 4 + 1 rows): `h-12 w-12 rounded-full bg-background border border-border` (white circle + border)
  - Inner lucide icon: `text-foreground`, `h-5 w-5`
- **"SETUP" / "LIVE DEMO" labels**: `text-muted-foreground` (gray), `uppercase tracking-wider text-xs font-semibold`

> ⚠️ During Phase1 work there was a case where the outer/row colors were merged with inside and outside flipped (2026-05-14). Don't infer tone placement from a screenshot alone → inspect each layer's `fillVar` before implementing (see `design-system/rules/figma-reading.md` "mandatory inspection of multi-layer tone cards").

## NumberedStep color fidelity

Left number badge: `h-7 w-7 rounded-md bg-highlight-subtle text-highlight`

## Page inline components

- `BuildOverviewCard` / `StepRow` (highlight | success tone)
- `NumberedStep` (id + number + title)
- `WhatYouGet` (content in an mt-2 gray box)
- `TestPhoneField` (read-only phone number display)
- `AgentCard` (●  name + description)
- `Callout` (info-subtle box, title + body)
- `Divider` (h-px border)

These components are page-only — not reused on other pages. If a similar pattern is needed on another page, promote it to a domain component.

## Content mock

The Request / Response code in Steps 1-4 is presumed UJet mock (does not exactly match the actual endpoint payload). Once the actual spec is received, just swap the constants.

## hidden nodes

- The `Buttons` of each step (external links / secondary buttons like "View Reference") — all visible=false. Not implemented.
- Step 4's `Default/alert/badge` and Step 4's `Default/alert` — visible=false (shown as AgentCard instead).
- Step 5's `Final Step/Frame 51`, `Field/Divider`, `Field/With_label`, `Field/Section` (some) — visible=false.
