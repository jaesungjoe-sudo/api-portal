# P3-8 — Token Gaps: z-index / motion / focus-ring

- **Date**: 2026-06-02
- **Roadmap**: Design system maturity P3-8
- **Scope**: Code-side only (Figma library work documented as separate designer handoff, executed asynchronously by Jaesung)
- **Status**: Design approved → ready for implementation plan

## Goal

세 갈래의 남은 토큰 갭을 메우고, 아웃라이어를 정리한다. 신규 컴포넌트가 일관된 어휘로 motion / focus / stacking 을 결정할 수 있게 만든다. P2-5 (typography) / P2-6 (a11y) 같은 *완전 문서-only* 가 아니라, **토큰 신설 + 외곽 outlier ~9건 refactor + 문서/카탈로그** 의 균형. 신설 토큰을 *카논으로 사용*하는 코드를 같이 가져가서 "쓰이지 않는 룰" 함정을 피한다.

## Non-Goals

- 모든 `z-50` / `duration-100` 을 의미 토큰으로 일괄 rename (가독성 ↓, shadcn upstream diff ↑, 동작 변화 0). 토큰을 *카논 선언*으로 사용하고 Tailwind 기본 스케일과의 동치 관계는 룰 문서에 명시.
- Figma 라이브러리 수정 (별도 designer handoff. 코드 작업 자체는 라이브러리 변경 없이 완결).
- 새 컴포넌트 추가, 다이얼로그 등 도메인 코드 변경.

## 1. Token Additions

### 1.1 z-index (4-step scale)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `--z-base` | 0 | 기본 페이지 콘텐츠 |
| `--z-sticky` | 10 | Sidebar wrapper, sticky TopNav |
| `--z-overlay` | 50 | Dialog / Sheet / Popover / Dropdown / Select / Sidebar rail (shadcn 표준 — `z-50` ≡ `--z-overlay`) |
| `--z-toast` | 100 | Sonner |

**카논 선언 패턴**: Tailwind 의 `z-50` / `z-10` 을 그대로 두고, 룰 문서에 "이 값이 `--z-overlay` / `--z-sticky` 와 동치임" 을 명시. `rounded-lg` ≡ `--radius-lg` 와 동일 접근.

### 1.2 motion (3 duration × 2 easing)

