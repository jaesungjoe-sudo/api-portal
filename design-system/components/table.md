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

## 기본 래퍼

테이블은 반드시 아래 래퍼 안에 배치:

```tsx
<div className="rounded-md border border-border overflow-x-auto">
  <Table>
    …
  </Table>
</div>
```

## 표준 컬럼 구조

| 컬럼 타입 | width | 주의 |
|---|---|---|
| Checkbox (선택) | `w-10 pl-3` | 헤더/본문 동일 |
| 본문 컬럼 | `min-w-[Npx]` | Name 160, Email 220, Team 130, Role 100, Status 110, Updated 140 등 |
| Actions (메뉴) | `w-14` | MoreHorizontal → Popover |
| Actions (버튼 그룹) | `min-w-[180px]` | Reject + Approve 등 |

## SortableHead 패턴

공용 컴포넌트 사용: `import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head"`

```tsx
<TableHead className="min-w-[160px]">
  <SortableHead col="name" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
    Name
  </SortableHead>
</TableHead>
```

- 제네릭 타입 `K extends string` — 페이지별 `SortKey` 타입을 그대로 넘김
- 활성 컬럼: `text-foreground` + `ArrowUp/ArrowDown` 아이콘
- 비활성 컬럼: `text-muted-foreground` + `ArrowUpDown` 아이콘
- 토글 동작: 같은 컬럼 클릭 시 asc↔desc, 다른 컬럼 클릭 시 asc 로 초기화
- 페이지 내 로컬 재정의 금지 — 공용 컴포넌트만 사용

## Info Tooltip 포함 헤더

예: Updated 컬럼처럼 설명이 필요한 헤더

```tsx
<TableHead className="min-w-[140px]">
  <div className="flex items-center gap-1.5">
    <SortableHead col="updatedAtMs" {...sp}>Updated</SortableHead>
    <Tooltip>
      <TooltipTrigger className="flex items-center">
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
      </TooltipTrigger>
      <TooltipContent side="top">{설명}</TooltipContent>
    </Tooltip>
  </div>
</TableHead>
```

## Row 셀 스타일

| 셀 타입 | 클래스 |
|---|---|
| 강조 텍스트 (Name 등) | `text-sm font-medium text-foreground` |
| 일반 텍스트 | `text-sm text-foreground` |
| 보조 텍스트 (날짜 등) | `text-sm text-muted-foreground` |
| Badge 셀 | 그대로 `<TableCell><StatusBadge … /></TableCell>` |
| 빈 상태 (데이터 없음) | `<TableCell colSpan={N} className="text-center text-sm text-muted-foreground py-8">` |

## Pagination 레이아웃

공용 컴포넌트 `TablePagination` 이 `grid grid-cols-3` 래퍼와 ellipsis 로직을 내장. 테이블 아래에 한 줄로 배치:

```tsx
import { TablePagination } from "@/components/api-portal/table-pagination"

<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

상세는 `design-system/components/pagination.md` 참조. 페이지 내에서 `Pagination` 원시 컴포넌트를 직접 조합하지 않음.

## Figma 판별 기준

- `mainComponent` 이름: "Table"
- 컬럼 존재 여부는 **헤더가 아니라 실제 row 셀의 x 좌표**로 판단. 상세는 `design-system/rules/figma-reading.md` 의 hidden 노드 처리 규칙 참조.
