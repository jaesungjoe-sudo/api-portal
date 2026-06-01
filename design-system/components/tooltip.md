# Tooltip

> 짧은 보조 설명을 hover/focus 시 표시. Help icon 옆 설명, disabled 상태 사유 안내 등에 사용. 메뉴 리스트나 일반 popover 콘텐츠는 별도 (DropdownMenu / Popover).

## Import

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
```

> `TooltipProvider` 는 **루트 layout (`src/app/layout.tsx`) 에 이미 mount 됨**. 페이지/컴포넌트에서 별도 wrapping 불필요.

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

- **`Tooltip`**: state root (controlled / uncontrolled 모두 OK).
- **`TooltipTrigger`**: hover/focus 받는 요소. 보통 아이콘 또는 짧은 텍스트.
- **`TooltipContent`**: 표시되는 박스. Base UI floating layer.

## 표준 trigger

| 용도 | 클래스 |
|---|---|
| Info 아이콘 (도움말) | `<Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />` |
| 작은 시각 아이콘 (Help / Question) | h-3.5 ~ h-4 lucide 아이콘 + muted-foreground |
| Disabled 액션 사유 안내 | `<span>` 또는 disabled 된 Button 자체 |

`cursor-default` — 클릭 액션이 아니라 hover-only 임을 시각적으로 명시 (pointer 가 아님).

## 표준 content

- 기본 `side="top"` (트리거 위)
- `sideOffset={4}` (4px) — primitive 기본값
- 본문: 한 줄 짧은 설명 (`text-xs` 또는 `text-sm`). 너무 길면 본문 인라인으로 옮기는 게 나음.
- primitive 가 자동으로 `bg-popover` + `text-popover-foreground` + `shadow-md` + `rounded-md` 부여.

## 사용 예시

### Help icon 옆 설명

```tsx
<div className="flex items-center gap-1.5">
  <span>{label}</span>
  <Tooltip>
    <TooltipTrigger className="flex items-center">
      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
    </TooltipTrigger>
    <TooltipContent>{설명}</TooltipContent>
  </Tooltip>
</div>
```

### Disabled 사유 안내 (권장 패턴, `rules/states.md` §6)

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <Button disabled>Delete</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>이 항목은 protected 상태라 삭제할 수 없습니다.</TooltipContent>
</Tooltip>
```

- disabled Button 은 mouse 이벤트 안 받음 → `<span tabIndex={0}>` 으로 감싸서 hover/focus 받게 함
- `asChild` — TooltipTrigger 가 자식 element 그대로 trigger 로 사용

## 사용 표 (Phase1)

| 위치 | trigger | content |
|---|---|---|
| Users 테이블 "Updated" 헤더 옆 | Info icon (h-3.5) | "Last time this user's record was modified" |
| Sidebar (shadcn 기본) | menu trigger | menu label (모바일에서) |

향후 추가 후보:
- API Keys 의 Status 옆 (Expired/Revoked 사유)
- form-dialog 의 protected 필드 disabled 사유

## a11y

- `TooltipTrigger` 가 자동으로 `aria-describedby` 로 content 연결
- 키보드: focus 시에도 content 표시 (mouse hover 와 동일 동작)
- screen reader: content 가 자동으로 읽힘

## Figma 판별 기준

- `mainComponent` 이름: "Tooltip"
- 트리거가 hover 시에만 표시되는 짧은 박스
- 일반 Popover (지속 표시되는 컨테이너) 와 구분

## 안티패턴

| ❌ | 이유 |
|---|---|
| Tooltip 본문이 2줄 초과 / 50자 초과 | 짧은 보조 정보 전용. 길면 본문에 inline 표시. |
| 클릭 액션을 Tooltip 으로 우회 (예: tooltip 안에 Button) | 임시 표시 컨테이너 — 클릭 액션은 Popover 또는 다이얼로그. |
| `TooltipProvider` 를 페이지마다 추가 wrap | 루트 layout 에 이미 있음. 중복 mount 시 delay 등 동작 불안정. |
| disabled Button 에 trigger 직접 (`<TooltipTrigger asChild><Button disabled />`) — `<span>` wrap 없이 | disabled 요소는 hover 이벤트 못 받음. `<span tabIndex={0}>` 으로 wrap 필수. |
| `cursor-default` 누락한 Info icon | 클릭 가능해 보이는 cursor (pointer) — UX 혼란. |
| 메뉴 리스트를 Tooltip 으로 작성 | Tooltip 은 단일 짧은 텍스트. 메뉴는 DropdownMenu. |

## 주의사항

- `TooltipProvider` 의 `delay={0}` 설정 — 우리 프로젝트는 즉시 표시 (디자이너 의도). 기본 750ms delay 가 아님.
- `position` / `side` / `align` 은 모두 primitive prop 으로 조정. Custom positioning 불필요.
- 동시에 여러 tooltip 표시 X — 새 tooltip 열리면 이전 자동 닫힘 (Base UI 기본 동작).
