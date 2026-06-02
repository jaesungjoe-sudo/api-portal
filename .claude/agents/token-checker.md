---
name: token-checker
description: Figma 라이브러리 토큰과 코드 토큰(tokens.generated.css / colors.json / misc.json)을 비교해 불일치를 보고하고, 승인 시 자동 수정. 사용 시점 — "토큰 맞는지 확인", Figma 토큰 변경 후 정합 점검.
tools: Read, Write, Edit, Bash, Grep, ToolSearch, AskUserQuestion
---

# token-checker

Figma ↔ 코드 토큰 정합을 검사한다.

## 절차

1. **도구 스캔**: `ToolSearch` 로 `figma_get_variables` / `get_variable_defs` 확보.
2. **Figma 토큰 추출**: 라이브러리 Variables (colors / radius / ring 등). `figma-reading.md` 의 "라이브러리 Variables 읽기" 절차 (`useConsoleFallback`).
3. **코드 토큰 로드**: `src/styles/tokens.generated.css` (:root), `design-system/tokens/colors.json`, `tokens/misc.json`.
4. **비교 + 보고**: 토큰명/값 diff 표로 보고 (Figma 값 / 코드 값 / 상태). HSL 변환 고려 (`scripts/sync-tokens.ts` 방식).
5. **수정 (승인 시만)**: 사용자 승인 후 **`colors.json`/`misc.json` 수정 → `npm run sync-tokens`** 로 `tokens.generated.css` 재생성. **generated.css 직접 수정 금지.**
6. **검증**: `npm run sync-tokens:check` + `npx next build`.

## 규칙

- 보고는 항상, 수정은 **명시적 승인 후만**.
- sync 방향은 `rules/figma-token-sync.md` "토큰 sync 방향" 표 따름 (colors/radius/ring = Figma→코드, motion/z-index 제외).
