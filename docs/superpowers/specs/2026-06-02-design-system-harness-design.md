# Design System Harness (Adapted) — Design Spec

- **Date**: 2026-06-02
- **Author**: Jaesung Joe + Claude
- **Status**: Design approved (decisions locked) → ready for spec review
- **Topic**: Figma → 코드 변환 일관성 보장 + 토큰 하드코딩 자동 감지 + 컴포넌트 구현 프로세스 표준화를 위한 에이전트/훅/문서 하네스

## Goal

API Portal 프로젝트에 design-system 작업용 하네스를 도입한다. 목적 3가지:
1. Figma 디자인 시스템을 코드로 변환할 때 일관성 보장
2. 토큰 하드코딩 자동 감지
3. 컴포넌트 구현 프로세스 표준화

## Guiding Principle — Adapt, not overwrite

제안 원본(Storybook 8 + `var(--color-*)` 필수 + 9개 신규 생성)을 **이 레포의 실제 구조에 맞게 교정**한다. 이 프로젝트는 이미 성숙한 design-system 문서 레이어(`design-system/rules/*`, `components/*`, `patterns/*`), 토큰 sync 워크플로우, `/design-system` Next.js 카탈로그, Figma Desktop Bridge MCP 를 보유. 하네스는 그 위에 얹는다.

### 확정된 결정 (브레인스토밍 합의)

| 결정 항목 | 선택 | 사유 |
|---|---|---|
| Story 전략 | **기존 `/design-system` 카탈로그 유지** (Storybook 미도입) | `.stories` 0개, package.json 에 Storybook 없음. 카탈로그가 이미 그 역할. |
| 기존 CLAUDE.md / settings.json | **병합/확장만** | 둘 다 존재. 통째 생성 시 기존 룰셋·plugin·권한 소실. |
| 토큰 탐지 기준 | **우리 컨벤션** (hex/rgb/임의값 금지, 시맨틱 Tailwind 클래스 권장) | CLAUDE.md 룰 3. `var(--color-*)` 직접 사용은 비권장 — 스펙 원문과 반대. |
| 4 아티팩트 범위 | **ⓐ** — 재사용 primitive=4, 단순/upstream=2, 도메인=patterns | 모든 컴포넌트 강제 시 50개 즉시 위반 (Storybook 함정 동일). |
| 4 아티팩트 강제 | **ⓐ 경고(warn)** | 기존 미커버는 위반이 아닌 P2-4 backlog. 신규만 경고, 차단 안 함. |

### 현재 커버리지 실태 (설계 근거)

- UI primitives `.tsx`: **24개** (impl 100%)
- 스펙 `.md`: **16개** (~63%)
- 카탈로그 페이지: **5개** (~21%, breadcrumb·button·dropdown-menu·sonner·tooltip)
- 도메인 컴포넌트 `api-portal/`: **32개** (스펙 거의 없음 → `patterns/` 가 커버)

## Non-Goals

- Storybook 도입.
- `var(--color-*)` 강제 (기존 Tailwind 시맨틱 클래스 컨벤션 유지).
- 기존 CLAUDE.md / settings.json / settings.local.json 통째 재작성.
- 기존 미커버 컴포넌트 50개 일괄 backfill (점진, P2-4 로드맵).
- Figma 라이브러리 수정 (코드 측 하네스만).

---

## 1. 컴포넌트 아티팩트 모델 (핵심)

### 1.1 4 아티팩트 정의 (예: Button)

| # | 아티팩트 | 경로 | 역할 |
|---|---|---|---|
| ① | 구현 | `src/components/{ui\|api-portal}/<Name>.tsx` | React 컴포넌트. cva variant + 시맨틱 Tailwind. Truth=Figma 컴포넌트 set. |
| ② | 스펙 | `design-system/components/<name>.md` | variant/size 매핑, Figma 노드 ID, 토큰, 안티패턴, WRONG/CORRECT. |
| ③ | 카탈로그 | `src/app/(design-system)/design-system/primitives/<name>/page.tsx` | 라이브 시각 데모 (Storybook 대체물). |
| ④ | nav 등록 | `src/lib/design-system-nav.ts` | ③을 사이드바에 노출 (③과 한 쌍). |

### 1.2 티어 모델

| Tier | 요구 아티팩트 | 대상 |
|---|---|---|
| **Tier 1** | ① | 단일 사용·variant 없는 내부 헬퍼 (대부분 도메인 1회성) |
| **Tier 2** | ①② | 단순/upstream primitive (separator·skeleton·label) 또는 라이브 데모 불필요 공용 |
| **Tier 3** | ①②③④ | variant/state 가진 재사용 design-system primitive |
| **도메인 조합물** | ① + `patterns/<pattern>.md` | 앱 조합물 (CreateApiKeyDialog 등). 개별 카탈로그 X. |

