# API Keys Page — Design Data

> Figma: F2lkYCId2xMqcd9RuXL20B / [Phase1] Design / API Keys
> Last read: 2026-04-22
> Scope: Phase1 has only the list frame. The Create/Edit/Delete dialogs and the Row Action Menu are undesigned → **stub implementation**.

---

## Used Components

- Button: `design-system/components/button.md`
- Table: `design-system/components/table.md`
- Input / Label: `design-system/components/input.md`
- Pagination: `design-system/components/pagination.md`

> Dialog / Popover / Alert / Badge / Select are not used on this page (stubbed due to missing Phase1 design).

---

## Used Patterns

<!-- TODO: add references after splitting out the table-list, confirm-dialog, form-dialog patterns -->

---

## Page Structure

### Overall layout
- Page frame: VERTICAL, w=1440, h=991
- Body: Sidebar(255px) + Main-Content(1185px)
- Main-Content padding / Footer Pagination layout are common to the dashboard (handled in layout.tsx)
- **No tabs** (`Navigation_menu visible=false`)

### Toolbar
- Left: Search Input (`w-60`, `h-8`, placeholder `Search`)
- Right: **Create API Key** button (`variant="default"`, `size="default"`)
- Center Columns dropdown: `visible=false` → excluded from implementation

### Footer
- Pagination centered (`grid grid-cols-3` wrapper, empty left/right divs)
- Wrapper of 2 outline buttons on the right: `visible=false` → excluded from implementation

---

## Table columns

| Column | x | w | sortable | Note |
|---|---|---|---|---|
| Checkbox | 0 | 33px | — | |
| Name | 33 | 492px | ✓ | e.g. "Playground demo". Wide because it shows the name on a single line while keeping whitespace |
| Token | 525 | 240px | — | e.g. `ujet_...` (masked display). No sorting |
| Last Used | 765 | 120px | ✓ | Date format `MM/DD/YYYY` |
| Created | 885 | 120px | ✓ | Date format `MM/DD/YYYY`, tooltip Info icon `visible=false` |
| Action | 1005 | 60px | — | `lucide/ellipsis` + `Type=icon ghost, Size=sm` (→ currently stub) |

**Hidden / excluded columns (intentionally not implemented)**
- **Permission** (header x=585) — no row cell, `visible=false`
- **Created** (header x=845, duplicate) — conflicts with the existing Created column, `visible=false`
- **Quota Tier** (header x=845) — `visible=false`
- **Last Used** (row cell x=845, duplicate) — `visible=false`

---

## Stub behavior (handling the missing Phase1 design)

### Create API Key button
- On click, stubbed with `toast.info("Create API Key dialog — Phase1 design pending")`.
- The actual dialog is implemented after the Phase1 design is added.

### Row Action Menu (ellipsis button)
- On click, stubbed with `toast.info("Row action menu — Phase1 design pending")`.
- The actual Popover menu is implemented after the Phase1 design is added.

---

## Figma Node IDs

| Screen | Node ID |
|---|---|
| API Keys page (root frame) | 1314:91052 |
| API Keys section | 1314:91361 |
| Main-Content | 1314:92188 |
| Header (title) | 1314:92191 |
| Content Container | 1314:92195 |
| Navigation_menu (tabs, hidden) | 1314:92196 |
| Data table | 1314:92197 |
| Toolbar (Wrapper top) | 1314:92198 |
| Create API Key button | 1314:92203 |
| Table header | 1314:92209 |
| Row (sample) | 1314:92258 |
| Action cell (row1) | 1314:92283 |
| Footer Pagination | 1314:92544 |

## Reference: POC design (for reference)

The dialogs missing from Phase1 have POC versions in the `[POC] Design / Dashboard` section. Re-check once the Phase1 design is added.

| POC Frame | Node ID |
|---|---|
| dashboard-API-popover | 748:9951 |
| dashboard-API-create | 733:28797 |
| dashboard-API-edit | 748:11033 |
| dashboard-API-created | 748:10683 |
