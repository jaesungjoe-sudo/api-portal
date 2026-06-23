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
<div className="rounded-md border border-border">
  <Table>
    …
  </Table>
</div>
```

The wrapper provides only the card frame (`rounded-md border`). **Don't add `overflow-x-auto`** — the `Table` primitive already wraps `<table>` in its own `<div data-slot="table-container" className="relative w-full overflow-x-auto">`, which handles horizontal scroll on mobile. A second `overflow-x-auto` on the wrapper only nests scroll containers.

## Standard column structure

| Column type | width | Note |
|---|---|---|
| First (Name, etc.) | `min-w-[160px] pl-5` | `pl-5` (20px) left padding — CLAUDE.md first-column rule |
| Body column | `min-w-[Npx]` | Email 220, Team 130, Role 100, Status 110, Updated 140, etc. |
| Actions — ⋯ menu | `w-14` | `MoreHorizontal` → **DropdownMenu** (not Popover). Header is an empty cell, no label. |
| Actions — button group | `min-w-[180px]` | Reject + Approve, etc. Header **may** carry an "Action" label. |

> No selection-checkbox column — removed from all tables (2026-05-08). Don't reintroduce one without a Figma spec.

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
| Empty state (no data) | `<TableCell colSpan={N} className="py-16"><EmptyState … /></TableCell>` — see `rules/states.md` §4 / `components/empty-state.md`. **No plain-text fallback.** |

## Vertical sizing (header & rows)

`Table` primitive(`src/components/ui/table.tsx`)의 세로 규칙 — Figma 정합 기준이기도 하다:

| 요소 | 코드 | 값 / 동작 |
|---|---|---|
| 헤더 셀 `TableHead` | `h-10` + `align-middle` | **40px 고정** 높이, 내용 세로 중앙 |
| 바디 셀 `TableCell` | `p-2` + `align-middle` | 8px 패딩, 내용 세로 중앙. 행 높이는 내용에 맞춰 hug(여러 줄이면 확장) |
| 행 구분 | `[&_tr]:border-b` | 행마다 하단 보더 |

- 헤더는 **항상 40px**(`h-10`) — 한 줄 라벨. 데이터 셀은 `align-middle`로 세로 중앙정렬, 셀 내용이 여러 줄이면 행이 자동으로 커진다(클립 금지).
- 셀 패딩(`p-2`)을 0으로 만들거나 헤더 높이를 내용에 붙이지 말 것 — 정보가 위아래로 붙어 가독성이 떨어진다.

> **Figma 작성 주의 (code-as-spec):** 라이브러리 `Data table`/`Table` 컴포넌트를 재사용할 때, 헤더 셀의 세로 padding이 0인 채로 행을 `HUG`(`counterAxisSizingMode='AUTO'` + 셀 `layoutSizingVertical='HUG'`)로 바꾸면 **헤더가 텍스트 높이(~20px)로 붕괴**한다(원본이 고정높이에 의존하기 때문). 복구 레시피 — 헤더 행: `counterAxisSizingMode='FIXED'` + 높이 40 + `counterAxisAlignItems='CENTER'`; 데이터 행: `AUTO` + `minHeight` + `CENTER`; 셀 `layoutSizingVertical='FILL'`. 상세: 메모리 `reference-figma-table-fixed-height-hug`.

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
