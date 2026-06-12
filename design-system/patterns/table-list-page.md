# table-list-page pattern

> The standard structure for dashboard pages that show an entity list. Breadcrumb → Title → (Tabs?) → Toolbar (Search + CTA) → Table → Pagination. Once this pattern is unified, adding a new list page becomes "fit it into this skeleton".

## Where used

- `/api-keys` — API Key list
- `/users` (User / Team / Pending Approvals tabs) — member / team / pending-approval lists
- `/users/team/[name]` — per-team member list
- Same structure planned for future pages like Webhooks

Entity detail pages, form pages, and landing pages are not covered by this pattern.

---

## 1. Page outer wrapper

```tsx
<div className="flex flex-col gap-10">
  {/* ... slots ... */}
</div>
```

- `gap-10` (40px) — consistent gap between Breadcrumb · Header · Tabs · Toolbar · Table · Pagination. Matches the CLAUDE.md "unify header-area gap" rule (2026-05-14).
- Don't add a separate `<main>` or `<section>` around it — the route layout (`(dashboard)/layout.tsx`) already provides `<main>`.

---

## 2. Breadcrumb (required)

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>{current page}</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

The last item is `BreadcrumbPage` (current page, no link). Detail pages add one more level (e.g. for the Team detail, "Users > Default").

---

## 3. Header

### Title

```tsx
<h1 className="text-3xl font-semibold text-foreground">{page title}</h1>
```

`text-3xl font-semibold` (30px / 600). Common to all table-list-pages.

### Subtitle (optional)

When copy is needed below the Title:

```tsx
<div className="flex flex-col gap-1">
  <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
  <p className="text-sm text-muted-foreground">{subtitle}</p>
</div>
```

Example use: "Production expires in 5 days" on `/api-keys`. Not needed for general catalog pages.

---

## 4. Tabs (optional)

Used only when multiple lists are grouped on one page, like `/users`. shadcn `<Tabs>` primitive — for detailed rules see `components/tabs.md`.

```tsx
<Tabs value={activeTab} onValueChange={handleTabChange} className="-mt-2">
  <TabsList>
    <TabsTrigger value="user">User</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
    <TabsTrigger value="pending">
      Pending Approvals
      {pendingCount > 0 && <CountBadge>{pendingCount}</CountBadge>}
    </TabsTrigger>
  </TabsList>
</Tabs>
```

- `-mt-2` — keeps the gap between the tab underline and the content natural.
- URL query (`?tab=team`) two-way sync — `useSearchParams` + `router.replace`. On Next.js 16+ a `<Suspense>` boundary is required.

---

## 5. Toolbar — Search + Primary CTA

```tsx
<div className="flex items-center justify-between gap-4">
  {/* Search (left) */}
  <div className="relative w-60">
    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input className="pl-8 h-8 text-sm" placeholder={`Search ${Entity}`} />
  </div>
  {/* Primary CTA (right) */}
  <Button onClick={openCreate}>{Create/Invite Action}</Button>
</div>
```

### Search rules

- Wrapper: `relative w-60` (240px fixed)
- Icon: `Search` (lucide), absolute position `left-2.5` (10px), `h-4 w-4`, `text-muted-foreground`
- Input: `pl-8 h-8 text-sm` (icon space + 32px height + 14px font)
- Placeholder: **`Search {Entity}`** (state the entity name in singular — "Search User", "Search API Key", "Search Team"). No plain `"Search"`.

### Primary CTA rules

- Default Button (`<Button>`, size=default = `h-9`)
- Label: verb + noun ("Create API Key", "Invite User", "Create Team")
- No arbitrary variant override — CLAUDE.md Button rule

### Toolbar-less variant

`/users` Pending Approvals tab — neither Search nor CTA. The Toolbar itself is omitted. It takes up no empty row.

---

## 6. Table wrapper

```tsx
<div className="rounded-md border border-border overflow-x-auto">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>
```

- Outer: `rounded-md border border-border` — card-like appearance
- Scroll: `overflow-x-auto` — horizontal scroll on mobile. The outer wrapper handles clipping.

### TableHeader rules

```tsx
<TableHeader>
  <TableRow>
    <TableHead className="min-w-[160px] pl-5">
      <SortableHead col="name" {...sp}>Name</SortableHead>
    </TableHead>
    <TableHead className="min-w-[160px]">Owner</TableHead>
    {/* ... more cells ... */}
    <TableHead className="w-14" />  {/* action ⋯ column */}
  </TableRow>
</TableHeader>
```

- First column: `pl-5` (20px left padding) — CLAUDE.md "unify first-column left padding `pl-5`" rule
- Last column: `w-14` (56px) — slot for the row's right-end ⋯ DropdownMenu. Header is an empty cell with no label.
- Sortable column: `<SortableHead col="key" {...sp}>` — `sortable-head.tsx`
- Column width: `min-w-[Npx]` (natural width + minimum guaranteed) or `w-[Npx]` (fixed).

