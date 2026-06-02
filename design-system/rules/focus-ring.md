# Focus ring — Width & color tokens

> `--ring-width` 는 Figma 라이브러리에서 `ring/width` Number variable 와 양방향 sync 예정 (Designer handoff 후). 코드 측 현재 값 = **3px**. 색은 기존 `--ring` / `--destructive` 토큰 재활용 — width 만 신설.

본 문서는 focus 의 **시각 토큰**만 다룬다. *행동* (autoFocus 차단, dialog focus 복귀, sr-only 흡수) 은 [`a11y.md`](./a11y.md) §3 에서.

---

## 1. 토큰 표

| 토큰 | 값 | 구현 (Tailwind) | 사용 |
|---|---|---|---|
| `--ring-width` | 3px | `ring-3` | 모든 focus-visible |
| `--ring-color-default` | `var(--ring) / 50%` | `ring-ring/50` | 일반 focus |
| `--ring-color-invalid` | `var(--destructive) / 20%` | `ring-destructive/20` | aria-invalid focus |

`--ring-width` 는 `tokens.generated.css` 의 `:root` 에 정의됨 (`misc.json#ring.width` → `sync-tokens.ts`). 색 2종은 별도 CSS var 신설 없이 기존 토큰 + alpha 로 표현.

---

## 2. 표준 cva 패턴

Input / Select / Button / Badge / Checkbox / Toggle 이 동일한 패턴을 쓴다:

```ts
// focus-visible 일반
"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// aria-invalid 자동 색 변환 (border + ring 동시)
"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
```

`aria-invalid` 가 true 면 border 와 ring 색이 함께 destructive 로 전환된다 — ring 만 바꾸고 border 를 빠뜨리면 시각 누설.

---

## 3. `outline-none` 사용 조건

Base UI primitive 는 자체 outline 을 가지므로 명시적으로 제거(`outline-none` / `outline-hidden`)해야 한다. 단 **키보드 사용자를 위해 반드시 `focus-visible` ring 으로 대체**한다 — outline 만 지우고 ring 이 없으면 키보드 포커스가 보이지 않아 접근성 위반.

---

## 4. Anti-patterns

- ❌ `ring-2` 또는 `ring-[Npx]` 리터럴 — width 통일 위반. 모두 `ring-3`.
- ❌ `outline-none` 만 두고 ring 없음 — 키보드 사용자 차단.
- ❌ `focus:` 사용 — 마우스 클릭 시에도 ring 표시. `focus-visible:` 사용.
- ❌ aria-invalid 색을 ring 에만 적용하고 border 누락 — 시각 누설.
- ❌ `ring-ring/50` 외 임의 alpha (`/40`, `/60` 등) — 합의 깨짐.

---

## 5. Cross-refs

- 행동(Focus 관리): [`a11y.md`](./a11y.md) §3 — autoFocus 차단, dialog focus 복귀, sr-only 흡수.
- Sync 정책: [`figma-token-sync.md`](./figma-token-sync.md) — ring-width = Figma → 코드 (디자이너 작업 예정).
- Spec: `docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md`
- 카탈로그: `/design-system/foundations/focus-ring` (Tab 순회 + ring-2 vs ring-3 비교 + aria-invalid 데모).
