# Table

## Import
```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

## Base wrapper

Tables must be placed inside the wrapper below:

```tsx
<div className="rounded-md border border-border overflow-x-auto">
  <Table>
    …
  </Table>
</div>
```

## Standard column structure

| Column type | width | Note |
|---|---|---|
| Checkbox (selection) | `w-10 pl-3` | Same for header/body |
| Body column | `min-w-[Npx]` | Name 160, Email 220, Team 130, Role 100, Status 110, Updated 140, etc. |
| Actions (menu) | `w-14` | MoreHorizontal → Popover |
| Actions (button group) | `min-w-[180px]` | Reject + Approve, etc. |

## SortableHead pattern

Use the shared component: `import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head"`

```tsx
<TableHead className="min-w-[160px]">
  <SortableHead col="name" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
    Name
  </SortableHead>
</TableHead>
```

- Generic type `K extends string` — pass each page's `SortKey` type through directly
- Active column: `text-foreground` + `ArrowUp/ArrowDown` icon
- Inactive column: `text-muted-foreground` + `ArrowUpDown` icon
- Toggle behavior: clicking the same column flips asc↔desc; clicking a different column resets to asc
- No local redefinition within a page — use only the shared component

## Header with an info Tooltip

Example: a header that needs an explanation, like the Updated column

```tsx
<TableHead className="min-w-[140px]">
  <div className="flex items-center gap-1.5">
    <SortableHead col="updatedAtMs" {...sp}>Updated</SortableHead>
    <Tooltip>
      <TooltipTrigger className="flex items-center">
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
      </TooltipTrigger>
      <TooltipContent side="top">{description}</TooltipContent>
    </Tooltip>
  </div>
</TableHead>
```

## Row cell styling

| Cell type | Class |
|---|---|
| Emphasis text (Name, etc.) | `text-sm font-medium text-foreground` |
| Normal text | `text-sm text-foreground` |
| Secondary text (dates, etc.) | `text-sm text-muted-foreground` |
| Badge cell | as-is `<TableCell><StatusBadge … /></TableCell>` |
| Empty state (no data) | `<TableCell colSpan={N} className="text-center text-sm text-muted-foreground py-8">` |

## Pagination layout

The shared `TablePagination` component has the `grid grid-cols-3` wrapper and ellipsis logic built in. Place it in a single row below the table:

```tsx
import { TablePagination } from "@/components/api-portal/table-pagination"

<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

For details, see `design-system/components/pagination.md`. Don't assemble the `Pagination` primitive directly within a page.

## How to identify in Figma

- `mainComponent` name: "Table"
- Determine whether a column exists from **the actual row cell's x coordinate, not the header**. For details, see the hidden-node handling rules in `design-system/rules/figma-reading.md`.
