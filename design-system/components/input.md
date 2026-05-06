# Input

## Import
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

## 기본 스펙

- Height: `h-9` (기본) / `h-8` (툴바의 sm)
- Shadow: `shadow-xs`
- 폭: 기본 `w-full`. 툴바의 검색처럼 고정 폭이 필요하면 래퍼에 `w-60` 등 지정.

## 검색 인풋 패턴

```tsx
<div className="relative w-60">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-8 h-8 text-sm" placeholder="Search …" />
</div>
```

## 폼 필드 + 에러 상태

```tsx
<div className="flex flex-col gap-2">
  <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
    Email
  </Label>
  <Input
    id="email"
    value={email}
    aria-invalid={errors.email}
    onChange={(e) => {
      setEmail(e.target.value)
      if (errors.email) setErrors((p) => ({ ...p, email: false }))
    }}
  />
  {errors.email && (
    <p className="text-sm text-muted-foreground">Email is required</p>
  )}
</div>
```

## 유효성 검사 규칙

- 저장/제출 시 필수 필드 비어있으면 `aria-invalid={true}` + Label `text-destructive` + 에러 메시지.
- 값이 변경되는 순간 해당 필드의 에러 즉시 해제.
- Edit 다이얼로그도 동일 규칙 적용.

## Disabled State

Figma `State=disabled` 스펙 (라이브러리 > Input 페이지):

| 속성 | 값 | Tailwind |
|---|---|---|
| fill | `muted` 토큰 | `bg-muted` |
| stroke | `border` 토큰 (불변) | — |
| opacity | 0.5 | `opacity-50` |

`input.tsx`에 이미 반영됨: `disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`

```tsx
<Input
  id="profile-email"
  value={user.email}
  disabled
  readOnly
/>
```

## Figma 판별 기준

- `mainComponent` 이름: "Input", "TextField"
- `componentProperties.State.value`: `default` / `error` / `disabled` / `focused`
- Error variant = Label `text-destructive` + Input `aria-invalid`

## Label 관련

shadcn `Label` 은 별도 파일 없음. Input 과 함께 사용:
- 에러 시: `className={errors.field ? "text-destructive" : ""}`
- `htmlFor` 로 Input `id` 와 연결
