# clickable-card-with-menu 패턴

> 카드 전체가 링크/액션이면서 카드 안에 별도 메뉴(예: DropdownMenu)도 동시에 활성화해야 하는 경우의 표준 구조. 단순히 `<Link>` 로 카드를 감싸면 내부 버튼 클릭이 링크 이동까지 트리거되는 문제를 `absolute inset-0` overlay + `pointer-events` 토글로 해결한다.

## 적용 범위

- **TeamCard** (`users/page.tsx` 의 인라인 컴포넌트) — Team 그리드. 카드 = 상세 페이지로, ⋯ 메뉴 = Edit/Delete.
- 향후 동일 구조 (카드 전체 클릭 + 내부 메뉴) 가 필요한 모든 카드.

이 패턴이 *필요하지 않은* 경우:
- 카드 안에 내부 버튼이 없음 → 일반 `<Link>` 로 카드 wrap.
- 카드는 정보 표시만 — 클릭 액션이 없음 → 단순 `<div>`.

---

## 1. 핵심 문제

```tsx
// ❌ Naive 구현 — 내부 버튼 클릭이 링크 이동도 트리거
<Link href={`/users/team/${team.name}`}>
  <div className="...">
    <h3>{team.name}</h3>
    <DropdownMenu>...</DropdownMenu>  {/* 클릭 시 카드 링크도 따라감 */}
  </div>
</Link>
```

`event.stopPropagation()` 으로 우회 가능하지만:
- 키보드 포커스 / a11y 가 복잡해짐
- 메뉴 외 다른 인터랙티브 요소가 추가될 때마다 stop 추가 필요

→ 구조적으로 해결하는 게 본 패턴.

---

## 2. 표준 구조 — Absolute overlay + pointer-events

```tsx
<div className="relative ...">
  {/* 1. Absolute overlay Link — 카드 전체 클릭 영역 */}
  <Link
    href={destination}
    aria-label={`View ${name}`}
    className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
  />

  {/* 2. 콘텐츠 — pointer-events-none 으로 클릭 통과 */}
  <div className="relative pointer-events-none">
    <h3>{name}</h3>

    {/* 3. 내부 인터랙티브 요소 — pointer-events-auto 로 재활성 */}
    <div className="pointer-events-auto">
      <DropdownMenu>
        <DropdownMenuTrigger>...</DropdownMenuTrigger>
        <DropdownMenuContent>...</DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</div>
```

### 핵심 원리

| Layer | 역할 |
|---|---|
| 외곽 `<div>` (relative) | overlay 의 positioning context |
| `<Link className="absolute inset-0">` | 카드 전체를 덮는 클릭 영역. 시각적으론 투명. `aria-label` 필수. |
| 콘텐츠 `<div className="relative pointer-events-none">` | overlay 위에 시각적으로 보이되 **클릭은 통과** — overlay Link 가 받음 |
| 인터랙티브 wrapper `<div className="pointer-events-auto">` | 자식 요소(DropdownMenu / Button 등) 의 클릭만 다시 활성화 |

---

## 3. 키보드 포커스 / a11y

- overlay `<Link>` 가 자체 `focus-visible:ring-2` 보유 → 카드 전체에 키보드 포커스 시 ring 표시.
- `aria-label` 로 카드의 목적지 명시 (예: `View ${team.name} team`).
- 내부 메뉴 (DropdownMenu) 는 자체 `aria-label` 별도 필요 (예: `Actions for ${team.name}`).
- Tab 순서: 카드 overlay 링크 → 내부 메뉴 trigger.

---

## 4. 호버 상태

```tsx
<div className="relative ... transition-colors hover:bg-muted/30 focus-within:bg-muted/30">
```

- `hover:bg-muted/30` — 카드 위 호버 시 살짝 강조
- `focus-within:bg-muted/30` — 카드 내부 어느 요소든 포커스되면 같은 시각 효과 (키보드 사용자)
- 같은 톤 권장 (호버 vs 포커스 시각 일관성)

---

## 5. 시스템 vs 일반 엔티티 — `protected` 플래그

보호된 엔티티(시스템 기본값 등)는 메뉴 항목 일부를 조건부 숨김:

