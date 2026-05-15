# API Portal Design - 진행 상황

최종 업데이트: 2026-05-15 (ToggleGroup primitive 도입 + AnalyticsTabs / HomeMetricsChart segmented control 통일)

## 현재 마일스톤

Phase1 디자인 구현 — **User & Team, API Keys, Documentation(Quick Start + Inbound Calls), Analytics, API Reference(Create Call)** 주요 플로우 완료.

다음 우선순위:
- 미완 페이지: **Webhooks** (디자인 대기)
- API Reference 나머지: Get Call / Update Call 본문 (현재 placeholder)
- Documentation 추가 콘텐츠 (Tutorials, Outbound Calls, Call Recording 등 — 현재 blank)
- 보조 기능: 검색 필터 동작, 팀 Delete 다이얼로그, Invite User to Team

---

## 완료된 작업

### 디자인 시스템 / 인프라

- [x] **Token sync workflow** — `scripts/sync-tokens.ts`, `src/styles/tokens.generated.css`
- [x] **Radius scale Figma 정합** (2026-05-08) — misc.json에 radius scale 추가, sync-tokens.ts 확장. 모든 radius 값 Figma 라이브러리와 일치 (sm 4→6, xl 12→14, 2xl 16→18, 3xl 24→22, 4xl 32→26)
- [x] 디자인 시스템 규칙 문서 — `design-system/rules/{figma-reading,shadcn,instance-variant,color,layout,figma-token-sync}.md`
- [x] 컴포넌트 스펙 문서 — `design-system/components/{alert,badge,button,dialog,input,select,popover,table,pagination}.md`
- [x] **아이콘 매핑 + 워크플로우 문서** — `design-system/icons.md` (4단계 절차: Figma 인스펙트 → lucide import → 없으면 질문 → 표 갱신)
- [x] **Sonner toast** 시맨틱 토큰 적용 — `src/components/ui/sonner.tsx`
- [x] **StatusBadge** (User용) + **ApiKeyStatusBadge** (Active/Expired/Revoked) 분리
- [x] **Mock data + runtime store**:
  - `src/lib/mock-team-data.ts` (Teams)
  - `src/lib/mock-api-keys.ts` (ApiKey + status/owner/expires 필드 + 포맷터)
