# API Portal Design - 진행 상황

최종 업데이트: 2026-04-28 (brand·destructive 토큰 정리 + Figma 동기화)

## 현재 마일스톤

Phase1 디자인 구현 — **User & Team, API Keys** 페이지의 주요 플로우(목록 / Create / View / Edit / Delete / 상세 / Toast)까지 완료.

다음: 미완 페이지(**Webhooks, Analytics**) + 보조 기능(검색 필터, 팀 Edit/Delete 다이얼로그, Invite User to Team).

---

## 완료된 작업

### 디자인 시스템 / 인프라

- [x] Token sync workflow — `scripts/sync-tokens.ts`, `src/styles/tokens.generated.css`
- [x] 디자인 시스템 규칙 문서 — `design-system/rules/{figma-reading,shadcn,instance-variant,color,layout}.md`
- [x] 컴포넌트 스펙 문서 — `design-system/components/{alert,badge,button,dialog,input,select,popover,...}.md`
- [x] 아이콘 매핑 문서 — `design-system/icons.md`
- [x] **Sonner toast** 시맨틱 토큰 적용 — `src/components/ui/sonner.tsx` (success/info/warning/error/loading 아이콘 + text-success/info/warning/destructive)
- [x] **StatusBadge** 공용 컴포넌트 추출 — `src/components/api-portal/StatusBadge.tsx`
- [x] **Mock data + runtime store** — `src/lib/mock-team-data.ts` (`getTeams/addTeam/deleteTeam/findTeam` — 라우트 간 동일 세션 동안 상태 공유)
- [x] **Brand 토큰 추가** — `palette/ujet-blue (#4ABCFF)` + `semantic.brand` / `brand-foreground` (light/dark 동일, foreground는 `neutral/950`). subtle/border 변형 없음 — 브랜드 한정 사용 정책.
- [x] **Destructive 4종 세트 완성** — `destructive` / `-foreground` / `-subtle` / `-border` 모두 Figma `mode` 컬렉션과 일치. `destructive-foreground` 별칭 `neutral/50` → `palette/white`로 정정 (SSOT).
- [x] **color.md Brand 사용 가이드 매트릭스** — ✅ 로고·랜딩·마케팅 / ❌ 일반 CTA(→primary), 정보 알림(→info), 사이드바 active(→sidebar-active)

### TopNav / Sidebar / Account

- [x] **TopNav**: ujet 로고(SVG, 161×43) + Documentation/API Reference + 세로 divider(`bg-sidebar-border`) + Dashboard 활성 + Search + Ask AI + Avatar — `src/app/(dashboard)/layout.tsx`
- [x] **AppSidebar** — `src/components/api-portal/AppSidebar.tsx`
- [x] **AccountDropdown**: 로그인 이메일 + Profile + Logout (Figma hidden인 Setting/Calculator 제거) — `src/components/api-portal/AccountDropdown.tsx`
- [x] **ProfileDialog**: Email/Name/Role/Team — Email/Role/Team `disabled` (Figma `State=disabled`) — `src/components/api-portal/ProfileDialog.tsx`

### Users 페이지 (`/users`)

- [x] User 탭: 멤버 테이블 + 정렬 + 페이지네이션 + Status badge — `src/app/(dashboard)/users/page.tsx`
- [x] Pending Approvals 탭
- [x] Team 탭: TeamCard 그리드 (3 cols) + Edit/Delete 메뉴 (Default 팀은 `protected:true`로 삭제 불가)
- [x] Invite User 다이얼로그 + Edit User 다이얼로그 (기존)
- [x] **CreateTeamDialog** (Team Name + Description + 120자 카운터, 토스트 "Team created") — `src/components/api-portal/CreateTeamDialog.tsx`
- [x] **EditTeamDialog** (Figma `1437:11972`, 423px, "Edit Team", Cancel/Save, 120자 카운터, rename 시 detail URL `router.replace`) — `src/components/api-portal/EditTeamDialog.tsx` + `updateTeam()` in `mock-team-data.ts`
- [x] Row action menu — Popover→DropdownMenu 통일, 단축키 hidden (Figma)

### Team 상세 페이지 (`/users/team/[name]`)

