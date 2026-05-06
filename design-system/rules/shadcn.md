# shadcn / 디자인 토큰 사용 규칙

> 컴포넌트별 variant·size·사용 패턴은 `design-system/components/<컴포넌트>.md` 에 있음.
> 이 파일은 shadcn 전체에 공통 적용되는 디자인 토큰 규칙만 담는다.

## 컴포넌트별 상세 규칙

- Button: `design-system/components/button.md`
- Badge: `design-system/components/badge.md`
- Dialog: `design-system/components/dialog.md`
- Alert: `design-system/components/alert.md`
- Table: `design-system/components/table.md`
- Input / Label: `design-system/components/input.md`
- Select: `design-system/components/select.md`
- Popover (Menulist 스펙 포함): `design-system/components/popover.md`
- Pagination: `design-system/components/pagination.md`

---

## Border Radius 규칙

Figma tw/border-radius 기준:

| 클래스 | 값 | 용도 |
|--------|-----|------|
| `rounded-none` | 0px | 날카로운 모서리 |
| `rounded-xs` | 2px | 배지, 태그 |
| `rounded-sm` | 4px | 버튼, 인풋 |
| `rounded-md` | 8px | 카드, 패널 |
| `rounded-lg` | 10px | 모달, 드롭다운 |
| `rounded-xl` | 12px | 큰 카드 |
| `rounded-2xl` | 16px | 섹션 |
| `rounded-3xl` | 24px | 특수 요소 |
| `rounded-full` | 9999px | 아바타, 칩 |

---

## 폰트 규칙

```
본문:    font-sans     (Inter)
코드:    font-mono     (Geist Mono / JetBrains Mono)
```

```
❌ 금지                    ✅ 올바른 사용
text-[14px]               text-sm
font-[600]                font-semibold
leading-[1.5]             leading-6
```

---

## Shadow 규칙

> Effect Style 은 Figma Variables 와 달리 자동 추출 불가. 아래 규칙을 보고 수동 적용.

| 컴포넌트 | shadow 클래스 | 이유 |
|---|---|---|
| Button (default, secondary, outline, destructive) | `shadow-xs` | 인터랙티브 컨트롤 깊이감 |
| Button (ghost, link) | 없음 | 배경에 섞이는 플랫 스타일 |
| Input, SelectTrigger | `shadow-xs` | 폼 필드 깊이감 |
| Dialog, Modal | `shadow-xl` | 최상위 레이어 |
| Dropdown, SelectContent, Popover | `shadow-md` | 중간 레이어 팝오버 |
| Tooltip | `shadow-md` | 팝오버 |
| Sheet (Drawer) | `shadow-xl` | 사이드 패널 |
| Card | `shadow-sm` | 콘텐츠 카드 |

```
❌ 금지                    ✅ 올바른 사용
shadow-[0_1px_2px_...]    shadow-xs
직접 box-shadow 작성       shadow-* 유틸리티 사용
ghost 버튼에 shadow-xs     ghost/link는 shadow 없음
```

---

## 간격 규칙 (8px 그리드)

```
❌ 금지                    ✅ 올바른 사용
p-[13px]                  p-3 (12px)
mt-[22px]                 mt-6 (24px)
gap-[7px]                 gap-2 (8px)
```

Tailwind 기본 spacing 스케일 사용:
`0, 0.5(2px), 1(4px), 2(8px), 3(12px), 4(16px), 6(24px), 8(32px), 12(48px)`

---

## 커스텀 컴포넌트 위치

shadcn 에 없는 컴포넌트는 `/src/components/api-portal/` 에서 import.
작업 전 Notion Component Decision Log 확인 필수.

---

## 스타일 추가 금지 원칙 (Figma 검증 없이 색·강조 추가 금지)

**UX 관습(destructive action은 빨강, 성공은 초록 등)으로 컬러·굵기·배경을 추가하지 않는다. Figma에서 해당 노드의 실제 토큰을 확인한 후에만 적용.**

### 왜 필요한가

관습에 따라 "Delete니까 text-destructive", "Error니까 bold" 같은 스타일을 덧붙이면, 디자이너가 의도적으로 *중립 스타일*을 선택한 경우에도 불필요한 강조가 들어감. 이번 사례:

- Figma Row Action 드롭다운의 "Delete API Key" 텍스트 색상 = `popover-foreground` (일반 텍스트)
- 구현 시 "destructive action = 빨강" 관습으로 `text-destructive` 추가 → Figma와 불일치

### 체크리스트

텍스트 노드·아이콘·배경에 **색상/굵기/강조** 적용 전에:

1. **Figma에서 해당 노드의 `fills` / `strokes` 확인**
   - 토큰명(`popover-foreground`, `destructive`, `muted-foreground` 등)을 직접 읽기
2. **토큰이 `destructive`/`warning`/`success` 같은 의미 토큰일 때만** 해당 Tailwind 클래스 적용
3. **기본 토큰(`foreground`, `popover-foreground` 등)이면 어떤 색상도 추가하지 않음** — 기본 상속

### 판단 매트릭스

| Figma 텍스트 토큰 | Tailwind | 언제 쓰는가 |
|---|---|---|
| `foreground` / `popover-foreground` | (지정 안 함 — 상속) | 일반 텍스트 |
| `muted-foreground` | `text-muted-foreground` | 보조 텍스트 |
| `destructive` | `text-destructive` | Figma가 명시적으로 destructive 색상 지정한 경우 |
| `success` | `text-success` | Figma가 명시적으로 success 색상 지정한 경우 |

