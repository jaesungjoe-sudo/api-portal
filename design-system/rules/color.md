# 컬러 토큰 규칙

## 색상 규칙

```
❌ 금지                         ✅ 올바른 사용
bg-blue-600                    bg-primary
text-gray-500                  text-muted-foreground
border-gray-200                border-border
bg-white                       bg-background
text-black                     text-foreground
```

### 사용 가능한 색상 토큰 (Neutral)
| 토큰 | 용도 |
|------|------|
| `bg-background` | 페이지 배경 |
| `bg-card` | 카드, 패널 배경 |
| `bg-primary` | 주요 액션 버튼 |
| `bg-secondary` | 보조 버튼, 태그 |
| `bg-muted` | 비활성, 서브 배경 |
| `bg-accent` | shadcn dropdown/popover hover 등 |
| `text-foreground` | 주요 텍스트 |
| `text-muted-foreground` | 보조 텍스트 |
| `border-border` | 구분선, 테두리 |
| `ring-ring` | 포커스 링 |

### 시맨틱 컬러 (4종 세트 × 5컬러)

각 시맨틱 컬러는 **4개 토큰 세트** 로 구성. `<Badge variant={...}>` / Alert / Toast 등 컴포넌트에서 사용.

| 시맨틱 | solid bg / text | foreground | subtle bg | border |
|---|---|---|---|---|
| `destructive` (빨강) | `bg-destructive` / `text-destructive` | `text-destructive-foreground` | `bg-destructive-subtle` | `border-destructive-border` |
| `success` (녹) | `bg-success` / `text-success` | `text-success-foreground` | `bg-success-subtle` | `border-success-border` |
| `warning` (앰버) | `bg-warning` / `text-warning` | `text-warning-foreground` | `bg-warning-subtle` | `border-warning-border` |
| `info` (블루) | `bg-info` / `text-info` | `text-info-foreground` | `bg-info-subtle` | `border-info-border` |
| `highlight` (보라) | `bg-highlight` / `text-highlight` | `text-highlight-foreground` | `bg-highlight-subtle` | `border-highlight-border` |

**사용 패턴**:
- Badge: `<Badge variant="success">` 등 — variant prop 만 사용 (색 className 직접 주입 금지)
- Alert/Callout: subtle 배경 + 시맨틱 텍스트 (예: `bg-info-subtle text-info border-info-border`)
- 솔리드 (`bg-success` 등): 강조 점, 작은 아이콘 배지 등 한정 사용

### Chart 컬러 (5종)

차트 (line/bar/pie) 전용. 시맨틱과 분리된 단일 토큰:

| 토큰 | 매핑 |
|------|------|
| `bg-success-chart` / `text-success-chart` | GET / 녹색 시리즈 |
| `bg-info-chart` / `text-info-chart` | POST / 블루 시리즈 |
| `bg-highlight-chart` / `text-highlight-chart` | PATCH / 보라 시리즈 |
| `bg-warning-chart` / `text-warning-chart` | PUT / 노랑 시리즈 |
| `bg-destructive-chart` / `text-destructive-chart` | DELETE / 빨강 시리즈 |

### Brand (UJET 브랜드 컬러)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `bg-brand` / `text-brand` | `#4ABCFF` (light/dark 동일) | UJET 시그니처 블루 |
| `text-brand-foreground` | `neutral/950` | brand 배경 위 텍스트 |

> brand는 light/dark 모드에서 같은 hex를 쓴다 (브랜드 일관성 정책). subtle/border 변형은 **만들지 않음** — 브랜드 컬러는 한정된 영역에만 사용.

#### Brand 사용 가이드

✅ **사용 O**
- 로고 (UJET 워드마크, 심볼)
- 랜딩 페이지 헤드라인 강조
- 마케팅 배너 / 프로모션 영역
- "About UJET" / 브랜드 소개 섹션

❌ **사용 X — 다른 토큰으로 대체**
| 잘못된 사용 | 올바른 토큰 |
|---|---|
| 일반 CTA 버튼 | `bg-primary` |
| 정보성 알림 / 배지 (예: "Invited") | `<Badge variant="info">` |
| 사이드바 active 상태 | `bg-sidebar-accent` |
| 링크 텍스트 | `text-primary` 또는 `text-foreground underline` |
| 폼 포커스 링 | `ring-ring` |

브랜드 컬러를 일반 UI에 흩뿌리면 **시그니처 의미가 희석**된다. 의심되면 디자이너에게 "이게 정말 브랜드 강조 영역인가?" 확인.

---

## Figma 컬러 토큰 읽기 규칙

**Figma에는 두 가지 토큰 시스템이 공존한다. 라이브러리는 Color Styles(구형)를 사용하므로 `fillStyleId`를 우선 확인한다.**

| 시스템 | 접근 방법 | 특징 |
|---|---|---|
| Color Styles (구형) | `node.fillStyleId` → `figma.getStyleByIdAsync(id).name` | 현재 라이브러리가 사용하는 방식 |
| Variables (신형) | `node.boundVariables?.fills?.[0]?.color` | 모드(dark/light) 전환 지원 |

```js
// ✅ 올바른 방법 — Color Styles 우선, Variables 차선, RGB fallback
async function getColorToken(node) {
  // 1순위: Color Styles (라이브러리가 사용하는 방식)
  const styleId = node.fillStyleId;
  if (styleId && typeof styleId === 'string') {
    const style = await figma.getStyleByIdAsync(styleId);
    if (style) return style.name; // "color/destructive", "Primary/500" 등
  }

  // 2순위: Variables (신형 시스템)
  const bound = node.boundVariables?.fills?.[0]?.color;
  if (bound) {
    const variable = await figma.variables.getVariableByIdAsync(bound.id);
    if (variable) return variable.name;
  }

  // 3순위: RGB fallback (토큰 없음)
  const c = node.fills[0]?.color;
  return c ? `rgb(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)})` : null;
}
```

fills, strokes, text color(`fillStyleId` → `strokeStyleId` → `textStyleId`) 모두 동일하게 적용. RGB로만 읽은 값은 CSS 변수 토큰으로 매핑할 수 없으므로 구현에 직접 사용 금지.
