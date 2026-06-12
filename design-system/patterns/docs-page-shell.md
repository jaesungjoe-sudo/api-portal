# docs-page-shell pattern

> The standard shell for Documentation and API Reference pages. Breadcrumb → (Tag?) → Title → Description → Sections (+TOC) → Prev/Next footer. This pattern is enforced through the single `<DocsPageShell>` component; the call site just fills in props.

## Where used

- `/documentation` and `/documentation/*` — Quick Start, Inbound Calls, Tutorials, and all other Documentation pages
- `/api-reference/*` — Create Call (implemented), Get Call / Update Call (placeholder)

Tables / forms / landing pages are not covered by this pattern. For list-type pages use `patterns/table-list-page.md`; for dialogs use `patterns/form-dialog.md` / `patterns/confirm-dialog.md`.

---

## 1. Usage — the `DocsPageShell` component

Every page in this pattern is built with the **single `<DocsPageShell>` component**. Do not assemble Breadcrumb / Title / TOC, etc. directly.

```tsx
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";
import { MethodBadge } from "@/components/api-portal/MethodBadge";

export default function MyDocsPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "My Page" },
      ]}
      tag={<MethodBadge method="POST" />}  // optional
      title="My Page"
      description="One-line intent for the reader."
      toc={[
        { id: "intro", label: "Introduction" },
        { id: "usage", label: "Usage" },
      ]}
      next={{ label: "Next Page", href: "/documentation/next" }}
    >
      <DocsSection id="intro" title="Introduction">
        <p>...</p>
      </DocsSection>
      <DocsSection id="usage" title="Usage">
        <p>...</p>
      </DocsSection>
    </DocsPageShell>
  );
}
```

---

## 2. Props

| Prop | Type | Required | Usage |
|---|---|---|---|
| `breadcrumb` | `{ label: string; href?: string }[]` | ✅ | Breadcrumbs. The last item has no `href` — automatically recognized as the current page (BreadcrumbPage). |
| `tag` | `React.ReactNode` | — | Slot above the Title — e.g. the method badge in API Reference. If absent, the Title sits right below the breadcrumb. |
| `title` | `string` | ✅ | `<h1>` page title. `text-4xl font-semibold` applied automatically. |
| `description` | `string` | — | One-line description below the Title. `text-base text-muted-foreground`. |
| `toc` | `{ id: string; label: string }[]` | — | TOC items. Automatically rendered both as the right TocSidebar (xl and up) and the in-body MobileToc (below xl). The id must match `DocsSection.id` for scrollSpy to work. |
| `prev` | `{ label: string; href: string }` | — | Prev link on the left of the footer. |
| `next` | `{ label: string; href: string }` | — | Next link on the right of the footer. |
| `children` | `React.ReactNode` | ✅ | The `<DocsSection>`s. Plain `<p>` / `<div>` also work, but DocsSection is recommended to integrate with the TOC. |

---

## 3. Anatomy

```
┌─ DocsPageShell (max-w-1160, gap-10 center column + right TOC) ──────────────┐
│                                                                              │
│  Breadcrumb                                                                  │
│                                                                              │
│  (tag — optional, mb-3)                                                      │
│                                                                              │
│  <h1> Title — text-4xl font-semibold                                         │
│  description — text-base text-muted-foreground                               │
│                                                                              │
│  [MobileToc — shown only below xl]                                           │
│                                                                              │
│  DocsSection #1 (id="intro")                                                 │
│    <h2> Introduction — text-2xl font-semibold                                │
│    body — text-base text-muted-foreground                                    │
│  DocsSection #2 (id="usage")                                                 │
│  ...                                                                         │
│                                                                              │
│  ─────────────────                                                           │
│  [prev]                                                          [next →]    │
│                                                                              │
└───────────────────────────────────────────────────────────────  ─────────────┘
                                                                  TocSidebar
                                                                  (xl and up,
                                                                   sticky)
```

Layout essentials:
- Outer `<div className="flex justify-center px-6 pb-20 pt-10 md:px-10">` — center alignment + top/bottom padding
- Inner `<div className="flex w-full max-w-[1160px] gap-10">` — body (`flex-1`) + right TocSidebar (`w-[265px]`)
- Body wrapper: `<div className="min-w-0 flex-1">` — `min-w-0` handles child overflow correctly
- Body sections wrapper: `<div className="flex flex-col gap-10">` — 40px gap between sections (same value as the table-list-page wrapper, intentional consistency)

---

## 4. Title typography — `text-4xl` (differs from table-list-page)

