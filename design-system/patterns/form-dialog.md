# form-dialog pattern

> A modal for **creating, editing, or inviting** a single object. It layers the rules in this doc on top of the Dialog primitive. Confirmation dialogs (Delete / Revoke / Deactivate / Reject) are a separate pattern — see `patterns/confirm-dialog.md`.

## Where used

This pattern covers dialogs of the following kinds:

- Create-* (e.g. Create API Key, Create Team)
- Edit-* (e.g. Edit API Key, Edit Team, Edit User, Profile)
- Invite-* (e.g. Invite User)
- View-* (e.g. View API Key — the no-Cancel variant, see §10)

Destructive actions (Delete / Revoke / Deactivate / Reject) use the `confirm-dialog` pattern.

---

## 1. Standard anatomy

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[423px]">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {/* description policy: see §3 */}
    </DialogHeader>

    {/* field group — standard gap (§4) */}
    <div className="flex flex-col gap-2">
      <Label htmlFor={...} className={error ? "text-destructive" : ""}>
        {label}
      </Label>
      <Input id={...} aria-invalid={error} ... />
      {error && (
        <p className="text-sm text-destructive">{label} is required</p>
      )}
    </div>

    {/* more field groups... */}

    {/* footer — DialogFooter primitive (§6) */}
    <DialogFooter>
      <Button variant="outline" onClick={...}>Cancel</Button>
      <Button onClick={...}>{confirmLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 2. Width

| Dialog kind | width | `showCloseButton` |
|---|---|---|
| form-dialog (this pattern) | `sm:max-w-[423px]` | **false** (no X button — primitive default) |
| confirm-dialog | `sm:max-w-[512px]` (separate pattern) | false (explicit) |

→ Matches Figma. No arbitrary width changes.

> **X button policy (corrected 2026-05-29)** — Neither the Figma form-dialog (1489:47265) nor confirm-dialog (1460:30528) has a top-right X. Changed the `showCloseButton` default of the `DialogContent` primitive from `true` → `false` (matches CLAUDE.md rule 10). Dismiss paths remain the three: Cancel button / Esc / backdrop click.

---

## 3. Header / Description policy

- **DialogTitle**: Required. Verb + noun ("Create a new key", "Invite User", "Edit Team").
- **DialogDescription**: Conditionally recommended.

Conditions to **add** a DialogDescription:
- (a) When the action's outcome isn't clear to the user (e.g. Invite → "Send an invitation link to start collaborating.")
- (b) When the object being created affects other users

Simple CRUD ("Create a new key", "Edit Team") is sufficient with just the Title, no description. **Don't add a meaningless description** (e.g. Title is "Profile" but description is "Edit your profile" — no informational value).

---

## 4. Field group — the `gap-2` standard

### Gap inside a field group

Between Label + Input/Select + error message: **`flex flex-col gap-2`** (= 8px)

```tsx
<div className="flex flex-col gap-2">
  <Label ... />
  <Input ... />
  {error && <p ...>...</p>}
</div>
```

### Gap between field groups

The `DialogContent` primitive itself gives a `gap-4` (= 16px) between its children. **No extra wrapper needed.** Matches Figma `itemSpacing: 16`.

```tsx
// ❌ Don't wrap in another wrapper inside DialogContent
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <div className="flex flex-col gap-4">  ← unnecessary. DialogContent already has gap-4
    <div className="flex flex-col gap-2">...field 1...</div>
    <div className="flex flex-col gap-2">...field 2...</div>
  </div>
  <DialogFooter>...</DialogFooter>
</DialogContent>

// ✅
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <div className="flex flex-col gap-2">...field 1...</div>
  <div className="flex flex-col gap-2">...field 2...</div>
  <DialogFooter>...</DialogFooter>
</DialogContent>
```

---

## 5. Validation rules

When a required value is unmet, apply all of the following at once:

| Element | Applied |
|---|---|
| `<Label>` | `className={error ? "text-destructive" : ""}` |
| `<Input>` / `<SelectTrigger>` | `aria-invalid={error}` |
| Error message `<p>` | `className="text-sm text-destructive"` |

```tsx
<Label htmlFor="x" className={errors.x ? "text-destructive" : ""}>
  {label}
</Label>
<Input id="x" aria-invalid={errors.x} ... />
{errors.x && (
  <p className="text-sm text-destructive">{label} is required</p>
)}
```

### Clear immediately on input change

```tsx
onChange={(e) => {
  setX(e.target.value);
  if (errors.x) setErrors((p) => ({ ...p, x: false }));
}}
```

### Error message copy

Standard copy: **`{Field name} is required`** (e.g. "Name is required", "Team name is required", "Email is required").

### Color policy — unified on `text-destructive`

Error messages are `text-destructive`. **No `text-muted-foreground`** (it must match the Label color so the meaning is clear).

---

## 6. Footer — use the `DialogFooter` primitive

No raw `<div className="mt-2 flex justify-end gap-2">`. Every footer uses the `<DialogFooter>` primitive.

```tsx
import { DialogFooter } from "@/components/ui/dialog";

<DialogFooter>
  <Button variant="outline" onClick={handleClose}>Cancel</Button>
  <Button onClick={handleConfirm}>{confirmLabel}</Button>
</DialogFooter>
```

### Figma fidelity — plain footer

To match Figma, the `DialogFooter` primitive is **plain (no background / separator / extra padding)**. The footer itself is simply `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`. The top gap from the body is handled by `DialogContent`'s `gap-4`, so no extra `mt-2`, etc.

> See the change history of the PR that wrote this doc for the detailed Figma inspection results. No horizontal separator above the footer / same background as the body / footer padding stays inside / no separate rounded corners — all four are plain.

### Button order

Left → right order in JSX:
- Cancel (left)
- Confirm CTA (right)

The `DialogFooter` primitive auto-reverses to `flex-col-reverse` on mobile (CTA moves up). In code you only need to mind the desktop order.

---

## 7. Button variant / label

### variant

| Position | variant |
|---|---|
| Cancel | `outline` |
| Confirm CTA (Create / Save / Invite) | `default` (omit = primary) |

> Why Cancel is `outline`: both form-dialog and confirm-dialog unify on outline. The `secondary` variant is reassigned to other uses (toolbar/header secondary actions) — see `components/button.md`.

### CTA label convention

| Dialog kind | CTA label |
|---|---|
| Create-* | `Create` |
| Edit-* / Profile | `Save` |
| Invite-* | `Send Invite` or `Invite` |
| View-* (no-Cancel variant) | `Done` |
| Cancel (common to all dialogs) | `Cancel` |

---

## 8. Blocking autoFocus

By default the Base UI Dialog may move focus to the first focusable child when it opens. Per the CLAUDE.md rule, **no field should become active when the dialog opens**.

### Blocking method — 2-Layer

**(1) An sr-only focus-absorbing span right under `DialogContent`**:

```tsx
<DialogContent className="sm:max-w-[423px]">
  <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
  <DialogHeader>...</DialogHeader>
  ...
</DialogContent>
```

→ When Base UI looks for the first focusable node, this span is caught and absorbs it with no visible focus.

**(2) Explicitly set `autoFocus={false}` on the first input/select** (defensive):

```tsx
<Input
  id="..."
  autoFocus={false}  // explicitly block
  ...
/>
```

Applied identically to Edit / Create / Invite dialogs.

### Scope

- Edit dialog: if the first pre-filled field is focused, the user may unintentionally start editing → blocking is required
- Create / Invite dialog: if an empty field is focused, the placeholder disappears and disorients the user → blocking is required
- View-* dialog (ViewApiKeyDialog, etc.): no input fields, so no effect. Keeping the sr-only span is recommended for safety.

---

## 9. Edit pre-fill / Create empty

### Edit dialog

On every open, pre-fill with the existing object's values + reset errors:

```tsx
useEffect(() => {
  if (open && initialValue) {
    setName(initialValue.name);
    setX(initialValue.x);
    setErrors({ name: false, x: false });
  }
}, [open, initialValue]);
```

### Create / Invite dialog

On every open, empty fields + reset errors:

```tsx
useEffect(() => {
  if (open) {
    setName("");
    setX("");
    setErrors({ name: false, x: false });
  }
}, [open]);
```

---

## 10. View variant (form-dialog without Cancel)

A read-only + single "Done" button form, like ViewApiKeyDialog. Displays info only, with no input.

- Same width: `sm:max-w-[423px]`
- Footer: just `<Button>Done</Button>` inside `<DialogFooter>`, no Cancel
- Uses only DialogTitle (Description usually unnecessary)
- All fields are `readOnly` or `disabled` (when Figma `State === "disabled"`)

```tsx
<DialogFooter>
  <Button onClick={() => onOpenChange(false)}>Done</Button>
</DialogFooter>
```

---

## 11. Anti-patterns

| ❌ | Reason |
|---|---|
| raw `<div className="mt-2 flex justify-end gap-2">` footer | The DialogFooter primitive's responsive/alignment behavior isn't applied. Violates §6. |
| Adding `mt-2` or `mt-*` margin above the footer | Duplicates DialogContent's `gap-4`. Makes the footer-body gap awkward. |
| `text-muted-foreground` error message | Mismatches the Label color (text-destructive). Ambiguous meaning. Violates §5. |
| Showing only plain text without `aria-invalid` | Accessibility. The screen reader can't recognize the error. Violates §5. |
| Explicit `autoFocus` on the first Input | The Edit dialog enters edit mode the moment it opens → ignores user intent. Violates §8. |
| Arbitrarily changing the width (other than 423) | Violates Figma. If a case needs confirm-dialog, use the separate pattern. Violates §2. |
| `variant="secondary"` Cancel | Cancel is unified on `outline` (both form / confirm). Violates §7. |
| Grouping field groups in another wrapper inside `DialogContent` (`<div className="flex flex-col gap-4">...</div>`) | DialogContent already applies `gap-4`. Duplicate. Violates §4. |
| A meaningless Description on simple CRUD ("Edit your profile") | No informational value. Violates §3. |

---

## 12. Components using it (Phase1)

Dialogs that follow this pattern (`src/components/api-portal/`):

| File | Kind | CTA label |
|---|---|---|
| `CreateApiKeyDialog.tsx` | Create | Create |
| `EditApiKeyDialog.tsx` | Edit | Save |
| `ViewApiKeyDialog.tsx` | View (§10) | Done |
| `CreateTeamDialog.tsx` | Create | Create |
| `EditTeamDialog.tsx` | Edit | Save |
| `ProfileDialog.tsx` | Edit (self) | Save |
| `InviteUserDialog.tsx` | Invite | Send Invite |
| `EditUserDialog.tsx` | Edit | Save |

---

## Related docs

- `components/dialog.md` — Dialog primitive spec (width / Title typography / focus rules)
- `components/button.md` — Button variant definitions (incl. secondary reassignment)
- `components/input.md` / `components/select.md` — field component specs
- `patterns/confirm-dialog.md` — destructive-action dialog
- `rules/instance-variant.md` — How to identify Disabled
