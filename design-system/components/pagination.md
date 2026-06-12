# Pagination

## Basic usage — TablePagination (shared component, recommended)

Table list pages use only the shared component below. The ellipsis logic, `grid grid-cols-3` wrapper, and boundary-disabled styling are all built in.

```tsx
import { TablePagination } from "@/components/api-portal/table-pagination"

<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

Implementation: `src/components/api-portal/table-pagination.tsx`

- `page: number` — current page (1-based)
- `totalPages: number` — total page count
- `onPageChange: (page: number) => void` — page-change handler

Don't assemble the shadcn `Pagination` directly within a page. If the layout or ellipsis rules change, edit the shared component in one place.

## Internal implementation reference

The shadcn primitives the shared component wraps:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

ellipsis logic:

```ts
function pageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, "…", totalPages]
  if (page >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages]
  return [1, "…", page, "…", totalPages]
}
```

## Page size

**Common to all tables: PAGE_SIZE = 10**

## Disabled state styling

- When Previous / Next reaches a boundary, disable it with `pointer-events-none opacity-50`.
- The active indication for each `PaginationLink` is the `isActive={p === page}` prop.

## How to identify in Figma

- `mainComponent` name: "Pagination"
- The ellipsis appears as a ` … ` string node; map it to `PaginationEllipsis` in the implementation.
