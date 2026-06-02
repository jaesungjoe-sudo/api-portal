# DESIGN — API Portal 디자인 내러티브

> 토큰·컴포넌트의 *기계적 규칙*은 `design-system/rules|components|patterns` 에 있다. 본 문서는 그 위의 *맥락·의도* — "왜 이 토큰을, 언제" 를 설명한다. 규칙 중복 금지, cross-ref 우선.

## 1. 브랜드 성격

- UJET 개발자 콘솔. 톤: **신뢰감 있는 / 정돈된 / 도구적**. 화려함보다 명료함.
- 시그니처 블루 `#00A2FF` (`brand` 토큰) — **로고·랜딩·마케팅 한정**. 일반 UI 강조는 `primary`/`info`/`sidebar`. (`rules/color.md`)

## 2. 색상 사용 맥락

| 상황 | 토큰 |
|---|---|
| 주요 CTA / 활성 | `primary` |
| 정보·중립 강조 (배지/링크) | `info` |
| 사이드바 네비 | `sidebar-*` |
| 성공/경고/위험 상태 | `success` / `warning` / `destructive` (+ `-subtle`/`-border`) |
| 브랜딩 | `brand` (한정) |

> "Delete=빨강" 같은 관습 색은 Figma `fills` 에 destructive 토큰이 명시된 경우만. (원칙 1)

## 3. 스페이싱 맥락

8px 그리드 (`rules/layout.md`). 페이지 wrapper `px-6 md:px-10`, 헤더 영역 `gap-10`, 폼 필드 `gap-2`. 임의 px 금지.

## 4. 컴포넌트 조합 규칙

- 메뉴 리스트 = `DropdownMenu` (Popover 아님).
- 확인 다이얼로그 = `ConfirmDialog` (outline Cancel + destructive Confirm).
- 폼 다이얼로그 = `patterns/form-dialog.md` (autoFocus 차단, 필드 gap-2).
- 리스트 페이지 = `patterns/table-list-page.md`.
- 클릭 카드 = `patterns/clickable-card-with-menu.md`.

## 5. 쓰지 말 것 (안티패턴)

- 인라인 색 매핑 (StatusBadge 우회) / `dark:` prefix / 고정 px 너비 / Figma 없는 variant / autoFocus / `var(--color-*)` 직접 사용 / hidden Figma 노드 구현.

## 6. Figma 레이어 네이밍 컨벤션

- 아이콘: `lucide/<kebab>` → PascalCase import. 예외 매핑은 `icons.md`.
- 컴포넌트 인스턴스: `componentProperties.Type`/`Size` 가 코드 variant/size 와 1:1.
- divider 의심: width=1/height=1 Rectangle, rotation+좁은 비율 → `figma-reading.md`.
- hidden(`visible:false`) 노드는 항상 제외.

## Cross-refs

- 규칙: `design-system/rules/*`  · 컴포넌트: `components/*`  · 패턴: `patterns/*`
- 아티팩트 티어: `rules/component-artifacts.md`
