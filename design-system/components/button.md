# Button

## Import
```tsx
import { Button } from "@/components/ui/button"
```

## Variants (Figma library)

| variant | Usage | shadow |
|---|---|---|
| `default` | Primary actions (Save, Send Invite, Create) | `shadow-xs` |
| `outline` | **All Cancel** (form-dialog / confirm-dialog), Approve / Reject / Resend, secondary landing CTA | `shadow-xs` |
| `secondary` | **Toolbar / Header secondary actions** (Export / Filter / Refresh, etc.). Currently 0 usages — planned for Webhooks / Analytics, etc. | `shadow-xs` |
| `ghost` | Flat (icon buttons) | none |
| `destructive` | Delete/destructive actions (Deactivate, Reject, Delete) | `shadow-xs` |
| `link` | Text link | none |

### Cancel is always `outline` (change history)

Previously, Cancel was split — `secondary` in form-dialog, `outline` in confirm-dialog. Now **all dialog Cancel buttons are unified to `outline`**. `secondary` is reassigned to secondary actions outside dialogs. For the full rationale, see `patterns/form-dialog.md` §7.

## Size

| size | height | padding | font |
|---|---|---|---|
| `xs` | h-7 (28px) | px-2 (8px) | text-xs (12px) |
| `sm` | h-8 (32px) | px-3 (12px) | text-sm (14px) |
| `default` | h-9 (36px) | px-4 (16px) | text-sm (14px) |
| `lg` | h-10 (40px) | px-8 (32px) | text-sm (14px) |
| `icon-xs` | size-7 (28×28) | — | — |
| `icon-sm` | size-8 (32×32) | — | — |
| `icon` | size-9 (36×36) | — | — |
| `icon-lg` | size-10 (40×40) | — | — |

## How to identify in Figma

- `mainComponent` name: "Button", "Buttons"
- `componentProperties.Type.value` → variant value (`default` / `outline` / `ghost` / `destructive`, etc.)
- `componentProperties.Size.value` → size value (`sm` / `default` / `lg`, etc.)
- `componentProperties.State.value` → state (`default` / `hover` / `disabled`)
- Re-verify via the fills + strokes combination: details in `design-system/rules/instance-variant.md`

## Notes

- **The Approve button is `variant="outline" className="text-success"`** (not primary). Approve in the Pending Approvals table is outline + success color.
- **Destructive actions in confirm dialogs are `variant="destructive"`** (Deactivate, Reject).
- **The Resend button is `variant="outline"`** (not secondary). It appears in the Edit dialog for Invited users.
- **ghost / link have no shadow**. The remaining variants use `shadow-xs`.
- Loading state: `<Button disabled><Loader2 className="animate-spin mr-2" />…</Button>`
- Icon-only buttons: `variant="ghost" size="icon"` or `size="icon-sm"`.
