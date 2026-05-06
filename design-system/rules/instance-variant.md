# Figma 컴포넌트 인스턴스 처리 규칙

**`node.type === 'INSTANCE'`인 노드를 만나면 아래 순서를 반드시 따른다.**

## STEP 1 — `/src/components/ui/`에 대응 컴포넌트가 있는지 먼저 확인

`mainComponent` 이름을 보고 shadcn 컴포넌트로 대응 가능한지 판단한다.

| Figma mainComponent 키워드 | 사용할 컴포넌트 |
|---|---|
| Button, Buttons | `<Button>` |
| Badge | `<Badge>` |
| Alert, alert | `<Alert>` (있으면), 없으면 내부 구조 읽어 구현 |
| Input, Select, Checkbox | 해당 shadcn 컴포넌트 |
| Dialog, Modal | `<Dialog>` |
| Tooltip | `<Tooltip>` |
| Separator | `<Separator>` |
| Pagination | `<Pagination>` |

- 대응 컴포넌트가 있으면 → shadcn 컴포넌트 사용, 내부 구조 재구현 금지
- 없으면 → STEP 2로

## STEP 2 — 인스턴스 내부 구조까지 읽기

대응 컴포넌트가 없으면 **children을 depth=3~4까지 읽어** 아이콘 유무, 텍스트 구조, 레이아웃을 확인하고 구현한다. `componentProperties`와 `mainComponent` 이름만 보고 구현하지 않는다.

## STEP 3 — fills + strokes 동시 확인으로 variant 결정

**`node.type === 'INSTANCE'`인 노드는 반드시 `componentProperties`를 읽어 어떤 variant인지 확인한다.**

- `componentProperties`에는 `Type=outline`, `Size=sm`, `State=hover` 같은 variant 값이 들어있음
- 텍스트나 위치만 보고 variant를 추정하지 않는다 → 반드시 명시적으로 확인
- `mainComponent.name`도 함께 읽으면 variant 구조 파악에 유용

```js
// ✅ 인스턴스 variant + 컬러 오버라이드 읽기
if (node.type === 'INSTANCE') {
  // 1. variant 읽기
  const props = node.componentProperties;
  const variantType = props?.Type?.value;       // "outline" | "default" | "destructive" 등
  const variantSize = props?.Size?.value;       // "sm" | "default" | "lg" 등
  const mainName = node.mainComponent?.name;    // "Type=outline, Size=sm, State=default"

  // 2. fills + strokes 모두 확인 (variant 추정에 필수)
  const hasFill = node.fills?.length > 0;
  const hasStroke = node.strokes?.length > 0;
  // ghost  → fills:[] + strokes:[] (배경 없음, 테두리 없음)
  // outline → fills:[] + strokes:[...] (배경 없음, 테두리 있음)
  // solid  → fills:[...] (배경 있음)

  // 3. 인스턴스 자체 fill/stroke 오버라이드 확인
  const instanceColor = await getColorToken(node);

  // 4. 자식 노드 fill 오버라이드 확인 (인스턴스 직접 fill이 없을 때)
  if (!instanceColor || instanceColor.startsWith('rgb')) {
    for (const child of node.children || []) {
      if (child.fills?.length > 0) {
        const childColor = await getColorToken(child);
        // childColor가 토큰 이름이면 오버라이드 적용된 것
      }
    }
  }
}
```

**fills만 보고 variant를 추정하지 않는다.** `fills: []`는 ghost와 outline 모두 해당하므로 반드시 `strokes`도 함께 확인해야 한다.

| fills | strokes | variant |
|---|---|---|
| 비어있음 | 비어있음 | `ghost` |
| 비어있음 | 있음 | `outline` |
| 있음 | 무관 | `default` / `destructive` / `secondary` 등 |

모든 컬러는 반드시 토큰과 연결해서 사용한다. RGB fallback이 나오면 디자이너에게 토큰 연결을 요청할 것.

이 규칙은 Button, Badge, Input 등 모든 컴포넌트 인스턴스에 적용한다.

---

## STEP 4 — 폼 필드 인스턴스는 `State` variant 반드시 확인

`Input`, `Select`, `Checkbox`, `Textarea` 같은 폼 필드 인스턴스는 **같은 mainComponent 이름으로도 `State` variant 값에 따라 HTML 속성이 달라진다**. 따라서 다이얼로그·폼을 구현할 때 각 필드 인스턴스의 `componentProperties.State`를 반드시 확인한다.

| `State` variant | HTML 속성 / 의미 |
|---|---|
| `default` / `empty` | placeholder 보이는 빈 상태 |
| `filled` | 값이 들어있는 일반 상태 |
| `disabled` | `disabled` prop 추가 — 사용자가 수정 불가 |
| `readonly` | `readOnly` prop 추가 — 표시 전용 |
| `error` | `aria-invalid` + 에러 메시지 노출 |
| `focus` / `hover` | 구현 불필요 (CSS 자동 처리) |

```js
// ✅ 폼 필드 인스턴스 변환 순서
for (const fieldInstance of formFieldInstances) {
  const state = fieldInstance.componentProperties?.State?.value;
  // state === "disabled" → Input/Select 컴포넌트에 disabled prop
  // state === "readonly" → readOnly prop
  // 기타 상태는 기본 구현
}
```

**경고: geometry(width/height)만으로 state 판단 금지.** 같은 컴포넌트라도 state에 따라 height가 바뀔 수 있지만 (label/helper text 유무), 높이 차이를 보고 state를 추정하는 건 틀림. 항상 `componentProperties.State`를 직접 확인.

**예시 — 실제 놓친 케이스:**
ProfileDialog에서 Role 필드가 Figma에서 `State=disabled`인데, shallow inspection에서 `componentProperties` 읽지 않고 height(64) vs Team의 height(68) 차이만 보고 넘어가 disabled prop이 누락됨.
