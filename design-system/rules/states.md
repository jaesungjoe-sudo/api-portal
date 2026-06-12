# Screen state rules (Loading / Empty / Error / Disabled)

> The area that diverges first the moment a new screen connects to backend data. The truth source differs per state, so check the §1 boundary table first.

---

## 1. Truth source boundaries

"Where the answer comes from" differs per state. This document is a hybrid rule with clear boundaries.

| State | Truth source | Prescription summary |
|---|---|---|
| **Loading** | Figma library `Skeleton` (code: `src/components/ui/skeleton.tsx`) | Use the primitive as-is, only compose the shape per surface |
| **Empty** | **Defined by this document** (no dedicated component in the library) | EmptyState baseline = this document §4 + `components/empty-state.md` |
| **Error** | Reuse shadcn `Alert` + this document defines the pattern | Page/section = Alert(destructive)+retry, transient = toast |
| **Disabled** | Existing rules (CLAUDE.md / `instance-variant.md`) | Not redefined here, cross-ref only |

### Lifetime conditions

- Empty is currently the truth of this document because the library has no dedicated component. **From the moment an `EmptyState` component is added to the library**, this document is demoted to a library alignment guide, and the baseline spec in `components/empty-state.md` migrates to the library spec.
- Loading / Error are based on the library/existing primitives, so they have no lifetime condition.

---

## 2. Surface × state matrix

Vertical axis = the surface where the state is shown, horizontal axis = the state. Each cell is the standard prescription.

| Surface | Loading | Empty | Error |
|---|---|---|---|
| **Full-page transition** | Block skeleton (header outline + body area) | — (usually a sub-surface handles it) | Alert destructive + retry in place of the page |
| **Table** | row skeleton ×N (keep the header) | EmptyState `no-data` / `no-results` if it's search results | Alert + retry in place of the table |
| **Card grid** | Card skeleton ×N | EmptyState (in place of the grid) | Alert + retry |
| **Form** | Field skeleton (during Edit pre-fill loading) | — | Alert above the fields / per-field `aria-invalid` |
| **Chart** | Chart area skeleton box | EmptyState `no-data` (in place of the chart) | Alert (in place of the chart) |
| **Inline action button** | **disabled only** (no spinner) | — | toast (transient error) |

### Simple rule for inline actions

The library has no spinner component, and there is no timing infrastructure for over-1-second (timer hooks etc.), so **keep inline actions simple with disabled only**. Once cases of actions taking over 1 second accumulate in real API integration, add a separate definition then.

### List (non-table) surfaces are currently undefined

E.g. Documentation Quick Links, Sidebar menu, TopApis rows — the rules for when these surfaces are empty or loading are not yet defined. Add a row to this matrix when a screen that needs it comes in.

---

## 3. Loading detail

### 3.1 Using the Skeleton primitive

- All loading placeholders use `<Skeleton />` from `src/components/ui/skeleton.tsx`. Don't create a new raw `animate-pulse bg-muted` pattern.
- Repeating units like rows/cards should match the same height·radius·spacing as the actual content of the same component to minimize layout shift.

```tsx
// ✅ Table row skeleton — keep the header, replace only the body
<TableBody>
  {Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      ...
    </TableRow>
  ))}
</TableBody>
```

### 3.2 Page/sort transitions — keeping rows recommended

In re-fetches where **the existing data context is preserved**, like sort·page transitions, don't swap whole rows for skeletons. For instant responses (mock / client-side sort), an indicator is unnecessary; for server sort·server pagination and other cases with visible latency, show a **2px thin indeterminate bar above the table header**.

> **Define the component at adoption time.** This PR's scope only recommends the rule and doesn't create a separate `TableLoadingBar`. shadcn `Progress` doesn't support indeterminate by default, so define a dedicated component when actually needed.

### 3.3 Background revalidation of cached data

When revalidating in the background stale-while-revalidate style after a cache hit, **no indicator**. It's natural for the user to see cached data immediately, and the revalidation itself shouldn't become noise.

> No case currently applies. Apply this rule when a data-fetching library like SWR / React Query is introduced.

---

## 4. Empty detail

### 4.1 Using the EmptyState component

Express every case of an empty surface body with the `EmptyState` component. Don't use a simple text fallback like `<p>No data</p>` directly.

- Component spec: see **`design-system/components/empty-state.md`**.
- 2 variants: `no-data` (no data at all) / `no-results` (no search·filter results). The copy and CTA policy differ.

### 4.2 Delegating container padding

