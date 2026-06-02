# Component Artifacts — 티어 & 승격 가이드

> 1 컴포넌트가 가져야 할 아티팩트를 "티어"로 정의한다. 모든 컴포넌트에 4개를 강제하지 않는다 — 재사용성이 자라면 아티팩트를 **승격(promote)** 한다. 강제는 **경고(warn)** 수준이며 기존 미커버 컴포넌트는 위반이 아니라 P2-4 backlog.

## 4 아티팩트 (예: Button)

| # | 아티팩트 | 경로 | 역할 |
|---|---|---|---|
| ① | 구현 | `src/components/{ui\|api-portal}/<Name>.tsx` | React 컴포넌트. cva variant + 시맨틱 Tailwind. Truth=Figma 컴포넌트 set. |
| ② | 스펙 | `design-system/components/<name>.md` | variant/size 매핑, Figma 노드 ID, 토큰, 안티패턴, WRONG/CORRECT. |
| ③ | 카탈로그 | `src/app/(design-system)/design-system/primitives/<name>/page.tsx` | 라이브 시각 데모 (Storybook 대체물). |
| ④ | nav 등록 | `src/lib/design-system-nav.ts` | ③을 사이드바에 노출 (③과 한 쌍). |

## 티어 모델

| Tier | 요구 | 대상 |
|---|---|---|
| **Tier 1** | ① | 단일 사용·variant 없는 내부 헬퍼 (대부분 도메인 1회성) |
| **Tier 2** | ①② | 단순/upstream primitive (separator·skeleton·label) 또는 라이브 데모 불필요 공용 |
| **Tier 3** | ①②③④ | variant/state 가진 재사용 design-system primitive |
| **도메인 조합물** | ① + `patterns/<pattern>.md` | 앱 조합물(다이얼로그 등). 개별 카탈로그 X. |

## 승격(promotion) 트리거 → 액션

| 트리거 | 액션 |
|---|---|
| 서로 다른 **2곳 이상**에서 import | ② 스펙 추가 (Tier 1 → 2) |
| **2번째 variant** 또는 인터랙티브 state 추가 | Tier 3 승격: ③ 카탈로그 + ④ nav 추가 |
| 1회성이 **복사/포크**되어 퍼짐 | 공용 위치 추출 후 기준 재적용 |

## 승격 절차 (체크리스트)

1. `design-system/components/<name>.md` 작성 (기존 spec 구조 따름: variant 표 / Figma 노드 / 토큰 / 안티패턴).
2. Tier 3 이면 `src/app/(design-system)/design-system/primitives/<name>/page.tsx` 생성 (기존 button/page.tsx 구조 참고, `mx-auto max-w-4xl px-6 py-10 md:px-10` 래퍼).
3. `src/lib/design-system-nav.ts` Primitives 그룹에 `{label, href, doc}` 추가 (알파벳 순).
4. `npx tsc --noEmit && npx next build` 통과 확인.

## 강제 수준

- 누락 = **경고**, 차단 아님. `check-catalog-exists.mjs`(하네스 hook, Phase B 도입) 는 **git 미추적(신규) ui 파일**에만 경고.
- 기존 미커버(primitive 19 / 도메인 32)는 위반 아님.

## Cross-refs

- 토큰 룰: `rules/color.md`, CLAUDE.md 디자인 원칙 3.
- 패턴(도메인 조합): `patterns/*.md`.
- 카탈로그 커버리지 로드맵: `PROGRESS.md` P2-4.
