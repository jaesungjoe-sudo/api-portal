# clickable-card-with-menu pattern

> The standard structure for when the entire card is a link/action while a separate menu (e.g. DropdownMenu) inside the card must also stay active. Simply wrapping the card in a `<Link>` causes clicks on inner buttons to also trigger navigation; this is solved with an `absolute inset-0` overlay + `pointer-events` toggle.

## Where used

- **TeamCard** (inline component in `users/page.tsx`) — Team grid. Card = detail page; the ⋯ menu = Edit/Delete.
- Any future card that needs the same structure (whole-card click + inner menu).

Cases where this pattern is *not* needed:
- No inner button in the card → wrap the card in a plain `<Link>`.
- The card only displays information — no click action → a simple `<div>`.

---

## 1. Core problem

```tsx
// ❌ Naive implementation — inner button click also triggers navigation
<Link href={`/users/team/${team.name}`}>
  <div className="...">
    <h3>{team.name}</h3>
    <DropdownMenu>...</DropdownMenu>  {/* clicking it also follows the card link */}
  </div>
</Link>
```

You can work around it with `event.stopPropagation()`, but:
- Keyboard focus / a11y becomes complicated
- Every time another interactive element is added, you need to add another stop

→ Solving it structurally is the point of this pattern.

---

## 2. Standard structure — Absolute overlay + pointer-events

```tsx
<div className="relative ...">
  {/* 1. Absolute overlay Link — whole-card click area */}
  <Link
    href={destination}
    aria-label={`View ${name}`}
    className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
  />

  {/* 2. Content — pointer-events-none lets clicks pass through */}
  <div className="relative pointer-events-none">
    <h3>{name}</h3>

    {/* 3. Inner interactive element — re-enabled with pointer-events-auto */}
    <div className="pointer-events-auto">
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>...</DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>
```

### Core principle

| Layer | Role |
|---|---|
| Outer `<div>` (relative) | Positioning context for the overlay |
| `<Link className="absolute inset-0">` | Click area covering the whole card. Visually transparent. `aria-label` required. |
| Content `<div className="relative pointer-events-none">` | Visually shown above the overlay but **clicks pass through** — caught by the overlay Link |
| Interactive wrapper `<div className="pointer-events-auto">` | Re-enables clicks only for child elements (DropdownMenu / Button, etc.) |

---

## 3. Keyboard focus / a11y

- The overlay `<Link>` has its own `focus-visible:ring-2` → the ring shows on the whole card when it receives keyboard focus.
- `aria-label` states the card's destination (e.g. `View ${team.name} team`).
- The inner menu (DropdownMenu) needs its own separate `aria-label` (e.g. `Actions for ${team.name}`).
- Tab order: card overlay link → inner menu trigger.

---

## 4. Hover state

```tsx
<div className="relative ... transition-colors hover:bg-muted/30 focus-within:bg-muted/30">
```

- `hover:bg-muted/30` — subtle emphasis on card hover
- `focus-within:bg-muted/30` — same visual effect when any element inside the card is focused (keyboard users)
- Same tone recommended (visual consistency between hover and focus)

---

## 5. System vs regular entity — the `protected` flag

Protected entities (system defaults, etc.) conditionally hide some menu items:

```tsx
// Data model
type Team = {
  name: string;
  description: string;
  protected?: boolean;  // true = cannot delete
};

// Menu
<DropdownMenuContent>
  <DropdownMenuItem onClick={() => onEdit(team)}>Edit</DropdownMenuItem>
  {!team.protected && (
    <DropdownMenuItem onClick={() => onDelete(team)}>Delete</DropdownMenuItem>
  )}
</DropdownMenuContent>
```

- Non-destructive actions like Edit can be shown regardless of protected status (editing is OK, only deletion is blocked)
- To make the reason Delete is disabled clearer, use a tooltip to explain (see rules/states.md §6 Disabled)
- Pairs with the destructive variant of the alert dialog (`patterns/confirm-dialog.md`)

---

## 6. Card outer visual tokens

```tsx
className="relative rounded-xl border border-border bg-card p-4
           transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
```

| Token | Value |
|---|---|
| Radius | `rounded-xl` (14px) — TeamCard spec |
| Border | `border border-border` |
| Background | `bg-card` (light/dark automatic) |
| Padding | `p-4` (16px) |
| Hover/Focus | `bg-muted/30` |

Other cards may use a different radius (e.g. `rounded-md` for a small card).

---

## 7. Card inner layout

Standard structure (matches TeamCard):

```tsx
<div className="...">
  <Link className="absolute inset-0 ..." />

  {/* Header row — Title + Action menu */}
  <div className="relative flex items-start justify-between gap-2 pb-3 pointer-events-none">
    <h3 className="text-lg font-semibold text-foreground">{name}</h3>
    <div className="pointer-events-auto">
      <DropdownMenu>...</DropdownMenu>
    </div>
  </div>

  {/* Body — description / metadata */}
  <p className="relative pointer-events-none line-clamp-2 text-sm text-muted-foreground">
    {description}
  </p>

  {/* Footer — count / icon */}
  <div className="relative pointer-events-none mt-4 flex items-center gap-2 text-sm text-muted-foreground">
    <Icon className="h-4 w-4" />
    <span>{count}</span>
  </div>
</div>
```

- Repeat **`relative` + `pointer-events-none`** on each child div — so the overlay Link receives clicks while the child stays visually on top
- Title is `text-lg font-semibold` (smaller than the table-list-page `<h1>` `text-3xl` — visual hierarchy inside the card)
- Body is `text-sm text-muted-foreground` + `line-clamp-2` (cut at two lines even if long)
- Footer is `mt-4` (16px top gap) + icon + count

---

## 8. Anti-patterns

| ❌ | Reason |
|---|---|
| Wrapping the whole card in `<Link>` (without overlay) | Inner menu clicks also trigger navigation. The event.stopPropagation workaround complicates a11y. |
| Missing `aria-label` on the overlay Link | Screen readers can't tell the card's destination. |
| Missing `pointer-events-none` on the content wrapper | The overlay is covered, making the card unclickable. |
| Missing `pointer-events-auto` on the inner menu wrapper | The menu trigger can't receive clicks. |
| Missing `focus-visible:ring` on the overlay Link | No ring shown on keyboard focus. |
| Having only `hover:bg-muted/30` and missing `focus-within:bg-muted/30` | Only mouse users get hover feedback; keyboard users get no visual feedback. |
| Showing the Delete menu on a protected entity + explaining via toast in onClick | Looks possible in the UI but doesn't execute — confusing for users. Hide it conditionally in the menu itself. |
| Comparing "by name" without a `protected` flag (e.g. `team.name === "Default"`) | Magic string. An explicit flag in the data model is the correct answer. |

---

## 9. Components using it (Phase1)

| Component | Location | Card → destination | Menu |
|---|---|---|---|
| TeamCard | inline in `users/page.tsx` | `/users/team/{name}` | Edit / Delete (Delete hidden for the Default team) |

Future candidates for the same pattern — wherever a user-clickable card + inner action is needed.

---

## Related docs

- `components/dropdown-menu.md` — DropdownMenu primitive (to be written)
- `patterns/confirm-dialog.md` — the confirm dialog opened by the Delete menu
- `rules/states.md` §6 — Disabled-reason tooltip recommended (protected menu items)