EmptyState itself has no outer padding (see anti-pattern). **The container provides the vertical padding appropriate to the surface.**

| Surface | Recommended padding |
|---|---|
| Table body / card grid | `py-16` (64px) |
| Chart | `py-10` (40px) |
| Form | `py-8` (32px) |
| Widget inside a card (small area) | `py-6` (24px) |

> The values above are recommendations. When the real Figma design comes in, you can adjust to those values. But keep the hierarchy between surfaces (table is largest, widget is smallest).

```tsx
// ✅ Empty table — the container provides py-16
<TableBody>
  <TableRow>
    <TableCell colSpan={COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<Key />}            // use the Figma inspection result
        title="No API keys yet"
        description="Create your first key to start integrating."
        action={{ label: "Create API key", onClick: openCreate }}
      />
    </TableCell>
  </TableRow>
</TableBody>
```

---

## 5. Error detail

### 5.1 3 categories

| Category | Prescription | Example |
|---|---|---|
| **Permanent/blocking** | `Alert variant="destructive"` + retry button in place of that surface. Page level if the whole page fails. | No permission, data fetch failure, missing dependent resource |
| **Transient/action error** | `toast` (sonner wrapper) | Save failure, transient network error |
| **Form validation error** | Existing rule — `aria-invalid` + per-field inline message. Not redefined here. | Missing required value, format error |

### 5.2 Decision tree — in-surface vs page level

> **When in doubt, choose the narrower scope.** Before covering the whole page with an error screen, confirm that every part of the page is truly meaningless.

- Only the body fails out of header + body → Alert only in place of the body
- Only one chart fails → Alert only in place of that chart (the other cards are fine)
- All page content depends on the same fetch and it fails → page-level Alert

### 5.3 Button rule exception — action buttons inside an Alert

> ⚠️ **An explicit exception to the Button rule in CLAUDE.md / `components/button.md`**

Action buttons inside an Alert (retry / refresh etc.) use the following:

```tsx
<Button variant="outline" size="sm" onClick={retry}>
  Retry
</Button>
```

- `variant="outline"` + `size="sm"` allowed.
- **Rationale**: an Alert is a secondary area with less visual weight than the page's main content, and a `default`-size Button (h-9) breaks the visual hierarchy against the Alert body text (`text-sm`).
- **Scope limited**: this exception is **limited to inside an Alert**. Button sizes/variants on other surfaces — page header actions, Dialog footer, table toolbar, etc. — follow the **existing Button rule (Figma `componentProperties` 1:1 match) as-is**.

### 5.4 Placement of the retry button inside an Alert

**inline + left-aligned** below the description. Don't put it in a separate dismiss area like the top-right X of the Alert.

```tsx
<Alert variant="destructive">
  <AlertTitle>Failed to load API keys</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
    <div className="mt-3">
      <Button variant="outline" size="sm" onClick={retry}>Retry</Button>
    </div>
  </AlertDescription>
</Alert>
```

### 5.5 Don't expose raw backend error messages

Don't expose `err.message`, stack traces, or status code strings directly to the user. Use copy generalized into user language + (developer console logs are separate).

```tsx
// ❌
<AlertDescription>{err.message}</AlertDescription>

// ✅
<AlertDescription>
  Failed to load API keys. Please try again.
</AlertDescription>
```

### 5.6 Optimistic update rollback

- Judge case by case. The key is that **the rollback must be visible to the user**.
- On failure, revert the UI state to the previous value and **notify the failure with a toast**. No silent rollback.

---

## 6. Disabled

No new definition. Keep only the following cross-refs.

- **Form field disabled** — applied only when Figma `componentProperties.State === "disabled"` (CLAUDE.md / `rules/instance-variant.md`).
- **Button disabled (action in progress)** — see the "inline action button" cell of the §2 matrix in this document (disabled only, no spinner).
- **Menu item disabled (permissions etc.)** — case by case. But if the disabled reason is the kind that "unlocks when some condition is met", **showing the reason with a Tooltip is recommended** ("The Default team can't be deleted", etc.).

---

## Related documents

- `components/empty-state.md` — EmptyState component spec (subject to the §1 lifetime condition of this document)
- `components/alert.md` — Alert primitive spec (the basis of the Error prescription)
- `components/button.md` — Button rule (the body of the §5.3 exception)
- `rules/instance-variant.md` — Disabled identification criteria
- `icons.md` — EmptyState icon selection workflow (Figma inspect → lucide → ask if missing)
