# API Portal Design - 진행 상황

최종 업데이트: 2026-06-22 (랜딩/Analytics 개편 + Getting Started·API Ref Introduction 페이지 + Figma 컴포넌트 감사·정합. 전부 push 완료, working tree clean)

## 🔜 다음 할 일 (새 세션은 여기부터)

> 우선순위 순. git 은 `main` ↔ `origin/main` 동기화 + working tree clean 상태에서 시작.

1. **개발팀 핸드오프 착수 (E0)** — `design-system/handoff-backlog.md` 의 계획을 Jira Epic/Story 로 발행. 첫 경로: E0-1(`design-system/` + `ui/*.tsx` 읽기전용 레퍼런스를 staging repo 에 추가) → E0-2(staging `CLAUDE.md` 거버넌스 1단락) → E1(토큰 인프라). "계획 확정, 발행 대기" 상태. **현재 가장 레버리지 큰 작업.**
2. **Ask AI 아이콘 코드 정합 확인** — Figma 는 `hugeicons/ai-magic` → lucide `Sparkles` 로 스왑 완료(3 인스턴스). 코드 쪽도 `Sparkles` 인지 확인/교체. (사용자가 직접 변경한다고 함 — 확인만)
3. **Buttons 컴포넌트 set 위생 (Figma 라이브러리)** — `Buttons` set 에 `Type=Size-small/default/large` 라는 잘못된 variant 가 Type 슬롯에 등록돼 있음. 인스턴스는 이미 정정했으나 set 자체 정리는 디자이너 핸드오프 필요.
4. **Figma 페이지 감사 계속** — 지금까지 Landing(`2121:60848`) / User list(`1175:19038` 전수) / Getting Started 감사+정합 완료. 나머지 화면(Profile / Key-API / Analytics / Home / Webhook) 동일 방식(서브에이전트 + figma_execute 실측) 으로 감사 가능.
5. **Phase1 잔여 페이지/기능** — Webhooks 페이지(디자인 대기), API Reference Get Call / Update Call 본문(현재 placeholder), 검색 입력 실제 필터(Users/API Keys/Team), Invite User to Team.

## 현재 마일스톤

Phase1 디자인 구현 — **랜딩, User & Team, API Keys, Documentation(Getting Started + Inbound Calls), Analytics, API Reference(Introduction + Create Call)** 주요 플로우 완료. Design system maturity 로드맵 9/9 (P1·P2·P3 완료). 이제 초점은 **개발팀 staging repo 와의 디자인 시스템 통합(handoff-backlog E0~E4)** + **Figma↔코드 정합 감사**.

---

## 최근 작업 (2026-06-16 ~ 06-22)

### 코드 (push 완료)
- **랜딩 페이지 재구축** — hero/footer(상하단 이미지) + 중간 콘텐츠 4섹션(Welcome / Make first request(번호 step 카드) / Where to go next / Popular API Endpoints). Figma `2121:60848` 정합. (`page.tsx`, commit `52855a1` 외)
- **Analytics 대시보드 개편** (`58650df`) — `AnalyticsView` 공용 컴포넌트 추출(preview/full), CallVolume 에 error-rate Line 오버레이(ComposedChart + dual hidden Y축), `AnalyticsStatusCodeDistribution` 패널 신규(health chips + segmented bar), Top APIs preview 5 + "See all" → `/analytics/top-apis` 전용 페이지, 기본 period 6m→7d, SummaryCard trend chip → info 툴팁.
- **Getting Started 문서** (`f2bbb67`) — `/documentation` 루트 콘텐츠를 Quick Start → Getting Started with the Public API 로 교체(Figma `2126:62474`). `DOCS_NAV` 를 단일 항목으로 축소. 인라인 코드칩은 `bg-muted` 토큰. (기존 하위 docs 라우트는 살아있으나 nav 에서만 제외)
- **API Reference Introduction** (`24f3635`) — `/api-reference/introduction` 페이지 + `ApiReferenceSidebar` 상단 Introduction 링크(`API_REFERENCE_LINKS`) + TopNav "API Reference" href 를 create-call → introduction 변경.
- **인프라** — `chore(tooling)` playwright + 스크린샷 스크립트(`scripts/shoot-*.mjs`), `docs` handoff-backlog.md.

