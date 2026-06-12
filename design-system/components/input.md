# Input

## Import
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

## Default spec

- Height: `h-9` (default) / `h-8` (toolbar sm)
- Shadow: `shadow-xs`
- Width: `w-full` by default. If a fixed width is needed (like toolbar search), set `w-60`, etc. on the wrapper.

## Search input pattern

```tsx
<div className="relative w-60">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-8 h-8 text-sm" placeholder="Search …" />
</div>
```

## Form field + error state

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

## Validation rules

- On save/submit, if a required field is empty, show `aria-invalid={true}` + Label `text-destructive` + an error message.
- The moment the value changes, clear that field's error immediately.
- The same rule applies to Edit dialogs.

## Disabled State

Figma `State=disabled` spec (library > Input page):

| Property | Value | Tailwind |
|---|---|---|
| fill | `muted` token | `bg-muted` |
| stroke | `border` token (unchanged) | — |
| opacity | 0.5 | `opacity-50` |

Already reflected in `input.tsx`: `disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`

```tsx
<Input
  id="profile-email"
  value={user.email}
  disabled
  readOnly
/>
```

## How to identify in Figma

- `mainComponent` name: "Input", "TextField"
- `componentProperties.State.value`: `default` / `error` / `disabled` / `focused`
- Error variant = Label `text-destructive` + Input `aria-invalid`

## About Label

The shadcn `Label` has no separate file. Use it together with Input:
- On error: `className={errors.field ? "text-destructive" : ""}`
- Connect to the Input `id` via `htmlFor`
