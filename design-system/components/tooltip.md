# Tooltip

> Shows a short supplementary explanation on hover/focus. Used for the note next to a help icon, explaining a disabled-state reason, etc. Menu lists and general popover content are separate (DropdownMenu / Popover).

## Import

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
```

> `TooltipProvider` is **already mounted in the root layout (`src/app/layout.tsx`)**. No separate wrapping is needed in pages/components.

## Anatomy

```tsx
<Tooltip>
  <TooltipTrigger className="flex items-center">
    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
  </TooltipTrigger>
  <TooltipContent side="top">
    Last time this user&apos;s record was modified
  </TooltipContent>
</Tooltip>
```

- **`Tooltip`**: state root (controlled / uncontrolled both OK).
- **`TooltipTrigger`**: the element that receives hover/focus. Usually an icon or short text.
- **`TooltipContent`**: the box that's shown. Base UI floating layer.

## Standard trigger

| Usage | Class |
|---|---|
| Info icon (help) | `<Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />` |
| Small visual icon (Help / Question) | h-3.5 to h-4 lucide icon + muted-foreground |
| Disabled action reason | `<span>` or the disabled Button itself |

`cursor-default` — visually signals this is hover-only, not a click action (not a pointer).

## Standard content

- Default `side="top"` (above the trigger)
- `sideOffset={4}` (4px) — primitive default
- Body: a one-line short explanation (`text-xs` or `text-sm`). If too long, better to move it inline into the body.
- The primitive automatically applies `bg-popover` + `text-popover-foreground` + `shadow-md` + `rounded-md`.

## Examples

### Note next to a help icon

```tsx
<div className="flex items-center gap-1.5">
  <span>{label}</span>
  <Tooltip>
    <TooltipTrigger className="flex items-center">
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
    </TooltipTrigger>
    <TooltipContent>{description}</TooltipContent>
  </Tooltip>
</div>
```

### Disabled reason (recommended pattern, `rules/states.md` §6)

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <Button disabled>Delete</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>This item is protected and can't be deleted.</TooltipContent>
</Tooltip>
```

- A disabled Button doesn't receive mouse events → wrap it in `<span tabIndex={0}>` so it receives hover/focus
- `asChild` — TooltipTrigger uses the child element directly as the trigger

## Usage table (Phase1)

| Location | trigger | content |
|---|---|---|
| Next to the Users table "Updated" header | Info icon (h-3.5) | "Last time this user's record was modified" |
| Sidebar (shadcn default) | menu trigger | menu label (on mobile) |

Future candidates:
- Next to Status on API Keys (Expired/Revoked reason)
- Disabled reason for protected fields in form-dialog

## a11y

- `TooltipTrigger` automatically links the content via `aria-describedby`
- Keyboard: content also shows on focus (same behavior as mouse hover)
- Screen reader: the content is read automatically

## How to identify in Figma

- `mainComponent` name: "Tooltip"
- A short box that appears only on hover of the trigger
- Distinguish from a general Popover (a persistently shown container)

## Anti-patterns

| ❌ | Reason |
|---|---|
| Tooltip body over 2 lines / over 50 chars | For short supplementary info only. If long, show inline in the body. |
| Routing a click action through a Tooltip (e.g. a Button inside a tooltip) | A transient display container — click actions go in a Popover or dialog. |
| Wrapping with an extra `TooltipProvider` on each page | Already in the root layout. Duplicate mounting makes behavior (delay, etc.) unstable. |
| Putting the trigger directly on a disabled Button (`<TooltipTrigger asChild><Button disabled />`) — without a `<span>` wrap | Disabled elements can't receive hover events. Wrapping in `<span tabIndex={0}>` is required. |
| Info icon missing `cursor-default` | A clickable-looking cursor (pointer) — UX confusion. |
| Building a menu list with Tooltip | Tooltip is for a single short text. Menus use DropdownMenu. |

## Notes

- `TooltipProvider` uses `delay={0}` — our project shows immediately (designer's intent). Not the default 750ms delay.
- `position` / `side` / `align` are all adjusted via primitive props. No custom positioning needed.
- No showing multiple tooltips at once — opening a new tooltip auto-closes the previous one (Base UI default behavior).
