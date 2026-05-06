# API Portal Design Project

> 매 세션 시작 시 **이 파일과 `PROGRESS.md`를 먼저 읽을 것.**
> 상세 규칙은 `design-system/rules/*.md`, `design-system/components/*.md`에 있고 본 파일은 인덱스 + 핵심 원칙.

---

## 프로젝트 목적

**API Portal** — UJET 개발자용 API 관리 콘솔. Figma의 [Phase1] Design 페이지를 Next.js + Tailwind + shadcn/ui로 구현한다.

페이지 (Figma 기준):
- `/analytics` — 미구현
- `/users` — User & Team management (구현됨)
  - `/users/team/[name]` — Team 상세 (구현됨)
- `/api-keys` — API Keys (구현됨)
- `/webhooks` — 미구현

---

## 기술 스택 / 도구

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** — Base UI 기반 (Radix 아님 → 일부 API 차이)
- **lucide-react** — 아이콘
- **sonner** — toast (커스텀 wrapper로 디자인 토큰 적용)
- **Figma Desktop Bridge MCP** — `figma_execute`로 plugin API 호출

Figma 파일:
- 라이브러리: https://www.figma.com/design/SmO9fsWrxriuCofc7T3b1S
- 디자인: https://www.figma.com/design/F2lkYCId2xMqcd9RuXL20B (`[Phase1] Design` 페이지)

---

## 디자인 원칙 (변경 금지)

1. **Figma is truth** — Figma에서 확인한 토큰/속성만 적용. 관습으로 색상·강조·padding 추가 금지. 특히 "Delete = 빨강" 같은 destructive 색은 Figma `fills`에 destructive 토큰이 명시된 경우만 적용.
2. **shadcn 우선** — `/src/components/ui/`에 있는 컴포넌트는 반드시 사용. 새 컴포넌트 작성 전 그곳을 먼저 확인.
3. **Tailwind CSS 변수 토큰만** — RGB/hex 하드코딩 금지. `text-[14px]`, `font-[600]` 같은 임의값도 금지 (`text-sm`, `font-semibold` 사용).
4. **`dark:` prefix 금지** — CSS 변수가 자동으로 dark 값 적용. `.dark` 클래스는 globals.css에서 관리.
5. **autoFocus 금지** — Edit 다이얼로그 첫 input에 자동 포커스 잡히지 않도록 처리.
6. **메뉴 리스트는 `DropdownMenu`** — Popover는 일반 포지션 컨테이너용 (Tooltip-like).
7. **shadcn 기본 padding 0으로 제거 금지** — 필요하면 래퍼 div로 내부 구조 조정.
8. **Figma `visible: false` 노드 구현 금지** — hidden 노드는 *항상* 제외.
9. **Container children 전체 enumerate** — 텍스트만 추출 금지. INSTANCE / DIVIDER / 장식 Rectangle 모두 visible 자식이면 구현 항목으로 매핑.
10. **shadcn 기본값 ≠ Figma 스펙이면 `src/components/ui/*.tsx` 직접 수정** — className 오버라이드로 우회 X.

상세 사례 + WRONG/CORRECT 예제: `design-system/rules/shadcn.md`, `design-system/rules/figma-reading.md`.

### Dialog / Form 규칙

- **Edit 다이얼로그**: 기존 데이터로 pre-fill, autoFocus 금지.
- **Create/Invite 다이얼로그**: 빈 필드 + placeholder.
- **필수값 검증**: 저장 시 `aria-invalid` + 에러 메시지, 입력 변경 시 즉시 해제. Edit/Create 동일.
- **Alert Dialog**: 확인용 다이얼로그는 `showCloseButton={false}` + outline + destructive 버튼.
- **폼 필드 disabled**: Figma `componentProperties.State === "disabled"` 일 때만 `disabled` prop 적용. 높이 차이로 추정 금지.

---

## 디자인 토큰

### 색상

`src/styles/tokens.generated.css`에서 자동 생성 (Figma `tw/colors` + mode 컬렉션 → `scripts/sync-tokens.ts`).

