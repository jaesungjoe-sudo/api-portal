# /analytics — Phase 1 spec

## 노드 ID (디자인 파일 `F2lkYCId2xMqcd9RuXL20B`)

- Root: `1579:79974` (Analytics frame, 1440×1436)
- Header (title + tabs): `1579:79981`
- Summary cards wrapper: `1579:79996`
- Request volume trend: `1579:80066`
- Content Container (bottom row): `1579:80137`
  - Top 5 APIs Container: `1579:80144`
  - Method distribution Container: `1583:80916`

## 페이지 구조

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

## 탭 (period)

3개 segmented tab:
- `Last 6 months` (default active, fill `accent`)
- `Last 30 days`
- `Last 7 days`

Phase 1: 6m 만 mock 데이터, 나머지는 동일 데이터 반환 (placeholder).

## Summary Cards

| # | Label | Value | Chip | Trend text |
|---|---|---|---|---|
| 1 | Total Requests | `1,252` | `+12.5%` | `+12.4% vs last 6 months` |
| 2 | Active APIs | `14` | — (chip 없음) | `APIs with traffic` |
| 3 | Active API keys | `135` | `+8` | `+8 new` |
| 4 | Unused APIs | `8` | — (chip 없음) | `Oldest: 12 days ago` |

- 카드: `rounded-xl` (14), `bg-card`, `shadow-sm`, padding 24/24, gap 24
- 1·3 카드: 우상단 chip (rounded-md border + TrendingUp 아이콘 + 텍스트)
- 2·4 카드: chip 없음, trend 텍스트만

## Request Volume Trend (area chart)

- 컨테이너: `rounded-xl`, `bg-card`, `shadow-sm`
- 제목: `Request volume trend` (16/24 Semibold)
- 부제: `Total for the last 6 months` (14/20 muted)
- 차트: **단일 area** (`total` = 모든 메소드 합)
  - Stroke / fill: `info-chart` (#3b82f6), fill 그라데이션 0.4 → 0
  - type=monotone, strokeWidth=2
- X축: Jan~Jun (6개월) — period 에 따라 `Week 1-4` (30d), `Mon-Sun` (7d)
- 범례 없음
- 호버 tooltip: 월 + total + 메소드별 카운트 5개 (GET / POST / PUT / PATCH / DELETE, 색 swatch 동반). `RequestVolumeTooltip` 커스텀 컴포넌트

## Top 5 APIs (horizontal bar)

| # | Endpoint | Count | Method | Bar color |
|---|---|---|---|---|
| 1 | `/users/{id}/profile` | 142 | GET | `success-chart` |
| 2 | `/orders/{id}/items` | 98 | POST | `info-chart` |
| 3 | `/organizations/{orgId}/members` | 92 | PATCH | `highlight-chart` |
| 4 | `/projects/{id}/settings` | 75 | GET | `success-chart` |
| 5 | `/workspaces/{id}/invitations` | 42 | DELETE | `destructive-chart` |

Layout: 3-column Y-axis (endpoint / count / method labels) + bar area (max width-기준 정규화). Bar height 29, rounded-xs.

## Method Distribution (pie + legend)

| Method | Percentage | Color token |
|---|---|---|
| GET | 35% | `success-chart` |
| POST | 25% | `info-chart` |
| PATCH | 20% | `highlight-chart` |
| DELETE | 15% | `destructive-chart` |
| PUT | 5% | `warning-chart` |

- 컨테이너 폭 420px 고정
- Pie 192×192, innerRadius 0 (full donut 아님)
- Legend: 8×8 색상 swatch + method label + percentage

## 디자인 토큰 (Figma → 코드)

| Figma 토큰 | hex | 코드 토큰 |
|---|---|---|
| `success/success-chart` | #22c55e | `success-chart` |
| `info/info-chart` | #3b82f6 | `info-chart` |
| `highlight/highlight-chart` | #8b5cf6 | `highlight-chart` |
| `warning/warning-chart` | #eab308 | `warning-chart` |
| `destructive/destructive-chart` | #ef4444 | `destructive-chart` |

light: palette/{color}/500, dark: palette/{color}/400.

## Hidden 노드 (구현 제외)

- Chart 내부 hidden `Tabs` (visible: false)
- Bar/Pie chart의 hidden `Header` (대신 Wrapper Title 사용)
- Card 2·4의 `Secondary_icon` chip (visible: false → 완전 제거)
- Card 2·4의 `lucide/trending-down`, `lucide/trending-up` (hidden)
- Bar chart "PETCH" / Pie chart "FATCH" 오타는 코드에서 PATCH로 정정 적용

## 파일 위치

- 페이지: `src/app/(dashboard)/analytics/page.tsx`
- 컴포넌트: `src/components/api-portal/Analytics*.tsx` (Tabs, SummaryCard, CallVolumeChart, TopApisChart, MethodDistribution)
- Mock: `src/lib/mock-analytics-data.ts`
- 메소드 색 매핑: `src/lib/method-colors.ts`