### TableBody — first column is emphasized

```tsx
<TableCell className="pl-5 text-sm font-medium text-foreground">{name}</TableCell>
<TableCell className="text-sm text-foreground">{value}</TableCell>
{/* secondary info is text-muted-foreground */}
<TableCell className="text-sm text-muted-foreground">{secondary}</TableCell>
```

- First column: `font-medium` (emphasis)
- Body columns: normal weight
- Supplementary info (date, last used, etc.): `text-muted-foreground`

### Action column (⋯ DropdownMenu)

```tsx
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label={`Actions for ${name}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem className="px-2 py-1.5" onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
      {/* ... */}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
```

- `aria-label` required (CLAUDE.md menu list rule)
- The trigger itself is `h-8 w-8` (32×32). The icon is `h-4 w-4`.
- Use `DropdownMenu`. No `Popover` (menu lists use DropdownMenu).

---

## 7. Pagination

```tsx
<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

- Every table-list-page uses `<TablePagination>` (`src/components/api-portal/table-pagination.tsx`).
- Standard page size = `PAGE_SIZE = 10` (per-page constant).
- `Math.max(1, Math.ceil(items.length / PAGE_SIZE))` — guarantees totalPages = 1 even for empty data.

---

## 8. Empty state

When data is empty, use the **`<EmptyState>` component in place of the table body** (`rules/states.md` §4 + `components/empty-state.md`).

```tsx
{paged.length === 0 ? (
  <TableRow>
    <TableCell colSpan={TOTAL_COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<UserPlus />}  // Figma inspection result (icons.md workflow)
        title="No pending approvals"
        description="New registrations awaiting review will appear here."
      />
    </TableCell>
  </TableRow>
) : (
  paged.map((row) => <TableRow>...</TableRow>)
)}
```

- Container padding: `py-16` (64px) — the recommended value for table body in `states.md` §4.2
- `colSpan` is the total number of columns (including the action column)
- variant choice: `no-data` (no data yet) / `no-results` (no search results)
- Use the **Figma inspection result** for the icon — no guessing (`icons.md` workflow)

### No plain-text fallback

```tsx
// ❌ violates states.md
<TableCell colSpan={N} className="text-center text-sm text-muted-foreground py-8">
  No pending approvals
</TableCell>

// ✅
<TableCell colSpan={N} className="py-16">
  <EmptyState variant="no-data" icon={...} title="No pending approvals" ... />
</TableCell>
```

---

## 9. Loading / Error state

The surface × state matrix in `rules/states.md` — Loading: row skeleton, Error: Alert in place of the table. This pattern only cross-refs it; no separate redefinition.

---

## 10. Anti-patterns

| ❌ | Reason |
|---|---|
| Page wrapper `gap-*` other than `gap-10` | Violates the header-area consistency rule. Breaks consistency across the 4 pages. |
| Missing first-column `pl-5` | Violates the CLAUDE.md "unify first-column left padding pl-5" rule. |
| Putting a label text ("Action") in the header of the action column (`w-14`) | Matches Figma — the header is an empty cell. The label is sufficiently provided by the ⋯ `aria-label`. |
| Search placeholder is plain text `"Search"` | Missing the Entity name. Use the `"Search {Entity}"` form. |
| Primary CTA using an arbitrary size like `size="sm"` | Violates the 1:1 Figma Button rule. Toolbar CTA is default size (`h-9`). |
| Plain text like `<p>No data</p>` for empty data | Anti-pattern in `states.md` §4 / `empty-state.md`. Use `<EmptyState>`. |
| Writing the action menu as a `<Popover>` | Menu lists use DropdownMenu (CLAUDE.md). |
| Not using `<TablePagination>` — writing page buttons directly | Bypasses the shared component. |

---

## 11. Pages using it (Phase1)

| Page | Tabs | Toolbar | Body |
|---|---|---|---|
| `/api-keys` | — | Search "Search API Key" + Create API Key | 7-col table |
| `/users` User tab | ✅ | Search "Search User" + Invite User | 6-col table |
| `/users` Team tab | ✅ | Search "Search Team" + Create Team | card grid (not a table) |
| `/users` Pending tab | ✅ | — | 7-col table + EmptyState |
| `/users/team/[name]` | — | Search "Search User" + Invite User | 6-col table |

The Team tab is a card grid, so it's a partial exception (grid instead of the table wrapper). The header / toolbar / page wrapper rules apply identically.

---

## Related docs

- `components/table.md` — Table primitive spec
- `components/pagination.md` — TablePagination component spec
- `components/empty-state.md` — EmptyState component spec
- `components/button.md` — Button variant / size rules (Toolbar CTA)
- `rules/states.md` — state (Loading / Empty / Error) patterns
- `patterns/form-dialog.md` — the dialog pattern opened by the Toolbar CTA
- `patterns/confirm-dialog.md` — the pattern opened by the action menu's Delete / Revoke
