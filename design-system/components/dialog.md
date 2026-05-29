# Dialog

## Import
```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
```

## Title 타이포그래피

- `text-lg font-semibold leading-7` (18px / 28px / 600)
- `dialog.tsx` 컴포넌트 내부에 기본값으로 적용됨. 페이지에서 별도 override 금지.

## Width 두 가지 타입

| 타입 | width | 용도 |
|---|---|---|
| Form Dialog | `sm:max-w-[423px]` | Edit / Invite / Create (입력 폼) |
| Confirm Dialog | `sm:max-w-[512px]` | Deactivate / Reject (확인 다이얼로그) |

## Confirm Dialog 공통 구조

상세 룰은 `patterns/confirm-dialog.md` 참조. 본 섹션은 골격만 — 모든 confirm 다이얼로그는 **`<ConfirmDialog>` 공용 컴포넌트** 사용 (Dialog primitive 직접 조립 금지).

```tsx
import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";

<ConfirmDialog
  open={target !== null}
  onOpenChange={(o) => { if (!o) setTarget(null); }}
  title="Delete API Key"
  description="Are you sure you want to delete this API Key?"
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

내부적으로 `showCloseButton={false}` + `sm:max-w-[512px]` + outline Cancel + destructive Confirm 으로 조립됨. 자세한 변형 (엔티티 이름 강조, 비-파괴적 변형) 은 `patterns/confirm-dialog.md` §1 / §6.

- 패딩: `24px all` (rounded-lg = 10px, gap 16px)
- 오버레이: `rgba(0,0,0,0.30)` (기본값 그대로)

## Form Dialog 공통 구조

상세 룰은 `patterns/form-dialog.md` 참조. 본 섹션은 골격만.

```tsx
<Dialog open={editOpen} onOpenChange={handleClose}>
  <DialogContent className="sm:max-w-[423px]">
    {/* Edit 다이얼로그는 focus 흡수용 sr-only span 필요 */}
    <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
    <DialogHeader>
      <DialogTitle>{제목}</DialogTitle>
      {/* DialogDescription 은 조건부 — form-dialog.md §3 */}
    </DialogHeader>
    {/* 필드 그룹들: 각자 gap-2, 그룹 사이는 DialogContent 의 gap-4 가 책임 */}
    <div className="flex flex-col gap-2">
      <Label .../>
      <Input .../>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSave}>{액션명}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

> **DialogFooter primitive 는 plain** (Figma 정합 — 풋터 위 구분선 / 배경 / 가장자리 확장 / 둥근 모서리 모두 없음). 별도 `mt-2` 등 위쪽 마진 추가 금지. 자세한 인스펙트 결과는 `patterns/form-dialog.md` §6.

## Focus 규칙 (Edit 다이얼로그)

- **다이얼로그가 열릴 때 어떤 필드도 active(focus) 상태가 되어선 안 됨**.
- `autoFocus` 금지.
- DialogContent 바로 아래 **focus 흡수용 sr-only span** 배치:
  ```tsx
  <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
  ```
- Create/Invite 다이얼로그는 빈 필드 + placeholder 방식이므로 focus 흡수 불필요.

## 유효성 검사 규칙

- 저장/제출 시 필수 필드가 비어있으면 `aria-invalid` + Label `text-destructive` + 에러 메시지 표시.
- Edit 다이얼로그도 동일: 기존 값을 지우고 저장하면 invalid.
- 필드 값이 변경되는 순간 해당 필드의 에러는 즉시 해제.

## Figma 판별 기준

- `mainComponent` 이름: "Dialog", "Modal"
- 내부 구조 `DialogHeader` / `DialogTitle` / `DialogDescription` 으로 매핑
- Close 버튼은 `dialog.tsx` 내장. 수동 추가 금지.
