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

### 사용 가능한 색상 토큰
| 토큰 | 용도 |
|------|------|
| `bg-background` | 페이지 배경 |
| `bg-card` | 카드, 패널 배경 |
| `bg-primary` | 주요 액션 버튼 |
| `bg-secondary` | 보조 버튼, 태그 |
| `bg-muted` | 비활성, 서브 배경 |
| `bg-accent` | 강조 배경 |
| `text-foreground` | 주요 텍스트 |
| `text-muted-foreground` | 보조 텍스트 |
| `border-border` | 구분선, 테두리 |
| `ring-ring` | 포커스 링 |

### Destructive (4종 세트)
| 토큰 | 용도 |
|------|------|
| `bg-destructive` / `text-destructive` | 삭제·위험 액션, Form 에러 텍스트 |
| `text-destructive-foreground` | destructive 배경 위 텍스트 |
| `bg-destructive-subtle` | destructive 영역 옅은 배경 (Alert, Toast) |
| `border-destructive-border` | destructive 영역 테두리 |

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
| 정보성 알림 / 배지 (예: "Invited") | `bg-info-subtle` / `text-info` *(info 토큰 추가 후)* |
| 사이드바 active 상태 | `text-sidebar-active` *(별도 토큰 정책 결정 후)* |
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