- [x] Breadcrumb (Home > Dashboard > User & Team management > {team.name}) — `src/app/(dashboard)/users/team/[name]/page.tsx`
- [x] Header: 제목(좌) + 3-dot 메뉴(우) `justify-between` + Description
- [x] 헤더 메뉴 — Edit + Delete (Default는 Delete 숨김)
- [x] Search User + Invite User toolbar
- [x] 멤버 테이블 (Name/Email/Status/Role/Updated) + "No list" 빈 상태
- [x] Breadcrumb "User & Team management" 클릭 시 `/users?tab=team`으로 복귀

### API Keys 페이지 (`/api-keys`)

- [x] API Keys 테이블 + 정렬/페이지네이션 — `src/app/(dashboard)/api-keys/page.tsx`
- [x] **CreateApiKeyDialog** — `src/components/api-portal/CreateApiKeyDialog.tsx`
- [x] **ViewApiKeyDialog** (성공 alert + 마스킹/copy/eye toggle) — `src/components/api-portal/ViewApiKeyDialog.tsx`
- [x] **EditApiKeyDialog** — `src/components/api-portal/EditApiKeyDialog.tsx`
- [x] **DeleteApiKeyDialog** (Alert Dialog 패턴, outline+destructive, X close 없음) — `src/components/api-portal/DeleteApiKeyDialog.tsx`
- [x] Row action menu (DropdownMenu, Edit/Delete) — Figma 기준 일반 텍스트 색(`popover-foreground`), destructive 색 추가 안 함
- [x] Create → 성공 시 ViewApiKeyDialog 자동 오픈 → Done으로 닫기 플로우

### 라우팅 / Tab 상태

- [x] Team 카드 클릭 → `/users/team/{encodeURIComponent(name)}`로 이동 (Link absolute overlay + `pointer-events-none/auto`로 메뉴 영역 분리)
- [x] Team 상세 → Breadcrumb 클릭 시 `/users?tab=team` (URL 쿼리)
- [x] Users 페이지 `useSearchParams`로 초기 탭 결정 → Next.js 16 CSR bailout 위해 `<Suspense>` 경계 적용

### Phase1 마무리된 규칙 추가

- `shadcn.md`: "shadcn 기본값 수정 원칙(Figma truth)" + "스타일 추가 금지 원칙(파괴적 액션 빨강 추가 금지)"
- `figma-reading.md`: "컨테이너 children 전체 enumerate" + "`getVisibleTexts()`만 호출 금지" + Rectangle/divider 판별 기준
- `instance-variant.md`: STEP 4 — 폼 필드 `State` variant는 `componentProperties` 직접 확인
- `popover.md`: 메뉴 리스트는 `DropdownMenu` 우선 (Popover는 일반 컨테이너용)
- `components/input.md`, `components/select.md`: Disabled state 스펙

---

## 진행 중

(현재 없음 — 마지막 task인 Team 상세 페이지 헤더 정렬 + Breadcrumb 쿼리 보존까지 완전히 마침)

---

## 백로그 (우선순위 순)

### 1. Team 운영 보조 기능 (사용자 다음 요청 가능성 큼)

- [ ] **Delete Team 확인 다이얼로그** — TeamCard 메뉴와 상세 헤더 메뉴에서 현재 `toast.info("... — Phase1 design pending")`. `DeleteApiKeyDialog` 패턴(512×156 Alert Dialog, outline+destructive) 재사용 가능 여부 확인 필요.
- [ ] **Invite User (특정 팀에)** — 팀 상세 페이지의 "Invite User" 버튼은 현재 toast placeholder. 기존 Users 페이지의 Invite User 다이얼로그 재사용 가능할지 검토.

### 2. Phase1 미구현 페이지

- [ ] **Webhooks 페이지** — `/webhooks` 파일 존재하나 디자인 미적용
- [ ] **Analytics 페이지** — `/analytics` 파일 존재하나 디자인 미적용

### 3. 보조 기능 / UX 개선

- [ ] **검색 입력 실제 필터** — Users/API Keys/Team 상세 모두 입력 UI만 있고 필터 동작 없음
- [ ] **Tab 변경 시 URL 동기화** — 현재 진입 시 `?tab=`만 읽음. 사용자가 탭을 바꿀 때 URL 갱신 안 됨 (router.replace 추가 검토)
- [ ] **ProfileDialog autoFocus 차단 검증** — `CLAUDE.md` 규칙에는 "Edit dialog 첫 input 자동 포커스 X"이지만 Base UI 기본 동작과 실제 동작 일치 여부 미검증