### 1.3 승격(promotion) 가이드 — 재사용 시작 시 아티팩트 추가

명시적 트리거 → 액션:

| 트리거 | 액션 |
|---|---|
| 서로 다른 **2곳 이상**에서 import | ② 스펙 추가 (Tier 1 → Tier 2) |
| **2번째 variant** 또는 인터랙티브 state 추가 | Tier 3 승격: ③ 카탈로그 + ④ nav 추가 |
| 1회성 컴포넌트가 **복사/포크**되어 퍼짐 | 공용 위치로 추출 후 위 기준 재적용 |

승격 절차(체크리스트)는 `design-system/rules/component-artifacts.md` 에 기록. CLAUDE.md 는 cross-ref 한 줄.

### 1.4 강제 수준

- 누락 = **경고(warn)**, 차단(block) 아님.
- 기존 미커버 50개는 위반 아님 (P2-4 backlog).
- `check-catalog-exists.mjs` 는 **신규 컴포넌트 파일 생성 시에만** 경고.

---

## 2. 루트 `CLAUDE.md` — 병합 (3 서브섹션 추가)

기존 룰셋 보존. 빠진 것만 cross-ref 추가:

- **컴포넌트 구조 (4 아티팩트 + 티어)** → `rules/component-artifacts.md` cross-ref 한 줄.
- **너비 규칙** → "고정 px 금지, `w-full` + 부모 padding". 기존 "fill container" 표를 룰로 승격.
- **금지사항 테이블** → Figma 에 없는 variant 임의 생성 금지 (기존 디자인 원칙 1 강화, 테이블화).

## 3. `.claude/CLAUDE.md` — 신설

- 7단계 프로세스: 이해 → 분석 → 탐색 → 계획 → 실행 → 검증 → 완료.
- **코드 작성 전 승인 필수** 게이트.
- 금지사항 테이블 (하드코딩 / 임의 variant / 고정 px / .env 수정 / Figma hidden 노드 구현 등).

## 4. `.claude/agents/` — 신설 4종

> 각 agent 파일은 frontmatter(name, description, tools) + 본문(역할/절차/출력 형식). 우리 Figma MCP 2개 서버 보유: **figma-console** (Desktop Bridge, 읽기+쓰기 다수) + **claude.ai Figma** (get_design_context 등).

### 4.1 `figma-implementer.md`
- 입력: Figma URL / node.
- **5단계**: Clarify → Context Gather → Plan → Generate → Evaluate.
- **도구 스캔**: 실행 시점에 사용 가능한 Figma 도구를 스캔해 읽기/쓰기 목록을 본문에 명시 (figma-console `figma_get_*`/`figma_set_*`/`figma_get_component_image`, claude.ai `get_design_context`/`get_screenshot`/`get_variable_defs` 등). 추측 금지, 실제 가용 도구 기준.
- **실패 처리**: 최대 **2회 재시도** → 실패 시 사용자에게 보고.
- shadcn-on-Base-UI 변환 규약(`rules/shadcn.md`) 준수.

### 4.2 `token-checker.md`
- Figma 토큰 ↔ 코드 토큰(`tokens.generated.css` / `tokens/colors.json` / `tokens/misc.json`) 비교.
- 불일치 보고 → **승인 시** `misc.json`/`colors.json` 수정 후 `npm run sync-tokens` 경유 반영 (generated.css 직접 수정 금지).

### 4.3 `design-qa.md`
- **8항목 검사** (검사만, 수정 X):
  1. `npx next build`
  2. `npx tsc --noEmit`
  3. `npm run sync-tokens:check`
  4. `eslint`
  5. 하드코딩 스캔 (hex/rgb/임의값)
  6. 신규 컴포넌트 아티팩트 (티어별 요구 충족 — 경고)
  7. a11y 베이스라인 (`rules/a11y.md` 체크리스트)
  8. Figma 충실도 (원본 텍스트/variant 일치 — figma-implementer 산출물 한정)

### 4.4 `design-reviewer.md`
- 코드 전체 스캔, 하드코딩/임의값/고정 px/`dark:` 사용 탐지.
- **Figma MCP 미사용** — 코드만 분석.

## 5. `.claude/hooks/` — 신설 4종 (Node `.mjs`, 크로스플랫폼)

