# Typography roles (Role → Class)

> A lookup table that organizes the text class combinations scattered across the code under **semantic role names**. The code still uses Tailwind utilities directly — this document is merely a *role → class mapping reference* and does not define new CSS utilities.

---

## 1. Scope — shadcn primitives excluded

The scope of this rule is **page level (h1/h2/h3, body, caption) and domain components** (EmptyState / TeamCard / DocsSection etc. in `src/components/api-portal/*`).

| Area | This rule applies |
|---|---|
| Pages (`/users`, `/api-keys`, `/documentation/*`, etc.) | ✅ |
| Domain components (`src/components/api-portal/*`) | ✅ |
| **Inside shadcn primitives** (`src/components/ui/*`) | ❌ Out of scope |
| Catalog pages (`/design-system/*`) | ✅ |

### Why shadcn primitives are out of scope

shadcn primitives carry **hardcoded typography decisions** inside themselves — `DialogTitle = text-lg font-semibold`, `Label = text-sm font-medium`, `TableHead = text-sm font-medium`. These are not subject to change per shadcn's design philosophy (see the conversion conventions in `rules/shadcn.md`).

If a primitive's typography *happens to match* some role in this table, it's validated; if it differs, we accept that as the primitive's decision. This table does *not interfere* with primitives.

> **Practical result**: adding a new shadcn component (e.g. `Tooltip`, `Hover Card`) doesn't conflict with this document. The primitive arrives with its own typography, and we are only responsible for the page / domain typography on top of it.

---

## 2. Role table

12 roles. Each role is a *cluster label* — in code you write the right-hand classes directly, and this table is a reference for *where it's used / why this combination*.

### 2.1 Heading family

| Role | Class | Where used | Frequency |
|---|---|---|---|
| `display` | `text-5xl md:text-6xl font-semibold tracking-tight text-foreground` | Landing hero | 5 |
| **`page-title`** (dashboard) | `text-3xl font-semibold text-foreground` | `<h1>` — `/users`, `/api-keys`, `/analytics`, etc. table-list-page | 15 |
| **`page-title`** (docs) | `text-4xl font-semibold text-foreground` | `<h1>` — `/documentation/*`, `/api-reference/*` (uses DocsPageShell) | 2 |
| **`section-title`** (docs body) | `text-2xl font-semibold text-foreground` | `<h2>` — inside DocsSection | 5 |
| **`section-title`** (catalog) | `text-xl font-semibold text-foreground` | `<h2>` — catalog page sections | 10 |
| `card-title-lg` | `text-lg font-semibold text-foreground` | Large card headers such as TeamCard | 3 |
| `card-title` | `text-base font-medium text-foreground` | EmptyState title, DemoCard, and other general card headers | 9 |

### 2.2 Body / Supportive family

| Role | Class | Where used | Frequency |
|---|---|---|---|
| `label` | `text-sm font-medium text-foreground` | Form Label, small sub-heading | 12 |
| `body` | `text-base text-muted-foreground` | Page description (below h1) | 14 |
| `body-sm` | `text-sm text-muted-foreground` | Card description, table secondary cell, general supportive text | 25+ |
| `caption` | `text-xs text-muted-foreground` | Metadata, footer notes, supportive hints | 12 |
| `error` | `text-sm text-destructive` | Form validation error message | 5+ |

### 2.3 Code / Link family

| Role | Class | Where used |
|---|---|---|
| `code-inline` | `rounded-sm bg-muted px-1 py-0.5 font-mono text-sm` | Inline `<code>` within body (emphasizing property names·identifiers) |
| `code-block` | `font-mono text-xs` or `text-sm` + `bg-muted/30 p-4 rounded-md` | Code snippet block |
| `link` | `text-info hover:underline` | cross-ref / external link |

---

## 3. Two variants of the same role — page-title / section-title

These two roles have intentional size variants.

### `page-title` — dashboard vs docs

| Variant | Class | Applied to |
|---|---|---|
| **dashboard** | `text-3xl font-semibold` | table-list-page pattern (table-centric content — too large a header breaks the visual hierarchy) |
| **docs** | `text-4xl font-semibold` | docs-page-shell pattern (long body — the title clearly marks the starting point) |

→ Which variant is **decided by the page pattern** (`patterns/table-list-page.md` / `patterns/docs-page-shell.md`). Don't change arbitrarily.