의미 토큰 (Tailwind 클래스 형태):
- `text-foreground` / `bg-background`
- `text-muted-foreground` / `bg-muted`
- `text-card-foreground` / `bg-card`
- `text-popover-foreground` / `bg-popover`
- `text-primary` / `bg-primary` / `text-primary-foreground`
- `text-secondary` / `bg-secondary` / `text-secondary-foreground`
- `text-accent` / `bg-accent` / `text-accent-foreground`
- `border-border` / `border-input` / `ring-ring`
- 시맨틱: `text-success` / `bg-success-subtle` / `border-success-border` (warning, destructive 동일 패턴)
- destructive 4종: `bg-destructive` / `text-destructive-foreground` / `bg-destructive-subtle` / `border-destructive-border`
- 브랜드 (UJET 시그니처 블루 `#4ABCFF`): `bg-brand` / `text-brand` / `text-brand-foreground` — **로고·랜딩·마케팅 한정 사용** (subtle/border 변형 없음). 일반 UI는 `primary`/`info`/`sidebar` 토큰 사용. 자세한 가이드: `design-system/rules/color.md`
- 사이드바: `border-sidebar-border` 등

예외 (의미 토큰 없음, 직접 팔레트 사용):
- `bg-fuchsia-600` — Avatar mock 배경

### 타이포그래피

```
본문: font-sans  (Inter)
코드: font-mono  (Geist Mono)
```

크기/굵기는 Tailwind 스케일만 사용 (`text-xs`/`text-sm`/`text-base`/`text-lg`/`text-xl`/`text-2xl`/`text-3xl`, `font-medium`/`font-semibold`).

### 스페이싱

8px 그리드 — `0, 0.5(2), 1(4), 2(8), 3(12), 4(16), 6(24), 8(32), 12(48)`.

### Border Radius

| 클래스 | 값 | 용도 |
|---|---|---|
| `rounded-xs` | 2 | 배지 |
| `rounded-sm` | 4 | 버튼, 인풋 |
| `rounded-md` | 8 | 카드, 패널 |
| `rounded-lg` | 10 | 모달, 드롭다운 |
| `rounded-xl` | 12 | 큰 카드 (TeamCard) |
| `rounded-2xl` | 16 | 섹션 |
| `rounded-full` | 9999 | 아바타, 칩 |

비표준 값(예: Figma 14)은 가장 가까운 표준값 사용. 강제 정밀 일치는 `rounded-[14px]`.

### Shadow

| 컴포넌트 | shadow |
|---|---|
| Button (default/secondary/outline/destructive), Input, SelectTrigger | `shadow-xs` |
| Button (ghost/link) | 없음 |
| Dialog, Sheet | `shadow-xl` |
| Dropdown, SelectContent, Popover, Tooltip, Toast | `shadow-md` |
| Card | `shadow-sm` |

### Figma "fill container" → 코드

| Figma | 코드 |
|---|---|
| fill container (가로) | `w-full` |
| fill container (세로) | `h-full` |
| hug contents | 기본값 (별도 width 지정 안 함) |
| fixed | `w-[Npx]` 또는 `max-w-*` |

`SelectTrigger` 기본은 `w-full`. 콘텐츠 폭이 필요할 때만 `className="w-fit"` 오버라이드.

---

## 컴포넌트 컨벤션

### 디렉토리

- **shadcn primitives**: `src/components/ui/*.tsx` (자동 생성)
- **도메인 컴포넌트**: `src/components/api-portal/*.tsx` (사이드바·카드·다이얼로그·테이블 보조)
- **페이지**: `src/app/(dashboard)/<route>/page.tsx`
- **Mock data + runtime store**: `src/lib/*.ts`

### 다이얼로그

- 파일명: `*Dialog.tsx`
- Width: Figma 따름 (예: 423 → `sm:max-w-[423px]`, 512 → `sm:max-w-[512px]`)
- Alert Dialog: `showCloseButton={false}` + outline+destructive