```tsx
// 데이터 모델
type Team = {
  name: string;
  description: string;
  protected?: boolean;  // true = 삭제 불가
};

// 메뉴
<DropdownMenuContent>
  <DropdownMenuItem onClick={() => onEdit(team)}>Edit</DropdownMenuItem>
  {!team.protected && (
    <DropdownMenuItem onClick={() => onDelete(team)}>Delete</DropdownMenuItem>
  )}
</DropdownMenuContent>
```

- Edit 같은 비파괴적 액션은 protected 여부와 무관하게 노출 가능 (수정은 OK, 삭제만 차단)
- Delete 가 비활성화된 이유를 더 분명히 하려면 tooltip 으로 안내 (rules/states.md §6 Disabled 참조)
- Alert dialog 의 destructive variant 와 짝 (`patterns/confirm-dialog.md`)

---

## 6. 카드 외곽 시각 토큰

```tsx
className="relative rounded-xl border border-border bg-card p-4
           transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
```

| 토큰 | 값 |
|---|---|
| Radius | `rounded-xl` (14px) — TeamCard 스펙 |
| Border | `border border-border` |
| 배경 | `bg-card` (라이트/다크 자동) |
| Padding | `p-4` (16px) |
| Hover/Focus | `bg-muted/30` |

다른 카드는 다른 radius 가능 (예: 작은 카드면 `rounded-md`).

---

## 7. 카드 내부 레이아웃

표준 구조 (TeamCard 정합):

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

- 각 자식 div 에 **`relative` + `pointer-events-none`** 반복 — overlay Link 가 클릭 받게 + 시각 위에 표시
- Title 은 `text-lg font-semibold` (table-list-page `<h1>` 의 `text-3xl` 보다 작음 — 카드 내부 위계)
- 본문은 `text-sm text-muted-foreground` + `line-clamp-2` (길어도 두 줄에서 cut)
- Footer 는 `mt-4` (16px 위쪽 간격) + 아이콘 + 카운트

---

## 8. 안티패턴

| ❌ | 이유 |
|---|---|
| `<Link>` 로 카드 통째 wrapping (overlay 없이) | 내부 메뉴 클릭이 링크 이동도 트리거. event.stopPropagation 우회는 a11y 복잡. |
| overlay Link 에 `aria-label` 누락 | screen reader 가 카드 목적지 인식 못 함. |
| 콘텐츠 wrapper 의 `pointer-events-none` 누락 | overlay 가 가려져 카드 클릭 불가. |
| 내부 메뉴 wrapper 의 `pointer-events-auto` 누락 | 메뉴 trigger 가 클릭 못 받음. |
| overlay Link 에 `focus-visible:ring` 누락 | 키보드 포커스 시 ring 안 보임. |
| `hover:bg-muted/30` 만 있고 `focus-within:bg-muted/30` 누락 | 마우스 사용자만 호버 피드백 받고 키보드 사용자는 시각 피드백 없음. |
| protected 엔티티에 Delete 메뉴 노출 + onClick 에서 토스트로 안내 | UI 상 가능해 보이는데 실행 안 됨 — 사용자 혼란. 메뉴 자체에서 조건부 숨김. |
| `protected` 플래그 없이 "이름으로 비교" (예: `team.name === "Default"`) | 매직 스트링. 데이터 모델에 명시적 플래그가 정답. |

---

## 9. 적용 컴포넌트 (Phase1)

| 컴포넌트 | 위치 | 카드 → 목적지 | 메뉴 |
|---|---|---|---|
| TeamCard | `users/page.tsx` 인라인 | `/users/team/{name}` | Edit / Delete (Default 팀은 Delete 숨김) |

향후 동일 패턴 적용 후보 — 사용자가 클릭 가능한 카드 + 내부 액션이 필요한 경우.

---

## 관련 문서

- `components/dropdown-menu.md` — DropdownMenu primitive (작성 예정)
- `patterns/confirm-dialog.md` — Delete 메뉴가 여는 확인 다이얼로그
- `rules/states.md` §6 — Disabled 사유 tooltip 권장 (protected 메뉴 항목)
