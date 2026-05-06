# Figma 노드 읽기 규칙

## Figma MCP 사용 규칙

### 기본 원칙
- 모든 Figma 작업은 Console MCP 우선 사용
- 공식 MCP는 사용하지 않음

### Console MCP 사용법
- 화면 구현: Figma 링크에서 node-id 추출해서 직접 읽기
- 토큰 추출: 파일 키로 변수 전체 읽기
- 컴포넌트 탐색: 파일 키로 직접 탐색

### Figma 파일 정보
- 라이브러리 파일 키: SmO9fsWrxriuCofc7T3b1S
- 디자인 파일 키: F2lkYCId2xMqcd9RuXL20B

### 작업 순서 (토큰 절약 필수)

**STEP 1 — design-system/ 캐시 먼저 확인 (Figma 읽기 전 필수)**
- `design-system/pages/<page>.md` 존재하면 → Figma 읽지 않고 그 파일 사용
- 필요한 정보가 캐시에 있으면 figma_execute 호출 금지

**STEP 2 — 캐시에 없는 정보만 Figma에서 읽기**
- 부모 프레임 전체 읽기 금지 → 필요한 섹션의 노드 ID만 핀포인트로 읽기
- figma_execute 읽기 순서:
  1. depth=1~2로 children ID 목록만 먼저 파악
  2. 필요한 노드 ID만 depth=3~4로 읽기
- 이미 구현된 컴포넌트(Navigation, Sidebar, Table, Dialog 등)는 Figma 재확인 금지

**STEP 3 — 읽은 결과 즉시 저장 (세션 종료 전 필수)**
- 새 화면 구현 완료 시 반드시 `design-system/pages/<page>.md`에 저장
- 저장 내용: 노드 ID, 컬럼 구조, 간격, 색상, hidden 노드 목록
- 저장하지 않으면 다음 세션에서 동일한 Figma 읽기가 반복되어 토큰 낭비 발생

**STEP 4 — 공식 MCP(get_design_context) 사용 금지**

### design-system/ 폴더 구조
```
design-system/
  tokens.json          ← Figma 색상/타이포/간격 토큰
  pages/
    users.md           ← /users 페이지 디자인 데이터 ✓
    api-keys.md        ← /api-keys 페이지 (미작성)
    webhooks.md        ← /webhooks 페이지 (미작성)
    analytics.md       ← /analytics 페이지 (미작성)
  components/          ← 공통 컴포넌트 스펙 (필요시 추가)
```

---

## Figma hidden 노드 처리 규칙

**Figma에서 숨겨진(hidden) 노드는 절대 구현하지 않는다.**

hidden 판별 기준 — 아래 중 하나라도 해당하면 구현 제외:
- `visible === false`
- opacity === 0
- 다른 노드와 x/y 좌표가 완전히 겹치면서(bounding box overlap) 실제 row/cell 데이터에 대응하는 셀이 없는 경우
- `figma_execute`로 읽은 row 셀 좌표 범위에 해당 컬럼 셀이 존재하지 않는 경우

**검증 방법**: 헤더 노드만 보지 말고 반드시 실제 **row 셀의 x 좌표**와 대조해서 컬럼 존재 여부 확인 후 구현.

**figma_execute 읽기 시 필수 체크**: 노드 내용을 추출할 때 텍스트/스타일만 읽지 말고 **반드시 `node.visible` 값을 함께 확인**한다. `visible: false`인 노드는 텍스트가 있어도 구현에서 제외.

---

## 컨테이너 children 전체 enumerate 규칙

**Parent 프레임을 구현할 때 `visible: true`인 모든 직접 자식을 순서대로 매핑한다.**

### 왜 필요한가

육안으로 "메뉴가 아닌 것처럼 보이는" 구조물(divider, spacer, 장식 Rectangle)을 semantic filtering으로 스킵하면 구현에서 누락됨. 실제 사례:

- TopNav의 `Frame 2` (HORIZONTAL, children=3)에서 `Nav1 | Divider(1×20 Rectangle) | Nav2` 중 Divider를 "장식"으로 보고 스킵 → 두 nav 그룹이 붙어서 렌더링.
- Team 상세 페이지 Header (VERTICAL, children=2)에서 Row 1이 `Title TEXT | Ellipsis INSTANCE` 두 자식을 갖는데, **`getVisibleTexts()`로 텍스트만 추출**하다 보니 옆에 있던 3-dot 메뉴 INSTANCE를 빠뜨림 → 헤더에 Edit/Delete 메뉴가 누락.

