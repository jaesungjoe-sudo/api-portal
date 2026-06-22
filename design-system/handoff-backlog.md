# Design System 핸드오프 백로그

> 개발팀(staging `api-dev-portal`)과의 디자인 개선 + 시스템 구조화 작업을 위한 Epic/티켓 계획.
> 이 문서는 Jira Epic/Story의 소스이자, 작업 중 갱신되는 추적 문서.
> **상태: 계획 확정, Jira 발행 대기.**

---

## 0. 배경 / 전략

**상황** — 두 코드베이스가 갈라져 있음:
- **이 repo (`api-portal`)** — 디자이너가 Figma 기준으로 정성껏 만든 *레퍼런스 구현 + 디자인 시스템 소스 오브 트루스*. 토큰(`tokens.generated.css`), 프리미티브(`src/components/ui/`), 규칙(`design-system/rules|patterns|components`), 라이브 카탈로그(`/design-system`).
- **staging repo** — 개발팀이 Figma만 보고 Claude CLI로 구현 중. 실제 디자인과 갭 큼, 디자인 시스템 구조 없음.

**스택** — 양쪽 동일 (Next.js 16 / Tailwind v4 / shadcn-on-Base-UI / lucide / sonner).

**채택한 통합 방식 — C (code-as-spec)**:
- 토큰은 **런타임 산출물**이라 한 번 이식하면 그쪽 빌드에 녹음 (CSS 변수). → 코드 이식 OK.
- 프리미티브는 **읽기 전용 레퍼런스**로만 넘김. 개발팀이 our `.tsx`/`.md`를 보고 *자기 컴포넌트를 정렬* (UI 외 이벤트/로직 wiring이 얽혀 있어 통째 교체 불가). 통합·소유는 그쪽.
- 스펙(`design-system/`)은 **그쪽 AI(Claude CLI)가 매 변경마다 읽는 상시 레퍼런스**로 박음 → 드리프트 억제.

**참조의 두 의미 구분**:
- 런타임 참조(패키지/submodule) = 결합. **안 함.**
- 소스 참조(원본이 여기 있다 + AI가 읽음) = 결합 0. **이걸로 감.**

---

## 1. 핵심 원칙 (전 티켓 공통)

1. **1 티켓 = 1 PR = (순수 추가) 또는 (격리된 단일 마이그레이션).** 빅뱅 금지.
2. **Strangler(점진 교체)** — 새 걸 나란히 도입/정렬 → 호출부 화면당 이동 → 옛 걸 마지막에 삭제.
3. **E0 먼저** — 핸드오프 + 거버넌스를 깔아야 이후 작업의 기준이 생김.
4. **토큰 인프라 먼저(E1), 비주얼 정합은 그 후(E3)** — 토큰 없이 비주얼 고치면 다시 함.
5. **한 화면 = 한 번의 비주얼 PR** — 토큰화 + Figma 정합을 같은 PR에서 (E3). 같은 파일 중복 PR 금지.
6. **프리미티브는 code-as-spec** — 우리가 심지 않음. 그쪽이 our spec 기준 자기 걸 정렬. AC = 스펙 일치.
7. **미사용 컴포넌트 티켓화 안 함** — `card` / `checkbox` / `navigation-menu` (앱 사용처 0). 채택 시 추가.

---

## 2. Epic 구조

| Epic | 목적 | 리스크 | 의존 | 주체 |
|---|---|---|---|---|
| **E0 — 핸드오프 + 거버넌스** | `design-system/` + `ui/*.tsx`(읽기전용) + CLAUDE.md를 staging에 / 드리프트 규약 | 0 (순수 추가) | — | 디자이너 |
| **E1 — 토큰 인프라** | 토큰 소스+스크립트+생성물 + globals 충돌 조정 | 낮음→중 | E0 | 디자이너 주도 + 개발 1명 |
| **E2 — 프리미티브 정렬** | 그쪽이 our spec 기준 자기 컴포넌트 정렬 (strangler) | 중 (호출부 이동) | E1 | **개발팀** + 디자이너 리뷰 |
| **E3 — 화면별 비주얼 정합** | 화면당 토큰화 + Figma 정합 한 PR | 낮음 (토큰 깔린 후) | E1 (E2 권장) | 개발 + 디자이너 리뷰 |
| **E4 — 드리프트 거버넌스** | 재갈라짐 방지 | 0 | E0 | 공통 |

**순서: E0 → E1 → (E2 / E3 병행) · E4 상시.**

---

## 3. 티켓 상세

### E0 — 핸드오프 + 거버넌스 (먼저, ~반나절, 리스크 0)

- [ ] **E0-1** `design-system/` 폴더 + `src/components/ui/*.tsx`를 staging repo에 추가
  - 종류: 추가 / `.tsx`는 **읽기 전용 레퍼런스** (import 대상 아님)
  - AC: 그쪽 Claude CLI가 `design-system/` + `ui/*.tsx`를 컨텍스트로 읽음. 빌드 영향 0.
- [ ] **E0-2** staging repo 루트 `CLAUDE.md`에 거버넌스 1단락
  - 내용: "토큰·컴포넌트 truth는 `design-system` 레퍼런스다. 변경은 sync PR로. 프리미티브는 our spec 기준 정렬(통합·소유는 staging)."
  - AC: PR 리뷰어가 이 문장 기준으로 드리프트 판단 가능.

### E1 — 토큰 인프라만 (최우선, 갭 대부분 여기서 닫힘 / 화면별 하드코딩 제거는 E3로)