| 토큰 | 값 | 사용처 |
|---|---|---|
| `--duration-fast` | 100ms | Popup open/close (Tooltip / Popover / Dropdown / Select / Dialog) |
| `--duration-base` | 200ms | Drawer (Sheet), Sidebar 접힘·펼침, Accordion |
| `--duration-slow` | 300ms | NavigationMenu 큰 전환 (현재 `[0.35s]` 리터럴 → 300ms 흡수) |
| `--ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | NavigationMenu, hero motion |

Easing 기본값 (`linear`) 은 토큰화하지 않음 — Tailwind 의 `ease-linear` 가 사실상 default 이고, 룰 문서에서 "정합되지 않은 한 `ease-linear` 사용" 으로 명시. 토큰 신설은 한 종류 (emphasized) 만.

**흡수 결정**: 현재 150ms (Sheet backdrop, Accordion 일부) 는 `--duration-base` (200ms) 로 흡수. 시각 차이 사실상 없음. 단일 소스 유지.

### 1.3 focus-ring

| 토큰 | 값 | 사용처 |
|---|---|---|
| `--ring-width` | 3px | 모든 focus-visible (`ring-3` 통일) |
| `--ring-color-default` | `var(--ring) / 50%` | 일반 focus |
| `--ring-color-invalid` | `var(--destructive) / 20%` | aria-invalid focus |

`--ring` 색 토큰은 이미 존재 (재활용). width 만 신설.

### 1.4 Tailwind v4 통합 방식

`globals.css` 에 `@theme inline` 으로 신규 ease 만 등록 → `ease-emphasized` 키 활성화.

```css
@theme inline {
  --ease-emphasized: var(--ease-emphasized);
}
```

Duration 은 Tailwind 의 기본 스케일 (`duration-100` / `duration-200` / `duration-300`) 이 우리 `--duration-fast/base/slow` 값과 동일하므로 **추가 등록 불필요**. CSS 변수 `--duration-*` 은 :root 에 두고 *룰 문서 + 커스텀 CSS 작성 시 참조용* 으로 운영. 코드 일상 사용은 Tailwind 네이티브 `duration-300` 형태가 우선.

`tokens.generated.css` 의 `:root` 에는 `--duration-fast/base/slow` + `--ease-emphasized` 가 모두 정의됨 (단일 소스). `@theme inline` 은 위 한 줄만 추가.

## 2. Outlier Refactor (9건)

`src/components/ui/*` 5 파일만 건드림.

| # | 파일 | 라인 | 현재 | 변경 | 사유 |
|---|---|---|---|---|---|
| 1 | sidebar.tsx | 403 | `focus-visible:ring-2` | `focus-visible:ring-3` | ring-width 통일 |
| 2 | sidebar.tsx | 427 | `focus-visible:ring-2` | `focus-visible:ring-3` | ring-width 통일 |
| 3 | sidebar.tsx | 478 | `focus-visible:ring-2` | `focus-visible:ring-3` | ring-width 통일 |
| 4 | sidebar.tsx | 567 | `focus-visible:ring-2` | `focus-visible:ring-3` | ring-width 통일 |
| 5 | sidebar.tsx | 682 | `focus-visible:ring-2` | `focus-visible:ring-3` | ring-width 통일 |
| 6 | badge.tsx | 8 | `focus-visible:ring-[3px]` | `focus-visible:ring-3` | 리터럴 → 스케일 |
| 7 | navigation-menu.tsx | 87 | `duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]` | `duration-300 ease-emphasized` | duration: Tailwind native (값 동일) / ease: 토큰 alias |
| 8 | navigation-menu.tsx | 111 | `duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]` | `duration-300 ease-emphasized` | duration: Tailwind native / ease: 토큰 alias |
| 9 | navigation-menu.tsx | 116 | `duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]` | `duration-300 ease-emphasized` | duration: Tailwind native / ease: 토큰 alias |

기존 `z-50` / `duration-100` / `duration-200` / `ease-linear` 등 정합된 사용은 변경 없음.

## 3. Token Sync (misc.json + sync-tokens.ts)

### 3.1 `design-system/tokens/misc.json` 확장

```json
{
  "radius": { ... existing ... },
  "zIndex": {
    "base": 0,
    "sticky": 10,
    "overlay": 50,
    "toast": 100
  },
  "motion": {
    "duration": {
      "fast": "100ms",
      "base": "200ms",
      "slow": "300ms"
    },
    "ease": {
      "emphasized": "cubic-bezier(0.22, 1, 0.36, 1)"
    }
  },
  "ring": {
    "width": "3px"
  }
}
```

### 3.2 `scripts/sync-tokens.ts` 확장

- `zIndex`, `motion.duration`, `motion.ease`, `ring.width` 섹션을 읽어 `tokens.generated.css` 의 `:root` 블록에 CSS 변수로 emit.
- 출력 라인은 radius scale 뒤에 신규 4 블록 (z-index / duration / ease / ring) 으로 정렬.

### 3.3 `tokens.generated.css` 출력 예 (신규 부분만)

```css
:root {
  /* ... existing radius ... */

  --z-base: 0;
  --z-sticky: 10;
  --z-overlay: 50;
  --z-toast: 100;

  --duration-fast: 100ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;

  --ease-emphasized: cubic-bezier(0.22, 1, 0.36, 1);

  --ring-width: 3px;
}
```

`globals.css` 의 `@theme inline` 에 ease 만 노출 (duration 은 Tailwind native 사용):

```css
@theme inline {
  --ease-emphasized: var(--ease-emphasized);
}
```

## 4. Documentation (3 new rules)

### 4.1 `design-system/rules/z-index.md`

- 4단계 scale 표
- "code-only, Figma 미모델" 명시
- `z-50` ≡ `--z-overlay` 동치 룰
- 안티패턴 4종: 임의 `z-[N]`, 같은 레이어 내 우열 다툼, `z-[9999]` 식 극단값, sidebar 와 overlay 같은 z 사용

### 4.2 `design-system/rules/motion.md`

- 3 duration × 2 ease 매트릭스 + 사용 가이드 (popup=fast, drawer/sidebar=base, hero=slow)
- Tailwind v4 `@theme` 등록 방식
- `prefers-reduced-motion` 정책 (현재 글로벌 핸들러 없음 → 후속 작업 검토 박스)
- 안티패턴 5종: 리터럴 ms, 5개 이상 duration 사용, 불일치 페어링 (fast + emphasized 등), reduced-motion 무시, 200ms 와 150ms 혼용

### 4.3 `design-system/rules/focus-ring.md`

- 토큰 3종 + 패턴 cva 스니펫 (border + ring + offset)
- aria-invalid 자동 색 변환 룰
- `outline-none` 사용 조건 (Base UI primitive 가 자체 outline 가지므로 명시적 제거)
- `rules/a11y.md` §3 (포커스 관리) cross-ref — *행동* 은 a11y, *시각 토큰* 은 focus-ring 으로 역할 분리

### 4.4 `rules/figma-token-sync.md` 갱신 (1 섹션 추가)

매트릭스 1개 추가:

| 토큰 그룹 | sync 방향 |
|---|---|
| colors, radius, shadow(예정), ring-width | Figma → 코드 (양방향) |
| motion | Figma 라이브러리 spec 페이지 (one-way 참조) |
| z-index | Code-only |

## 5. Catalog Pages (3 new under Foundations)

| 라우트 | 컨텐츠 |
|---|---|
| `/design-system/foundations/z-index` | 4 계층 시각 데모 (겹친 카드 stack), 토큰 표, 안티패턴 |
| `/design-system/foundations/motion` | 3 duration 라이브 데모 (버튼 클릭 → fade 비교), 2 ease 곡선 SVG + 라이브 데모, prefers-reduced-motion 박스 |
| `/design-system/foundations/focus-ring` | Tab 키 안내 + Input/Select/Button/Badge ring 비교, aria-invalid 데모 cross-ref to a11y page, ring-2 vs ring-3 비교 (refactor 전후) |

### 5.1 `CatalogSidebar` nav 갱신

Foundations 그룹 (기존 *Tokens*) → 4 항목 (Tokens / Z-Index / Motion / Focus Ring). 알파벳 순 또는 의미 순 — 구현 시 결정.

### 5.2 `design-system-nav.ts` 데이터 + Roadmap 항목 갱신

- nav: foundations 그룹에 3 라우트 추가
- Roadmap 표: P3-8 ✅ 완료 마크 (구현 commit 시점)

## 6. Designer Handoff (Async — 비-필수 dependency)

Figma 라이브러리 (`SmO9fsWrxriuCofc7T3b1S`) 작업. 코드 PR merge 와 무관하게 진행 가능.

### 6.1 focus-ring — `ring/width` Number variable

- 위치: `tw/dimensions` 컬렉션 (없으면 새 컬렉션 `effects` 신설)
- 변수: `ring/width` = 3 (Number)
- 바인딩: Input / Select / Button / Checkbox / Badge / Tabs / Toggle / Accordion 의 Focused variant 외곽 stroke weight
- 코드 정합: 코드에 미리 박힌 `--ring-width: 3px` 값과 일치하면 OK. 다르면 코드 1줄 정정.

### 6.2 motion — Library spec page

- 위치: 라이브러리 새 페이지 `Motion` (Foundations)
- 내용: 3 duration 카드 + 2 easing 카드 (각 토큰명 / 값 / 사용처). Emphasized easing 의 cubic-bezier 곡선 SVG 시각화 권장.
- Variables 등록: 선택사항 (Figma motion 자동 바인딩 없음). 등록 시 `motion/duration-*` Number + `motion/ease-emphasized` String.

### 6.3 z-index — `Layer Stack (code-only)` memo page

- 위치: 라이브러리 새 페이지 (Foundations) 또는 README 페이지 1 섹션
- 내용: "Figma 에서 모델링하지 않음. 4 단계 어휘만 빌려쓰기" 메모 + 단계 표

### 6.4 작업 순서 권장

1. 코드 PR merge
2. Figma `Motion` + `Layer Stack` 페이지 신설 (30 분)
3. `ring/width` 변수 + Focused variant 바인딩 (1-2 시간)
4. Library publish + 디자인 파일들 library update accept
5. 코드 측 PROGRESS.md 에 "Figma 정합 완료" 1 줄

## 7. Implementation Order

1. `misc.json` 확장
2. `sync-tokens.ts` 확장 + `npm run sync-tokens` 실행 → `tokens.generated.css` 갱신
3. `globals.css` `@theme` 등록
4. Outlier 9 건 refactor (sidebar / badge / navigation-menu)
5. 3 룰 문서 신규 + `figma-token-sync.md` 갱신
6. 카탈로그 페이지 3 개 + nav + Roadmap 갱신
7. `npx tsc --noEmit` + `npx next build` 통과 확인
8. 시각 회귀 수동 체크: Tab 키로 Sidebar/Input/Button/Badge focus ring 일관성, NavigationMenu 전환 부드러움
9. PROGRESS.md 갱신 + commit

## 8. Done Definition

- [ ] `tokens.generated.css` 에 `--z-*` / `--duration-*` / `--ease-*` / `--ring-width` 변수 존재
- [ ] `globals.css` `@theme inline` 에 `--ease-emphasized` 등록되어 `ease-emphasized` Tailwind 키로 사용 가능 (duration 은 Tailwind native `duration-100/200/300` 사용)
- [ ] Outlier 9 건 변경 적용, `npx next build` 통과
- [ ] 3 룰 문서 / 3 카탈로그 페이지 신규
- [ ] CatalogSidebar Foundations 그룹 nav 확장
- [ ] Roadmap 표 P3-8 ✅
- [ ] PROGRESS.md 한 줄 추가 (단일 commit 정책 정합)
- [ ] Designer handoff 노트는 spec 문서 자체로 인계됨 (별도 채널 안내 불요)

## 9. Risks / Open Questions

- `globals.css` `@theme inline` 사용으로 Tailwind v4 가 신규 키를 인식하는지 빌드 단계에서 검증 필요. 만약 등록이 동작하지 않으면 fallback: 코드에서 `duration-[var(--duration-fast)]` 형태 직접 사용.
- Sonner toast 의 z-index 가 실제로 `--z-toast` (100) 수준인지 라이브러리 내부에서 검증. 우리 wrapper (`src/components/ui/sonner.tsx`) 에서 별도 z 설정 안 함 → sonner 기본값 따름. 필요 시 wrapper 에서 override.
- `prefers-reduced-motion` 처리 — 현재 글로벌 핸들러 없음. 룰 문서에 "후속 작업 검토" 박스로 남기고 본 P3-8 스코프 외.