### 체크리스트

Parent 프레임 읽을 때 **반드시 수행**:

1. **Parent 자체 속성**: `layoutMode`, `itemSpacing`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `visible` 기록
2. **자식 enumeration**: `children` 배열 전체를 순서대로 나열 (이름·type·width·height·visible)
3. **visible=false 필터링**: hidden 노드 제외
4. **남은 visible 자식은 하나도 빠짐없이 구현 항목으로 매핑**
5. **텍스트·아이콘·배경의 `fills` / `strokes` 토큰명 확인** — `destructive`·`warning`·`success` 같은 의미 토큰이 아닌 경우, 관습으로 해당 색상 추가 금지 (상세: `shadcn.md` "스타일 추가 금지 원칙")

### `getVisibleTexts()`만 호출 금지

자식 enumerate 단계에서 텍스트만 추출하는 헬퍼(`findAll(n => n.type === 'TEXT')` / `getVisibleTexts()`)에 의존하면 INSTANCE/FRAME/RECTANGLE 자식이 통째로 누락됨.

| 헬퍼 종류 | 어디에 쓰나 |
|---|---|
| `getVisibleTexts(n)` | 텍스트 콘텐츠가 정확한지 확인할 때만 (라벨 매칭) |
| **자식 enumeration**(아래) | **레이아웃 구조 파악 — 항상 먼저 수행** |

```js
// ✅ 자식 전체를 type/visible과 함께 enumerate (레이아웃 파악)
return n.children.map(c => ({
  name: c.name, type: c.type, visible: c.visible,
  w: Math.round(c.width), h: Math.round(c.height),
  text: c.type === 'TEXT' ? c.characters : undefined,
}));
```

텍스트 매칭은 enumerate 결과로 **레이아웃을 먼저 그린 뒤** 보조적으로 수행.

### Rectangle 노드가 수상할 때 — divider 판별 기준

극단적 종횡비의 Rectangle은 대부분 divider. 장식으로 가정 금지.

| 힌트 | 해석 |
|---|---|
| width=1 또는 height=1 | 세로선/가로선 divider |
| 회전(rotation ≠ 0)된 좁은 Rectangle | 회전된 divider (예: 20×1 + rotation=-90 → 1×20 세로선) |
| 두 그룹 사이에 위치한 작은 Rectangle | 섹션 divider |
| stroke만 있고 fills=[] | 선형 요소 (divider/border) |

### 구현 매핑 예시

```
Frame 2 (HORIZONTAL, gap=12, visible=true, children=3):
  [0] Nav1 (INSTANCE, visible=true)
  [1] Divider (RECTANGLE 20×1, rotation=-90, stroke=sidebar-border, visible=true)
  [2] Nav2 (INSTANCE, visible=true)
```

↓

```tsx
<nav className="flex items-center gap-3">
  <Nav1 />
  <div className="h-5 w-px bg-sidebar-border" />  {/* ← divider 빠뜨리지 말 것 */}
  <Nav2 />
</nav>
```

---

## Figma 레이아웃 방향 읽기 규칙

**복수의 자식을 가진 프레임은 반드시 `layoutMode`를 확인한 뒤 구현한다.**

| Figma `layoutMode` | 코드 |
|---|---|
| `HORIZONTAL` | `flex flex-row` |
| `VERTICAL` | `flex flex-col` |
| `NONE` | flex 없음 (absolute 또는 block) |

`figma_execute`로 노드를 읽을 때 아래 속성을 반드시 포함해서 추출할 것:

```js
{
  layoutMode: node.layoutMode,
  primaryAxisAlignItems: node.primaryAxisAlignItems,  // justify-*
  counterAxisAlignItems: node.counterAxisAlignItems,  // items-*
  itemSpacing: node.itemSpacing,                      // gap
  visible: node.visible,
}
```

레이아웃 방향을 확인하지 않고 임의로 `flex-col` / `flex-row`를 결정하지 않는다.
