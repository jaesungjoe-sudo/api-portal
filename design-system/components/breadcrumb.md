# Breadcrumb

> Page hierarchy navigation — shown at the top of every dashboard / docs / api-reference page. Last item is always the current page (no link). Pairs with `patterns/table-list-page.md` and `patterns/docs-page-shell.md`.

## Import

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
```

## Anatomy

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>API Keys</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

- **`Breadcrumb`**: wrapper `<nav>` with `aria-label="breadcrumb"`.
- **`BreadcrumbList`**: `<ol>` with `flex`, `flex-wrap`, `gap-1.5 sm:gap-2.5`, `text-sm`, `text-muted-foreground`.
- **`BreadcrumbItem`**: `<li>` — wraps each link / separator pair atomically.
- **`BreadcrumbLink`**: `<a>` — `transition-colors hover:text-foreground`.
- **`BreadcrumbPage`**: `<span>` — current page (no link). `aria-current="page"` automatically applied. `text-foreground` (not muted).
- **`BreadcrumbSeparator`**: chevron divider (default lucide `ChevronRight`).

## Standard structure — 3 levels

Every dashboard page uses the same 3-level pattern:

```
Home  →  Dashboard  →  {Current page}
```

| Page | Last item |
|---|---|
| `/api-keys` | `API Keys` |
| `/users` | `User & Team management` |
| `/users/team/[name]` | `{Team name}` (with `Users` as the parent link) |
| `/analytics` | `Analytics` |
| `/documentation/*` | `Documentation > {Page}` |
| `/api-reference/*` | `API Reference > {Page}` |

The DocsPageShell component takes a `breadcrumb` prop instead of raw children — it constructs the structure internally.

## Common patterns

### Table-list-page (manual JSX)

Used directly in `(dashboard)/*` pages:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Docs / API Reference (via DocsPageShell)

DocsPageShell exposes a typed prop instead of raw JSX:

```tsx
<DocsPageShell
  breadcrumb={[
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/documentation" },
    { label: "Inbound Calls" },  // last — no href → renders as BreadcrumbPage
  ]}
  ...
/>
```

Internally maps to the same Breadcrumb primitive.

### Detail pages with dynamic last segment

```tsx
// /users/team/[name]
<BreadcrumbItem>
  <BreadcrumbLink href="/users?tab=team">Users</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem><BreadcrumbPage>{decodeURIComponent(teamName)}</BreadcrumbPage></BreadcrumbItem>
```

Parent link should point back to the *tab* (`?tab=team`) so the user lands where they were.

## a11y

- `Breadcrumb` adds `aria-label="breadcrumb"` automatically — don't override.
- `BreadcrumbPage` adds `aria-current="page"` — screen reader announces it as the current location.
- Separators are decorative — `aria-hidden="true"` applied internally.

## Anti-patterns

| ❌ | 이유 |
|---|---|
| Last item rendered as `BreadcrumbLink` to the current page | a11y / convention — current page is not a link. Use `BreadcrumbPage`. |
| Custom `<nav>` + `<ol>` wrappers instead of `Breadcrumb` + `BreadcrumbList` | Skip primitive's a11y wiring + standardized typography. |
| Separator inline as a literal "/" or ">" character | Use `<BreadcrumbSeparator />` — primitive renders ChevronRight consistently. |
| Detail page parent link pointing to wrong tab | e.g. `/users` (User tab) when the user came from `/users?tab=team` — they get disoriented. Match the tab they came from. |
| 4+ levels deep | Phase1 keeps to 3 levels max. If hierarchy is deeper, consider whether the page structure is right. |

## Figma 판별 기준

- `mainComponent` 이름: "Breadcrumb"
- `componentProperties.Property` (있는 경우): item count
- 시각 spec: text-sm muted-foreground, ChevronRight separator (h-3.5 w-3.5)

## 주의사항

- shadcn 기본 `BreadcrumbList` 의 gap (`gap-1.5 sm:gap-2.5`) Figma 정합. 별도 override X.
- 모바일에서 wrap 가능 (`flex-wrap` 기본). 단 wrap 가 자주 일어나면 페이지 제목 길이를 재검토.
- 동적 라우트 segment 는 `encodeURIComponent` / `decodeURIComponent` 한 쌍으로 처리 (예: 팀 이름).