### Form

- `<Label htmlFor>` + Input/Select `id` 연결
- 에러 시 Label에 `text-destructive`, Input/SelectTrigger에 `aria-invalid={true}`

### 메뉴 리스트

- `DropdownMenu` + `DropdownMenuItem` (Popover X)
- Trigger: `aria-label` 필수 (예: `"Actions for {name}"`)
- 텍스트 색은 Figma 토큰 따름 (`popover-foreground` 일반). `text-destructive` 금지 — Figma 확인 후만.
- 단축키(`⌘K`)는 Figma 인스턴스에서 visible=false면 미표시.

### Status Badge

- 공용 컴포넌트: `src/components/api-portal/StatusBadge.tsx` 사용. 직접 색 매핑 inline 금지.

### 아이콘

- lucide-react. Figma 노드명(kebab-case) → PascalCase (`lucide/circle-check` → `CircleCheck`).
- 예외 매핑: `lucide/ellipsis` → `MoreHorizontal` (코드 통일)
- 직접 작성 파일에서는 **suffix 없이** import (`Search`, `MoreHorizontal`). 단 lucide `User`와 의미 타입 `User`가 충돌하면 `User as UserIcon`으로 alias.
- shadcn 자동 생성 파일은 `*Icon` suffix 유지.

### 클릭 가능한 카드 + 내부 메뉴 (TeamCard 패턴)

```tsx
<div className="relative ...">
  <Link href={...} className="absolute inset-0" aria-label={...} />
  <div className="relative pointer-events-none">
    {/* 카드 콘텐츠 — 클릭 통과 */}
    <div className="pointer-events-auto">
      <DropdownMenu>...</DropdownMenu>
    </div>
  </div>
</div>
```

### 시스템 vs 일반 엔티티

- 보호 엔티티(예: Default 팀)는 `protected: true` 플래그로 표시 → 메뉴/UI에서 Delete 항목 조건부 숨김.

---

## 파일 구조

```
api-portal/
├── CLAUDE.md                 ← 이 파일
├── PROGRESS.md               ← 작업 진행 상황 (매 세션 갱신)
├── design-system/            ← Figma → 코드 룰 / 캐시
│   ├── icons.md
│   ├── tokens.json           ← Figma 원본
│   ├── rules/
│   │   ├── color.md
│   │   ├── figma-reading.md
│   │   ├── instance-variant.md
│   │   ├── layout.md
│   │   └── shadcn.md
│   └── components/           ← 컴포넌트별 스펙
│       ├── alert.md, badge.md, button.md, dialog.md
│       ├── input.md, select.md, popover.md, pagination.md, table.md
├── public/
│   └── ujet-logo.svg
├── scripts/
│   └── sync-tokens.ts        ← tokens.json → tokens.generated.css
└── src/
    ├── app/
    │   ├── layout.tsx        ← Root + <Toaster>
    │   ├── globals.css
    │   └── (dashboard)/
    │       ├── layout.tsx    ← TopNav + Sidebar + main
    │       ├── analytics/page.tsx
    │       ├── api-keys/page.tsx
    │       ├── users/
    │       │   ├── page.tsx
    │       │   └── team/[name]/page.tsx
    │       └── webhooks/page.tsx
    ├── components/
    │   ├── api-portal/       ← 도메인 컴포넌트
    │   │   ├── AccountDropdown.tsx
    │   │   ├── AppSidebar.tsx
    │   │   ├── CreateApiKeyDialog.tsx
    │   │   ├── CreateTeamDialog.tsx
    │   │   ├── DeleteApiKeyDialog.tsx
    │   │   ├── EditApiKeyDialog.tsx
    │   │   ├── ProfileDialog.tsx
    │   │   ├── sortable-head.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── table-pagination.tsx
    │   │   └── ViewApiKeyDialog.tsx
    │   └── ui/               ← shadcn primitives + 커스텀 sonner
    │       ├── badge.tsx, breadcrumb.tsx, button.tsx, ...
    │       └── sonner.tsx    ← 커스텀 (시맨틱 토큰 적용)
    ├── lib/
    │   ├── mock-team-data.ts ← Phase1 mock + runtime store
    │   └── utils.ts
    ├── styles/
    │   └── tokens.generated.css
    └── hooks/
```

