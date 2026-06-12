# Sonner (Toast)

> Notifies the result of a transient action — "Invitation sent", "Team deleted", "Failed to copy", etc. Recommended by the "transient / action error" prescription in `rules/states.md` §5. Permanent / blocking errors use Alert.

## Import

```tsx
import { toast } from "sonner";
```

> The `<Toaster>` itself is **mounted in the root layout** (`src/app/layout.tsx`). Pages just call it.

## How to call

```tsx
import { toast } from "sonner";

toast.success("Team created");
toast.error("Failed to copy key");
toast.info("Subscription updated");
toast.warning("Invitation expires soon");
toast.loading("Saving...");  // usually combined with the promise pattern
```

### Adding a description

```tsx
toast.success("Invitation sent", {
  description: `An invite has been sent to ${email}.`,
});
```

### Promise pattern (loading + result)

```tsx
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved",
  error: "Failed to save",
});
```

## Standard visuals (custom wrapper)

`src/components/ui/sonner.tsx` enforces the following on top of the sonner primitive:

| Item | Value |
|---|---|
| Position | `top-center` |
| Container | `flex items-center gap-1.5 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md` |
| Title | `text-sm font-medium text-foreground` (= typography role `label`) |
| Description | `text-sm text-muted-foreground` (= typography role `body-sm`) |
| Shadow | `shadow-md` (same as Dropdown / Tooltip — CLAUDE.md shadow table) |

### Semantic icon mapping

| toast type | lucide icon | Color token |
|---|---|---|
| `success` | `CircleCheck` | `text-success` |
| `info` | `Info` | `text-info` |
| `warning` | `TriangleAlert` | `text-warning` |
| `error` | `OctagonX` | `text-destructive` |
| `loading` | `LoaderCircle` (animate-spin) | `text-muted-foreground` |

→ Matches the Figma `Sonner` component set. Instance-level overrides broke consistency in the design, but the wrapper unifies them with tokens.

## Usage table (Phase1)

| Location | Call | Type |
|---|---|---|
| Create API Key success | `toast.success("API key created")` | success |
| Delete API Key | `toast.success("API key deleted")` | success |
| Revoke API Key | `toast.success("API key revoked")` | success |
| Invite User | `toast.success("Invitation sent", { description })` | success + desc |
| Edit User | `toast.success("User updated")` | success |
| Create Team / Edit / Delete | `toast.success("Team ... ")` | success |
| Resend Invitation | `toast.success("Invitation resent to ...")` | success |
| Approve / Reject | `toast.success("... approved/rejected")` | success |
| Deactivate User | `toast.success("... deactivated")` | success |
| ViewApiKey copy success | `toast.success("API key copied to clipboard")` | success |
| ViewApiKey copy failure | `toast.error("Failed to copy key")` | error |
| Profile / Phase1 mock placeholder | `toast.info("... — Phase1 design pending")` | info |

→ Mostly success. error is 1 case (clipboard). info is for placeholder notices.

## Usage guidelines

### When toast vs Alert

| Situation | Prescription |
|---|---|
| Action success ("Saved", "Deleted") | **toast.success** |
| Transient action failure ("Failed to copy", temporary network error) | **toast.error** |
| Permanent / blocking error (fetch failure, no permission) | Alert (`states.md` §5) |
| Form validation error | Inline on the field (`form-dialog.md` §5) |

### Copy guidelines

- **Concise verb + noun**: "Team created" / "Invitation sent" / "API key deleted"
- **Generalize into the user's language** — don't expose raw backend errors (`err.message`, stack traces) (`states.md` §5.5)
- **Use a description only for supplementary info**: when specific details like email/name are needed. A simple confirm is fine with the title alone.

## a11y

- The sonner primitive automatically applies `role="status"` (success/info/warning) or `role="alert"` (error)
- Screen readers announce the toast automatically when shown
- Keyboard: dismiss with ESC (primitive default)

## Anti-patterns

| ❌ | Reason |
|---|---|
| Notifying a permanent error via toast | Auto-dismisses and the user misses it. Blocking errors use Alert. |
| Exposing raw backend error messages (`toast.error(err.message)`) | UX / security. Generalize into the user's language. (`states.md` §5.5) |
| Showing info only in a toast (it disappears when the user leaves the page) | Permanent info goes in the body / Dialog. A toast is ephemeral. |
| Mounting an extra `<Toaster />` on each page | Already in the root layout. Duplicate mounting shows toasts in multiple places. |
| Custom visuals / colors (inline `bg-`, `text-` classes) | The wrapper unifies with semantic tokens. Inline overrides break light/dark consistency. |
| Showing for over 5 seconds / forcing user dismissal (generalizing `duration: Infinity`) | The sonner default duration is appropriate. Too long blocks the screen; too short and it's missed. |

## Notes

- Multiple toasts at once — sonner stacks them automatically (3 max by default)
- On mobile, top-center can overlap the TopNav — fine in the current design, but revisit if an additional notification channel is introduced
- You can navigate away immediately after calling toast — the toast is at the layout level so it doesn't unmount
- `toast.promise` is an async-work pattern — unused in Phase1 mock (instant responses), to be used when a real API is introduced
