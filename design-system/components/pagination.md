# Pagination

## 기본 사용 — TablePagination (공용 컴포넌트, 권장)

테이블 목록 페이지에서는 아래 공용 컴포넌트만 사용한다. ellipsis 로직, `grid grid-cols-3` 래퍼, 경계 비활성화 스타일 전부 내장.

```tsx
import { TablePagination } from "@/components/api-portal/table-pagination"

<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

구현 위치: `src/components/api-portal/table-pagination.tsx`

- `page: number` — 현재 페이지 (1-based)
- `totalPages: number` — 전체 페이지 수
- `onPageChange: (page: number) => void` — 페이지 변경 핸들러

페이지 내에서 shadcn `Pagination` 을 직접 조합하지 말 것. 레이아웃이나 ellipsis 규칙이 바뀌면 공용 컴포넌트 한 곳만 수정.

## 내부 구현 참고

공용 컴포넌트가 감싸고 있는 shadcn 원시 컴포넌트:

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

ellipsis 로직:

```ts
function pageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, "…", totalPages]
  if (page >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages]
  return [1, "…", page, "…", totalPages]
}
```

## 페이지 크기

**모든 테이블 공통: PAGE_SIZE = 10**

## 비활성 상태 스타일

- Previous / Next 가 경계에 닿으면 `pointer-events-none opacity-50` 로 비활성화.
- 개별 `PaginationLink` 의 활성 표시는 `isActive={p === page}` prop.

## Figma 판별 기준

- `mainComponent` 이름: "Pagination"
- ellipsis 는 ` … ` 문자열 노드로 등장, 구현에서는 `PaginationEllipsis` 로 매핑.