- [ ] **E1-1** 토큰 소스(`tokens.json`/`colors.json`/`misc.json`) + `scripts/sync-tokens.ts` + 생성물 `tokens.generated.css` 추가
  - 종류: 추가 (additive)
  - AC: `npm run sync-tokens` 동작 → css 재생성. 기존 코드 영향 0.
- [ ] **E1-2** `globals.css` `@theme inline` 매핑 + `.dark` + 글로벌 cursor 규칙 정합
  - 종류: **충돌 조정 (유일한 신중 구간)**
  - 선행: 그쪽 기존 CSS 변수 ↔ our 토큰 **이름/값 대조표** 작성 후 머지
  - AC: 변수 충돌 해소. 시각 회귀 0.

> 화면별 하드코딩(`#fff`/`rgb()`/임의값) → 토큰 클래스 마이그레이션은 **E3에 흡수** (한 화면 두 번 건드리지 않기 위함).

### E2 — 프리미티브 정렬 (strangler / code-as-spec / 개발팀 주도)

각 프리미티브 = 자체 Story. 우리가 심지 않고, **개발팀이 our `.tsx`/`.md` 레퍼런스 기준 자기 컴포넌트를 정렬.**
Task: ① 그쪽이 스펙 기준 정렬 → ② 화면별 검증 → ③ 잔재 정리.
AC: anatomy / states / 토큰이 our 스펙과 일치. (우리 `.tsx` import 여부 아님)

우선순위(앱 사용도 순):

- [ ] **E2-1 Button** — 전 화면, 비주얼 임팩트 최대 (`components/button.md`)
- [ ] **E2-2 Input + Label** — 폼 전반 (`components/input.md`)
- [ ] **E2-3 Badge** (+ StatusBadge / MethodBadge wrapper) — 상태 표시 도처 (`components/badge.md`)
- [ ] **E2-4 Dialog** (+ form-dialog / confirm-dialog 패턴) — 모든 CRUD (`components/dialog.md`, `patterns/form-dialog.md`, `patterns/confirm-dialog.md`)
- [ ] **E2-5 Table** (+ pagination, sortable-head) — 리스트 페이지 (`components/table.md`, `components/pagination.md`)
- [ ] **E2-6 Select / DropdownMenu** — 폼·메뉴 (`components/select.md`, `components/dropdown-menu.md`)
- [ ] **E2-7 Sidebar / Sheet** — 내비 셸 (크지만 고가치)

> 2차(필요 시): tooltip / tabs / toggle-group / skeleton / sonner.
> 제외(미사용): card / checkbox / navigation-menu.

### E3 — 화면별 비주얼 정합 (토큰화 + Figma 정합 한 PR, 화면당 1회)

각 티켓 = Figma 노드 + our `/design-system` 카탈로그 레퍼런스 + Before(staging)/After(Figma) + 토큰화 + 반응형 AC.
노출도 순. (개발자 포털 첫 얼굴부터)

- [ ] **E3-1** API Reference / Introduction (`…/api-reference/introduction`) — 1번
- [ ] **E3-2** API Reference / Create Call (참조: `pages/create-call.md`)
- [ ] **E3-3** Dashboard / API Keys (참조: `pages/api-keys.md`)
- [ ] **E3-4** Dashboard / Users & Teams (참조: `pages/users.md`)
- [ ] **E3-5** Analytics (참조: `pages/analytics.md`)
- [ ] **E3-6** Documentation 셸 + Quick Start
- [ ] **E3-N** (staging 화면 인벤토리 확정 후 추가)
- [ ] **E3-sweep** 잔여 화면 토큰화 sweep — 비주얼 백로그에 없는 저노출 화면의 하드코딩 회수 (토큰/dark mode 무결성 보장용 캐치올)

> 각 E3 티켓 AC: 하드코딩(hex/rgb/임의값) 0 · Figma 노드 일치 · md/lg 반응형 · 기존 로직 변경 0.

### E4 — 드리프트 거버넌스 (E0 직후 상시)

- [ ] **E4-1** staging PR 템플릿에 체크박스: "토큰/프리미티브 변경 시 `design-system` 레퍼런스 대조"
- [ ] **E4-2** (선택) 월 1회 토큰 diff — 두 repo `tokens.generated.css` 비교 스크립트

---

## 4. 티켓 템플릿 (전 티켓 통일)

```
제목: [E1] users 페이지 하드코딩 색 → 토큰 정합 (예시)
종류: 추가 | 마이그레이션(격리)        ← 리스크 한눈에
주체: 디자이너 | 개발 | 개발+디자이너 리뷰
맥락: 왜
레퍼런스: Figma <노드 링크> + design-system/<spec 경로> + /design-system <카탈로그>
Before / After (스샷)
AC:
  - [ ] 하드코딩(hex/rgb/임의값) 0
  - [ ] Figma 노드와 일치 (또는 스펙 일치)
  - [ ] md/lg 반응형 동작
  - [ ] 기존 로직 변경 0 (additive / 격리)
견적 / 우선순위
```

---

## 5. 차주 첫 2주 경로

1. **Day 1** — E0-1, E0-2 (핸드오프 + 거버넌스 / 반나절, 리스크 0)
2. **Day 1~2** — E1-1, E1-2 (토큰 도입 + globals 충돌 조정 / 유일한 신중 구간)
3. **Day 3~** — **E3-1 (API Reference Introduction — 토큰화 + Figma 정합 한 방)**
   → **첫 주에 눈에 띄는 비주얼 개선 1건 = 팀 신뢰 확보**
4. **2주차** — E2-1 Button 정렬 시작 (개발팀 주도, 디자이너 스펙/리뷰)
