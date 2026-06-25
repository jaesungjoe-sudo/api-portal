# /analytics — Phase 1 spec

## Node IDs (design file `F2lkYCId2xMqcd9RuXL20B`)

- Root: `1579:79974` (Analytics frame, 1440×1436)
- Header (title + tabs): `1579:79981`
- Summary cards wrapper: `1579:79996`
- Request volume trend: `1579:80066`
- Content Container (bottom row): `1579:80137`
  - Top 5 APIs Container: `1579:80144`
  - Method distribution Container: `1583:80916`

## Page structure

```
Breadcrumb (Home → Dashboard → Analytics)
Header
  ├── Left: "Analytics" h1 (28/36 Semibold) + "All API traffic overview · Operator view"
  └── Right: AnalyticsTabs (3 segmented tabs)
4 Summary cards (gap 16, equal width)
Request volume trend card (rounded-xl, shadow-sm)
Bottom row (gap 20)
  ├── Top 5 APIs (flex-1)
  └── Method distribution (420px fixed)
```

## Tabs (period)

3 segmented tabs:
- `Last 6 months` (default active, fill `accent`)
- `Last 30 days`
- `Last 7 days`

Phase 1: only 6m has mock data; the rest return the same data (placeholder).

## Summary Cards

| # | Label | Value | Chip | Trend text |
|---|---|---|---|---|
| 1 | Total Requests | `1,252` | `+12.5%` | `+12.4% vs last 6 months` |
| 2 | Active APIs | `14` | — (no chip) | `APIs with traffic` |
| 3 | Active API keys | `135` | `+8` | `+8 new` |
| 4 | Unused APIs | `8` | — (no chip) | `Oldest: 12 days ago` |

- Card: `rounded-xl` (14), `bg-card`, `shadow-sm`, padding 24/24, gap 24
- Cards 1 & 3: top-right chip (rounded-md border + TrendingUp icon + text)
- Cards 2 & 4: no chip, trend text only

## Request Volume Trend (area chart)

- Container: `rounded-xl`, `bg-card`, `shadow-sm`
- Title: `Request volume trend` (16/24 Semibold)
- Subtitle: `Total for the last 6 months` (14/20 muted)
- Chart: **single area** (`total` = sum of all methods)
  - Stroke / fill: `info-chart` (#3b82f6), fill gradient 0.4 → 0
  - type=monotone, strokeWidth=2
- X axis: Jan–Jun (6 months) — depending on period, `Week 1-4` (30d), `Mon-Sun` (7d)
- No legend
- Hover tooltip: month + total + per-method counts for 5 methods (GET / POST / PUT / PATCH / DELETE, each with a color swatch). `RequestVolumeTooltip` custom component

## Top 5 APIs (horizontal bar)

| # | Endpoint | Count | Method | Bar color |
|---|---|---|---|---|
| 1 | `/users/{id}/profile` | 142 | GET | `success-chart` |
| 2 | `/orders/{id}/items` | 98 | POST | `info-chart` |
| 3 | `/organizations/{orgId}/members` | 92 | PATCH | `warning-chart` |
| 4 | `/projects/{id}/settings` | 75 | GET | `success-chart` |
| 5 | `/workspaces/{id}/invitations` | 42 | DELETE | `destructive-chart` |

Layout: 3-column Y-axis (endpoint / count / method labels) + bar area (normalized to max width). Bar height 29, rounded-xs.

## Method Distribution (pie + legend)

| Method | Percentage | Color token |
|---|---|---|
| GET | 35% | `success-chart` |
| POST | 25% | `info-chart` |
| PATCH | 20% | `warning-chart` |
| DELETE | 15% | `destructive-chart` |
| PUT | 5% | `warning-chart` |

> PATCH 는 `warning-chart` 로 통일(2026-06-24, method 색 전체 정합) — PUT 과 같은 `warning-chart` 를 공유. `highlight-chart` 토큰은 정의는 남아있으나 method 색으로는 미사용.

- Container width fixed at 420px
- Pie 192×192, innerRadius 0 (not a full donut)
- Legend: 8×8 color swatch + method label + percentage

## Design tokens (Figma → code)

| Figma token | hex | Code token |
|---|---|---|
| `success/success-chart` | #22c55e | `success-chart` |
| `info/info-chart` | #3b82f6 | `info-chart` |
| `highlight/highlight-chart` | #8b5cf6 | `highlight-chart` |
| `warning/warning-chart` | #eab308 | `warning-chart` |
| `destructive/destructive-chart` | #ef4444 | `destructive-chart` |

light: palette/{color}/500, dark: palette/{color}/400.

## Hidden nodes (excluded from implementation)

- The hidden `Tabs` inside the chart (visible: false)
- The hidden `Header` of the bar/pie chart (uses the Wrapper Title instead)
- The `Secondary_icon` chip of cards 2 & 4 (visible: false → fully removed)
- `lucide/trending-down`, `lucide/trending-up` of cards 2 & 4 (hidden)
- The "PETCH" / "FATCH" typos in the bar chart / pie chart are corrected to PATCH in code

## File locations

- Page: `src/app/(dashboard)/analytics/page.tsx`
- Components: `src/components/api-portal/Analytics*.tsx` (Tabs, SummaryCard, CallVolumeChart, TopApisChart, MethodDistribution)
- Mock: `src/lib/mock-analytics-data.ts`
- Method color mapping: `src/lib/method-colors.ts`
