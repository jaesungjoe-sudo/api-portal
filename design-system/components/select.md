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

## Default spec

- `SelectTrigger` default width: **`w-full`** (auto-fills within forms)
- Shadow: `shadow-xs`
- Override with `className="w-fit"` only when content width is needed, like toolbar / inline dropdowns

## Form field + error state

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

The Figma library Select has no `State=disabled` variant.
Apply uniformly, identical to the Input disabled spec:

| Property | Value | Tailwind |
|---|---|---|
| fill | `muted` token | `bg-muted` |
| opacity | 0.5 | `opacity-50` |

Already reflected on the `select.tsx` SelectTrigger: `disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`

```tsx
{/* The user's own Role can't be edited → disable the Select */}
<Select value={user.role} disabled>
  <SelectTrigger id="profile-role">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="developer">Developer</SelectItem>
  </SelectContent>
</Select>
```

## SelectContent (Menulist) spec

Follows the popover spec in the Menulist section of `design-system/components/popover.md`.

## Validation rules

- Apply `aria-invalid={errors.field}` to the SelectTrigger.
- Clear that field's error immediately on value change.

## How to identify in Figma

- `mainComponent` name: "Select", "Dropdown", "Menulist"
- `componentProperties.State.value`: `default` / `open` / `error` / `disabled`
- If fill container, use `w-full` (keep the default); if hug contents, use `className="w-fit"`

## Notes

- `w-full` is the SelectTrigger default, so no need to set it explicitly.
- If a fixed width must be enforced, adjust it on the parent wrapper.
