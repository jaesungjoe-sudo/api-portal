# Button

## Import
```tsx
import { Button } from "@/components/ui/button"
```

## Variants (Figma 라이브러리)

| variant | 용도 | shadow |
|---|---|---|
| `default` | 주요 액션 (Save, Send Invite) | `shadow-xs` |
| `outline` | 보조 액션 (Cancel 대안, Approve, Resend) | `shadow-xs` |
| `secondary` | Cancel | `shadow-xs` |
| `ghost` | 플랫 (icon 버튼) | 없음 |
| `destructive` | 삭제·파괴 액션 (Deactivate, Reject) | `shadow-xs` |
| `link` | 텍스트 링크 | 없음 |

## Size

| size | height | padding | font |
|---|---|---|---|
| `xs` | h-7 (28px) | px-2 (8px) | text-xs (12px) |
| `sm` | h-8 (32px) | px-3 (12px) | text-sm (14px) |
| `default` | h-9 (36px) | px-4 (16px) | text-sm (14px) |
| `lg` | h-10 (40px) | px-8 (32px) | text-sm (14px) |
| `icon-xs` | size-7 (28×28) | — | — |
| `icon-sm` | size-8 (32×32) | — | — |
| `icon` | size-9 (36×36) | — | — |
| `icon-lg` | size-10 (40×40) | — | — |

## Figma 판별 기준

- `mainComponent` 이름: "Button", "Buttons"
- `componentProperties.Type.value` → variant 값 (`default` / `outline` / `ghost` / `destructive` 등)
- `componentProperties.Size.value` → size 값 (`sm` / `default` / `lg` 등)
- `componentProperties.State.value` → 상태 (`default` / `hover` / `disabled`)
- fills + strokes 조합으로 재검증: 상세는 `design-system/rules/instance-variant.md`

## 주의사항

- **Approve 버튼은 `variant="outline" className="text-success"`** (primary 아님). Pending Approvals 테이블의 Approve는 outline + success 컬러.
- **확인 다이얼로그의 파괴 액션은 `variant="destructive"`** (Deactivate, Reject).
- **Resend 버튼은 `variant="outline"`** (secondary 아님). Invited 상태 사용자 Edit 다이얼로그에 등장.
- **ghost / link 는 shadow 없음**. 나머지 variant 는 `shadow-xs`.
- Loading 상태: `<Button disabled><Loader2 className="animate-spin mr-2" />…</Button>`
- 아이콘 단독 버튼: `variant="ghost" size="icon"` 또는 `size="icon-sm"`.
