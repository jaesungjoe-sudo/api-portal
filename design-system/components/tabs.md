# Tabs

Underline-less text-only tab switcher. Wraps Base UI `@base-ui/react/tabs`.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
```

## API

```tsx
<Tabs value={value} onValueChange={(v) => setValue(v as MyTab)}>
  <TabsList>
    <TabsTrigger value="a">A</TabsTrigger>
    <TabsTrigger value="b">B</TabsTrigger>
  </TabsList>
  {/* Optional — only when content needs role=tabpanel binding */}
  <TabsContent value="a">…</TabsContent>
  <TabsContent value="b">…</TabsContent>
</Tabs>
```

Base UI's `TabsTab.value` is `any`, so it accepts non-string values too, but this project standardizes on string.

## Visual spec (variant: `text` — default)

- inactive: `text-muted-foreground`
- hover: `text-foreground`
- active: `text-foreground` (`data-[active]`)
- padding: `px-4 py-2`
- Size: `text-sm font-medium`
- Gap: `gap-1` between `TabsList` children
- focus ring: `focus-visible:ring-3 focus-visible:ring-ring/50`

If Figma later specifies an underline indicator, consider adding `variant="underline"` using `TabsPrimitive.Indicator`.

## Automatic side effects (Base UI)

- Keyboard arrow / Home / End navigation
- `data-active` + `aria-selected` on the active tab
- Standard handling of the `disabled` prop
- Automatic `aria-controls` / `aria-labelledby` wiring between TabsContent ↔ TabsTrigger

## Whether to use TabsContent

If each tab has entirely different content/toolbar, wrap it in TabsContent for better a11y. If the toolbar/search is shared and only the table branches, keeping a `value`-based conditional render outside is fine (the only a11y loss is the panel role).

## URL sync pattern

```tsx
function handleTabChange(next: MyTab) {
  setActive(next);
  const url = next === DEFAULT ? pathname : `${pathname}?tab=${next}`;
  router.replace(url, { scroll: false });
}
```

`router.replace` prevents history pollution. Drop `?tab=` for the default tab.

## Where used

- `src/app/(dashboard)/users/page.tsx` — User / Team / Pending Approvals (text variant + `?tab=` sync)
