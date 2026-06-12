# Responsive / breakpoint rules

> Specifies the semantics of "when to use sm/md/lg/xl". Recording *which transition point* a BP is — not just a pixel value — keeps new screens splitting at consistent breakpoints.

---

## 1. Breakpoint meaning table

Use Tailwind defaults as-is. Each BP has a **distinct transition meaning** (not just pixels).

| BP | Px | Semantic intent | Main usage |
|---|---|---|---|
| (base) | 0 | **Mobile-first** — the narrowest state | 1-col layout, full-width dialog, hamburger menu |
| **`sm`** | 640 | Dialog leaves mobile full-width / first grid split | `sm:max-w-[423px]` (form-dialog), `sm:grid-cols-2`, `sm:flex-row` (DialogFooter) |
| **`md`** | 768 | **Sidebar display transition point** + page padding expansion + inline nav display | `md:block` (sidebar), `md:px-10`, `md:flex` (TopNav main menu), `md:grid-cols-2` |
| **`lg`** | 1024 | Desktop tone — TopNav search bar shown inline, grid 3-4 col | `lg:flex` (TopNav search bar), `lg:grid-cols-3` / `lg:grid-cols-4` |
| **`xl`** | 1280 | Wide desktop — **TocSidebar beside/above transition** | `xl:block` (TocSidebar), `xl:hidden` (MobileToc) |
| `2xl` | 1536 | **Not used** (current policy) | — |

→ **2xl unused policy**: the Phase1 design doesn't separately design for 1440px+. If Figma later defines a 2xl layout, introduce it then.

---

## 2. Mobile-first principle

The base class = mobile state. BP suffixes **evolve upward**.

```tsx
// ✅ Mobile-first — base 1 col, 2 col at md+, 4 col at lg+
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ❌ Avoid desktop-first — branching with `md:hidden` alone risks flicker/SSR mismatch on mobile
<div className="grid-cols-4 md:hidden">  // bad pattern
```

`md:hidden` / `xl:hidden` themselves are OK (when paired with another element — e.g. Sidebar md:block + SidebarTrigger md:hidden). The principle is just not to write a single element desktop-first.

---

## 3. Page wrapper padding standard

```tsx
<div className="px-6 py-10 md:px-10">
```

- **Mobile**: `px-6` (24px)
- **md+**: `px-10` (40px)
- Vertical padding is consistent (`py-10` etc.)

This rule applies identically to **all pages·catalogs·DocsPageShell**. No separate decision needed when writing a page wrapper.

Exception: full-bleed pages (e.g. the landing Hero area) — a separate pattern.

---

## 4. Container max-width rule

max-width differs per page type. Intentionally matched to body readability·content type.

| Page type | max-width | Reason |
|---|---|---|
| Dashboard (table-list-page) | **none** — fills with `flex-1` | The table uses the full available width |
| docs-page-shell | `max-w-[1160px]` | Max width for the body + TocSidebar combination |
| Catalog page | `max-w-4xl` (896px) | Comfortable body reading width |
| form-dialog | `sm:max-w-[423px]` | Figma alignment |
| confirm-dialog | `sm:max-w-[512px]` | Figma alignment |

→ Decide a new page into one of the 5 categories above. Check this table before using an arbitrary value.

---

## 5. Known responsive patterns

### 5.1 Sidebar: md hamburger ↔ inline aside

```tsx
// Common to AppSidebar / DocsSidebar / CatalogSidebar
if (isMobile) {
  return <Sheet>...drawer...</Sheet>;
}
return (
  <aside className="sticky top-[69px] hidden ... md:block">
    ...
  </aside>
);
```

- Mobile (below md): `<SidebarTrigger>` hamburger → `<Sheet>` drawer
- md+: fixed sticky `<aside>` (255px)
- Uses the `isMobile` hook of `SidebarProvider` (shadcn)

### 5.2 TopNav stepwise shrinking

