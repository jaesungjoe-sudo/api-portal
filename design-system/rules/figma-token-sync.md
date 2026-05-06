# Figma → tokens/colors.json Sync Workflow

> 디자이너가 Figma Library 의 Variables 를 수정했을 때, 그 값을 `design-system/tokens/colors.json` 의 `semantic` 섹션에 반영하는 워크플로우.
> **Claude Code 가 실행하는 semi-automated 절차**. REST API (Enterprise 전용) 아닌 Plugin API (MCP) 기반.

---

## 전체 흐름

```
Figma Library (Variables)
      │
      │  figma.teamLibrary / figma.variables (MCP)
      ▼
tokens/colors.json  (semantic 섹션 갱신)
      │
      │  npm run sync-tokens
      ▼
src/styles/tokens.generated.css
      │
      │  @import
      ▼
globals.css → 브라우저 렌더
```

각 화살표마다 **사람이 확인 후 통과**. 무인 cron 아님.

---

## Trigger

- 디자이너로부터 "토큰 바뀌었어, 반영해줘" 요청 받았을 때
- 새 페이지 구현 시작 전 최신 상태 확인
- `/sync-figma-tokens` 슬래시 커맨드 (Claude Code 세션에서)

---

## 전제 조건

1. **Figma Desktop 실행 중** + 라이브러리 파일(`SmO9fsWrxriuCofc7T3b1S`) 에 access 가능
2. **Desktop Bridge 플러그인 Run 중** (Plugins → Development → Figma Desktop Bridge)
3. MCP 연결 OK (`figma_get_status` 로 확인)

## 범위 (권위 경계 명확화)

**Figma Variables 가 권위**:
- `mode` 컬렉션의 모든 COLOR 타입 semantic 토큰
- 매핑: Figma 에 값이 있으면 그 값을 사용. drift 감지 시 Figma 우선

**Figma Variables 권위 아님 (수동 유지)**:
- `destructive-foreground` — Figma 에 없지만 shadcn 호환성 때문에 유지. sync 대상 제외.
- `overlay` — Figma `background-color` 를 reference 로 보되 이름만 우리가 리네이밍. alpha 0.3 유지.
- `palette` 섹션 — Tailwind 기본 팔레트. Figma `tw/colors` 와 1:1 이라 가정. 변경 있으면 별도 협의.
- `misc.json` — radius.base 외에 지금은 sync 대상 아님.

---

## 절차 (Claude Code 실행)

### STEP 1 — 연결 확인

```
figma_get_status (probe:true) → websocket 연결 확인
```

실패 시: 사용자에게 "Figma Desktop + Desktop Bridge 실행" 안내 후 `figma_reconnect`.

### STEP 2 — mode 컬렉션 읽기

```js
// 라이브러리 subscriptions 에서 mode 컬렉션 찾기
const libs = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const modeCollection = libs.find(c => c.libraryName.includes("Design System API") && c.name === "mode");
const modeKey = modeCollection.key;   // 현재: 7070bf9909f47cf6901d8216ea6ec4c429b09f00

// 컬렉션 내 모든 variable 메타데이터
const metaList = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(modeKey);
// 반환: [{ name, key, resolvedType }, ...] — 현재 총 59개
```

### STEP 3 — 각 변수 resolve

```js
for (const meta of metaList) {
  if (meta.resolvedType !== "COLOR") continue;   // FLOAT 는 skip (misc.json 범위 아님)

  const imported = await figma.variables.importVariableByKeyAsync(meta.key);
  const collection = await figma.variables.getVariableCollectionByIdAsync(imported.variableCollectionId);

  for (const mode of collection.modes) {
    // mode.name: "light mode" | "dark mode"
    const raw = imported.valuesByMode[mode.modeId];

    if (raw?.type === "VARIABLE_ALIAS") {
      // alias 해결 → 실제 variable (보통 tw/colors 팔레트)
      const aliased = await figma.variables.getVariableByIdAsync(raw.id);
      // aliased.name: "red/600", "neutral/950", "white" 등
      // aliased.variableCollectionId 로 tw/colors 여부 확인
    } else {
      // raw RGB — 팔레트 alias 로 표현 불가. alpha 있으면 hsla 허용.
    }
  }
}
```

### STEP 4 — 이름 매핑 (slash prefix 자동 제거)

STEP 3 루프 안에서 아래 함수로 이름을 정규화한다. 별도 수작업 불필요.