- [x] **Brand 토큰** — `palette/ujet-blue (#4ABCFF)` + `brand` / `brand-foreground` (subtle/border 없음, 한정 사용 정책)
- [x] **Destructive 4종 세트** — destructive / -foreground (white) / -subtle / -border
- [x] **Info 토큰 정정** (2026-05-11) — `info` light 값 `blue/500` → `blue/600`로 Figma 정합 + `background-color` (5% black overlay) 신규 추가
- [x] **HTTP Basic Auth middleware** — `src/middleware.ts` (BASIC_AUTH_USER/BASIC_AUTH_PASSWORD env vars)
- [x] **Auth Context** (UI 로그인 상태) — `src/lib/auth-context.tsx`, in-memory useState (refresh 시 리셋)
- [x] **글로벌 cursor pointer** — `button:not(:disabled)`, `[role="button"]` 호버 시 손가락 커서 (globals.css)
- [x] **dev 서버 NODE_OPTIONS 영구 적용** (2026-05-14) — `package.json` `dev` 스크립트에 `NODE_OPTIONS='--max-old-space-size=8192'` 박음. Next.js 16 Turbopack 의 dev 메모리 누수 대응.
- [x] **Badge 시스템 라이브러리 정합** (2026-05-14) — rounded-lg + subtle 토큰 4종 /100 정합 + highlight 4-token set + Badge primitive cva 확장(success/warning/info/highlight/muted) + 4 wrapper 통일 (상세는 "토큰 / 색상 후속 검토" 섹션 참조)
- [x] **헤더 영역 gap 통일** (2026-05-14) — Breadcrumb ↔ Header 간격 4페이지 (analytics / api-keys / users / team-detail) 모두 `gap-10` (40px) 으로 정합. 기존 api-keys / users / team-detail 은 `gap-6` 으로 불일치 였음.
- [x] **브랜드 컬러 업데이트** (2026-05-15) — `palette/ujet-blue` `#4ABCFF` → `#00A2FF` (Figma `brand/brand` 변경 정합). `colors.json` → `sync-tokens` → `tokens.generated.css` 자동 반영. `CLAUDE.md` / `design-system/rules/color.md` / `UjetLogo.tsx` 주석 hex 갱신. GNB 로고는 `text-brand` currentColor 기반이라 자동 적용.
- [x] **Next.js 16 `proxy` 마이그레이션** (2026-05-15) — `src/middleware.ts` → `src/proxy.ts` (git mv) + export 함수명 `middleware` → `proxy`. deprecation 경고 해소. `.next` 캐시 삭제 후 재시작 필요했음 (Turbopack edge 모듈 캐시).
- [x] **ToggleGroup primitive 도입 + segmented control 통일** (2026-05-15) — `src/components/ui/toggle-group.tsx` 신규 (Base UI `@base-ui/react/toggle-group` + `toggle` wrapping, cva variant `outlined`/`pill` + size `default`/`sm`). single-value 외부 API (`value: string`, `onValueChange: (v: string) => void`) 로 Base UI 의 array API 래핑. `AnalyticsTabs.tsx` → `outlined`, `HomeMetricsChart.tsx` → `pill size="sm"` 마이그레이션. raw `<button>` 6건 제거. 자동 부수효과: 화살표 키보드 내비게이션, `aria-pressed`, focus-visible ring. 문서: `design-system/components/toggle-group.md`.
- [x] **Analytics 메인 차트 단일 라인 변경 + tooltip method 분해** (2026-05-15) — `AnalyticsCallVolumeChart` stacked 2-series(read/write) → 단일 `total` area(info-chart blue). 호버 tooltip 커스텀 `RequestVolumeTooltip` (총 + GET/POST/PUT/PATCH/DELETE 5 row, swatch + 값). 범례 제거. `CallVolumePoint` 타입 `{month, total, get, post, put, patch, delete}` 으로 재구성. 3 period(6m/30d/7d) mock 모두 method-별 breakdown 으로 갱신. 카피 "Call volume trend" → "Request volume trend", summary card 1 "Total calls" → "Total Requests" 3 period 공통.
- [x] **Analytics 페이지 반응형** (2026-05-15) — 헤더 stacked(`md:flex-row`), Summary 카드 `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, 하단 row `flex-col lg:flex-row`, MethodDistribution `w-full lg:w-[420px]`, TopApis endpoint 컬럼 `w-[120px] sm:w-[200px]`, CallVolume legend `flex-wrap`, AnalyticsTabs `md` 미만 라벨 축약 (`6m`/`30d`/`7d`). `AnalyticsSummaryCard`에서 `flex-1` 제거 (grid가 폭 결정).

### TopNav

- [x] **UjetLogo 인라인 컴포넌트** — `src/components/api-portal/UjetLogo.tsx` (SVG → React, currentColor + text-foreground/text-brand 토큰)
- [x] **TopNav 단일 컴포넌트** — `src/components/api-portal/TopNav.tsx` (활성 메뉴 자동 감지 via `usePathname()`, auth 상태 자동 분기 via `useAuth()`)
- [x] **로그인 상태 메뉴 분기**:
  - 로그아웃: Documentation / API Reference + "Log in" 버튼
  - 로그인: + Dashboard 메뉴 + AccountDropdown (Avatar)
  - Log out → AccountDropdown 메뉴 → `useAuth().logout()`

### Sidebar (재설계 — 2026-05-08)

- [x] **사이드바 active 색상 정책** — `bg-sidebar-accent`만 적용 (텍스트 색 변경 없음, Figma 1518:13771 정합)
- [x] **AppSidebar + DocsSidebar 통일 구조** — 둘 다 커스텀 `<aside>` 패턴 + sidebar-* 토큰
- [x] **Level 1 leaf + Level 1 group with chevron + Level 2** 구조 — 두 사이드바 공통
- [x] **헤더 높이 통일 (68px)** — Dashboard Bottom=false에서도 wrapper 36px 고정으로 아이콘 Y 위치 정렬
- [x] **shadcn Accordion 커스텀** — `ChevronDown/Up` → 단일 `ChevronRight` 90° 회전 (Figma sidebar 스펙), AccordionContent의 `[&_a]:underline` 제거, AccordionTrigger의 `hover:underline` 제거

### Dashboard 영역 (`(dashboard)` 라우트 그룹)

#### Users 페이지 (`/users`)
- [x] User 탭: 멤버 테이블 + 정렬 + 페이지네이션 + Status badge
- [x] Pending Approvals 탭
- [x] Team 탭: TeamCard 그리드 + Edit/Delete (Default 팀 protected)
- [x] Invite User / Edit User 다이얼로그
- [x] CreateTeamDialog / EditTeamDialog
- [x] **테이블 Checkbox 컬럼 제거** (2026-05-08) — 향후 phase에서 다중 선택 다른 방식
- [x] **첫 컬럼 좌측 padding `pl-5` (20px)** 통일

#### Team 상세 페이지 (`/users/team/[name]`)
- [x] Breadcrumb + 헤더(Edit/Delete) + Search/Invite toolbar + 멤버 테이블
- [x] Checkbox 제거

#### API Keys 페이지 (`/api-keys`)
- [x] **테이블 7컬럼** (Name/Owner/Key/Status/Expires/Last used/Created) — Figma 갱신 정합
- [x] **부제 "Production expires in 5 days"** 헤더 아래
- [x] CRUD + **Revoke 플로우** (Active 상태만 Revoke 가능, status → `Revoked`)
- [x] CreateApiKeyDialog: Name + **Expiry select** (No expiration / 30 days / 90 days / 365 days), 버튼 `Create`
- [x] ViewApiKeyDialog ("API Key Created"): 성공 alert + Name(disabled) + Expiry(disabled select) + Token(masked + copy + eye toggle)
- [x] EditApiKeyDialog: Name + Expiry + Created date (readonly muted)
- [x] DeleteApiKeyDialog (Alert pattern, 512×156)
- [x] RevokeApiKeyDialog (Alert pattern + "Revoked" 빨강 배지 적용)
- [x] **`ApiKeyStatusBadge`** — Active(green) / Expired(gray) / Revoked(destructive-subtle)
- [x] **데이터 모델 `id` 필드 추가** — Deployment 중복 5건 React key 충돌 방지

#### Analytics 페이지 (`/analytics`) — 2026-05-13
- [x] **5개 chart 토큰 추가** — `success-chart` / `info-chart` / `accent-chart` / `warning-chart` / `destructive-chart` (light: palette/*/500, dark: */400). Figma 라이브러리 `mode` collection에서 `figma_get_variables` + `useConsoleFallback`로 토큰명 직접 추출
- [x] **shadcn `chart` primitive** 설치 (recharts 의존)
- [x] **Mock data** — `src/lib/mock-analytics-data.ts` (6m 데이터셋, **30d/7d 별도 mock 데이터셋 추가 2026-05-14**: 30d=Week 1-4, 7d=Mon-Sun. 카드 4개 / Call Volume / Top APIs / Method Distribution 모두 period 별 다른 값. 캡션 `Total for the last N` 도 period-aware)
- [x] **메소드 색 매핑 단일 소스** — `src/lib/method-colors.ts` (HTTP method → chart 토큰)
- [x] **컴포넌트 5종**:
  - `AnalyticsTabs` — 3개 segmented period 탭 (Last 6 months / 30 days / 7 days)
  - `AnalyticsSummaryCard` — chip 있는/없는 2 variant (1·3 chip, 2·4 chip 없음)
  - `AnalyticsCallVolumeChart` — Read(GET)/Write(POST·PUT·PATCH·DELETE) stacked area + 범례
  - `AnalyticsTopApisChart` — 3-column Y축 (endpoint/count/method) + horizontal bar
  - `AnalyticsMethodDistribution` — pie 192×192 + 5 method legend (420px 고정)
- [x] **PETCH/FATCH 오타 코드에서 PATCH로 정정** (Figma 파일 수정 요청 中)

### 사이드바 hybrid 반응형 (2026-05-12)

- [x] **하이브리드 패턴**: shadcn `SidebarProvider` + `Sheet` (모바일) + 커스텀 `<aside>` (데스크탑)
- [x] **AppSidebar + DocsSidebar** 동일 패턴 적용
- [x] **TopNav 반응형** — md 미만 햄버거(`SidebarTrigger`), lg 미만 검색 아이콘만, sm 미만 Ask AI 아이콘만
- [x] **TocSidebar 모바일** — xl 미만에서 본문 상단 `<details>` collapsible로 변환
- [x] **DocsPageShell px-6 md:px-10** — 모바일 패딩 축소

### Figma MCP 워크플로우 개선 (2026-05-12)

- [x] **`design-system/rules/figma-reading.md`에 "라이브러리 Variables 읽기" 섹션 추가** — `figma_get_variables` + `useConsoleFallback=true` + Desktop Bridge 우회 표준 명령. hex 추측은 최후 fallback.
- [x] **`design-system/pages/analytics.md`** — Analytics 페이지 완전 스펙 (노드 ID, 카드 콘텐츠, 차트 종류, 색 매핑, hidden 노드 목록)
- [x] 메모리 저장 — Figma MCP는 summary 먼저, deep는 최후 (토큰 절약)

### Documentation 영역 (`(docs)` 라우트 그룹 — 2026-05-08)

- [x] **(docs) 라우트 그룹** + DocsLayout (3-column: DocsSidebar + Main + TocSidebar)
- [x] **DocsPageShell** + **DocsSection** 공통 컴포넌트 (Breadcrumb / Title / Description / sections / Prev·Next 풋터)
- [x] **TocSidebar** — "On This Page" + 자동 스크롤 spy (`useScrollSpy` 훅)
- [x] **CodeBlock** — 제목 + 언어 select(disabled) + 복사 버튼 (Phase1: plain text monospace)
- [x] **DocsSidebar** — DOCS_NAV 데이터 기반, Calls/Queues/Agents 그룹 expandable, sidebar-* 토큰
- [x] **`/documentation` (Quick Start)** 완전 구현 — 5개 섹션 (About / What You'll Find Here with 4 features / How to Use / Quick Links / Need Help), TOC 자동
- [x] **`/documentation/inbound-calls`** 완전 구현 — 5개 섹션 (When to use / How it works / Call flow with code / Call statuses table / Related API endpoints)
- [x] Documentation 외 8개 메뉴는 **blank 페이지** (사이드바 클릭 시 빈 화면, 콘텐츠 대기 중)

### API Reference 영역 (`(api-reference)` 라우트 그룹 — 2026-05-14)

- [x] **(api-reference) 라우트 그룹** + 전용 layout (TopNav + ApiReferenceSidebar + main)
- [x] **`ApiReferenceSidebar`** — `API_REFERENCE_NAV` 데이터 기반, 헤더 "API Reference v1.0.0" + Code2 아이콘. 메뉴 항목마다 method 배지 + 라벨이 고정 폭 (w-14) 컨테이너로 정렬돼 한 줄로 떨어짐.
- [x] **`api-reference-nav.ts`** — Calls / Queues / Agents 그룹. Calls 하위 mock 3개 (POST Create Call / GET Get Call / PATCH Update Call).
- [x] **`MethodBadge` / `CodeBadge`** — shadcn `Badge` primitive thin wrapper. MethodBadge variant 매핑 `{GET:success, POST:info, PATCH:highlight, PUT:warning, DELETE:destructive}`.
- [x] **`/api-reference/create-call`** 완전 구현 — 10 섹션 (Header / Endpoint card / Authentication / Headers table / Body Parameters table / Response code block / Response Fields table / Call Lifecycle 인라인 chip 흐름 + Status Definitions table / Monitoring Polling Example code / Notes / Related API endpoints / Related Documentation). TOC: 7 항목 (Figma 스펙 정합).
- [x] **`/api-reference/get-call`** / **`/api-reference/update-call`** — placeholder ("Coming soon").
- [x] **TopNav 정합** — `API Reference` 메뉴 href = `/api-reference/create-call`, `/api-reference/*` pathname active 감지.

### 라우팅 / Tab 상태

- [x] Team 카드 클릭 → `/users/team/{encodeURIComponent(name)}` (Link absolute overlay)
- [x] Team 상세 → Breadcrumb 클릭 시 `/users?tab=team`
- [x] Users 페이지 `useSearchParams` + `<Suspense>` (Next.js 16 CSR bailout)

### Phase1 마무리된 규칙 추가

- `shadcn.md`: shadcn 기본값 수정 원칙 (Figma truth)
- `figma-reading.md`: 컨테이너 children 전체 enumerate, Rectangle/divider 판별
- `instance-variant.md`: 폼 필드 State variant는 componentProperties 확인
- `popover.md`: 메뉴 리스트는 DropdownMenu 우선
- `components/input.md`, `components/select.md`: Disabled state 스펙
- `figma-token-sync.md`: 토큰 sync workflow (colors + radius)
- `icons.md`: 4단계 아이콘 워크플로우 (Figma 인스펙트 → lucide → 없으면 질문 → 표 갱신)
- `CLAUDE.md` "Button 규칙": variant/size는 Figma `componentProperties`와 1:1 매칭

---

## 진행 중

(현재 없음)

---

## 백로그 (우선순위 순)

### 1. Phase1 미구현 페이지

- [ ] **Webhooks 페이지** — `/webhooks` 파일 존재하나 디자인 미적용
- [x] ✅ **Analytics 페이지** (2026-05-13) — 카드 4개 + Call Volume area chart + Top 5 APIs bar + Method Distribution pie. **30d/7d 탭별 mock 데이터셋 + period-aware 캡션 완료 (2026-05-14)**
- [x] ✅ **API Reference / Create Call** (2026-05-14) — `/api-reference/create-call` 풀 구현 (10 섹션: Header / Endpoint / Headers / Body Params / Response / Response Fields / Lifecycle / Monitoring / Notes / Related). Get Call / Update Call 은 placeholder.

### 2. Documentation 추가 콘텐츠

- [ ] **Tutorials** 페이지 콘텐츠 (`/documentation/tutorials`)
- [ ] **Outbound Calls** 페이지 콘텐츠
- [ ] **Call Recording / Queues / Agents / Chat / SMS** — 디자인 후 진행

### 3. Team 운영 보조 기능

- [ ] **Delete Team 확인 다이얼로그** — 현재 toast placeholder. DeleteApiKeyDialog 패턴 재사용 가능 여부 확인 필요.
- [ ] **Invite User (특정 팀에)** — 팀 상세 페이지의 Invite 버튼 toast placeholder.

### 4. 보조 기능 / UX 개선

- [ ] **검색 입력 실제 필터** — Users/API Keys/Team 상세 모두 입력 UI만 있고 필터 동작 없음
- [ ] **Tab 변경 시 URL 동기화** — 진입 시 `?tab=`만 읽음. 사용자 탭 변경 시 URL 갱신 안 됨
- [ ] **ProfileDialog autoFocus 차단 검증** — Base UI Dialog 기본 동작 vs CLAUDE.md 룰 미검증

### 5. 데이터 / 인프라

- [ ] **실제 로그인 플로우** — 현재 `Log in` 버튼 클릭 = 즉시 로그인 (Phase1). 다이얼로그/페이지 + 실제 폼 처리 필요. `useAuth().login()` 호출 지점만 바뀌면 됨.
- [ ] **Mock data → 실제 API 연동** (전부 Phase1 mock 상태)
- [ ] **`CURRENT_USER` mock 공유 모듈 추출** — `ProfileDialog`와 `AccountDropdown` 양쪽에 inline 중복

### 6. 토큰 / 색상 후속 검토

- [x] ✅ **`info` 시맨틱 토큰** (2026-05-11) — `info` 4종 세트 (info/info-foreground/info-subtle/info-border) 모두 colors.json에 있음. `info` light 값을 `blue/500` → `blue/600`로 Figma 정합.
- [x] ✅ **Badge 시스템 라이브러리 정합** (2026-05-14) — 아래 묶음 작업:
  - `rounded-4xl` (26px pill) → `rounded-lg` (10px) Figma 정합. CLAUDE.md radius 표 정정 (badge: xs → lg).
  - `subtle` 토큰 4종 light 값 `palette/{color}/50` → `/100` (success/warning/info/destructive). 라이브러리 변수와 동일.
  - `highlight` 4-token set 신규 (`highlight` / `-foreground` / `-subtle` / `-border` → violet 팔레트 alias). 라이브러리 `accent` → `highlight` 리네이밍 정합.
  - `Badge` primitive cva 확장: `success` / `warning` / `info` / `highlight` / `muted` variant 추가. `destructive` variant 도 `bg-destructive/10` → `bg-destructive-subtle` 로 통일.
  - `StatusBadge` / `ApiKeyStatusBadge` / `MethodBadge` / `CodeBadge` 4개 wrapper 모두 shadcn `Badge` primitive thin wrapper 로 통일. 색 className 직접 주입 패턴 제거. `method-colors.ts` 의 `METHOD_BADGE_CLASS` 제거 (variant 이름으로 대체).
  - `MethodBadge`: PATCH 가 임시 폴백 `accent-chart/10` 에서 정식 `highlight` variant 로 정합.
  - `StatusBadge`: Invited → `info` (Figma 정합, 일전에 `success` 잘못 적용된 것 정정).
- [x] ✅ **사이드바 active 색상 정책** (2026-05-08) — `bg-sidebar-accent`만 적용

---

## 차단 요소 / 결정 필요 사항

### 사용자 결정 / 디자인 노드 필요

- [ ] **Delete Team 확인 다이얼로그** Figma 노드 ID — 또는 "DeleteApiKeyDialog 패턴 재사용 OK" 확인
- [ ] **Invite User to Team** Figma 노드 ID — 또는 "기존 Invite User 다이얼로그 재사용 OK" 확인
- [ ] **Webhooks 페이지** Figma 노드 위치
- [x] ✅ **Analytics 30d/7d 탭 mock 데이터** (2026-05-14) — 그럴듯한 mock 추가 (Week 1-4 / Mon-Sun). 캡션도 period-aware (`Total for the last N days`).
- [ ] **Analytics Figma "FATCH" 오타 수정** — Pie 차트 legend `FATCH` → `PATCH` (코드는 정정 완료)
- [ ] **API Reference Get Call / Update Call** Figma 노드 ID — 현재 둘 다 placeholder.
- [ ] **Call Lifecycle 다이어그램 이미지** — Create Call 페이지에 임시 인라인 chip 흐름. 실제 다이어그램 이미지/SVG 받으면 교체.

### 기술 결정 미확정

- [ ] **mock store localStorage 영속화 여부** — 새로고침 시 INITIAL_*로 리셋. 영속화 필요성 미결정.
- [ ] **`CURRENT_USER` mock 공유 모듈 추출 여부**

### 알려진 작은 이슈

- **ProfileDialog / EditTeamDialog autoFocus** — Base UI Dialog 기본 동작상 첫 input에 포커스가 잡힐 가능성. CLAUDE.md 규칙은 차단이지만 미검증.
- **Team rename 후 user.team 미갱신** — `updateTeam()`은 team 레코드만 변경. 멤버의 `user.team` 필드는 그대로 (Phase1 mock 한계).
- **EditTeamDialog Description 카피** — Figma에 "Create a team..." (Create 다이얼로그와 동일) 그대로 사용. 디자인팀 의도 확인 필요.
- **Code block syntax highlighting** — Phase1은 plain text monospace. syntax highlighter(prism/shiki) 도입 시 CodeBlock 컴포넌트만 교체.
