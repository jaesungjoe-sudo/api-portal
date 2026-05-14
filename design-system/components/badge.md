# Badge

> Figma 라이브러리 컴포넌트 set 정합 (`1603:86622` / Library file `SmO9fsWrxriuCofc7T3b1S` node `665:2024`).

## Import

```tsx
import { Badge } from "@/components/ui/badge"
```

## Variants

`Badge` primitive 의 `variant` prop 으로 색을 결정. 색 className 직접 주입 금지.

| `variant` | 배경 | 텍스트 | 용도 |
|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | 기본 솔리드 (Type=primary 정합) |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | Type=secondary, Property=default |
| `destructive` | `bg-destructive-subtle` | `text-destructive` | Revoked / 위험 상태 라벨 (Type=secondary, Property=destructive) |
| `outline` | 없음 (border) | `text-foreground` | 윤곽선만 |
| `success` | `bg-success-subtle` | `text-success` | Active 등 양호 상태 |
| `warning` | `bg-warning-subtle` | `text-warning` | Verified 등 주의 상태 |
| `info` | `bg-info-subtle` | `text-info` | Invited 등 정보 상태 |
| `highlight` | `bg-highlight-subtle` | `text-highlight` | PATCH 메서드, 보라색 강조 (Figma `Property=highlight`) |
| `muted` | `bg-muted` | `text-muted-foreground` | Deactivated / Expired 등 비활성 상태 |
| `ghost` / `link` | — | — | 특수 (shadcn 잔존) |

기본 모양: `h-5`, `rounded-lg` (10px — Figma 라이브러리 cornerRadius), `px-2 py-0.5`, `text-xs font-medium`.

## 4개 wrapper — Badge primitive 의 thin wrapper

```
StatusBadge       → User Status (Active/Verified/Invited/Deactivated)
ApiKeyStatusBadge → API Key Status (Active/Expired/Revoked)
MethodBadge       → HTTP Method (GET/POST/PATCH/PUT/DELETE)
CodeBadge         → 코드/식별자 강조 (destructive variant + font-mono)
```

모두 `<Badge variant={...}>` 호출. 색 className 직접 주입 안 함.

### 상태 ↔ variant 매핑

| Wrapper | 값 | variant |
|---|---|---|
| `StatusBadge` | `Active` | `success` |
| 〃 | `Verified` | `warning` |
| 〃 | `Invited` | `info` |
| 〃 | `Deactivated` | `muted` |
| `ApiKeyStatusBadge` | `Active` | `success` |
| 〃 | `Expired` | `muted` |
| 〃 | `Revoked` | `destructive` |
| `MethodBadge` | `GET` | `success` |
| 〃 | `POST` | `info` |
| 〃 | `PATCH` | `highlight` |
| 〃 | `PUT` | `warning` |
| 〃 | `DELETE` | `destructive` |

### Wrapper 의 className 오버라이드

`StatusBadge` / `ApiKeyStatusBadge` 는 페이지 컨벤션상 pill 모양:

```tsx
<Badge variant={STATUS_VARIANT[status]} className="border-0 font-medium rounded-full px-2.5">
  {status}
</Badge>
```

`MethodBadge` / `CodeBadge` 는 Badge primitive 의 기본 `rounded-lg` 그대로.
`CodeBadge` 는 `font-mono` 만 className 으로 추가.

## Count Badge (탭 카운트)

탭 옆 카운트 표시는 별도 컴포넌트 — Figma 라이브러리에서 `Type=*_number` variant. 현재 코드는 인라인 `<span>`:

```tsx
<span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-xs font-medium min-w-[18px] h-[18px] px-1">
  {count}
</span>
```

(향후 `<Badge variant="default" />` 의 number variant 분기로 통합 가능.)

## Figma 판별 기준

- `mainComponent.parent.name` === `"Badge"` (componentSet id `665:2024`)
- `componentProperties.Type.value` ∈ `primary | secondary | destructive | outline | default_number | destructive_number | secondary_number`
- `componentProperties.Property.value` ∈ `default | success | info | warning | destructive | muted | highlight`

→ 위 표 매핑으로 `variant` 결정.

## 주의사항

- **색상 className 직접 주입 금지** — variant 만 사용. `bg-green-100` / `bg-blue-100` 같은 Tailwind 팔레트 색은 금지 (Phase1 초기 코드 잔존시 발견되면 마이그레이션).
- 새 상태 추가 시: Figma 인스턴스의 `Property` variant 확인 → 위 매핑 표에 맞춰 `variant` 선택 → 신규 wrapper 추가 또는 기존 wrapper 의 매핑 객체 확장.
- 새 wrapper 도 반드시 shadcn `<Badge>` 거침. raw `<span>` + 색 className 패턴 다시 만들지 말 것.
- `rounded-lg` 가 Figma 정합 (cornerRadius=10). 임의의 `rounded-4xl` / `rounded-full` 오버라이드 전에 디자인 확인.
