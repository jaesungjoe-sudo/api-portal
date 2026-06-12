# Users Page — Design Data

> Figma: F2lkYCId2xMqcd9RuXL20B / [Phase1] Design
> Last read: 2026-04-21

---

## Used Components

- Button: `design-system/components/button.md`
- Dialog: `design-system/components/dialog.md`
- Badge: `design-system/components/badge.md`
- Table: `design-system/components/table.md`
- Alert: `design-system/components/alert.md`
- Input / Label: `design-system/components/input.md`
- Select: `design-system/components/select.md`
- Popover (Row Action Menu): `design-system/components/popover.md`
- Pagination: `design-system/components/pagination.md`

---

## Used Patterns

<!-- TODO: add references after splitting out the table-list, confirm-dialog, form-dialog patterns -->

---

## Page Structure

### Overall layout
- Full page: VERTICAL, w=1440
- Body: HORIZONTAL — Sidebar(255px) + Main-Content(1185px)
- Main-Content padding: 40px top, 80px bottom, 60px left/right, gap=40

### Tab composition
- Layout: HORIZONTAL, gap=4px
- Tab list: **User (64px)** | **Team (69px)** | **Pending Approvals (182px)**
- Active tab text: `text-foreground` / Inactive: `text-muted-foreground` (matches the underline tabs in `components/tabs.md`)
- Count badge next to the Pending Approvals tab: shows the pending count (for the badge pattern see `components/badge.md`)

### Toolbar (below the tabs)
- Left: Search Input (`w-60`, `h-8`, placeholder `Search User`)
- Right: **Invite User** button (default size = `h-9`, default variant — `patterns/table-list-page.md` §5 toolbar CTA rule)
  - **Hidden on the Pending Approvals tab** — shown only on the User / Team tabs

### Footer (Pagination placement)
- `grid grid-cols-3 items-center`
  - Left: empty div (selected-count display not used)
  - Center: Pagination
  - Right: empty div

---

## Users Tab

### Table columns

| Column | min-width | notes |
|---|---|---|
| Checkbox | w-10 | |
| Name | 160px | sortable |
| Email | 220px | sortable |
| Team | 130px | sortable |
| Role | 100px | sortable |
| Status | 110px | sortable, StatusBadge |
| Updated | 140px | sortable + Info tooltip |
| Actions | w-14 | MoreHorizontal → Popover |

**Hidden / excluded columns (intentionally not implemented)**
- **Permission** — the Figma header node exists but there's no actual row cell → excluded from implementation
- **Created** — existed in an earlier version but was removed in the current implementation → the `createdAt`, `createdAtMs` fields are also removed from the User type

### Row Action Menu (opens on MoreHorizontal click)

- **Edit** → shortcut `⇧⌘P` → opens the Edit User Dialog
- **Deactivate** → shortcut `⌘B` → opens the Deactivate Confirm Dialog
- [Separator]
- **Resend invite mail** → shortcut `⌘S` → toast `Invitation resent to {email}`

### Edit User Dialog

Form Dialog (width 423px).

**Fields (gap=16px)**

1. **Name** — Input (pre-filled, no autofocus)
2. **Email** — Input (pre-filled, no autofocus)
3. **Status** — Label + StatusBadge (HORIZONTAL, justify-between)
   - Right: shows `<Button variant="outline" size="sm">Resend invitation</Button>` **only when in the Invited state**
   - Below: status-specific Alert
     - **Invited** → `Invitation sent and waiting for acceptance`
     - **Otherwise** → `Awaiting administrator approval.`
4. **Select Role** — Label + Select
   - The Info alert node right below it: `visible=false → excluded from implementation`
5. **Team** — Label + Select

**Footer**
- Cancel (`variant="secondary"`) + Save (`variant="default"`)

**Focus behavior**: When the dialog opens, no field is autofocused — focus is absorbed by an sr-only span (details in `components/dialog.md`).

### Deactivate Confirm Dialog

Confirm Dialog (width 512px).

- **Title**: `Deactivate User`
- **Body**: `Are you sure you want to deactivate this user ({email})?`
- **Footer**: Cancel (`variant="outline"`) + Deactivate (`variant="destructive"`)
- **Behavior**: On Deactivate click, update that row's `status → Deactivated` + toast `{name|email} deactivated`

---

## Pending Approvals Tab

### Table columns

| Column | x | w | notes |
|---|---|---|---|
| Checkbox | 0 | 33px | |
| Name | 33 | 141px | |
| Email | 174 | 200px | |
| Team | 374 | 160px | |
| Role | 534 | 120px | |
| Status | 654 | 120px | Verified StatusBadge |
| Updated | 774 | 120px | |
| **HIDDEN** | 845 | 160px | visible=false → excluded from implementation |
| Action | 894 | 171px | Reject + Approve buttons |

### Approve / Reject behavior

- **Approve button** (`variant="outline"` + `className="text-success"`, `size="sm"`)
  - On click, update that row's `status → Active` + toast `{name|email} approved`
  - Executes immediately with no confirm dialog
- **Reject button** (`variant="outline"`, `size="sm"`)
  - On click, opens the **Reject Confirm Dialog**

### Reject Confirm Dialog

Confirm Dialog (width 512px).

- **Title**: `Reject registration request`
- **Body**: `Are you sure you want to reject this registration ({email}) request?`
- **Footer**: Cancel (`variant="outline"`) + Reject (`variant="destructive"`)
- **Behavior**: On Reject click, update that row's `status → Deactivated` + toast `{name|email} rejected`

---

## Invite User Dialog

Form Dialog (width 423px). Opens via the "Invite User" button in the toolbar of the User / Team tabs.

**Fields (all required)**

1. **Email** — Input (empty field + placeholder)
2. **Select Role** — Select (placeholder `Select role`)
3. **Team** — Select (placeholder `Select team`)

**Validation**
- On submit, empty fields get `aria-invalid=true` + Label `text-destructive` + error message `{Field} is required`
- The field's error clears immediately on input

**Footer**
- Cancel (`variant="secondary"`) + Send Invite (`variant="default"`)

**Behavior**: On Send Invite click, a new user with `status: Invited` is added to the top of the list + toast `Invitation sent` + dialog closes

---

## Figma Node IDs

| Screen | Node ID |
|---|---|
| User tab (frame) | 1175:24855 |
| Pending Approvals tab (frame) | 1175:26199 |
| Navigation_menu (tabs) | 1175:26352 |
| Row Action Menu (popover) | 1175:21747 / 1282:9940 |
| Edit User Dialog | 1175:23785 / 1175:24292 |
| Edit User — Warning Alert (awaiting) | 1175:24309 |
| Invite User Dialog (validation) | 1276:5719 |
| Deactivate Confirm Dialog | 1284:14206 |
| Reject Confirm Dialog (screen) | 1296:4658 |
| Reject Confirm Dialog (spec) | 1296:5431 |
