# Popover / Menulist

> Menu-list UI defaults to `DropdownMenu`. `Popover` is for general positioning containers, not menus.

## Import

```tsx
// Menu lists (Row Action, Account, dropdown selection, etc.)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// General positioning container (tooltip-like custom overlay, etc.)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
```

## When to use which

| Usage | Component | Reason |
|---|---|---|
| Row action 3-dot menu | `DropdownMenu` | Built-in keyboard navigation · ARIA · focus trap |
| Account dropdown | `DropdownMenu` | Same |
| Select trigger | `Select` / `SelectTrigger` | For selection lists only |
| Custom card / info bubble | `Popover` | General content positioning |

**For "anything that looks like a menu," always pick `DropdownMenu` first.** When unsure, default to DropdownMenu.

## Menulist common spec (Figma library + finalized design values)

> Figma library node: `3134:5588` (Menulist)
> Applies to: `DropdownMenuContent`, `SelectContent`, `PopoverContent`

| Property | Value | Tailwind |
|---|---|---|
| Background | `popover` token | `bg-popover` |
| Border | `border` 1px | `border border-border` |
| Corner | 8px | `rounded-lg` |
| Shadow | `shadow-md` | `shadow-md` |
| Inner padding | 4px | `p-1` |
| Item height | 32px | `h-8` (`px-2 py-1.5` is an OK substitute) |
| Item hover/focus | `accent` token | `focus:bg-accent focus:text-accent-foreground` |
| Item text | `popover-foreground` | Inherited by default (don't set the color) |
| Separator | `border` 1px | `<DropdownMenuSeparator />` |

→ The `DropdownMenuContent` / `DropdownMenuItem` defaults already meet the spec above. Don't override colors arbitrarily via className.

### Don't add color to destructive actions (Delete/Deactivate)

In Figma, Delete / Deactivate text is also `popover-foreground` (the normal color). **Don't add `text-destructive` based on the "destructive action = red" convention.** Details: `design-system/rules/shadcn.md` "no adding styles" principle.

## Row Action Menu pattern

The `MoreHorizontal` dropdown in a table row:

```tsx
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger
    aria-label={`Actions for ${item.name}`}
    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
  >
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem className="px-2 py-1.5" onClick={() => onEdit(item)}>
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem className="px-2 py-1.5" onClick={() => onDelete(item)}>
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Spec summary

| Item | Value |
|---|---|
| Dropdown width | `w-56` (224px) |
| Trigger size | `h-8 w-8` (32×32) |
| Trigger aria-label | **Required** — include row-identifying info (`Actions for {name}`) |
| Item padding | `px-2 py-1.5` |
| Separator | `<DropdownMenuSeparator />` (manual `<hr />` / `<Separator />` forbidden) |

## Handling keyboard shortcut text (⌘K, etc.)

The Figma library Menulist has a shortcut field like `⌘K`, but **on actual design instances it's usually `visible=false`**. Implement based on the actual Figma instance — don't add shortcuts arbitrarily just because the library has them.

## How to identify in Figma

- `mainComponent` name: "Menulist", "Dropdown", "Popover"
- The trigger is usually a separate icon button (`MoreHorizontal` / avatar / chevron, etc.)
- Action text color like `Edit / Delete / Deactivate` = `popover-foreground` (normal)
- Handle the shortcut field after checking the actual instance's `visible` value

## Notes

- Wrap row-level conditional items (e.g. "Resend invite" only when status=Invited) in `{isInvited && <>...</>}`.
- `DropdownMenuLabel` must be used inside a `DropdownMenuGroup` (a Base UI constraint, details: `design-system/rules/shadcn.md`).
