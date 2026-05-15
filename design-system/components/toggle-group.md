# ToggleGroup

단일 선택 segmented control 용 primitive. Base UI `@base-ui/react/toggle-group` + `@base-ui/react/toggle` wrapping.

## Import

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
```

## Variants

| variant | 형태 | 용도 |
|---|---|---|
| `outlined` | border-joined segmented (`first:rounded-l-md` / `last:rounded-r-md` / `-ml-px`) | Analytics 페이지 기간 탭 |
| `pill` | border wrapper + `p-0.5` + 각 item `rounded-sm` | Home Metrics 등 카드 내부 토글 |

## Size

| size | 적용 위치 | 값 |
|---|---|---|
| `default` | outlined | item h-9 / px-4 / text-sm |
| `sm` | pill | item h-8 / px-3 / text-xs |

(variant 마다 기본 height 가 다르므로 size 는 보조 조절용)

## API

```tsx
<ToggleGroup
  variant="outlined"          // or "pill"
  size="default"              // or "sm"
  value={selected}            // single value (string)
  onValueChange={setSelected} // (next: string) => void
>
  <ToggleGroupItem value="a">Option A</ToggleGroupItem>
  <ToggleGroupItem value="b">Option B</ToggleGroupItem>
</ToggleGroup>
```

내부적으로 Base UI 의 `value: string[]` 배열을 single value 로 wrapping. 다중 선택은 별도 wrapper 가 필요.

## 자동 부수효과 (Base UI)

- 키보드 화살표 / Home / End 키 내비게이션
- 활성 항목 `data-pressed` + `aria-pressed="true"`
- `disabled` 속성 표준 처리
- focus ring (`focus-visible:ring-3 focus-visible:ring-ring/50`)

## Button vs ToggleGroup

| 항목 | Button | ToggleGroup |
|---|---|---|
| 역할 | 단일 액션 (Save / Cancel) | 옵션 선택 (Last 6 months 등) |
| 활성 상태 | 없음 (클릭 시 액션 실행) | 한 항목 `data-pressed` 유지 |
| A11y | `<button>` | `<button aria-pressed>` |

## 사용처

- `src/components/api-portal/AnalyticsTabs.tsx` — outlined
- `src/components/api-portal/HomeMetricsChart.tsx` — pill, sm