| 파일 | 이벤트 | 동작 |
|---|---|---|
| `check-design-tokens.mjs` | PostToolUse (Write/Edit, `*.tsx`/`*.css`) | hex/rgb/임의값(`text-[14px]`, `bg-[#...]`, `rounded-[Npx]`) 감지 → 경고. shadcn 예외(`bg-fuchsia-600` 등) allowlist. |
| `check-catalog-exists.mjs` | PostToolUse (신규 `ui/*.tsx` 생성) | 티어 추정 후 누락 아티팩트(②③④) 경고. 차단 X. |
| `protect-files.mjs` | PreToolUse (Write/Edit) | `.env*` 수정 차단 (실제 비번 존재). |
| `notify.mjs` | (다른 훅에서 호출) | OS별 데스크탑 알림 (macOS `osascript`, linux `notify-send`, win `msg`). |

- 전부 순수 Node ESM, 의존성 0. stdin 으로 hook payload(JSON) 수신, 표준 hook 출력 규약 따름.

## 6. `.claude/settings.json` — 병합

- 기존 `enabledPlugins.figma` **보존**.
- `hooks` 섹션 추가 — 위 4 훅을 PreToolUse/PostToolUse 에 연결.
- `permissions.deny` 에 `.env*` **읽기 차단** 추가.
- `settings.local.json`(기존 권한) 미수정.

## 7. `docs/DESIGN.md` — 신설

- 브랜드 성격 (UJET 시그니처 블루 `#00A2FF`, 한정 사용 정책).
- 색상/스페이싱 사용 맥락 (언제 primary vs info vs sidebar, 8px 그리드).
- 컴포넌트 조합 규칙 + 쓰지 말 것 (안티패턴).
- Figma 레이어 네이밍 컨벤션.
- 기존 `rules/` 를 인용하는 상위 내러티브 (중복 금지, cross-ref).

## 8. `install.sh` — 신설

- Node 버전 확인 (≥18).
- `.claude/hooks/*.mjs` 존재/실행 스모크 테스트 (각 훅에 dummy payload 1회).
- `.claude/settings.json` 병합 상태 안내 (덮어쓰기 대신 수동 확인 가이드).
- 멱등(idempotent): 재실행해도 안전.

---

## 9. File Manifest

### Create
- `design-system/rules/component-artifacts.md` (티어 + 승격 가이드)
- `.claude/CLAUDE.md`
- `.claude/agents/figma-implementer.md`
- `.claude/agents/token-checker.md`
- `.claude/agents/design-qa.md`
- `.claude/agents/design-reviewer.md`
- `.claude/hooks/check-design-tokens.mjs`
- `.claude/hooks/check-catalog-exists.mjs`
- `.claude/hooks/protect-files.mjs`
- `.claude/hooks/notify.mjs`
- `docs/DESIGN.md`
- `install.sh`

### Modify (merge)
- `CLAUDE.md` (루트 — 3 서브섹션 + cross-ref)
- `.claude/settings.json` (hooks + .env deny, 기존 보존)

---

## 10. Done Definition

- [ ] 4 아티팩트 티어 모델 + 승격 가이드가 `component-artifacts.md` 에 명문화, CLAUDE.md cross-ref.
- [ ] `.claude/CLAUDE.md` 7단계 + 승인 게이트 + 금지 테이블.
- [ ] agents 4종 — figma-implementer 가 실제 가용 Figma 도구를 스캔해 목록화, 2회 재시도 규약.
- [ ] hooks 4종 동작 (token 경고 / catalog 경고 / .env 차단 / 알림), 의존성 0.
- [ ] settings.json 병합 — 기존 plugin/권한 보존 확인 + .env 읽기 deny.
- [ ] DESIGN.md 상위 내러티브 (rules/ cross-ref, 중복 0).
- [ ] install.sh 멱등 실행 통과.
- [ ] 토큰 탐지 = 우리 컨벤션 (hex/rgb/임의값), `var(--color-*)` 강제 아님.
- [ ] 기존 50개 미커버 컴포넌트가 "위반"으로 잡히지 않음 (신규만 경고).

## 11. Risks / Open Questions

- **Hook payload 스키마**: Claude Code hook 의 PreToolUse/PostToolUse 입력 JSON 형식을 구현 단계에서 확정 (Write/Edit 의 file_path 추출 경로). 플랜 단계에서 실제 스키마 검증.
- **하드코딩 allowlist**: `bg-fuchsia-600`(Avatar mock) 등 의도된 예외 목록을 `check-design-tokens.mjs` 에 명시. 추가 예외 발견 시 갱신.
- **settings.json 병합 자동화 범위**: install.sh 가 자동 병합할지, 수동 안내만 할지 — 기존 설정 손상 방지 위해 **수동 안내 + diff 제시** 권장.
- **figma-implementer 도구 스캔 시점**: 세션마다 가용 도구가 다를 수 있어(ToolSearch deferred), agent 본문은 "스캔 절차"를 명시하고 정적 목록은 참고용으로만.