| Pattern | h1 class | Reason |
|---|---|---|
| table-list-page | `text-3xl font-semibold` (30px) | Page content is a data table — too heavy a header throws off the visual hierarchy |
| **docs-page-shell** | `text-4xl font-semibold` (36px) | Page content is long-form body — the title must clearly separate the start of the body |

→ An intentional difference between the two patterns. Don't confuse table-list-page with docs-page-shell (e.g. don't apply table-list-page styling to an API Reference page).

---

## 5. The `DocsSection` helper

```tsx
<DocsSection id="usage" title="Usage">
  <p>...</p>
  <CodeBlock>...</CodeBlock>
</DocsSection>
```

- `id` required — integrates with TOC scrollSpy
- `title` — `<h2 className="text-2xl font-semibold">`
- children wrapper — `<div className="flex flex-col gap-3 text-base leading-6 text-muted-foreground">` (12px gap between elements inside the section; body is automatically muted-foreground)
- A plain `<p>` automatically gets styled by the wrapping. If you need emphasized text, override with `<span className="text-foreground font-medium">`.

---

## 6. TOC integration

Providing the `toc` prop automatically renders two things:

| Component | Position | Display condition |
|---|---|---|
| `TocSidebar` | Right sticky, `w-[265px]` | xl and up (1280px+) |
| `MobileToc` | Top of body, `<details>` collapsible | below xl |

scrollSpy (the `useScrollSpy` hook) tracks the section id in the current viewport and highlights the active item. `DocsSection.id` and `toc[].id` must match exactly for it to work.

---

## 7. Prev / Next footer nav

```tsx
prev={{ label: "Quick Start", href: "/documentation" }}
next={{ label: "Inbound Calls", href: "/documentation/inbound-calls" }}
```

- Both optional. If only one is present, only that side shows.
- Visuals — outer `border border-border bg-background ... hover:bg-accent` (looks similar to an outline Button, but is an anchor tag).
- The footer is separated from the body by `border-t border-border` + `pt-10 mt-12`.

---

## 8. The `tag` prop — added 2026-05-29

A slot added to display a method badge (GET / POST / PATCH, etc.) above the Title on API Reference pages.

```tsx
<DocsPageShell
  tag={<MethodBadge method="POST" />}
  title="Create Call"
  ...
>
```

- Position: below the Breadcrumb, above the Title. `mb-3` gives a 12px gap from the Title.
- Previously worked around with an inline `PostBadge()` component + a `-mt-6` margin hack → formalized as the `tag` prop.
- Usable on pages beyond API Reference (status badge, version badge, etc.).

---

## 9. Anti-patterns

| ❌ | Reason |
|---|---|
| Assembling Breadcrumb / Title / TocSidebar, etc. directly | `<DocsPageShell>` is enforced. Risk of deviating from the rules (breaks max-width / gap / typography consistency). |
| Writing `<h1>` directly inside `<DocsPageShell>` | The Title is passed as a prop. `text-4xl font-semibold` is applied automatically. |
| Mismatch between `DocsSection`'s `id` and `toc[].id` | scrollSpy can't track the active item. The TOC active state won't show. |
| Expressing a badge above the Title with an inline `*Badge()` + margin hack | Use the `tag` prop. (Formalized 2026-05-29.) |
| Using a table-list-page-toned `text-3xl` Title | docs-page-shell is `text-4xl`. The shell applies it itself — attempting to override is itself a rule violation. |
| Defining a custom helper like `<Section>` yourself | Reuse `<DocsSection>`. id + title + children wrapping is the standard. |
| Missing `min-w-0` on the body wrapper | Long code blocks/tables break the layout on horizontal overflow. |

---

## 10. Pages using it (Phase1)

| Page | Implementation status | tag |
|---|---|---|
| `/documentation` (Quick Start) | ✅ fully implemented (5 sections) | — |
| `/documentation/inbound-calls` | ✅ fully implemented (5 sections) | — |
| `/documentation/tutorials` | Placeholder | — |
| `/documentation/*` (remaining 8 pages) | Blank | — |
| `/api-reference/create-call` | ✅ fully implemented (10 sections) | POST badge |
| `/api-reference/get-call` | Placeholder | GET badge |
| `/api-reference/update-call` | Placeholder | PATCH badge |

---

## Related docs

- `components/breadcrumb.md` — Breadcrumb primitive (to be written)
- `patterns/table-list-page.md` — dashboard page pattern (contrast)
- `patterns/form-dialog.md` / `patterns/confirm-dialog.md` — dialog patterns (contrast)
- `components/badge.md` — Badge / MethodBadge frequently used in the `tag` prop
