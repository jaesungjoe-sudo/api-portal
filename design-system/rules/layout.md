# Layout rules

> Rules derived from recurring bugs. Always check before writing a new layout.

---

## 1. `h-screen` vs `min-h-screen` — height propagation in flex layouts

### Rule
A flex layout whose children use `h-full` must use **`h-screen`** on the root container. `min-h-screen` does not work.

### Why
`min-h-screen` only guarantees a minimum height and does not provide a definite height. A child's `h-full` references the parent's definite height, so under a `min-h-*` parent it collapses to 0 or the content size.

```tsx
// ❌ Sidebar h-full collapses
<div className="flex min-h-screen flex-col">
  <TopNav />                        {/* 69px */}
  <SidebarProvider className="flex-1">
    <Sidebar collapsible="none" />  {/* h-full → collapses to 0 */}
    <main>...</main>
  </SidebarProvider>
</div>

// ✅ Sidebar h-full works correctly
<div className="flex h-screen flex-col">
  <TopNav />                        {/* 69px */}
  <SidebarProvider className="min-h-0 flex-1">
    <Sidebar collapsible="none" />  {/* h-full → 100vh - 69px */}
    <main>...</main>
  </SidebarProvider>
</div>
```

### When to apply
- Fixed header + sidebar + scrolling content structure → always `h-screen`
- Simple page (no header, natural scroll) → `min-h-screen` is fine

---

## 2. `overflow-auto` on a flex child — `min-h-0` required

### Rule
To use `overflow-auto` (or `overflow-scroll`) on a flex child, you must also use **`min-h-0`**.

### Why
A flex child's default `min-height` is `auto` (content size). In that state flex won't shrink the child below its content size, so `overflow-auto` is never triggered. You must lower the minimum to 0 with `min-h-0` so the flex algorithm constrains the child's height and overflow kicks in.

```tsx
// ❌ Content overflows the viewport, no scroll
<main className="flex-1 overflow-auto">...</main>

// ✅ Scrolls correctly in a flex context
<main className="min-h-0 flex-1 overflow-auto">...</main>
```

Horizontal scroll in flex-col is the same: `min-w-0 overflow-x-auto`.

---

## 3. shadcn component default sizes — always check against Figma values

### Rule
shadcn components may have internal padding/height that differs from the Figma spec. For components where height/spacing matters — layout, sidebar, navigation — **visually verify in the browser right after writing the code**.

### Known defaults

| Component | shadcn default | Figma spec | Override |
|---|---|---|---|
| `SidebarMenuButton` | `p-2` → ~36px | 44px | `h-11 py-0` |
| `SidebarHeader` | `flex-col p-2` | 44px | `h-11 justify-center py-0` |
| `SidebarContent` | `py-2` includes margin | 0px margin | `py-0` |

### Beware of the flex axis direction
`SidebarHeader` is `flex-col`.
- `items-center` → **horizontal** center (content drifts to the center of the sidebar width) ← wrong
- `justify-center` → **vertical** center ← correct

---

## 4. Full dashboard layout pattern (reference)

```tsx
// Fixed header + inline sidebar + scrolling main structure
<div className="flex h-screen flex-col">
  <Header className="shrink-0" />          {/* fixed height */}
  <SidebarProvider className="min-h-0 flex-1" style={{ minHeight: 0 }}>
    <Sidebar collapsible="none" />          {/* h-full works */}
    <main className="min-h-0 flex-1 overflow-auto">
      {children}
    </main>
  </SidebarProvider>
</div>
```
