# z-index — Layer stack

> **Code-only.** Figma 에서 모델링하지 않음. layer 합의는 본 문서가 단일 출처(truth)다. Tailwind 의 `z-50` / `z-10` 을 그대로 쓰되, 그 값이 어떤 레이어를 뜻하는지 본 문서가 *동치 명세* 한다.

---

## 1. 4 단계 scale

| 토큰 | 값 | Tailwind | 사용처 |
|---|---|---|---|
| `--z-base` | 0 | `z-0` (또는 기본) | 페이지 콘텐츠 |
| `--z-sticky` | 10 | `z-10` | Sidebar wrapper, sticky 헤더 |
| `--z-overlay` | 50 | `z-50` | Dialog / Sheet / Popover / Dropdown / Select / Sidebar rail |
| `--z-toast` | 100 | `z-[100]` (Sonner 자체 처리) | Sonner toast |

CSS 변수는 `tokens.generated.css` 의 `:root` 에 정의됨 (`misc.json#zIndex` → `sync-tokens.ts`).

---

## 2. 카논 선언 패턴

`rounded-lg` ≡ `--radius-lg` 와 같은 접근이다. 코드에서는 Tailwind 네이티브 클래스 (`z-50`, `z-10`) 를 그대로 쓰고, **그 값이 4 단계 어휘 중 무엇인지는 본 문서가 정의**한다. 즉 `z-50` 을 일괄 `z-[var(--z-overlay)]` 로 rename 하지 않는다 — 가독성↓, shadcn upstream diff↑, 동작 변화 0.

새 컴포넌트를 작성할 때는 아래 4 단계 중 하나를 *의도적으로 선택*해서 해당 Tailwind 값을 쓴다:

- 떠 있는 오버레이(모달/드롭다운/팝오버) → `z-50` (`--z-overlay`)
- sticky 헤더 / 사이드바 골격 → `z-10` (`--z-sticky`)
- toast → Sonner 가 자체적으로 `100` 수준 처리 (직접 z 설정 불필요)

---

## 3. 사용 가이드

- **새 overlay 신설**: Dialog/Sheet/Popover/Dropdown/Select 류는 모두 `z-50`. 새 레이어를 임의로 만들지 말 것.
- **같은 layer 충돌**: 두 overlay 가 동시에 열리면 z 로 우열을 다투지 말고 **DOM 순서**로 해결 (나중에 마운트된 것이 위).
- **Sidebar rail**: 데스크탑 골격은 `z-10`, 모바일 Sheet 오버레이는 `z-50` (Sheet 가 overlay 레이어).
- **Toast**: overlay(50) 보다 위(100) 여야 confirm/alert 위에서도 보인다. Sonner 기본값 따름 — wrapper(`src/components/ui/sonner.tsx`) 에서 z override 하지 않음.

---

## 4. Anti-patterns

- ❌ `z-[9999]` 등 극단값 — 단계 어휘 무시. "일단 제일 위로" 식 임시방편은 다음 충돌을 키운다.
- ❌ 임의 `z-[N]` 리터럴 (`z-[30]`, `z-[60]` 등) — 4 단계 합의 우회.
- ❌ 같은 layer 내 우열 다툼 — 두 Popover 가 동시에 열렸을 때 z 로 싸우지 말 것. DOM 순서로 자연 해결.
- ❌ Toast 를 overlay 아래로 두기 — confirm/alert 다이얼로그가 toast 를 가려 사용자가 못 봄. 의도된 행동 아님.

---

## 5. Cross-refs

- Sync 정책: [`figma-token-sync.md`](./figma-token-sync.md) — "토큰 sync 방향" 매트릭스 (z-index = code-only).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- 카탈로그: `/design-system/foundations/z-index` (4 layer 겹친 stack 시각 데모).