```tsx
<SidebarTrigger className="mr-2 md:hidden" />        {/* mobile hamburger */}
<nav className="hidden items-center gap-3 md:flex">  {/* main menu */}
<div className="hidden ... lg:flex">                 {/* search bar */}
<Button className="lg:hidden" aria-label="Search">   {/* search icon only */}
<span className="hidden sm:inline">Ask AI</span>     {/* Ask AI label */}
```

3-step shrinking:
- **Below sm**: Ask AI = icon-only
- **Below md**: main nav hidden, SidebarTrigger shown
- **Below lg**: search bar hidden, search icon only

### 5.3 TocSidebar: xl beside ↔ MobileToc above

```tsx
// Right-side TocSidebar — xl and up
<aside className="sticky top-[89px] hidden ... xl:block">

// MobileToc at the top of the body — below xl
<details className="... xl:hidden">
```

- Both render from the same `toc[]` prop (handled inside DocsPageShell)
- Below xl it becomes a collapsible `<details>` above the body
- At xl+ it's a right-side sticky sidebar

### 5.4 Grid split steps

| Pattern | Class |
|---|---|
| Card grid (2 col) | `grid grid-cols-1 sm:grid-cols-2` |
| Card grid (3 col) | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Card grid (4 col) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| TeamCard (3 col variant) | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3` |

Base 1 col → first split at sm → multi-tier at md/lg. xl usage depends on content density.

### 5.5 Dialog responsive width

```tsx
<DialogContent className="sm:max-w-[423px]">
```

- Mobile (below sm): `calc(100% - 2rem)` from full-width (`DialogContent` default)
- sm+: fixed max-width (423 form / 512 confirm)
- `DialogFooter` is `flex-col-reverse` on mobile (CTA on top) → `flex-row sm:justify-end` at sm+

### 5.6 Page header stacked → row (Analytics)

```tsx
<div className="flex flex-col md:flex-row ...">
```

- Mobile: vertical stack
- md+: horizontal alignment

Used in the Analytics header, Toolbar, etc.

---

## 6. Anti-patterns

| ❌ | Reason |
|---|---|
| Arbitrary BP — magic numbers like `min-w-[1234px]`, `lg:max-w-[1200px]` | Violates the §4 max-width table. Only Tailwind BP + defined values. |
| Using `2xl:` | §1 policy — unused until Figma defines a 2xl design. |
| Branching a single element with `md:hidden` alone (without a pair) | Desktop-first tone. There must be a pair (another element with md:block). |
| A page wrapper using a value other than `px-6 md:px-10` | Violates the §3 standard. |
| Using `sm:` only and missing `md:` (for large content like tables) | The visual hierarchy breaks on tablet (md). Stepwise evolution sm → md → lg is recommended. |
| Rendering completely different component trees per BP (`md:hidden` `<MobileFoo />` + `hidden md:block` `<DesktopFoo />`) | DOM duplication. If possible, have the same component adapt to the BP. (Only when unavoidable — like Sheet vs aside.) |

---

## 7. Sidebar / Toaster / external layout impact

This pattern covers only *how a component adapts within a layout*. The following are separate rules:

- **The sidebar layout itself** — `(dashboard)/layout.tsx`, `(docs)/layout.tsx`, etc. define the SidebarProvider + aside combination. cross-ref `patterns/docs-page-shell.md`.
- **Mobile Sheet drawer** — shadcn `Sheet` primitive rules. The isMobile check happens inside the sidebar component.
- **Toaster position** — same bottom-right of the screen even on mobile. No separate responsive branching.

---

## 8. Related documents

- `patterns/docs-page-shell.md` — TocSidebar / MobileToc xl transition
- `patterns/table-list-page.md` — page wrapper padding (px-6 md:px-10), Toolbar responsiveness
- `patterns/form-dialog.md` / `patterns/confirm-dialog.md` — Dialog sm:max-w
- `components/dialog.md` — DialogFooter mobile flex-col-reverse
- `rules/layout.md` — h-screen / overflow / sidebar height rules
