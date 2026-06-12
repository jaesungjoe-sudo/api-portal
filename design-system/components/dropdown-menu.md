# DropdownMenu

> Action menu lists — table row ⋯, TeamCard ⋯, AccountDropdown, etc. The standard menu component, distinct from Popover (CLAUDE.md rule 6: menu lists use DropdownMenu).

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

## Anatomy

```tsx
<DropdownMenu>
  <DropdownMenuTrigger
    aria-label={`Actions for ${name}`}
    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
  >
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem className="px-2 py-1.5" onClick={...}>Edit</DropdownMenuItem>
    {showDelete && <DropdownMenuItem className="px-2 py-1.5" onClick={...}>Delete</DropdownMenuItem>}
  </DropdownMenuContent>
</DropdownMenu>
```

## Standard trigger (table / card ⋯)

| Part | Value |
|---|---|
| Size | `h-8 w-8` (32×32) for compact rows, `h-9 w-9` (36×36) for cards |
| Icon | `<MoreHorizontal className="h-4 w-4" />` (lucide) |
| Color | `text-muted-foreground` |
| Hover | `hover:bg-muted` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring` |
| Remove outline | `outline-none` (replaced by focus-visible) |
| Border radius | `rounded-md` |
| `aria-label` | **Required** — `Actions for {name}` form |

## Standard content

```tsx
<DropdownMenuContent align="end" className="w-56">
```

- `align="end"` — right-align to the trigger (when the anchor is top-right, like a table row ⋯)
- `w-56` (224px) — standard width. If menu item labels are long, widening up to `w-64` is OK.
- The shadcn primitive applies `shadow-md` + `border border-border` + `rounded-md` + `bg-popover` automatically (matches the CLAUDE.md shadow table)

## Standard item

```tsx
<DropdownMenuItem className="px-2 py-1.5" onClick={...}>Edit</DropdownMenuItem>
```

- `px-2 py-1.5` (8px / 6px) — standard padding. Slightly tighter than the shadcn default (matches Figma).
- Color is `text-popover-foreground` by default. **Don't inject `text-destructive` directly** — only after confirming against Figma (CLAUDE.md menu rule).
- Shortcuts (`⌘K`) — not shown if `visible=false` on the Figma instance. A separate `DropdownMenuShortcut` component exists (rarely used).

### Conditional items

A protected entity hides destructive actions:

```tsx
<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
{!team.protected && (
  <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
)}
```

→ Hide Delete entirely — a plain hide, not disable + tooltip. (See `patterns/clickable-card-with-menu.md` §5)

### Groups / Separator

```tsx
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Deactivate</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem>Resend invite mail</DropdownMenuItem>
```

`DropdownMenuSeparator` — 1px border-border. Separates semantically distinct action groups (e.g. general actions vs. Invited-state-only actions).

## Usage table (Phase1)

| Location | Trigger | Items |
|---|---|---|
| Users table ⋯ | h-8 w-8 ghost | Edit / Deactivate (+Resend if Invited) |
| Team Card ⋯ | h-9 w-9 ghost | Edit / Delete (except the Default team) |
| API Keys table ⋯ | h-8 w-8 ghost | Edit / Revoke (Active) / Delete |
| Account dropdown (TopNav) | h-9 avatar | Profile / Log out |

## How to identify in Figma

- If the menu appears at a *fixed position* after clicking the trigger and is a *list of items*, it's a DropdownMenu
- The trigger is a ⋯ / chevron / Avatar, etc.
- A Popover is an *arbitrary content container* (e.g. a tooltip-like info box, a filter form) — not a menu

## Anti-patterns

| ❌ | Reason |
|---|---|
| Implementing a menu list with `<Popover>` | CLAUDE.md rule 6 — menus use DropdownMenu. Popover is for arbitrary content. |
| Missing `aria-label` on the trigger | a11y. Screen readers can't recognize the menu trigger. |
| Applying `text-destructive` to items arbitrarily | Only after confirming against Figma. Most destructive actions (Delete, Revoke) use the normal color in the menu, with destructive styling in the dialog (confirm-dialog). |
| Default (`start`) instead of `align="end"` — when the trigger is a right-side anchor | The menu overflows off the right edge of the screen. align=end is standard. |
| Missing `className="px-2 py-1.5"` | Without the Figma-matching padding, item spacing looks off. |
| Adding a shortcut display (`⌘K`) that isn't in Figma | Confirm against Figma. If not specified, don't show it. |
| Too many menu items (over 5) | Long menus hurt UX. Split by category with separators or consider a nested submenu. |

## Notes

- `DropdownMenu` itself works either controlled or uncontrolled. But when opening a dialog from inside the menu (Delete → ConfirmDialog), the parent manages the dialog's open state.
- The menu closes automatically when an item is clicked (primitive default). No explicit close call needed.
- Concern about the menu going off-viewport — the primitive handles flip / shift automatically (Base UI floating logic).
- Keyboard: ↑↓ move between items, Enter selects, Esc closes — handled automatically by the primitive.
- Submenus (`DropdownMenuSub`) are currently unused. Separate rule when needed.
