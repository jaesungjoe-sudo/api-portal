# Button

## Import
```tsx
import { Button } from "@/components/ui/button"
```

## Variants (Figma 라이브러리)

| variant | 용도 | shadow |
|---|---|---|
| `default` | 주요 액션 (Save, Send Invite, Create) | `shadow-xs` |
| `outline` | **모든 Cancel** (form-dialog / confirm-dialog), Approve / Reject / Resend, 랜딩 보조 CTA | `shadow-xs` |
| `secondary` | **Toolbar / Header 보조 액션** (Export / Filter / Refresh 등). 현재 사용처 0건 — Webhooks / Analytics 등 향후 적용 예정. | `shadow-xs` |
| `ghost` | 플랫 (icon 버튼) | 없음 |
| `destructive` | 삭제·파괴 액션 (Deactivate, Reject, Delete) | `shadow-xs` |
| `link` | 텍스트 링크 | 없음 |

### Cancel 은 모두 `outline` (변경 이력)

이전엔 form-dialog 의 Cancel 이 `secondary`, confirm-dialog 의 Cancel 이 `outline` 으로 갈라져 있었다. 현재는 **모든 다이얼로그의 Cancel 을 `outline` 으로 통일**. `secondary` 는 다이얼로그 외부의 보조 액션 용도로 재할당. 자세한 결정 배경은 `patterns/form-dialog.md` §7 참조.

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
