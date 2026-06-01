# DropdownMenu

> 액션 메뉴 리스트 — 테이블 행 ⋯, TeamCard ⋯, AccountDropdown 등. Popover 와 다른 표준 메뉴 컴포넌트 (CLAUDE.md 룰 6: 메뉴 리스트는 DropdownMenu).

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

## Anatomy

```tsx
<DropdownMenu>
  <DropdownMenuTrigger
    aria-label={`Actions for ${name}`}
    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
  >
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem className="px-2 py-1.5" onClick={...}>Edit</DropdownMenuItem>
    {showDelete && <DropdownMenuItem className="px-2 py-1.5" onClick={...}>Delete</DropdownMenuItem>}
  </DropdownMenuContent>
</DropdownMenu>
```

## 표준 trigger (테이블 / 카드 ⋯)

| 부분 | 값 |
|---|---|
| Size | `h-8 w-8` (32×32) for compact rows, `h-9 w-9` (36×36) for cards |
| Icon | `<MoreHorizontal className="h-4 w-4" />` (lucide) |
| 색 | `text-muted-foreground` |
| Hover | `hover:bg-muted` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring` |
| Outline 제거 | `outline-none` (focus-visible 로 대체) |
| Border radius | `rounded-md` |
| `aria-label` | **필수** — `Actions for {name}` 형태 |

## 표준 content

```tsx
<DropdownMenuContent align="end" className="w-56">
```

- `align="end"` — trigger 우측 정렬 (테이블 행 ⋯ 같이 우상단 anchor 인 경우)
- `w-56` (224px) — 표준 폭. 메뉴 항목 라벨이 길면 `w-64` 까지 늘려도 OK.
- shadcn primitive 가 `shadow-md` + `border border-border` + `rounded-md` + `bg-popover` 자동 부여 (CLAUDE.md shadow 표 정합)

## 표준 item

```tsx
<DropdownMenuItem className="px-2 py-1.5" onClick={...}>Edit</DropdownMenuItem>
```

- `px-2 py-1.5` (8px / 6px) — 표준 padding. shadcn 기본보다 살짝 좁음 (Figma 정합).
- 색은 `text-popover-foreground` 기본. **`text-destructive` 직접 주입 금지** — Figma 정합 확인 후만 (CLAUDE.md 메뉴 룰).
- 단축키 (`⌘K`) — Figma 인스턴스에서 visible=false 면 미표시. 별도 `DropdownMenuShortcut` 컴포넌트 있음 (드물게 사용).

### 조건부 항목

protected entity 가 destructive 액션 숨김:

```tsx
<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
{!team.protected && (
  <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
)}
```

→ Delete 자체를 안 보이게 — disable + 안내가 아닌, 단순 숨김. (`patterns/clickable-card-with-menu.md` §5 참조)

### 그룹 / Separator

```tsx
<DropdownMenuItem>Edit</DropdownMenuItem>
<DropdownMenuItem>Deactivate</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem>Resend invite mail</DropdownMenuItem>
```

`DropdownMenuSeparator` — 1px border-border. 의미적으로 다른 액션 그룹 구분 (예: 일반 액션 vs Invited 상태 전용 액션).

## 사용 표 (Phase1)

| 위치 | Trigger | 항목 |
|---|---|---|
| Users 테이블 ⋯ | h-8 w-8 ghost | Edit / Deactivate (+Resend if Invited) |
| Team Card ⋯ | h-9 w-9 ghost | Edit / Delete (Default 팀 제외) |
| API Keys 테이블 ⋯ | h-8 w-8 ghost | Edit / Revoke (Active) / Delete |
| Account dropdown (TopNav) | h-9 avatar | Profile / Log out |

## Figma 판별 기준

- 메뉴가 트리거 클릭 후 *고정 위치* 에 표시되고 *항목 리스트* 면 DropdownMenu
- 트리거가 ⋯ / chevron / Avatar 등
- Popover 는 *임의 콘텐츠 컨테이너* (예: tooltip-like 정보 박스, 필터 폼) — 메뉴 아님

## 안티패턴

| ❌ | 이유 |
|---|---|
| 메뉴 리스트를 `<Popover>` 로 구현 | CLAUDE.md 룰 6 — 메뉴는 DropdownMenu. Popover 는 임의 콘텐츠. |
| Trigger 에 `aria-label` 누락 | a11y. screen reader 가 메뉴 트리거 인식 못 함. |
| `text-destructive` 를 임의로 항목에 적용 | Figma 정합 확인 후만. 대부분의 destructive 액션 (Delete, Revoke) 은 메뉴에서 일반 색, 다이얼로그(confirm-dialog) 에서 destructive 시각. |
| `align="end"` 대신 기본값 (`start`) — trigger 가 우측 anchor 인 경우 | 메뉴가 화면 우측으로 튀어나감. align=end 가 standard. |
| `className="px-2 py-1.5"` 누락 | Figma 정합 padding 빠지면 항목 간 spacing 어색. |
| 단축키 표시 (`⌘K`) 가 Figma 에 없는데 추가 | Figma 정합 확인. 명시되지 않으면 미표시. |
| 너무 많은 메뉴 항목 (5개 초과) | 메뉴가 길어지면 UX 저하. 카테고리 별로 separator 분리 또는 nested submenu 검토. |

## 주의사항

- `DropdownMenu` 자체는 controlled 또는 uncontrolled 양쪽 OK. 단 메뉴 안에서 다이얼로그를 여는 경우 (Delete → ConfirmDialog) 다이얼로그 open 상태는 부모가 관리.
- 메뉴 항목 클릭 시 메뉴는 자동 닫힘 (primitive 기본). 명시적 close 호출 불필요.
- 메뉴가 viewport 밖으로 나갈 우려 — primitive 가 자동으로 flip / shift 처리 (Base UI floating logic).
- 키보드: ↑↓ 항목 이동, Enter 선택, Esc 닫힘 — primitive 자동 처리.
- Submenu (`DropdownMenuSub`) 는 현재 사용 없음. 필요해질 때 별도 룰.