---

## 주요 파일 위치

### 매 세션 시작 시 읽기
- `CLAUDE.md` (이 파일)
- `PROGRESS.md` (작업 상황)

### 디자인 시스템 규칙 (구현 전 참조)
- `design-system/rules/figma-reading.md` — Figma 노드 읽기 / hidden / enumerate
- `design-system/rules/shadcn.md` — shadcn 사용 / 오버라이드 금지 / 스타일 추가 금지
- `design-system/rules/instance-variant.md` — INSTANCE variant 판별 (fills+strokes+componentProperties)
- `design-system/rules/color.md` — 컬러 토큰
- `design-system/rules/layout.md` — h-screen / overflow / 사이드바 등
- `design-system/components/<컴포넌트>.md` — Button / Dialog / Input / Select / Popover / Table 등 스펙
- `design-system/icons.md` — Figma 노드명 ↔ lucide 매핑

### 코드 핵심 위치
- 토큰: `src/styles/tokens.generated.css` (자동 생성 — 직접 수정 X)
- 토큰 sync: `scripts/sync-tokens.ts`
- Mock + runtime store: `src/lib/mock-team-data.ts`
- 글로벌 layout (TopNav): `src/app/(dashboard)/layout.tsx`
- Toast wrapper: `src/components/ui/sonner.tsx`

---

## 작업 시 주의사항

### Figma 읽기

- 노드 읽을 때 항상 `visible` 포함. `visible: false`는 절대 구현 금지.
- 컨테이너 자식은 `name`/`type`/`visible`/`w`/`h` 전체 enumerate. **`getVisibleTexts()`만 호출하면 INSTANCE/RECTANGLE 자식이 통째로 누락됨** (실제 사례 2건: TopNav divider, Team header ellipsis).
- 색상 적용 전 해당 노드의 `fills`/`strokes` 토큰명 확인.
- Figma 라이브러리의 컴포넌트 set 색은 그대로 두고 **인스턴스 레벨에서 override**하는 패턴이 흔함 (예: Sonner 아이콘 색은 라이브러리에선 `foreground`인데 디자인 인스턴스에선 `success/success`로 override). 라이브러리만 보지 말고 실제 디자인 인스턴스도 확인.

### Rectangle 노드 = divider 의심

| 힌트 | 해석 |
|---|---|
| width=1 또는 height=1 | 세로/가로선 divider |
| rotation ≠ 0 + 좁은 비율 | 회전된 divider (예: 20×1 + rotation=-90 → 1×20 세로선) |
| 두 그룹 사이 위치 | 섹션 divider |
| stroke만 있고 fills=[] | 선형 요소 |

### 라우팅 / 상태

- Tab 상태는 URL 쿼리(`?tab=team`)로 deep-link 지원. `useSearchParams` 사용 시 **Next.js 16에서 `<Suspense>` 경계 필수** (CSR bailout 에러).
- Mock 데이터 라우트 간 공유는 `mock-team-data.ts` 패턴: 모듈 레벨 mutable + `useState` 초기값으로 스냅샷 + `setState(getX())`로 동기화.
- **새로고침 시 mock store는 INITIAL_*로 리셋** — 영속화 필요 시 localStorage.

### 빌드 검증

- 타입 체크: `npx tsc --noEmit`
- 빌드: `npx next build` — 변경 후 빌드까지 통과 확인 권장 (특히 `useSearchParams`, dynamic route 같은 Next.js 16 특이 케이스).

### Phase1 mock vs 실제 API

- 모든 mock은 `src/lib/`에 모음. 컴포넌트 inline 작성 자제.
- 예외: `CURRENT_USER`는 현재 ProfileDialog/AccountDropdown에 inline (TBD: 추후 추출).
