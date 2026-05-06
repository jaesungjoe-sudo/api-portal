# Badge

## Import
```tsx
import { Badge } from "@/components/ui/badge"
```

## StatusBadge 색상 매핑

모든 StatusBadge 공통: `border-0 font-medium rounded-full px-2.5`

| Status | 색상 클래스 |
|---|---|
| `Active` | `bg-green-100 text-green-700 hover:bg-green-100` |
| `Verified` | `bg-orange-100 text-orange-700 hover:bg-orange-100` |
| `Invited` | `bg-blue-100 text-blue-700 hover:bg-blue-100` |
| `Deactivated` | `bg-secondary text-secondary-foreground hover:bg-secondary` |

## Count Badge (탭 뱃지)

탭 옆 카운트 뱃지 (예: Pending Approvals 개수):

```tsx
<span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-xs font-medium min-w-[18px] h-[18px] px-1">
  {count}
</span>
```

## Figma 판별 기준

- `mainComponent` 이름: "Badge"
- `componentProperties.Type.value`: variant (status 이름 또는 default/secondary/outline 등)

## 주의사항

- StatusBadge 4개 상태 외 다른 상태가 추가되면 `badge.md` 와 StatusBadge 코드 양쪽 업데이트.
- 탭 뱃지는 shadcn `Badge` 가 아니라 `span` + 유틸리티 클래스 조합. Figma 라이브러리도 별도 컴포넌트로 정의되어 있음.