### `section-title` — docs body vs catalog

| Variant | Class | Applied to |
|---|---|---|
| **docs body** | `text-2xl font-semibold` | Inside DocsSection (a clear child of h1 text-4xl) |
| **catalog** | `text-xl font-semibold` | Catalog page sections (a clear child of h1 text-3xl) |

→ Maintain hierarchy consistency per pattern — h2 also steps down to match the h1 size.

---

## 4. Usage examples

### 4.1 Standard page header

```tsx
// Dashboard (table-list-page)
<h1 className="text-3xl font-semibold text-foreground">{title}</h1>     {/* page-title (dashboard) */}
<p className="text-sm text-muted-foreground">{subtitle}</p>              {/* body-sm */}

// Docs (docs-page-shell)
<h1 className="text-4xl font-semibold text-foreground">{title}</h1>     {/* page-title (docs) */}
<p className="text-base text-muted-foreground">{description}</p>         {/* body */}
```

### 4.2 Card header + body

```tsx
<div className="rounded-md border border-border bg-card p-4">
  <h3 className="text-base font-medium text-foreground">{cardTitle}</h3>  {/* card-title */}
  <p className="text-xs text-muted-foreground">{cardCaption}</p>          {/* caption */}
</div>
```

### 4.3 Form field + error

```tsx
<Label className="text-sm font-medium text-foreground">Email</Label>     {/* label */}
<Input ... />
{error && (
  <p className="text-sm text-destructive">Email is required</p>           {/* error */}
)}
```

### 4.4 EmptyState

```tsx
<EmptyState
  variant="no-data"
  icon={<UserCheck />}
  title="No pending approvals"        // internally applies card-title (text-base font-medium)
  description="..."                    // internally applies body-sm (text-sm muted)
/>
```

---

## 5. Intentional omissions / future additions to consider

| Undefined area | Reason |
|---|---|
| Marketing page typography beyond `display` | The marketing area has its own rules like the brand token (see `rules/color.md`) — outside Phase1 |
| Inline `text-foreground font-mono` (without a chip) | Uncommon — handle case-by-case when needed |
| Heading anchors / TOC item typography | DocsSection / TocSidebar handle it themselves (see `patterns/docs-page-shell.md`) |
| Separate mobile size variants (e.g. shrinking page-title on mobile) | Not currently used in code — define linked to `rules/responsive.md` when needed |

---

## 6. Anti-patterns

| ❌ | Reason |
|---|---|
| Using an arbitrary class combination not in this table (e.g. `text-[22px] font-semibold`) | Pick a similar role from the table — if none, a decision to add is needed (ask the user) |
| Overriding a shadcn primitive's internal typography with this table (`<DialogTitle className="text-2xl">`) | The primitive owns its typography — out of scope (§1). If needed, edit the primitive directly (`rules/shadcn.md` rule 10). |
| Mixing page-title variants on the same page (using `text-4xl` on a table-list-page) | Breaks the per-pattern hierarchy. The pattern decides the variant. |
| Writing body with `text-sm font-medium` (when it's the label role) | label is only for form fields / small sub-headings. body is `text-sm text-muted-foreground`. |
| Creating new semantic meaning for usages outside this table | The table is *the cluster label of current code* — when making a new pattern, add a row to the table first, then use it. |

---

## 7. When updating this table

- When a new typography combination is intentionally introduced into the code, update this table
- If a class combination not in the table appears in code, do **one of two things**:
  - Migrate to an existing role (change the Tailwind class)
  - Add a new role to the table (when enough usage cases have accumulated)
- Arbitrary additions are discouraged — *clustering* is the value of this table, so don't add a new role from just 1-2 cases

---

## 8. Related documents

- `rules/shadcn.md` — shadcn primitive conversion conventions (outside this rule's scope)
- `rules/color.md` — color tokens (typography's `text-foreground`, `text-muted-foreground`, etc. depend on them)
- `rules/responsive.md` — responsive (page-title currently has no per-BP size variant, but possible in the future)
- `patterns/table-list-page.md` — page-title (dashboard variant) usage
- `patterns/docs-page-shell.md` — page-title (docs variant) + section-title usage
- `components/empty-state.md` — card-title / body-sm usage (update spec after introducing this table)
- `rules/states.md` — body-sm / error role usage (update spec after introducing this table)
