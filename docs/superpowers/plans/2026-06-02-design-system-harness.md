# Design System Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Figma→코드 일관성 / 토큰 하드코딩 감지 / 컴포넌트 프로세스 표준화를 위한 에이전트·훅·문서 하네스를, 기존 design-system 자산 위에 "adapt-not-overwrite" 로 얹는다.

**Architecture:** 기존 `design-system/rules|components|patterns`, 토큰 sync 워크플로우, `/design-system` Next.js 카탈로그(Storybook 미사용), Figma Desktop Bridge MCP 를 그대로 두고 — (a) 컴포넌트 아티팩트 티어 모델 룰 문서, (b) CLAUDE.md 병합, (c) `.claude/` 하네스(7단계 프로세스 + agents 4 + hooks 4 + settings 병합), (d) DESIGN.md, (e) install.sh 를 추가한다. `.claude/` 가 gitignore 되어 있어 하네스 파일은 `git add -f` 로 선별 추적.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind v4 / shadcn-on-Base-UI / Node ESM(.mjs) hooks / Claude Code agents+hooks.

**Spec:** `docs/superpowers/specs/2026-06-02-design-system-harness-design.md`

**Decisions (locked):** Storybook 미도입(카탈로그 사용) · CLAUDE.md/settings 병합 · 토큰 탐지=우리 컨벤션(hex/rgb/임의값, var() 강제 아님) · 4 아티팩트 티어ⓐ + 경고-onlyⓐ + 승격 가이드 · 하네스 `git add -f` 선별 추적.

**Commits:** 3 Phase (각 Phase 종료 시 commit + push origin main — 프로젝트 워크플로우).
- **Phase A**: 아티팩트 룰 + CLAUDE.md 병합 + DESIGN.md (문서 foundation)
- **Phase B**: hooks 4 + settings.json 병합 + install.sh (enforcement infra, force-add)
- **Phase C**: agents 4 (workflow, force-add)

