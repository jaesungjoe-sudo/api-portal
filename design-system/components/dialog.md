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

```tsx
<Dialog open={!!target} onOpenChange={(open) => { if (!open) setTarget(null); }}>
  <DialogContent className="sm:max-w-[512px]">
    <DialogHeader>
      <DialogTitle>{제목}</DialogTitle>
      <DialogDescription>{본문(이메일 등 포함)}</DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
      <Button variant="destructive" onClick={handleConfirm}>{액션명}</Button>
    </div>
  </DialogContent>
</Dialog>
```

- 패딩: `24px all` (rounded-lg = 10px, gap 16px)
- 오버레이: `rgba(0,0,0,0.30)` (기본값 그대로)

## Form Dialog 공통 구조

```tsx
<Dialog open={editOpen} onOpenChange={handleClose}>
  <DialogContent className="sm:max-w-[423px]">
    {/* Edit 다이얼로그는 focus 흡수용 sr-only span 필요 */}
    <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
    <DialogHeader>
      <DialogTitle>{제목}</DialogTitle>
      <DialogDescription>{설명}</DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-4">
      {/* 필드들: gap-4 (16px) 로 구분 */}
    </div>
    <div className="flex justify-end gap-2 mt-2">
      <Button variant="secondary" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSave}>{액션명}</Button>
    </div>
  </DialogContent>
</Dialog>
```

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
