# Select

## Import
```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

## 기본 스펙

- `SelectTrigger` 기본 폭: **`w-full`** (폼 안에서 자동 fill)
- Shadow: `shadow-xs`
- 툴바·인라인 드롭다운처럼 콘텐츠 폭이 필요할 때만 `className="w-fit"` 오버라이드

## 폼 필드 + 에러 상태

```tsx
<div className="flex flex-col gap-2">
  <Label className={errors.role ? "text-destructive" : ""}>Select Role</Label>
  <Select
    value={role}
    onValueChange={(v) => {
      setRole(v ?? "")
      if (errors.role) setErrors((p) => ({ ...p, role: false }))
    }}
  >
    <SelectTrigger aria-invalid={errors.role}>
      <SelectValue placeholder="Select role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="admin">Admin</SelectItem>
      …
    </SelectContent>
  </Select>
  {errors.role && <p className="text-sm text-muted-foreground">Role is required</p>}
</div>
```

## Disabled State

Figma 라이브러리의 Select에는 `State=disabled` variant가 없음.
Input disabled 스펙과 동일하게 통일 적용:

| 속성 | 값 | Tailwind |
|---|---|---|
| fill | `muted` 토큰 | `bg-muted` |
| opacity | 0.5 | `opacity-50` |

`select.tsx` SelectTrigger에 이미 반영됨: `disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`

```tsx
{/* 본인 Role은 수정 불가 → Select에 disabled */}
<Select value={user.role} disabled>
  <SelectTrigger id="profile-role">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="developer">Developer</SelectItem>
  </SelectContent>
</Select>
```

## SelectContent (Menulist) 스펙

팝오버 스펙은 `design-system/components/popover.md` 의 Menulist 섹션을 따름.

## 유효성 검사 규칙

- `aria-invalid={errors.field}` 를 SelectTrigger 에 적용.
- 값 변경 시 해당 필드의 에러 즉시 해제.

## Figma 판별 기준

- `mainComponent` 이름: "Select", "Dropdown", "Menulist"
- `componentProperties.State.value`: `default` / `open` / `error` / `disabled`
- fill container 속성이면 `w-full` (기본값 유지), hug contents 면 `className="w-fit"`

## 주의사항

- `w-full` 은 SelectTrigger 의 기본값이므로 별도 지정 불필요.
- 고정 폭 강제가 필요하면 부모 래퍼에서 조정.
