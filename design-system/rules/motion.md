# Motion — Duration & easing

> **코드 truth.** Figma 라이브러리에는 spec 페이지(one-way 참조)만 둔다 — 자동 sync 안 함. 새 컴포넌트의 transition 은 아래 3 duration × 1 easing 어휘 안에서 결정한다.

---

## 1. Duration 매트릭스

| 토큰 | 값 | Tailwind | 사용처 |
|---|---|---|---|
| `--duration-fast` | 100ms | `duration-100` | Popover / Dropdown / Select / Dialog / Tooltip open·close |
| `--duration-base` | 200ms | `duration-200` | Sheet, Sidebar 접힘·펼침, Accordion |
| `--duration-slow` | 300ms | `duration-300` | NavigationMenu 큰 전환, hero motion |

> **150ms 흡수 결정**: 일부 backdrop / Accordion 에 남아있던 150ms 는 `--duration-base` (200ms) 로 흡수한다. 시각 차이 사실상 없음 — 단일 소스 유지가 우선.

---

## 2. Easing 매트릭스

| 토큰 | 값 | Tailwind | 사용처 |
|---|---|---|---|
| (default) | `linear` | `ease-linear` | Sidebar 등 단순 사이즈/위치 보간 (default) |
| `--ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-emphasized` | NavigationMenu, "spring 느낌" 필요한 큰 전환 |

Easing 기본값(`linear`)은 토큰화하지 않는다 — Tailwind 의 `ease-linear` 가 사실상 default. 정합이 필요한 한 곳(emphasized)만 토큰 신설.

---

## 3. Tailwind v4 통합 방식

- **Duration**: Tailwind 네이티브 `duration-100/200/300` 가 우리 카논 값(`--duration-fast/base/slow`)과 그대로 동치. 추가 등록 불필요 — 코드에서는 `duration-300` 형태를 직접 쓴다. `--duration-*` CSS 변수는 룰 문서 + 커스텀 CSS 작성 시 참조용.
- **Easing**: `globals.css` 의 `@theme inline` 에 `--ease-emphasized: var(--ease-emphasized);` 한 줄로 `ease-emphasized` Tailwind 유틸리티 키를 활성화. 값 자체는 `tokens.generated.css` 의 `:root` 에 단일 정의.

```css
/* globals.css @theme inline */
--ease-emphasized: var(--ease-emphasized);  /* value lives in tokens.generated.css */
```

---

## 4. `prefers-reduced-motion` 정책

> ⚠️ **현재 글로벌 핸들러 없음 — 후속 작업 검토 항목.**
> 정책 합의: 사용자가 OS 에서 Reduce motion 을 활성화하면 모든 transition 을 `0ms` 로 단축한다. 구현 시 `globals.css` 에 글로벌 룰을 추가:
>
> ```css
> @media (prefers-reduced-motion: reduce) {
>   *, ::before, ::after {
>     animation-duration: 0.01ms !important;
>     transition-duration: 0.01ms !important;
>   }
> }
> ```
>
> 본 P3-8 스코프 밖. 도입 전까지 카탈로그 데모도 reduce motion 을 무시하는 상태임을 명시.

---

## 5. 사용 가이드

- **popup** (Tooltip / Popover / Dropdown / Select / Dialog) → `duration-100`
- **drawer / sidebar / accordion** → `duration-200`
- **nav / hero** 큰 전환 → `duration-300 ease-emphasized`

---

## 6. Anti-patterns

- ❌ 리터럴 ms — `duration-[180ms]` 같은 임의값. 3 단계 어휘로 흡수.
- ❌ 5 개 이상 duration 사용 — 스케일 외 확장. 새 값이 정말 필요하면 spec 합의 후 토큰 추가.
- ❌ 불일치 페어링 — `duration-100`(fast) + `ease-emphasized`. emphasized 는 큰 전환(slow)과 매칭.
- ❌ `prefers-reduced-motion` 무시한 항시 애니메이션 (정책 도입 후).
- ❌ 200ms 와 150ms 혼용 — 한 곳에 150 이 남아있다면 그건 정리 대상(`--duration-base` 로 흡수).

---

## 7. Cross-refs

- Sync 정책: [`figma-token-sync.md`](./figma-token-sync.md) — motion = 코드 truth (one-way).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- 카탈로그: `/design-system/foundations/motion` (duration 3 박스 토글 + easing 곡선 + 라이브 데모).
