# confirm-dialog pattern

> A modal that confirms a single destructive or hard-to-undo action (Figma name: "Alert dialog"). It layers the rules in this doc on top of the Dialog primitive. When an input form is needed, use the separate pattern — see `patterns/form-dialog.md`.

## Where used

This pattern covers dialogs of the following kinds:

- Delete-* (e.g. Delete API Key, Delete Team)
- Revoke-* (e.g. Revoke API Key)
- Deactivate-* (e.g. Deactivate User)
- Reject-* (e.g. Reject Registration)

Dialogs with an input form (Create / Edit / Invite / View) use the `form-dialog` pattern.

---

## 1. Usage — the `ConfirmDialog` shared component

All dialogs in this pattern are built with the **`<ConfirmDialog>` shared component**. Do not assemble the Dialog primitive directly.

```tsx
import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";

<ConfirmDialog
  open={target !== null}
  onOpenChange={(o) => { if (!o) setTarget(null); }}
  title="Delete API Key"
  description="Are you sure you want to delete this API Key?"
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

When emphasizing an entity name, email, etc. in the body, pass JSX directly to `description`:

```tsx
<ConfirmDialog
  ...
  description={
    <>Are you sure you want to delete the <strong>{team.name}</strong> team?</>
  }
/>
```

---

## 2. Anatomy (inside ConfirmDialog)

```tsx
<Dialog>
  <DialogContent className="sm:max-w-[512px]" showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">{confirmLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. Width — 512px (differs from form-dialog)

| Pattern | width |
|---|---|
| form-dialog | `sm:max-w-[423px]` |
| **confirm-dialog (this pattern)** | `sm:max-w-[512px]` |

→ Matches Figma. Confirm dialogs tend to have longer body copy, so they're a bit wider.

---

## 4. `showCloseButton={false}` — always

**Hide** the top-right X button of the Dialog primitive. This forces the user to "explicitly press either Cancel or Confirm" and is the key safety mechanism for destructive actions.

→ form-dialog defaults `showCloseButton` to true (X may show); confirm-dialog is always false.

---

## 5. Header / Description policy

- **DialogTitle**: Required. Verb + noun ("Delete API Key", "Revoke API Key", "Deactivate User", "Reject registration request").
- **DialogDescription**: **Always required** (form-dialog is conditional). For a11y and Figma fidelity. Either plain text or JSX with an emphasized entity name is fine.

---

## 6. Footer

`DialogFooter` primitive (matches the plain footer) + outline Cancel + destructive Confirm.

| Position | variant |
|---|---|
| Cancel (left) | `outline` |
| Confirm (right) | `destructive` (default) |

JSX order is Cancel → Confirm (left → right). On mobile, the DialogFooter primitive automatically reverses to `flex-col-reverse` so the CTA moves to the top.

### Non-destructive confirm — `confirmVariant="default"`

A very rare case. For an action like Logout that "isn't destructive but still needs intent confirmation" — override with `confirmVariant="default"`.

```tsx
<ConfirmDialog
  ...
  title="Log out"
  description="You'll need to sign in again to continue."
  confirmLabel="Log out"
  confirmVariant="default"
  onConfirm={handleLogout}
/>
```

Zero usages in Phase1 so far — since `destructive` is the default, it applies automatically if unspecified.

---

## 7. Differences from form-dialog (at a glance)

| | form-dialog | confirm-dialog |
|---|---|---|
| **Purpose** | Take input (Create / Edit / Invite / View) | Confirm a single action (Delete / Revoke / Deactivate / Reject) |
| **Width** | `sm:max-w-[423px]` | `sm:max-w-[512px]` |
| **showCloseButton** | default true (X shows) | **`false` (X hidden)** |
| **Body** | Multiple fields (Label + Input/Select + validation) | **1 DialogDescription** (required) |
| **DialogDescription** | Conditionally recommended | **Always required** |
| **Footer** | DialogFooter (outline Cancel + default CTA) | DialogFooter (outline Cancel + **destructive** CTA) |
| **Block autoFocus** | sr-only span + autoFocus={false} | No input → not needed |
| **Shared component** | None (each dialog written directly) | **`<ConfirmDialog>` enforced** |

---

## 8. Anti-patterns

| ❌ | Reason |
|---|---|
| Building a confirm by assembling the Dialog primitive directly | `<ConfirmDialog>` is enforced. Risk of deviating from the rules (showCloseButton, body node, footer). |
| Not specifying `showCloseButton` (= true) | Defeats the confirm's key safety mechanism. Violates §4 of this pattern. |
| Writing the body directly as `<p>` or `<span>` | Use DialogDescription — for a11y. The screen reader must recognize it as the dialog body. |
| Confirm button using `default` variant (for a destructive action) | destructive is the default. It's the visual signal of a destructive action. Violates §6. |
| Cancel button using `secondary` or `default` | Unified with form-dialog — Cancel is always `outline`. |
| Arbitrarily changing the width (other than 512) | Violates Figma. If a case needs form-dialog, switch the whole pattern. |
| Adding an input field to a confirm-dialog | Violates the pattern. If input is needed, switch to form-dialog or split into two steps. |

---

## 9. Components using it (Phase1)

Dialogs that use this pattern (= `ConfirmDialog`):

| File / location | Action | Confirm variant |
|---|---|---|
| `DeleteApiKeyDialog.tsx` | Delete API Key | destructive |
| `RevokeApiKeyDialog.tsx` | Revoke API Key | destructive |
| inline in `users/page.tsx` | Deactivate User | destructive |
| inline in `users/page.tsx` | Reject Registration | destructive |
| inline in `users/page.tsx` | **Delete Team** (added 2026-05-29) | destructive |

Each dialog file is a thin wrapper over `<ConfirmDialog>` — only title / description / confirmLabel differ.

---

## Related docs

- `patterns/form-dialog.md` — input-form dialog (contrast)
- `components/dialog.md` — Dialog primitive spec (Width, showCloseButton, focus rules)
- `components/button.md` — Button variant definitions (destructive, etc.)
- `rules/states.md` §5 — Error handling (toast on optimistic rollback)
