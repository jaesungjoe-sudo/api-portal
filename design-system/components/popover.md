# Popover / Menulist

> 메뉴 리스트 UI는 `DropdownMenu`가 기본. `Popover`는 메뉴가 아닌 일반 포지션 컨테이너용.

## Import

```tsx
// 메뉴 리스트 (Row Action, Account, 드롭다운 선택 등)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 일반 포지션 컨테이너 (tooltip-like custom overlay 등)
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
```

## 언제 무엇을 쓰나

| 용도 | 컴포넌트 | 이유 |
|---|---|---|
| Row action 3-dot 메뉴 | `DropdownMenu` | 키보드 navigation · ARIA · focus trap 내장 |
| Account · 계정 드롭다운 | `DropdownMenu` | 동일 |
| Select 트리거 | `Select` / `SelectTrigger` | 선택형 리스트 전용 |
| 커스텀 카드·인포 버블 | `Popover` | 일반 콘텐츠 포지셔닝 |

**"메뉴처럼 생긴 아무 것"은 항상 `DropdownMenu`를 먼저 선택.** 뭘 쓸지 애매하면 DropdownMenu 기본.

## Menulist 공통 스펙 (Figma 라이브러리 + 디자인 확정값)

> Figma 라이브러리 노드: `3134:5588` (Menulist)
> 적용 대상: `DropdownMenuContent`, `SelectContent`, `PopoverContent`

| 속성 | 값 | Tailwind |
|---|---|---|
| 배경 | `popover` 토큰 | `bg-popover` |
| 테두리 | `border` 1px | `border border-border` |
| 모서리 | 8px | `rounded-lg` |
| 그림자 | `shadow-md` | `shadow-md` |
| 내부 패딩 | 4px | `p-1` |
| 아이템 높이 | 32px | `h-8` (`px-2 py-1.5` 대체 OK) |
| 아이템 호버/포커스 | `accent` 토큰 | `focus:bg-accent focus:text-accent-foreground` |
| 아이템 텍스트 | `popover-foreground` | 기본 상속 (색상 지정 안 함) |
| 구분선 | `border` 1px | `<DropdownMenuSeparator />` |

→ `DropdownMenuContent` / `DropdownMenuItem` 기본값이 이미 위 스펙을 충족. className으로 임의 색 덮어쓰기 금지.

### 파괴적 동작(Delete/Deactivate)에 색상 추가 금지

Figma는 Delete / Deactivate 텍스트도 `popover-foreground`(일반 색). **"파괴적 action = 빨강" 관습으로 `text-destructive`를 추가하지 않는다.** 상세: `design-system/rules/shadcn.md` "스타일 추가 금지 원칙".

## Row Action Menu 패턴

테이블 row의 `MoreHorizontal` 드롭다운:

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

### 스펙 요약

| 항목 | 값 |
|---|---|
| Dropdown 폭 | `w-56` (224px) |
| Trigger 크기 | `h-8 w-8` (32×32) |
| Trigger aria-label | **필수** — row 식별 정보 포함 (`Actions for {name}`) |
| 아이템 패딩 | `px-2 py-1.5` |
| 구분선 | `<DropdownMenuSeparator />` (수동 `<hr />` / `<Separator />` 금지) |

## 키보드 단축키 텍스트(⌘K 등) 처리

Figma 라이브러리 Menulist에는 `⌘K` 같은 shortcut 필드가 존재하지만, **실제 디자인 인스턴스에서는 대개 `visible=false`**. Figma 실제 인스턴스 기준으로 구현 — 라이브러리에 있다고 단축키를 임의 추가하지 않는다.

## Figma 판별 기준

- `mainComponent` 이름: "Menulist", "Dropdown", "Popover"
- Trigger는 대개 별도 icon button (`MoreHorizontal` / avatar / chevron 등)
- `Edit / Delete / Deactivate` 같은 action 텍스트 색상 = `popover-foreground` (일반)
- shortcut 필드는 실제 인스턴스의 `visible` 값 확인 후 처리

## 주의사항

- Row-level 조건부 아이템 (예: "Resend invite" 은 status=Invited 일 때만) 은 `{isInvited && <>...</>}` 로 감싼다.
- `DropdownMenuLabel`은 반드시 `DropdownMenuGroup` 안에서 사용 (Base UI 제약, 상세: `design-system/rules/shadcn.md`).
