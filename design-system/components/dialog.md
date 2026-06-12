# Dialog

## Import
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
```

## Title typography

- `text-lg font-semibold leading-7` (18px / 28px / 600)
- Applied as a default inside the `dialog.tsx` component. Don't override it from pages.

## Two width types

| Type | width | Usage |
|---|---|---|
| Form Dialog | `sm:max-w-[423px]` | Edit / Invite / Create (input forms) |
| Confirm Dialog | `sm:max-w-[512px]` | Deactivate / Reject (confirm dialogs) |

## Confirm Dialog common structure

For detailed rules, see `patterns/confirm-dialog.md`. This section is the skeleton only — all confirm dialogs use the **shared `<ConfirmDialog>` component** (don't assemble the Dialog primitive directly).

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

Internally assembled with `showCloseButton={false}` + `sm:max-w-[512px]` + outline Cancel + destructive Confirm. For detailed variations (entity-name emphasis, non-destructive variant), see `patterns/confirm-dialog.md` §1 / §6.

- Padding: `24px all` (rounded-lg = 10px, gap 16px)
- Overlay: `rgba(0,0,0,0.30)` (keep the default)

## Form Dialog common structure

For detailed rules, see `patterns/form-dialog.md`. This section is the skeleton only.

```tsx
<Dialog open={editOpen} onOpenChange={handleClose}>
  <DialogContent className="sm:max-w-[423px]">
    {/* Edit dialogs need a focus-absorbing sr-only span */}
    <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {/* DialogDescription is conditional — form-dialog.md §3 */}
    </DialogHeader>
    {/* Field groups: each gap-2; the DialogContent gap-4 handles spacing between groups */}
    <div className="flex flex-col gap-2">
      <Label .../>
      <Input .../>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSave}>{actionLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

> **The DialogFooter primitive is plain** (matches Figma — no divider above the footer, no background, no edge extension, no rounded corners). Don't add a top margin such as `mt-2`. For detailed inspection results, see `patterns/form-dialog.md` §6.

## Focus rules (Edit dialogs)

- **When the dialog opens, no field may be in the active (focused) state**.
- `autoFocus` is forbidden.
- Place a **focus-absorbing sr-only span** directly under DialogContent:
  ```tsx
  <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
  ```
- Create/Invite dialogs use empty fields + placeholders, so focus absorption is unnecessary.

## Validation rules

- On save/submit, if a required field is empty, show `aria-invalid` + Label `text-destructive` + an error message.
- Edit dialogs behave the same: clearing an existing value and saving is invalid.
- The moment a field value changes, that field's error is cleared immediately.

## How to identify in Figma

- `mainComponent` name: "Dialog", "Modal"
- Map the internal structure to `DialogHeader` / `DialogTitle` / `DialogDescription`
- The Close button is built into `dialog.tsx`. Don't add it manually.
