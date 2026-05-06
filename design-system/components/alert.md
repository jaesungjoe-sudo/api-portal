# Alert (경고 블록)

> shadcn `Alert` 컴포넌트가 없을 경우 아래 패턴으로 구현.
> Figma 라이브러리는 `Type=warning / info / success / destructive` variant 를 가진 단일 Alert 컴포넌트를 사용.

## Warning Alert 기본 패턴

```tsx
import { TriangleAlert } from "lucide-react"

<div className="flex items-center gap-3 rounded-md border border-border bg-warning-subtle px-4 py-3 text-sm font-medium text-warning">
  <TriangleAlert className="h-4 w-4 shrink-0" />
  <span>{메시지}</span>
</div>
```

## 핵심 스펙 (Figma 1175:24309 기준)

| 항목 | 값 | 클래스 |
|---|---|---|
| 레이아웃 | HORIZONTAL | `flex items-center` |
| gap (아이콘↔텍스트) | 12px | `gap-3` |
| padding | 16px / 12px | `px-4 py-3` |
| 배경 | warning-subtle | `bg-warning-subtle` |
| 텍스트·아이콘 색상 | warning | `text-warning` |
| 테두리 | border-border 1px | `border border-border` |
| radius | 6px | `rounded-md` |
| 아이콘 크기 | 16×16 | `h-4 w-4 shrink-0` |

## Variant 별 토큰

| Type | 배경 | 텍스트·아이콘 | 아이콘 |
|---|---|---|---|
| warning | `bg-warning-subtle` | `text-warning` | `TriangleAlert` |
| info | `bg-info-subtle` | `text-info` | `Info` |
| success | `bg-success-subtle` | `text-success` | `CheckCircle` |
| destructive | `bg-destructive/10` | `text-destructive` | `AlertCircle` |

## Figma 판별 기준

- `mainComponent` 이름: "alert", "Alert"
- `componentProperties.Type.value`: `warning` / `info` / `success` / `destructive`
- **children depth=3 까지 반드시 읽기** — 아이콘(`lucide/triangle-alert` 등)이 children 에 instance 로 들어있음. `componentProperties` 만 보면 아이콘 누락됨.

## 주의사항

- 아이콘 없는 단순 배경 블록으로 구현하지 않는다. Figma 디자인에는 항상 border + icon 이 있음.
- 색상 토큰 하드코딩 금지 (`bg-yellow-50`, `text-yellow-800` 등). 반드시 `warning-subtle` / `warning` 토큰 사용.
- `Type=destructive` 에서 visible=false 인 children (예: title + description 조합) 은 구현 제외.