**Co-author trailer (모든 commit):** `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure

### Create
| 경로 | 책임 | 추적 |
|---|---|---|
| `design-system/rules/component-artifacts.md` | 4 아티팩트 티어 + 승격 가이드 | normal |
| `docs/DESIGN.md` | 브랜드/색·스페이싱 맥락/조합·금지/Figma 네이밍 상위 내러티브 | normal |
| `.claude/CLAUDE.md` | 7단계 프로세스 + 승인 게이트 + 금지 테이블 | `git add -f` |
| `.claude/agents/figma-implementer.md` | Figma URL→5단계 구현, 도구 스캔, 2회 재시도 | `git add -f` |
| `.claude/agents/token-checker.md` | Figma↔코드 토큰 비교, 승인 시 수정 | `git add -f` |
| `.claude/agents/design-qa.md` | 8항목 검사(검사만) | `git add -f` |
| `.claude/agents/design-reviewer.md` | 코드 하드코딩 스캔(Figma 미사용) | `git add -f` |
| `.claude/hooks/check-design-tokens.mjs` | .tsx 하드코딩 경고 | `git add -f` |
| `.claude/hooks/check-catalog-exists.mjs` | 신규 ui 컴포넌트 아티팩트 누락 경고 | `git add -f` |
| `.claude/hooks/protect-files.mjs` | .env 수정 차단 | `git add -f` |
| `.claude/hooks/notify.mjs` | OS 데스크탑 알림 | `git add -f` |
| `install.sh` | 멱등 셋업/스모크 테스트 | normal |

### Modify (merge)
| 경로 | 변경 |
|---|---|
| `CLAUDE.md` (루트) | 3 서브섹션 추가 (컴포넌트 구조 cross-ref / 너비 룰 / 금지 테이블) |
| `.claude/settings.json` | `permissions.deny`(.env) + `hooks` 추가, 기존 `enabledPlugins` 보존 (`git add -f`) |

> `.claude/settings.local.json` 은 **건드리지 않음**.

---

## Phase A — 문서 Foundation

### Task 1: `component-artifacts.md` (티어 + 승격 가이드)

**Files:**
- Create: `design-system/rules/component-artifacts.md`

- [ ] **Step 1: 파일 생성 (아래 전체 내용)**

````markdown
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

- 누락 = **경고**, 차단 아님. `check-catalog-exists.mjs` 는 **git 미추적(신규) ui 파일**에만 경고.
- 기존 미커버(primitive 19 / 도메인 31)는 위반 아님.

## Cross-refs

- 토큰 룰: `rules/color.md`, CLAUDE.md 디자인 원칙 3.
- 패턴(도메인 조합): `patterns/*.md`.
- 카탈로그 커버리지 로드맵: `PROGRESS.md` P2-4.
````

- [ ] **Step 2: 검증**

Run: `test -f design-system/rules/component-artifacts.md && grep -c "Tier" design-system/rules/component-artifacts.md`
Expected: 파일 존재 + "Tier" 4회 이상.

---

### Task 2: 루트 `CLAUDE.md` 병합 (3 서브섹션)

**Files:**
- Modify: `CLAUDE.md` (루트)

- [ ] **Step 1: "컴포넌트 컨벤션" 섹션 안 "### 디렉토리" 직전에 컴포넌트 구조 cross-ref 추가**

`CLAUDE.md` 의 `## 컴포넌트 컨벤션` 헤딩 바로 다음 줄에 삽입:

```markdown
### 컴포넌트 아티팩트 (티어)

1 컴포넌트 = 최대 4 아티팩트(구현 `.tsx` / 스펙 `components/*.md` / 카탈로그 page / nav 등록). **모든 컴포넌트에 4개 강제 안 함** — 티어별 요구 + 재사용 시 승격 규칙은 **`design-system/rules/component-artifacts.md`** 단일 출처. 신규 재사용 primitive 만 4개 권장(경고 수준).
```

- [ ] **Step 2: "디자인 원칙 (변경 금지)" 번호 목록 끝(원칙 10 다음)에 너비 룰 + 금지 테이블 추가**

`10. shadcn 기본값 ≠ Figma 스펙이면 ...` 줄 다음, `상세 사례 + WRONG/CORRECT 예제:` 줄 **앞에** 삽입:

```markdown
11. **컴포넌트 너비는 고정 px 금지** — `w-[320px]` 같은 고정폭 대신 `w-full` + 부모의 padding/max-width 로 제어. 예외: Figma 가 명시적으로 `fixed` width 인 경우만 (`max-w-*` 우선). 상세 매핑은 "Figma fill container → 코드" 표.
12. **Figma에 없는 variant/속성 임의 생성 금지** — variant·size·색·상태는 Figma 컴포넌트 set / 인스턴스에 존재하는 것만. "있으면 편할 것 같아서" 추가 금지.

### 금지사항 (요약 테이블)

| 금지 | 대신 | 출처 |
|---|---|---|
| hex/rgb 하드코딩 (`#fff`, `rgb(...)`) | 시맨틱 Tailwind 클래스 (`bg-primary`) | 원칙 3 / `rules/color.md` |
| 임의값 (`text-[14px]`, `bg-[#...]`, `rounded-[Npx]`) | Tailwind 스케일 (`text-sm`, `rounded-lg`) | 원칙 3 |
| `var(--color-*)` 직접 사용 | 시맨틱 클래스 | `rules/color.md` |
| 고정 px 너비 | `w-full` + 부모 제어 | 원칙 11 |
| Figma 없는 variant 임의 생성 | Figma 존재분만 | 원칙 12 |
| `dark:` prefix | CSS 변수 자동 적용 | 원칙 4 |
| `.env*` 수정 | 수동 처리 (hook 차단됨) | 하네스 |
```

- [ ] **Step 3: 검증**

Run: `grep -c "금지사항 (요약 테이블)\|컴포넌트 아티팩트 (티어)\|고정 px 금지" CLAUDE.md`
Expected: 3.

---

### Task 3: `docs/DESIGN.md` 작성

**Files:**
- Create: `docs/DESIGN.md`

- [ ] **Step 1: 파일 생성 (아래 전체 내용)**

````markdown
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
````

- [ ] **Step 2: 검증**

Run: `test -f docs/DESIGN.md && grep -c "^## " docs/DESIGN.md`
Expected: 파일 존재 + 섹션 6개 이상.

---

### Task 4: Phase A 커밋

- [ ] **Step 1: 빌드 영향 없음 확인 (문서만)**

Run: `npx tsc --noEmit`
Expected: 에러 없음 (문서 변경이라 무영향).

- [ ] **Step 2: 커밋 + 푸시**

```bash
git add design-system/rules/component-artifacts.md docs/DESIGN.md CLAUDE.md
git commit -m "$(cat <<'EOF'
Harness A: artifact tier model + CLAUDE.md merge + DESIGN.md

- rules/component-artifacts.md: 4-artifact tiers + promotion guide (warn-only)
- CLAUDE.md: +컴포넌트 아티팩트 cross-ref, +너비 룰(11)/임의 variant 금지(12), +금지 테이블
- docs/DESIGN.md: brand/color/spacing 맥락 + 조합·금지 + Figma 네이밍 (rules/ cross-ref)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin main
```

Expected: 푸시 성공.

---

## Phase B — Hooks + settings + install.sh

> 모든 hook 은 순수 Node ESM, 의존성 0. stdin 으로 hook payload(JSON) 수신. **파일 내용은 디스크에서 직접 읽음** (`tool_input` content 필드 버전 편차 회피). 차단=`exit 2`+stderr, 경고=`exit 0`+stderr(비차단).

### Task 5: `protect-files.mjs` (.env 수정 차단)

**Files:**
- Create: `.claude/hooks/protect-files.mjs`

- [ ] **Step 1: 파일 생성**

```js
#!/usr/bin/env node
// PreToolUse (Write|Edit): block edits to .env* files (secrets present).
import { readFileSync } from "node:fs";
import { basename } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0); // unparseable → don't interfere
}

const fp = payload?.tool_input?.file_path ?? "";
const name = basename(fp);

if (/^\.env(\..+)?$/.test(name)) {
  console.error(
    `🔒 protect-files: "${name}" 수정은 차단됩니다 (시크릿 포함). ` +
      `필요하면 사용자가 직접 편집하세요. (.claude/hooks/protect-files.mjs)`
  );
  process.exit(2); // block
}

process.exit(0);
```

- [ ] **Step 2: 차단 동작 스모크 테스트**

Run:
```bash
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/.env.local"}}' | node .claude/hooks/protect-files.mjs; echo "exit: $?"
```
Expected: stderr 에 `🔒 protect-files` 메시지 + `exit: 2`.

- [ ] **Step 3: 통과 동작 스모크 테스트**

Run:
```bash
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/src/a.tsx"}}' | node .claude/hooks/protect-files.mjs; echo "exit: $?"
```
Expected: 출력 없음 + `exit: 0`.

---

### Task 6: `check-design-tokens.mjs` (.tsx 하드코딩 경고)

**Files:**
- Create: `.claude/hooks/check-design-tokens.mjs`

> `.css` 는 스캔 제외 (globals.css / tokens.generated.css 는 색 정의의 정당한 위치 — false positive 회피). `.tsx` 컴포넌트 코드만.

- [ ] **Step 1: 파일 생성**

```js
#!/usr/bin/env node
// PostToolUse (Write|Edit): warn on hardcoded colors / arbitrary values in .tsx (non-blocking).
import { readFileSync, existsSync } from "node:fs";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const fp = payload?.tool_input?.file_path ?? "";
if (!/\.tsx$/.test(fp) || !existsSync(fp)) process.exit(0);

const src = readFileSync(fp, "utf8");
const lines = src.split("\n");

// Intended exceptions (CLAUDE.md): Avatar mock background.
const ALLOW = [/bg-fuchsia-600/];

const PATTERNS = [
  { re: /#[0-9a-fA-F]{3,8}\b/, msg: "hex color literal" },
  { re: /\brgba?\(/, msg: "rgb()/rgba() literal" },
  {
    re: /\b(?:text|bg|border|fill|stroke|ring|from|to|via)-\[#?[0-9a-fA-F]/,
    msg: "arbitrary color value (use semantic token)",
  },
  {
    re: /\b(?:text|p|px|py|pt|pb|pl|pr|m|mx|my|gap|w|h|rounded|leading)-\[\d/,
    msg: "arbitrary size value (use Tailwind scale)",
  },
  { re: /var\(--color-/, msg: "var(--color-*) 직접 사용 (시맨틱 클래스 사용)" },
];

const findings = [];
lines.forEach((line, i) => {
  if (ALLOW.some((a) => a.test(line))) return;
  for (const { re, msg } of PATTERNS) {
    if (re.test(line)) {
      findings.push(`  L${i + 1}: ${msg} → ${line.trim().slice(0, 80)}`);
      break;
    }
  }
});

if (findings.length) {
  console.error(
    `⚠️ check-design-tokens (비차단): ${fp}\n${findings.join("\n")}\n` +
      `  → 시맨틱 Tailwind 클래스 사용 (CLAUDE.md 원칙 3 / rules/color.md).`
  );
}
process.exit(0); // warn-only
```

- [ ] **Step 2: 위반 탐지 스모크 테스트**

Run:
```bash
TMP=$(mktemp /tmp/hooktest-XXXX.tsx); printf 'const a = <div className="bg-[#ff0000] text-[14px]" style={{color:"#fff"}} />;\n' > "$TMP"
echo "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"$TMP\"}}" | node .claude/hooks/check-design-tokens.mjs; echo "exit: $?"; rm -f "$TMP"
```
Expected: stderr 에 `⚠️ check-design-tokens` + hex/arbitrary 항목 + `exit: 0`.

- [ ] **Step 3: 클린 파일 스모크 테스트**

Run:
```bash
TMP=$(mktemp /tmp/hooktest-XXXX.tsx); printf 'const a = <div className="bg-primary text-sm rounded-lg" />;\n' > "$TMP"
echo "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"$TMP\"}}" | node .claude/hooks/check-design-tokens.mjs; echo "exit: $?"; rm -f "$TMP"
```
Expected: 출력 없음 + `exit: 0`.

---

### Task 7: `check-catalog-exists.mjs` (신규 ui 컴포넌트 아티팩트 경고)

**Files:**
- Create: `.claude/hooks/check-catalog-exists.mjs`

> "신규" 판별 = `git ls-files --error-unmatch` 실패(미추적). 기존 파일 편집엔 침묵.

- [ ] **Step 1: 파일 생성**

```js
#!/usr/bin/env node
// PostToolUse (Write): for a NEW src/components/ui/<name>.tsx, warn if spec/catalog/nav missing.
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { execSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const fp = payload?.tool_input?.file_path ?? "";
const m = fp.match(/src\/components\/ui\/([a-z0-9-]+)\.tsx$/);
if (!m || !existsSync(fp)) process.exit(0);

// Only warn for newly-created (git-untracked) files.
function isTracked(path) {
  try {
    execSync(`git ls-files --error-unmatch "${path}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
if (isTracked(fp)) process.exit(0);

const name = m[1];
const src = readFileSync(fp, "utf8");
// Tier 3 heuristic: has cva variants → reusable, demo-worthy.
const isTier3 = /\bcva\(/.test(src);
if (!isTier3) process.exit(0); // Tier 1/2 — no catalog requirement

const specPath = `design-system/components/${name}.md`;
const catalogPath = `src/app/(design-system)/design-system/primitives/${name}/page.tsx`;
const navPath = "src/lib/design-system-nav.ts";

const missing = [];
if (!existsSync(specPath)) missing.push(`② 스펙: ${specPath}`);
if (!existsSync(catalogPath)) missing.push(`③ 카탈로그: ${catalogPath}`);
const navHasIt = existsSync(navPath) && readFileSync(navPath, "utf8").includes(`/primitives/${name}`);
if (!navHasIt) missing.push(`④ nav 등록: ${navPath}`);

if (missing.length) {
  console.error(
    `⚠️ check-catalog-exists (비차단): 신규 Tier-3 후보 "${basename(fp)}" 의 아티팩트 누락:\n` +
      missing.map((x) => `  - ${x}`).join("\n") +
      `\n  → 재사용 primitive 면 추가 (rules/component-artifacts.md 승격 절차). 1회성이면 무시.`
  );
}
process.exit(0); // warn-only
```

- [ ] **Step 2: 스모크 테스트 (미추적 + cva → 경고)**

Run:
```bash
mkdir -p src/components/ui
TMP="src/components/ui/__hooktest.tsx"; printf 'import {cva} from "x"; const v = cva("base");\n' > "$TMP"
echo "{\"tool_name\":\"Write\",\"tool_input\":{\"file_path\":\"$(pwd)/$TMP\"}}" | node .claude/hooks/check-catalog-exists.mjs; echo "exit: $?"; rm -f "$TMP"
```
Expected: stderr 에 `⚠️ check-catalog-exists` + ②③④ 누락 + `exit: 0`.
(주의: `__hooktest.tsx` 는 미추적이라 경고 대상. 테스트 후 삭제.)

- [ ] **Step 3: 스모크 테스트 (기존 추적 파일 → 침묵)**

Run:
```bash
echo "{\"tool_name\":\"Edit\",\"tool_input\":{\"file_path\":\"$(pwd)/src/components/ui/button.tsx\"}}" | node .claude/hooks/check-catalog-exists.mjs; echo "exit: $?"
```
Expected: 출력 없음 + `exit: 0` (button.tsx 는 git 추적됨).

---

### Task 8: `notify.mjs` (OS 데스크탑 알림)

**Files:**
- Create: `.claude/hooks/notify.mjs`

- [ ] **Step 1: 파일 생성**

```js
#!/usr/bin/env node
// OS desktop notification. Message via argv (preferred) or stdin JSON {message}.
import { execFileSync } from "node:child_process";
import { platform } from "node:os";
import { readFileSync } from "node:fs";

let msg = process.argv.slice(2).join(" ").trim();
if (!msg) {
  try {
    const p = JSON.parse(readFileSync(0, "utf8") || "{}");
    msg = p.message || p.reason || "Claude Code event";
  } catch {
    msg = "Claude Code event";
  }
}

try {
  const os = platform();
  if (os === "darwin") {
    execFileSync("osascript", [
      "-e",
      `display notification ${JSON.stringify(msg)} with title "Claude Code"`,
    ]);
  } else if (os === "linux") {
    execFileSync("notify-send", ["Claude Code", msg]);
  } else if (os === "win32") {
    execFileSync("powershell", [
      "-NoProfile",
      "-Command",
      `[void][System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show(${JSON.stringify(msg)},'Claude Code')`,
    ]);
  }
} catch {
  // best-effort: notification failure must never break the flow
}
process.exit(0);
```

- [ ] **Step 2: 스모크 테스트**

Run: `node .claude/hooks/notify.mjs "harness test"; echo "exit: $?"`
Expected: `exit: 0` (macOS 면 데스크탑 알림 표시; 실패해도 0).

---

### Task 9: `.claude/settings.json` 병합

**Files:**
- Modify: `.claude/settings.json`

- [ ] **Step 1: 현재 내용 확인 (보존 대상)**

Run: `cat .claude/settings.json`
Expected: `{ "enabledPlugins": { "figma@claude-plugins-official": true } }`.

- [ ] **Step 2: 아래 내용으로 교체 (enabledPlugins 보존 + deny + hooks)**

```json
{
  "enabledPlugins": {
    "figma@claude-plugins-official": true
  },
  "permissions": {
    "deny": [
      "Read(.env)",
      "Read(.env.*)",
      "Read(//**/.env)",
      "Read(//**/.env.*)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/protect-files.mjs\""
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/check-design-tokens.mjs\""
          },
          {
            "type": "command",
            "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/check-catalog-exists.mjs\""
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 3: JSON 유효성 + plugin 보존 확인**

Run: `node -e "const j=require('./.claude/settings.json'); if(!j.enabledPlugins['figma@claude-plugins-official']) throw new Error('plugin lost'); console.log('OK', Object.keys(j))"`
Expected: `OK [ 'enabledPlugins', 'permissions', 'hooks' ]`.

- [ ] **Step 4: settings.local.json 무변경 확인**

Run: `git status --porcelain .claude/settings.local.json`
Expected: 출력 없음 (변경 안 됨).

---

### Task 10: `install.sh` 작성

**Files:**
- Create: `install.sh`

- [ ] **Step 1: 파일 생성**

```bash
#!/usr/bin/env bash
# Design System Harness installer — idempotent. Verifies hooks & settings.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
HOOKS=".claude/hooks"
PASS=0; FAIL=0
ok(){ echo "  ✓ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ✗ $1"; FAIL=$((FAIL+1)); }

echo "== Design System Harness install =="

# 1) Node version (>=18)
if command -v node >/dev/null 2>&1; then
  MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
  if [ "$MAJOR" -ge 18 ]; then ok "node v$(node -v) (>=18)"; else bad "node too old: $(node -v)"; fi
else
  bad "node not found"; fi

# 2) Hook files present
for h in protect-files check-design-tokens check-catalog-exists notify; do
  if [ -f "$HOOKS/$h.mjs" ]; then ok "$h.mjs present"; else bad "$h.mjs MISSING"; fi
done

# 3) Hook smoke tests (must not crash)
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/.env.local"}}' | node "$HOOKS/protect-files.mjs" >/dev/null 2>&1 && bad "protect-files should block .env (exit2)" || ok "protect-files blocks .env"
echo '{"tool_name":"Edit","tool_input":{"file_path":"/x/a.txt"}}' | node "$HOOKS/protect-files.mjs" >/dev/null 2>&1 && ok "protect-files allows non-.env" || bad "protect-files wrongly blocked"

# 4) settings.json valid + plugin preserved
if node -e "const j=require('./.claude/settings.json'); if(!j.enabledPlugins||!j.hooks) process.exit(1)" 2>/dev/null; then
  ok "settings.json valid (plugin + hooks)"; else bad "settings.json invalid or missing keys"; fi

# 5) Tracking reminder (.claude is gitignored → force-add)
echo ""
echo "== git tracking =="
echo "  .claude/ is gitignored. Harness files are tracked via: git add -f"
echo "  (settings.local.json intentionally NOT tracked.)"

echo ""
echo "== result: $PASS passed, $FAIL failed =="
[ "$FAIL" -eq 0 ] || { echo "Some checks failed — see above."; exit 1; }
echo "Harness OK."
```

- [ ] **Step 2: 실행 권한 + 실행**

Run: `chmod +x install.sh && ./install.sh; echo "exit: $?"`
Expected: 모든 체크 `✓`, `Harness OK.`, `exit: 0`.

---

### Task 11: Phase B 커밋 (force-add 하네스)

- [ ] **Step 1: 변경 확인**

Run: `git status --porcelain; echo "---"; ls .claude/hooks`
Expected: `install.sh` untracked, `.claude/*` 는 gitignore 로 status 에 안 보일 수 있음. hooks 4개 파일 존재.

- [ ] **Step 2: 커밋 + 푸시 (force-add)**

```bash
git add -f .claude/settings.json .claude/hooks/protect-files.mjs .claude/hooks/check-design-tokens.mjs .claude/hooks/check-catalog-exists.mjs .claude/hooks/notify.mjs
git add install.sh
git commit -m "$(cat <<'EOF'
Harness B: hooks + settings merge + install.sh

- hooks/protect-files.mjs: block .env* edits (exit2)
- hooks/check-design-tokens.mjs: warn hex/rgb/arbitrary in .tsx (non-blocking)
- hooks/check-catalog-exists.mjs: warn missing artifacts on NEW Tier-3 ui (git-untracked + cva)
- hooks/notify.mjs: cross-platform desktop notification
- settings.json: +permissions.deny(.env) +hooks(Pre/PostToolUse), enabledPlugins preserved
- install.sh: idempotent smoke-test installer
- .claude/ is gitignored → harness files force-added; settings.local.json untouched

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin main
```

Expected: 푸시 성공.

---

## Phase C — Agents

> 각 agent = `.claude/agents/<name>.md`, frontmatter(`name`/`description`/`tools`) + 본문. Claude Code 가 subagent 로 인식.

### Task 12: `figma-implementer.md`

**Files:**
- Create: `.claude/agents/figma-implementer.md`

- [ ] **Step 1: 파일 생성**

````markdown
---
name: figma-implementer
description: Figma URL/node 를 받아 shadcn-on-Base-UI + Tailwind 시맨틱 토큰 컴포넌트로 구현. Figma MCP 읽기/쓰기 도구 사용. 사용 시점 — "이 Figma 구현해줘", Figma 링크 + 컴포넌트/페이지 구현 요청.
tools: Read, Write, Edit, Bash, Grep, Glob, ToolSearch, AskUserQuestion
---

# figma-implementer

Figma 디자인을 코드로 변환한다. **5단계** 를 순서대로 따른다.

## 0. 도구 스캔 (시작 시 필수)

Figma MCP 는 deferred 일 수 있으니 시작 시 `ToolSearch` 로 가용 도구를 스캔하고 사용 목록을 정한다. 추측 금지 — 실제 가용분만.

- **읽기**: `mcp__figma-console__figma_get_*` (get_file_data / get_variables / get_component_for_development / get_component_image / get_selection / take_screenshot / get_status), `mcp__claude_ai_Figma__get_design_context` / `get_screenshot` / `get_variable_defs`.
- **쓰기**: `mcp__figma-console__figma_set_*` (set_text / set_fills / set_strokes), `figma_create_child` / `instantiate_component` / `set_instance_properties` 등. (figma-console Desktop Bridge 가 쓰기 지원)

스캔 명령 예: `ToolSearch("figma get component variables")`, `ToolSearch("figma set text fills")`.

## 1. Clarify

- 대상 node-id / 파일 / 어떤 화면인지 확인. 모호하면 `AskUserQuestion`.
- 신규 컴포넌트인지, 기존 수정인지. 배치 위치(`ui/` vs `api-portal/`).

## 2. Context Gather

- Figma: `figma_get_status` 로 연결·파일 확인 → `get_component_for_development` / `get_variables` 로 노드·토큰 인스펙트. **summary 먼저, deep 는 최후** (토큰 절약).
- `visible:false` 노드 제외. 컨테이너 children 전체 enumerate (INSTANCE/RECTANGLE 포함 — `rules/figma-reading.md`).
- 코드: `design-system/components/<name>.md`, `rules/shadcn.md`, 기존 유사 컴포넌트 Read.

## 3. Plan

- variant/size 를 Figma `componentProperties` 와 1:1 매핑 (임의 생성 금지 — 원칙 12).
- 토큰: 시맨틱 Tailwind 클래스만 (hex/rgb/임의값/`var(--color-*)` 금지 — 원칙 3).
- 너비: `w-full` + 부모 제어 (원칙 11).
- 사용자에게 계획 제시 → **승인 후 코드** (.claude/CLAUDE.md 게이트).

## 4. Generate

- shadcn-on-Base-UI 변환 규약 (`rules/shadcn.md`). 기본값 ≠ Figma 면 `ui/*.tsx` 직접 수정 (className 우회 금지 — 원칙 10).
- 신규 재사용 primitive 면 아티팩트 티어 따름 (`rules/component-artifacts.md`).

## 5. Evaluate

- `npx tsc --noEmit` + `npx next build`.
- 시각 대조: `figma_get_component_image` / `get_screenshot` 로 Figma 원본 vs 구현 비교 (원본 텍스트 유지, 자의적 변경 금지).
- 토큰 정합: hardcode 없는지 self-check.

## 실패 처리

- 단계 실패(빌드/타입/도구 오류) 시 **최대 2회 재시도**. 그래도 실패하면 **중단하고 사용자에게 보고** (무엇이 왜 실패했는지 + 부분 산출물).
````

- [ ] **Step 2: 검증**

Run: `grep -c "^## \|name: figma-implementer\|2회 재시도" .claude/agents/figma-implementer.md`
Expected: 5단계 헤딩 + frontmatter + 재시도 규약 포함 (≥7).

---

### Task 13: `token-checker.md`

**Files:**
- Create: `.claude/agents/token-checker.md`

- [ ] **Step 1: 파일 생성**

````markdown
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
````

- [ ] **Step 2: 검증**

Run: `grep -c "sync-tokens\|승인" .claude/agents/token-checker.md`
Expected: ≥3.

---

### Task 14: `design-qa.md`

**Files:**
- Create: `.claude/agents/design-qa.md`

- [ ] **Step 1: 파일 생성**

````markdown
---
name: design-qa
description: 빌드/타입/토큰/lint/하드코딩/아티팩트/a11y/Figma 충실도 8항목을 자동 검사. 검사만 하고 수정하지 않음. 사용 시점 — 출시 전 점검, "QA 돌려줘".
tools: Read, Bash, Grep, Glob
---

# design-qa

8항목을 순서대로 검사하고 **PASS/FAIL 표로 보고**. **수정하지 않는다** (발견만).

| # | 항목 | 명령/방법 | PASS 기준 |
|---|---|---|---|
| 1 | Build | `npx next build` | 에러 0 |
| 2 | Types | `npx tsc --noEmit` | 에러 0 |
| 3 | Token sync | `npm run sync-tokens:check` | in sync |
| 4 | Lint | `npx eslint` | 에러 0 |
| 5 | 하드코딩 | `grep -rnE "#[0-9a-fA-F]{3,6}\b|rgba?\(|-\[#|-\[[0-9]" src/components src/app --include=*.tsx` (allowlist: bg-fuchsia-600) | 위반 0 |
| 6 | 아티팩트 | 신규 Tier-3 ui 컴포넌트에 spec/catalog/nav 존재 (`rules/component-artifacts.md`) | 누락 0 (경고성) |
| 7 | a11y | `rules/a11y.md` 출시 전 체크리스트 항목 수동 대조 | 체크리스트 충족 |
| 8 | Figma 충실도 | (figma-implementer 산출물 한정) 원본 텍스트/variant 일치 | 일치 |

## 출력 형식

```
design-qa report
[1] Build    : PASS
[2] Types    : FAIL — src/x.tsx:12 ...
...
요약: 6 PASS / 2 FAIL
```

검사 전용. 수정이 필요하면 사용자/다른 agent 에게 인계.
````

- [ ] **Step 2: 검증**

Run: `grep -c "PASS\|FAIL\|검사만\|수정하지 않" .claude/agents/design-qa.md`
Expected: ≥3.

---

### Task 15: `design-reviewer.md`

**Files:**
- Create: `.claude/agents/design-reviewer.md`

- [ ] **Step 1: 파일 생성**

````markdown
---
name: design-reviewer
description: 코드 전체를 스캔해 하드코딩/임의값/고정 px/dark: 사용/임의 variant 를 탐지하고 보고. Figma MCP 미사용 — 코드만 분석. 사용 시점 — "디자인 룰 위반 스캔", 대규모 리뷰.
tools: Read, Bash, Grep, Glob
---

# design-reviewer

코드만 정적 분석한다. **Figma MCP 를 호출하지 않는다.**

## 스캔 항목

| 항목 | 탐지 |
|---|---|
| hex/rgb 하드코딩 | `#[0-9a-fA-F]{3,6}`, `rgba?\(` (단, `tokens.generated.css`/`globals.css` 제외 — 토큰 정의처) |
| 임의 색 | `-\[#`, `(text\|bg\|border\|ring)-\[` |
| 임의 사이즈 | `(text\|p\|m\|gap\|w\|h\|rounded)-\[\d` |
| 고정 px 너비 | `w-\[\d+px\]` (원칙 11) |
| `dark:` prefix | `\bdark:` (원칙 4) |
| `var(--color-*)` 직접 사용 | `var\(--color-` |

allowlist: `bg-fuchsia-600` (Avatar mock).

## 절차

1. `grep -rnE` 로 `src/components` + `src/app` (`.tsx`) 스캔.
2. 항목별 위반을 `파일:라인 → 코드` 로 집계.
3. **보고만** — 심각도(원칙 위반 vs 권고)와 함께. 수정은 사용자 승인 후 별도.

## 출력 형식

```
design-reviewer report
하드코딩 색 (3건):
  src/components/x.tsx:42 → style={{color:"#fff"}}
...
요약: 총 N건 (원칙위반 M / 권고 K)
```
````

- [ ] **Step 2: 검증**

Run: `grep -c "Figma MCP 를 호출하지 않\|보고만\|dark:" .claude/agents/design-reviewer.md`
Expected: ≥2.

---

### Task 16: Phase C 커밋 + 최종 검증

- [ ] **Step 1: agents force-add 커밋 + 푸시**

```bash
git add -f .claude/agents/figma-implementer.md .claude/agents/token-checker.md .claude/agents/design-qa.md .claude/agents/design-reviewer.md
git commit -m "$(cat <<'EOF'
Harness C: agents (figma-implementer / token-checker / design-qa / design-reviewer)

- figma-implementer: Figma URL → 5단계(Clarify→Gather→Plan→Generate→Evaluate), 도구 스캔, 2회 재시도
- token-checker: Figma↔코드 토큰 비교, 승인 시 sync-tokens 경유 수정
- design-qa: 8항목 검사 (검사만)
- design-reviewer: 코드 하드코딩 스캔 (Figma MCP 미사용)
- .claude/ gitignore → force-added

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
git push origin main
```

Expected: 푸시 성공.

- [ ] **Step 2: 전체 하네스 최종 스모크**

Run: `./install.sh && ls .claude/agents && git ls-files .claude | wc -l`
Expected: `Harness OK.` + agents 4개 + `git ls-files .claude` 가 9 (settings.json + hooks 4 + agents 4) 이상.

- [ ] **Step 3: 빌드 무영향 최종 확인**

Run: `npx tsc --noEmit && npx next build 2>&1 | tail -3`
Expected: 에러 없음 (하네스는 런타임 코드 무영향).

---

## Self-Review (spec 대조)

- **§1 아티팩트 티어/승격** → Task 1 (`component-artifacts.md`) + Task 2 (CLAUDE.md cross-ref). ✅
- **§2 CLAUDE.md 병합** → Task 2 (너비 룰/임의 variant/금지 테이블). ✅
- **§3 .claude/CLAUDE.md (7단계+승인+금지)** → **누락 보완**: Task 2.5 로 추가 (아래). ⚠️ 아래 Task 추가됨.
- **§4 agents 4종** → Task 12–15. ✅
- **§5 hooks 4종** → Task 5–8. ✅
- **§6 settings 병합** → Task 9. ✅
- **§7 DESIGN.md** → Task 3. ✅
- **§8 install.sh** → Task 10. ✅
- 토큰 탐지 우리 컨벤션 / var() 강제 아님 → Task 6 (var() 도 위반으로 탐지). ✅
- 기존 50개 미위반 → Task 7 (git 미추적 + cva 한정). ✅

> **보완 Task (누락 수정)**: spec §3 `.claude/CLAUDE.md` 가 위 Task 에 빠져 있었음. 아래 Task 2.5 로 삽입.

---

### Task 2.5: `.claude/CLAUDE.md` (7단계 프로세스 + 승인 게이트 + 금지) — Phase A 에 포함

**Files:**
- Create: `.claude/CLAUDE.md`

> Phase A 커밋(Task 4)에 함께 force-add 한다 (`.claude/` gitignore).

- [ ] **Step 1: 파일 생성**

````markdown
# .claude/CLAUDE.md — 작업 프로세스 (하네스)

> 루트 `CLAUDE.md`(프로젝트 룰) + `design-system/rules|patterns`(디자인 룰)를 보완하는 **세션 작업 규율**. 충돌 시 우선순위: 사용자 지시 > 루트 CLAUDE.md > 본 문서.

## 7단계 작업 프로세스

| 단계 | 내용 |
|---|---|
| 1. 이해 | 요청의 목적·성공조건 파악. 모호하면 질문. |
| 2. 분석 | 영향 범위·기존 자산(rules/components/patterns) 식별. |
| 3. 탐색 | 관련 파일·Figma 노드·토큰 인스펙트 (summary 먼저). |
| 4. 계획 | 변경 파일·단계 제시. **여기서 멈추고 승인 대기.** |
| 5. 실행 | 승인 후에만 코드 작성. 시맨틱 토큰·티어 규칙 준수. |
| 6. 검증 | `tsc --noEmit` + `next build` + 토큰/시각 대조. |
| 7. 완료 | PROGRESS.md 갱신 + commit (Phase 단위) + 보고. |

## 코드 작성 전 승인 필수

- 4단계(계획) 후 **사용자 승인 없이 5단계(실행) 진입 금지**. (탐색·읽기는 승인 불요)
- 질문에는 답만 — 묻지 않은 구현 금지.

## 금지사항 테이블

| 금지 | 사유 |
|---|---|
| 토큰 하드코딩 (hex/rgb/임의값/`var(--color-*)`) | 원칙 3 / hook 경고 |
| Figma 없는 variant·속성 임의 생성 | 원칙 12 |
| 고정 px 너비 | 원칙 11 |
| `.env*` 수정 | hook 차단 (시크릿) |
| Figma `visible:false` 노드 구현 | 원칙 8 |
| `tokens.generated.css` 직접 수정 | sync-tokens 경유만 |
| 승인 없이 실행 | 4단계 게이트 |

## Agents

- Figma 구현 → `figma-implementer` · 토큰 정합 → `token-checker` · 출시 점검 → `design-qa` · 코드 룰 스캔 → `design-reviewer`.
````

- [ ] **Step 2: Task 4 커밋에 포함**

Task 4 Step 2 의 `git add` 라인을 다음으로 교체:
```bash
git add design-system/rules/component-artifacts.md docs/DESIGN.md CLAUDE.md
git add -f .claude/CLAUDE.md
```

- [ ] **Step 3: 검증**

Run: `grep -c "7단계\|승인 필수\|금지사항" .claude/CLAUDE.md`
Expected: ≥3.

---

## Done Definition

- [ ] `component-artifacts.md` 티어+승격 / CLAUDE.md 병합(원칙 11·12·금지표) / DESIGN.md (Phase A).
- [ ] `.claude/CLAUDE.md` 7단계+승인+금지 (Phase A, force-add).
- [ ] hooks 4종 스모크 통과 / settings.json 병합(plugin 보존+deny+hooks) / install.sh 멱등 (Phase B, force-add).
- [ ] agents 4종 (Phase C, force-add).
- [ ] `npx tsc --noEmit` + `npx next build` 무영향 통과.
- [ ] 3 commit (A/B/C) main 푸시. `.claude/settings.local.json` 무변경.
- [ ] 토큰 탐지=우리 컨벤션, 기존 50개 미위반.

## Implementation Notes

- **Hook payload 필드**: `tool_input.file_path` 만 신뢰, 내용은 디스크 read (PostToolUse 는 이미 기록됨). 차단=`exit 2`+stderr, 경고=`exit 0`+stderr.
- **경고 가시성**: 일부 Claude Code 버전에서 PostToolUse 의 `exit 0`+stderr 노출이 약하면, hook 의 `process.exit(0)` 를 `process.exit(1)` 로 바꿔 비차단 경고로 승격 (단 2 는 금지 — 차단됨). Phase B 실행 중 실제 노출 확인 후 결정.
- **`.claude/` gitignore**: 하네스 파일은 `git add -f` 로만 추적. `settings.local.json` 은 절대 add 하지 않음 (로컬 권한).
- **점진 마이그레이션**: 기존 미커버 컴포넌트는 backfill 안 함 (P2-4). hook 은 신규만 경고.