### 4. 데이터 / 인프라

- [ ] Mock data → 실제 API 연동 (전부 Phase1 mock 상태)
- [ ] 인증 / 세션 컨텍스트 (`CURRENT_USER` mock이 `ProfileDialog`/`AccountDropdown` 양쪽 inline)

### 5. 토큰 / 색상 정책 (이번 세션에서 도출)

- [ ] **`info` 시맨틱 토큰 추가** — Figma `mode` 컬렉션에는 있을 가능성 높음(success/warning/destructive와 짝). 코드의 `colors.json`에는 누락. `info` / `info-foreground` / `info-subtle` / `info-border` 4종 세트로 추가 검토.
- [ ] **`StatusBadge` 마이그레이션** (`src/components/api-portal/StatusBadge.tsx`)
  - 현재: `Active=bg-green-100/text-green-700`, `Verified=bg-orange-100/text-orange-700`, `Invited=bg-blue-100/text-blue-700` (팔레트 직접 사용 — dark mode 미대응)
  - 목표: `Invited` → `bg-info-subtle text-info border-info-border` (`info` 토큰 추가 후), `Active`/`Verified`도 시맨틱 또는 status-카테고리 토큰으로 마이그레이션
  - 의존: 위 `info` 토큰 추가 선행
- [x] ✅ **사이드바 active 색상 정책 결정 — 완료 (2026-05-08)**
  - 결정: 텍스트 색상 변경 없이 **`bg-sidebar-accent`만** (Figma 1518:13771 정합)
  - `AppSidebar.tsx`/`DocsSidebar.tsx` 모두 동일 패턴 적용 — `bg-sidebar-accent` (active) / `hover:bg-sidebar-accent` (hover), 텍스트는 `text-sidebar-foreground`

---

## 차단 요소 / 결정 필요 사항

### 사용자 결정 / 디자인 노드 필요

- [ ] **Delete Team 확인 다이얼로그** Figma 노드 ID — 또는 "DeleteApiKeyDialog 패턴 재사용 OK" 확인
- [ ] **Invite User to Team** Figma 노드 ID — 또는 "기존 Invite User 다이얼로그 재사용 OK" 확인
- [ ] **Webhooks 페이지** Figma 노드 위치
- [ ] **Analytics 페이지** Figma 노드 위치

### 기술 결정 미확정

- [ ] **mock-team-data runtime store**는 같은 클라이언트 세션 내에서만 유지 — 새로고침 시 `INITIAL_TEAMS`로 리셋. localStorage 영속화 필요 여부 미결정.
- [ ] **`CURRENT_USER` mock** — `ProfileDialog`와 `AccountDropdown` 양쪽에 inline 중복. 공유 모듈(`src/lib/mock-current-user.ts`) 추출 여부 미결정.

### 알려진 작은 이슈

- **TeamCard `rounded-xl`(12px)** — Figma 14px과 약간 다름. 가장 가까운 Tailwind 표준값(rounded-xl=12, rounded-2xl=16) 중 12 선택. 고정밀 일치 필요하면 `rounded-[14px]`로 변경 가능.
- **ProfileDialog / EditTeamDialog autoFocus** — Base UI Dialog 기본 동작상 첫 input에 포커스가 잡힐 가능성. 현재 명시적 차단 코드 없음. CLAUDE.md 규칙은 "Edit 다이얼로그 첫 input autoFocus 금지"이지만 미검증.
- **Team rename 후 user.team 미갱신** — `updateTeam()`은 team 레코드만 변경. 기존 멤버의 `user.team` 필드는 그대로라 멤버 리스트가 빈 상태로 보일 수 있음 (Phase1 mock 한계). 실제 API 연동 시 백엔드가 처리.
- **EditTeamDialog Description 카피** — Figma에 "Create a team to organize members and manage access." (Create 다이얼로그와 동일)이 그대로 들어가 있어 코드도 동일하게 적용. 디자인팀 의도된 것인지 확인 필요.