### Figma 직접 수정 (디자인 파일 `F2lkYCId2xMqcd9RuXL20B` — git 무관, 감사 후 정합)
- Getting Started 코드칩 3개(`2126:63101/63192/63195`): secondary/destructive/rounded-xs → **muted/foreground/radius-sm** 변수 바인딩.
- Ask AI 아이콘 3개(`1512:10661`, `2126:62704`, `1630:27835`): `hugeicons/ai-magic` → **lucide `Sparkles`** 스왑.
- 랜딩 Step Number 원 3개(`2124:2/4/6` + 숫자 텍스트): raw hex(#e9f5ff/#0a78c2) → **`info-subtle`/`info`** 변수 바인딩.
- 랜딩 보조 버튼 2개(`2121:60858`, `2121:60920`): 깨진 `Type=Size-default` → **`outline`** + 라벨 "Documentation" 복구.
- 감사 결과 정상(오탐): per-column sort/info 아이콘(lucide 인스턴스 rename), Buttons/Badge variant(라이브러리 valid), Dropdown_menu, Checkbox, Analytics chip(차트 범례), 카드 stroke(이미 `border` 바인딩됨).

### 감사 방법론 (재사용)
Figma 컴포넌트 규칙 감사는 **서브에이전트 + figma-console `figma_execute` 실측**(type/componentProperties/mainComponent/fills 변수명)으로 진행 — 이름만으로 위반 단정 금지(오탐 다수). get_metadata 거대 출력은 jq 로 노드 ID 추출만. 단독 노드 스크린샷이 1×1 로 깨지면 상위 프레임 캡처 또는 get_design_context SVG 에셋 사용.

---

## 환경 메모

- dev 서버: `npm run dev` (Basic Auth, `.env.local` 자격증명). production 노출은 `src/proxy.ts`.
- 스크린샷 검증: `node --env-file=.env.local scripts/shoot-*.mjs` — **반드시 프로젝트 디렉토리 안에서 실행**(/tmp 실행 시 playwright module not found).

---

## Design system maturity 로드맵 (2026-05-29 도입)

`design-system/` 의 누락 레이어 분석 결과 9개 항목. 본 섹션은 이 conversation 의 작업 단위로 갱신됨.

### 🔴 P1 — 새 화면이 바로 새는 영역

| # | 항목 | 상태 |
|---|---|---|
| P1-1 | **patterns/ 레이어 신설** (5개 패턴) | ✅ 완료 (5/5) |
| P1-2 | 상태(States) 규칙 — Loading/Empty/Error/Disabled | ✅ 완료 (2026-05-29) |
| P1-3 | 반응형/브레이크포인트 문서 | ✅ 완료 (2026-06-01) |

### 🟡 P2 — 성숙도/일관성

| # | 항목 | 상태 |
|---|---|---|
| P2-4 | 컴포넌트 문서 커버리지 (24 primitives) | 🔵 부분 (15/24 — breadcrumb / dropdown-menu / sonner / tooltip 추가, Card 는 unused 라 후순위) |
| P2-5 | 타이포그래피 "역할 → 클래스" 시맨틱 매핑 | ✅ 완료 (2026-06-01) — 문서 only, shadcn scope 분리 |
| P2-6 | a11y/인터랙션 베이스라인 (autofocus / aria-label / focus-ring 통합) | ✅ 완료 (2026-06-01) |

### 🟢 P3 — 운영/유지보수

| # | 항목 | 상태 |
|---|---|---|
| P3-7 | `design-system/README.md` 인덱스 + 페이지 스펙 템플릿 표준화 | 🔵 부분 충족 (`/design-system` 카탈로그 랜딩이 인덱스 역할 대신함) |
| P3-8 | 토큰 남은 갭 (z-index, motion/transition, focus-ring) | ✅ 완료 (2026-06-02) |
| P3-9 | 작은 정합 이슈 (users.md raw RGB → 토큰 교체, Notion log 인레포 추적) | ✅ 완료 (2026-06-01) |

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
- [x] **P1-2 States 룰 + EmptyState 베이스라인 spec + 컴포넌트 구현** (2026-05-29) — `design-system/rules/states.md` 신규 (Truth 출처 경계 표 + 표면×상태 6×3 매트릭스 + Loading/Empty/Error 상세 + Disabled cross-ref + Button 규칙 §5.3 예외 박스). `design-system/components/empty-state.md` 신규 (라이브러리 전용 컴포넌트 없어 자체 정의, 2 variant + Props + 토큰 + 예시 3종 + 안티패턴 5종). 아이콘은 Figma 인스펙트 결과 사용 톤 (icons.md 워크플로우 cross-ref). **EmptyState 컴포넌트 구현** (`src/components/api-portal/EmptyState.tsx`) — table-list-page 작업과 함께 완료. Pending Approvals 빈 상태에 적용 (인라인 `<p>` 텍스트 → `<EmptyState>` 정합).
- [x] **P1-1 patterns/ 레이어 신설 + form-dialog 패턴 + 다이얼로그 정합** (2026-05-29) — `design-system/patterns/` 디렉토리 신설. `patterns/form-dialog.md` 신규 (12 섹션: 구조/width/header/필드 gap/검증/footer/variant/autoFocus 2-layer/pre-fill·empty/View 변형/안티패턴 9종/적용 컴포넌트표). 결정 사항:
  - **Cancel 일괄 outline** (form/confirm 모두). `secondary` variant 는 Toolbar/Header 보조 액션으로 재할당 (현재 사용처 0건, 미래 대비). `button.md` / `dialog.md` 갱신.
  - **DialogFooter primitive Figma 정합 plain 화** — Figma MCP 로 Form Dialog (1489:47265) + Confirm Dialog (1460:30528) 풋터 인스펙트 결과 4개 시각 요소(border-t / bg-muted / -mx-4 -mb-4 / rounded-b-xl) 모두 ❌. `src/components/ui/dialog.tsx` 의 DialogFooter cva 에서 제거 (CLAUDE.md 룰 10 정합, className 우회 금지).
  - **8개 다이얼로그 일괄 정리** — CreateApiKey / EditApiKey / ViewApiKey / CreateTeam / EditTeam / Profile + 신규 InviteUser / EditUser. `variant="secondary"` → `outline` (Cancel), raw `<div className="mt-2 flex justify-end gap-2">` → `<DialogFooter>` (mt-2 제거), 필드 gap-3/4 → gap-2 통일, 에러 메시지 색 `text-muted-foreground` → `text-destructive`, 첫 input `autoFocus={false}` 명시, Edit 4개에 `sr-only` focus 흡수 span 추가.
  - **InviteUserDialog / EditUserDialog 추출** — users/page.tsx 530~720줄 인라인 Dialog 2개 → 도메인 컴포넌트로. 9 state + 5 handlers → 2 handlers 로 축약.
- [x] **API Reference method 배지 via `DocsPageShell` tag prop** (2026-05-29) — `DocsPageShell` 에 `tag` prop 슬롯(breadcrumb 과 title 사이) 추가. create-call 의 인라인 `PostBadge()` (`-mt-6` 마진 hack) 제거. get-call / update-call 에 GET / PATCH 배지 같은 방식으로 적용.
- [x] **P3-9 작은 정합 이슈 정정** (2026-06-01) — 3개 micro-fix. 단일 commit.
  - `pages/users.md` line 38: `rgb(10,10,10) / rgb(115,115,115)` raw RGB → `text-foreground` / `text-muted-foreground` 토큰명 + `components/tabs.md` cross-ref.
  - `pages/users.md` line 43: Invite User 버튼 `size="sm"` (잘못된 정보) → default size + `patterns/table-list-page.md` §5 toolbar CTA 룰 cross-ref. 실제 코드는 default 사이즈.
  - `rules/shadcn.md` line 162: 외부 "Notion Component Decision Log" 참조 → 인레포 추적 위치 명시 (patterns/ + components/ + git commit history). 외부 의존 제거.
  - 다른 page spec audit 결과 `rgb()` / 잘못된 `size="sm"` 추가 발견 없음. analytics.md / api-keys.md / create-call.md / tutorials.md 의 hex 값은 의도된 spec 문서 (Figma → 코드 매핑 표) 라 유지.
- [x] **P3-8 토큰 갭 (z-index / motion / focus-ring)** (2026-06-02) — 코드 토큰 신설 + 9건 outlier refactor + 3 룰 + 3 카탈로그. 2 commit 분할 (foundation + docs/catalog).
  - **misc.json 확장**: `zIndex` (4 단계 0/10/50/100), `motion.duration` (fast/base/slow = 100/200/300ms), `motion.ease.emphasized` (cubic-bezier(0.22,1,0.36,1)), `ring.width` (3px).
  - **sync-tokens.ts 확장** → `tokens.generated.css` 의 `:root` 에 `--z-*` / `--duration-*` / `--ease-emphasized` / `--ring-width` 신규 emit.
  - **globals.css** `@theme inline` 에 `--ease-emphasized` 1 줄로 Tailwind `ease-emphasized` 키 활성화. Duration 은 Tailwind native (`duration-100/200/300`) 사용 — `--duration-*` CSS var 는 룰 문서 + 커스텀 CSS 참조용.
  - **Outlier refactor 9건**: sidebar.tsx 5×(`ring-2`→`ring-3`), badge.tsx 1×(`ring-[3px]`→`ring-3`), navigation-menu.tsx 3×(`duration-[0.35s] ease-[cubic-bezier(...)]` → `duration-300 ease-emphasized`). `z-50` / `duration-100/200` 같은 기존 정합 사용처는 룰 문서가 *카논 선언* 으로 작동 — 코드 일괄 rename 없음.
  - **3 룰 문서 신규**: `rules/z-index.md` (4 단계 + 안티패턴 4), `rules/motion.md` (duration/ease 표 + prefers-reduced-motion 박스 + 안티패턴 5), `rules/focus-ring.md` (시각 토큰 3 + cva 스니펫 + 안티패턴 5).
  - **`rules/a11y.md`** §3 (포커스 관리) → `focus-ring.md` cross-ref 1줄. 행동 vs 시각 토큰 역할 분리.
  - **`rules/figma-token-sync.md`** → "토큰 sync 방향" 매트릭스 섹션 추가 (colors / radius / shadow / ring-width / motion / z-index 6 행).
  - **3 카탈로그 페이지 신규**: `/foundations/{z-index,motion,focus-ring}`. z-index 는 4 layer 겹친 stack 데모, motion 은 duration 3 박스 동시 토글 + easing 2 박스 비교 + SVG 곡선, focus-ring 은 Tab 순회 + ring-2 vs ring-3 비교 + aria-invalid 데모.
  - **nav** Foundations 그룹 4 항목 (Tokens / Focus Ring / Motion / Z-Index). Roadmap P3-8 ✅.
  - **Designer handoff** (Figma 라이브러리 `SmO9…`, 2026-06-16 실행 완료): `effects` 컬렉션 + `ring/width` Number=3 변수 + `Motion` 페이지(duration 3 + easing 2) + `Layer Stack (code-only)` 페이지(z-index 4단계 표). figma-console 로 생성. **남은 것: 사용자 Figma UI 에서 Library Publish.** `ring/width` 바인딩은 보류 — 라이브러리 87개 컴포넌트 set 에 focus variant 0개라 바인딩 대상 없음(코드 `--ring-width:3px` 미러 토큰으로 존재, focus 상태 추가 시 바인딩). Spec doc §6 참조.
- [x] **P2-6 a11y / 인터랙션 베이스라인** (2026-06-01) — 코드 변경 없이 흩어진 룰을 1곳에 통합. P2 영역 완료.
  - `design-system/rules/a11y.md` 신규 (9 섹션): 적용 범위 (shadcn primitive 내부는 shadcn 책임) / 키보드 네비 (Tab 순서, focus-visible:ring, primitive 자동 단축키) / 포커스 관리 (autoFocus 2-layer 차단, disabled hover wrap, 다이얼로그 focus 복귀) / ARIA 속성 (aria-label / aria-invalid / aria-current / aria-describedby / aria-hidden / role) / 시각 피드백 (글로벌 cursor pointer, cursor-default, hover+focus-within 페어) / 컴포넌트별 a11y 체크리스트 (10 항목 표) / 10 안티패턴 / 출시 전 수동 체크 (키보드 / screen reader / 시각 일관성 3 카테고리).
  - 이전에 흩어져 있던 a11y 룰을 cross-ref 로 연결: CLAUDE.md / form-dialog.md §8 / dialog.md / dropdown-menu.md / tooltip.md / breadcrumb.md / sonner.md / clickable-card-with-menu.md / table-list-page.md / globals.css.
  - 카탈로그 `/design-system/rules/a11y` 페이지 신규 — focus-visible ring 라이브 데모 / aria-label 시연 (title 속성으로 힌트) / aria-invalid 폼 데모 (Submit/Reset 인터랙티브) / cursor 피드백 (disabled vs Info icon) / hover+focus-within 비교 카드 (correct vs anti-pattern) / autoFocus 2-layer 코드 스니펫 / 컴포넌트별 체크리스트 표 / 3-그룹 수동 체크 (키보드 / SR / 시각).
  - nav + Roadmap P2-6 ✅ 갱신. Rules 그룹 4개 (States / Responsive / Typography / A11y).
- [x] **P2-4 (부분) 우선 4개 컴포넌트 문서화** (2026-06-01) — 11/24 → 15/24. 2 commit 분할.
  - **commit 1**: `breadcrumb.md` + `dropdown-menu.md` 신규 (네비/메뉴 묶음). 카탈로그 페이지 2개 추가.
  - **commit 2**: `tooltip.md` + `sonner.md` 신규 (피드백 묶음). 카탈로그 페이지 2개 추가.
  - **Card 는 후순위** — primitive 파일 존재하나 앱 사용처 0건. 채택 결정 시 다시 문서화.
  - Breadcrumb: 3 라이브 데모 (3-level / detail dynamic / DocsPageShell prop), Anatomy 6 row.
  - DropdownMenu: 4 라이브 데모 (Standard ⋯ / Protected conditional / Separator group / Avatar trigger), 7 anti-patterns.
  - Tooltip: Help icon + Disabled button reason + 4-side position variants 데모. `<TooltipProvider>` 루트 mount 룰 명시.
  - Sonner: 5 semantic types 라이브 toast + description + promise 패턴 데모. toast vs Alert 채널 결정 표.
  - Primitives 그룹 nav: Button 1개 → 5개 (Breadcrumb / Button / DropdownMenu / Sonner / Tooltip 알파벳 순).
- [x] **P2-5 타이포그래피 역할 → 클래스 매핑** (2026-06-01) — 문서 only 접근. shadcn primitive scope 외 명시. 코드 변경 0건.
  - `design-system/rules/typography.md` 신규 (8 섹션): Scope (shadcn primitive 제외 이유 설명) / 12 역할 표 (Heading 7 + Body 5 + Code-Link 3) / page-title / section-title 의 2-variant 룰 (dashboard vs docs 의도된 차이) / 사용 예시 / 향후 추가 검토 항목 / 안티패턴 / 표 갱신 룰.
  - **shadcn 정합 분석 후 의도적 결정**: shadcn 은 시맨틱 typography role 정의 안 함 (Tailwind utility-first 철학). 우리도 Tailwind 유틸리티 클래스 (`.text-page-title` 등) 신설은 비추. 본 표는 *클러스터 라벨 lookup* 으로만 운영. 248곳 `text-sm` 마이그레이션 0건, shadcn 컴포넌트 추가 시 충돌 0건.
  - placeholder 의존 해소: `components/empty-state.md` 의 "P2-5 도입 시 시맨틱 토큰으로 교체 예정" 박스 → 실제 role 매핑 (card-title / body-sm) 으로 갱신.
  - 카탈로그 `/design-system/rules/typography` 페이지 신규 — 각 role 의 라이브 sample 렌더 + Scope 카드 (Covered / Out of scope) + 2-variant 룰 시각 카드 (각 variant 별 클래스·적용 페이지 표시) + 안티패턴 + cross-refs.
  - nav + Roadmap P2-5 ✅ 갱신. Rules 그룹에 Typography 추가 (States / Responsive / Typography 3개).
- [x] **P1-3 반응형 / 브레이크포인트 룰** (2026-06-01) — 코드 refactor 없이 룰 문서화 + 카탈로그. P1 영역 완성.
  - `design-system/rules/responsive.md` 신규 (8 섹션): BP 의미 표 (시맨틱 의도) + Mobile-first 원칙 / 페이지 wrapper padding 표준 (`px-6 md:px-10`) / 컨테이너 max-width 룰 (페이지/다이얼로그/카탈로그별 5 카테고리) / 알려진 패턴 6종 (Sidebar md / TopNav 3-단계 / TocSidebar xl / Grid 단계 / Dialog sm / 헤더 stacked→row) / 6 안티패턴 / Sidebar·Toaster 외부 layout 영향 / cross-refs.
  - **2xl 미사용 정책** 명시 — Phase1 디자인 미정의, Figma 가 2xl 레이아웃 추가 시 도입.
  - 카탈로그 `/design-system/rules/responsive` 페이지 신규 — **라이브 viewport pill** (현재 BP + px 너비 실시간 표시, 브라우저 리사이즈로 즉시 확인 가능) + BP 의미 표 + Mobile-first 비교 카드 + Max-width 표 + 패턴 4 카드 + 안티패턴 + 리사이즈 가이드 (실 페이지 링크 4개 — sidebar/TopNav/TocSidebar/Grid 전환 각각 데모).
  - nav + Roadmap P1-3 ✅ 갱신. Rules 그룹에 Responsive 추가 (States 와 짝).
- [x] **P1-1 clickable-card-with-menu 패턴 + CLAUDE.md slim 처리** (2026-06-01) — P1-1 patterns 5/5 완성. 
  - `design-system/patterns/clickable-card-with-menu.md` 신규 (9 섹션): 핵심 문제 (naive 구현 결점) / Absolute overlay + pointer-events 3-layer 구조 / 키보드·a11y / hover + focus-within 페어 / `protected` 플래그 룰 / 카드 외곽 토큰 / 내부 레이아웃 / 8 안티패턴 / 적용 표.
  - **CLAUDE.md slim 처리** — 본문에 박혀 있던 "클릭 가능한 카드 + 내부 메뉴 (TeamCard 패턴)" 코드 블록 + "시스템 vs 일반 엔티티" 섹션을 cross-ref 한 줄로 축약. 패턴 본문은 patterns/clickable-card-with-menu.md 로 이관.
  - 카탈로그 `/design-system/patterns/clickable-card-with-menu` 페이지 신규 — 라이브 데모 3 카드 그리드 (1 protected + 2 일반). 카드 클릭 / ⋯ 메뉴 클릭 / Edit·Delete 모두 toast 로 동작 검증. Anatomy + 6 decisions + 8 anti-patterns + cross-refs.
  - nav + Roadmap **"5/5 ✅ Done"** 갱신. P1-1 patterns/ 레이어 완료.
- [x] **P1-1 docs-page-shell 패턴** (2026-05-29) — `DocsPageShell` 컴포넌트는 이미 6 페이지에서 일관 사용 + 최근 `tag` prop 추가까지 정합 상태였음. 코드 refactor 없이 패턴 문서화만 진행. 
  - `design-system/patterns/docs-page-shell.md` 신규 (10 섹션): 사용법 / Props 표 / Anatomy / Title text-4xl vs table-list-page text-3xl 차이 / DocsSection 헬퍼 / TOC 통합 (TocSidebar + MobileToc dual render + scrollSpy) / Prev·Next 풋터 / `tag` prop (2026-05-29 추가) / 7 안티패턴 / 적용 페이지 표.
  - 카탈로그 `/design-system/patterns/docs-page-shell` 페이지 신규 — 4 라이브 페이지 reference 카드 (외부 링크) + 점선 wrapper mock skeleton + Anatomy + 6 decisions + 7 anti-patterns. 라이브 페이지 자체 임베드는 TocSidebar 가 외부 layout 의존이라 mock 으로 대체.
  - nav + Roadmap "4/5" 갱신. 단일 commit.
- [x] **P1-1 table-list-page 패턴 + EmptyState 컴포넌트 + 코드 정합** (2026-05-29) — 4 페이지 (`/api-keys`, `/users` User/Pending 탭, `/users/team/[name]`) 의 공통 골격 문서화. 핵심:
  - `design-system/patterns/table-list-page.md` 신규 (11 섹션): 페이지 wrapper (gap-10) / Breadcrumb / Header / Tabs (optional) / Toolbar (Search w-60 h-8 + primary CTA) / Table wrapper / Table 헤더·바디 룰 / Pagination / Empty state cross-ref / 8 안티패턴 / 적용 페이지 표.
  - **EmptyState 컴포넌트 구현** (`src/components/api-portal/EmptyState.tsx`) — `empty-state.md` spec 정합. variant (no-data/no-results) + icon + title + description + action props. CTA variant 자동 (no-data → default / no-results → ghost).
  - **Pending Approvals 빈 상태 정합** — `users/page.tsx` 의 인라인 `<p className="text-center text-sm text-muted-foreground py-8">No pending approvals</p>` → `<EmptyState variant="no-data" icon={<UserCheck />} ...>`. colSpan={8} → 7 (실제 컬럼 수, 버그 수정). 아이콘은 Figma 디자인 확정 시 교체 (TODO 코멘트).
  - **Search placeholder 통일** — `/api-keys` 의 `"Search"` → `"Search API Key"`. 4 페이지 모두 `"Search {Entity}"` 형태 정합.
  - 카탈로그 `/design-system/patterns/table-list-page` 페이지 신규 — 인터랙티브 mini 테이블 (점선 wrapper / Search 필터 → no-results EmptyState / Toggle empty state → no-data EmptyState / 정렬·페이지네이션 동작). Anatomy + 6 decisions + 7 anti-patterns + 5 cross-refs.
  - nav + Roadmap "3/5" 갱신.
- [x] **P1-1 confirm-dialog 패턴 + ConfirmDialog 공용 컴포넌트** (2026-05-29) — 5개 confirm-dialog (Delete API Key / Revoke / Deactivate / Reject / **Delete Team 신규**) 모두 `<ConfirmDialog>` thin wrapper 로 통일. 핵심 결정:
  - `src/components/api-portal/ConfirmDialog.tsx` 신규 — 512 width / `showCloseButton={false}` / DialogDescription 필수 / outline Cancel + destructive Confirm 강제. description prop 은 ReactNode (엔티티 이름 강조 지원).
  - DeleteApiKeyDialog / RevokeApiKeyDialog 풀 파일 → 5-line wrapper. users/page.tsx 의 인라인 Deactivate/Reject Dialog → ConfirmDialog 직접 사용.
  - **Delete Team 백로그 해소** — TeamCard onDelete 가 즉시 삭제하던 것을 ConfirmDialog 확인 단계 추가 (팀 이름 굵게 강조).
  - **Figma X 버튼 정합 부수 효과** — Figma form-dialog / confirm-dialog 모두 X 없음 확인. `DialogContent` primitive 의 `showCloseButton` 기본값 `true` → `false` 로 변경 (CLAUDE.md 룰 10 정합). 8 form-dialog 모두 자동 정합, 호출부 변경 0건. Dismiss 경로는 Cancel / Esc / 백드롭 3가지 유지.
  - 카탈로그 `/design-system/patterns/confirm-dialog` 페이지 신규 (5 라이브 데모 + Anatomy + 6 decisions + form vs confirm 비교 표 + 7 anti-patterns). nav + Roadmap "2/5" 갱신.
  - 문서: `design-system/patterns/confirm-dialog.md` 신규 (9 섹션), `components/dialog.md` 의 Confirm Dialog 섹션 갱신, `patterns/form-dialog.md` 의 X 버튼 정책 박스 + cross-ref 갱신.
- [x] **`/design-system` 시각 카탈로그 MVP** (2026-05-29) — 디자이너/개발자용 reference 사이트. 4 commit 분할 진행. 카탈로그 자체가 디자인 시스템 dogfooding.
  - **Phase A+B (Scaffolding + Landing)** — `src/app/(design-system)/design-system/` 라우트 그룹, 전용 layout (App TopNav 미포함), `CatalogSidebar` (DocsSidebar 패턴 + `DarkModeToggle`), 5-route 사이드바 nav, 랜딩 페이지 (4 영역 카드 + 9-item Maturity Roadmap 표 + 외부 references). 9 Coming soon placeholder routes 포함.
  - **Phase C-1 (Tokens)** — 전체 의미 색 토큰 갤러리 (Surface / Foreground / Action / Status 5-set × 4-token / Brand / Sidebar / Border-Input-Ring / Chart sequential+method / Radius 10단 / Shadow 4단). `TokenSwatch` 헬퍼 (ColorSwatch / ForegroundSwatch / RadiusSwatch / ShadowSwatch).
  - **Phase C-2 (Button)** — variant × size 매트릭스 (6×4 = 24), icon-* 4 size, 상태 데모 (default / disabled / loading with inline Loader2), 인터랙티브 Copy 데모, 6 common patterns (form-dialog footer / confirm footer / page CTA / table inline / marketing CTA / Alert 내부 exception), 6 룰 quick reference.
  - **Phase C-3 (Form Dialog)** — 4 라이브 다이얼로그 데모 (Create / Edit / Invite / View), Anatomy 다이어그램, 6 key decisions (Cancel outline / footer plain / field gap / error 색 / autoFocus 2-layer / width 423), 7 안티패턴, cross-refs.
  - **인프라**: Dark mode 토글 (`html.dark` 클래스), production 노출 제한은 기존 `src/proxy.ts` Basic Auth 그대로. Figma 임베드는 MVP 보류 (Share 권한 미검증).

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

- [x] ✅ **Delete Team 확인 다이얼로그** (2026-05-29) — ConfirmDialog 공용 컴포넌트로 해소. 팀 이름 강조 + destructive Confirm.
- [ ] **Invite User (특정 팀에)** — 팀 상세 페이지의 Invite 버튼 toast placeholder.

### 4. 보조 기능 / UX 개선

- [x] ✅ **Phase 3 — users underline tabs → shadcn Tabs primitive** (2026-05-18) — `src/components/ui/tabs.tsx` Base UI 기반 신규 (`Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, cva `text` variant). `users/page.tsx` raw `<button>` 3개 제거. URL `?tab=` 진입 + 변경 양방향 sync (`router.replace` + `pathname` 기본탭 strip). 문서: `design-system/components/tabs.md`.
- [x] ✅ **ProfileDialog autoFocus 차단 검증** (2026-05-29) — form-dialog 패턴 적용 시 sr-only focus 흡수 span + `autoFocus={false}` 명시. 시각 확인 통과.
- [ ] **검색 입력 실제 필터** — Users/API Keys/Team 상세 모두 입력 UI만 있고 필터 동작 없음
- [ ] **`sortable-head.tsx` 라이브러리 통합 여부 재검토** — Phase 1 에서 table th padding 충돌로 의도적 제외. ghost-text-only Button variant 추가 시 통합 가능성 재고.

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

- [x] ✅ **Delete Team 확인 다이얼로그** Figma 노드 ID (2026-05-29) — DeleteApiKeyDialog 패턴 (ConfirmDialog 공용 컴포넌트) 재사용으로 해소.
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

- ~~**ProfileDialog / EditTeamDialog autoFocus**~~ — ✅ 2026-05-29 form-dialog 패턴 적용 시 sr-only focus 흡수 span + `autoFocus={false}` 명시로 해소.
- **Team rename 후 user.team 미갱신** — `updateTeam()`은 team 레코드만 변경. 멤버의 `user.team` 필드는 그대로 (Phase1 mock 한계).
- **EditTeamDialog Description 카피** — Figma에 "Create a team..." (Create 다이얼로그와 동일) 그대로 사용. 디자인팀 의도 확인 필요.
- **Code block syntax highlighting** — Phase1은 plain text monospace. syntax highlighter(prism/shiki) 도입 시 CodeBlock 컴포넌트만 교체.
- **다이얼로그 본문 padding** — primitive `p-4` (16) vs Figma 인스펙트 결과 `padding: 24`. form-dialog 정리 PR 에선 스코프 외로 미정정. 별도 결정 필요.