**"Delete / Remove 라서 빨강" 은 Figma 확인 없이 적용 금지.**

### 검증 스크립트 예시

```js
// 텍스트 노드의 실제 fill 토큰 확인
const fill = textNode.fills?.[0];
const varId = fill?.boundVariables?.color?.id;
const variable = varId ? await figma.variables.getVariableByIdAsync(varId) : null;
console.log(textNode.characters, '→', variable?.name); // 예: "Delete API Key" → "popover-foreground"
```

---

## shadcn 기본값 수정 원칙 (Figma truth)

shadcn 기본 스타일이 Figma 스펙과 다를 때 **`src/components/ui/` 파일을 직접 수정**한다.
className 오버라이드나 래퍼로 우회하지 않는다.

### 기준

| 상황 | 처리 |
|---|---|
| shadcn 기본값 = Figma 스펙 | 그대로 사용 |
| shadcn 기본값 ≠ Figma 스펙 | `src/components/ui/*.tsx` 직접 수정 |
| 두 컴포넌트 간 동일 상태 스타일 불일치 | Figma 기준으로 통일 수정 |

### 적용 예시 — Input / Select disabled

공식 shadcn은 Input과 Select의 `disabled` 스타일이 다름:

```
Input    → disabled:bg-input/50 disabled:opacity-50  (배경 있음)
Select   → disabled:opacity-50                       (배경 없음)
```

Figma 라이브러리 기준 (Input `State=disabled`):
- fill: `muted` 토큰 → `bg-muted`
- opacity: 0.5 → `opacity-50`
- Select에는 disabled variant 없음 → Input과 동일 패턴 적용

**수정 결과 (두 컴포넌트 통일):**

```
Input    → disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
Select   → disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 오버라이드 금지 패턴

> shadcn 컴포넌트에 className을 추가할 때 "내가 추가하는 것"만 보지 말고
> **"내가 제거하는 것"** 도 반드시 확인. 제거가 필요하면 래퍼 div로 해결.

### 원칙

| 구분 | 설명 |
|---|---|
| ✅ 허용 | 기본값보다 크게 변경 (`p-2` → `py-3`, `h-auto` → `h-11`) |
| ✅ 허용 | 없던 속성 추가 (`border-r`, `text-sm`, `font-medium`) |
| ❌ 금지 | 기본값을 0으로 제거 (`py-0`, `p-0`, `m-0`, `gap-0`) |
| ❌ 금지 | 이유 없이 기본 padding을 덮어쓰기 |

제거가 필요한 경우 → **래퍼 div로 내부 구조 조정**.

---

### 알려진 금지 패턴

#### SidebarHeader — `py-0` / `p-0` 직접 지정 금지

`SidebarHeader`의 기본 `p-2`는 상단 breathing room을 제공한다.
이를 `py-0`으로 제거하면 TopNav 보더와 내용이 붙어 보인다.

```tsx
// ❌ SidebarHeader padding 직접 제거
<SidebarHeader className="h-11 items-center py-0 px-4">
  <div>...</div>
</SidebarHeader>

// ✅ SidebarHeader 기본 padding 유지 + 래퍼 div로 내부 구조 제어
<SidebarHeader>
  <div className="flex items-center gap-3">
    ...
  </div>
</SidebarHeader>
```

#### Sidebar `collapsible="none"` — `border-r` 반드시 명시

`collapsible="none"`은 단순 div로 렌더링되어 기본 `border-r`이 사라진다.
단독 사용 금지. 래퍼 컴포넌트에서 border를 포함하거나 className으로 명시.

```tsx
// ❌ border 없이 단독 사용
<Sidebar collapsible="none">

// ✅ border 명시
<Sidebar collapsible="none" className="border-r border-sidebar-border">
```

#### DropdownMenuLabel — 반드시 `DropdownMenuGroup` 안에 사용

Base UI의 `Menu.GroupLabel`은 `Menu.Group` 컨텍스트를 요구한다 (Radix와 다름).
shadcn 기본 레지스트리는 이 요구를 반영하지 않아, `DropdownMenuLabel`을 단독으로 쓰면
런타임 에러: `MenuGroupRootContext is missing`.

```tsx
// ❌ Label 단독 사용 — 런타임 에러
<DropdownMenuContent>
  <DropdownMenuLabel>Account</DropdownMenuLabel>
  <DropdownMenuItem>Profile</DropdownMenuItem>
</DropdownMenuContent>

// ✅ Group 으로 감싸기
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

#### flex-col 컨텍스트에서 `items-center` vs `justify-center`

`flex-col`에서 두 클래스의 역할이 반대다.

| 클래스 | flex-col에서 효과 |
|---|---|
| `items-center` | 수평(cross-axis) 중앙 → 콘텐츠가 너비 중앙으로 쏠림 |
| `justify-center` | 수직(main-axis) 중앙 → 원하는 효과 |

`SidebarHeader`(`flex-col`)에서 수직 중앙 정렬이 필요하면 `justify-center` 사용.

---

### 반복 사용 패턴은 래퍼 컴포넌트로 분리

사이드바처럼 shadcn 컴포넌트를 조합해 반복 사용하는 패턴은
`src/components/api-portal/`에 래퍼 컴포넌트로 분리한다.
border·padding·active 상태 등 프로젝트 규칙을 해당 컴포넌트 안에 캡슐화.

```
src/components/api-portal/
  AppSidebar.tsx   ← Sidebar + border-r + nav items 캡슐화
```

새로운 부작용 패턴 발견 시 → 이 섹션에 즉시 추가.