```js
/**
 * Figma variable 이름에서 group prefix 를 자동 제거한다.
 *   "success/success"        → "success"
 *   "success/success-border" → "success-border"
 *   "warning/warning-subtle" → "warning-subtle"
 *   "background"             → "background"  (slash 없으면 그대로)
 */
function normalizeTokenName(figmaName) {
  const slashIdx = figmaName.indexOf("/");
  if (slashIdx === -1) return figmaName;
  return figmaName.slice(slashIdx + 1);
}
```

STEP 3 루프에서 적용:

```js
for (const meta of metaList) {
  if (meta.resolvedType !== "COLOR") continue;

  const tokenName = normalizeTokenName(meta.name);   // ← 여기서 자동 변환
  if (EXCLUDE.has(meta.name)) continue;              // STEP 5 제외 목록

  // ... resolve & compare
}
```

### STEP 5 — 제외 목록

현재 tokens/colors.json 에 반영하지 않을 Figma 변수:

| Figma 이름 | 이유 |
|---|---|
| `semantic-foreground` | 용도 확인 전까지 skip |
| `semantic-background` | 용도 확인 전까지 skip |
| `semantic-border` | 용도 확인 전까지 skip |
| `background-color` | `overlay` 로 리네이밍되어 이미 tokens/colors.json 에 있음. alpha 값만 확인 |
| `radius-*`, `border-width`, `stroke-width` | FLOAT. misc.json 범위 — 현재 scope 아님 |

### STEP 6 — 값을 colors.json 스키마로 변환

**alias → palette ref 문자열**:
- Figma `aliased.name = "red/600"` + `aliased.collection = "tw/colors"` → `"palette/red/600"`
- Figma `aliased.name = "white"` + `aliased.collection = "tw/colors"` → `"palette/white"`

**raw RGB → HSL 또는 hex 직접**:
- alpha == 1 인 raw 는 palette 에 없는 커스텀 컬러 → 경고 로그 + 디자이너 확인 요청
- alpha < 1 인 raw (예: `overlay`) 는 `"palette/black@0.3"` 같은 기존 alpha 문법 사용

### STEP 7 — Drift 리포트

현재 colors.json 과 Figma 결과를 비교하여:

```
✓ 일치 토큰: N 개
⚠ 변경된 토큰:
  - destructive (light): palette/red/600 → palette/red/700
  - muted (dark): palette/neutral/800 → palette/neutral/700
➕ Figma 에만 있는 새 토큰: ...
➖ colors.json 에만 있는 토큰: ...
```

변경 있으면 **사용자에게 확인 요청**. 자동 덮어쓰기 금지.

### STEP 8 — 반영 + generated CSS 갱신

사용자 승인 후:

1. `tokens/colors.json` 의 `semantic` 섹션을 새 값으로 업데이트 (수동 Edit 또는 스크립트)
2. `npm run sync-tokens` 실행 → `tokens.generated.css` 재생성
3. `npm run sync-tokens:check` 로 일관성 확인
4. 브라우저에서 `/users`, `/api-keys` 렌더 확인 (육안)
5. 변경 요약 메시지 사용자에게 출력

### STEP 9 — PR 전 체크리스트

- [ ] `git diff design-system/tokens/colors.json` 가 의도한 변경만 포함
- [ ] `src/styles/tokens.generated.css` 도 함께 업데이트 (차이 있으면 반드시 포함)
- [ ] `npm run sync-tokens:check` exit 0
- [ ] 시각 회귀 확인 (특히 destructive, status badge, dialog overlay)

---

## 알려진 한계

1. **디자이너가 직접 실행 불가**. Claude Code 가 필요. 디자이너가 셀프서비스하려면 Figma Plugin 형태 재구성 필요.
2. **Desktop Bridge 연결 끊김**. Figma Desktop 종료/재시작 시 재연결 필요.
3. **FLOAT 타입 미지원**. radius scale 같은 수치 토큰은 현재 sync 대상 아님.
4. **Palette drift 미감지**. `tw/colors` 팔레트 자체가 바뀌면 tokens/colors.json.palette 와 어긋나지만 본 워크플로우는 감지 못 함.

## 향후 개선 후보

- `semantic-*` 3개 용도 파악 후 sync 대상 포함 결정
- FLOAT 토큰(radius-*, border-width, stroke-width) → misc.json 확장
- `tw/colors` 팔레트 자체의 drift 감지 (추가 STEP)
- Enterprise 플랜 확보 시 REST API 기반 CI 자동화로 승격
