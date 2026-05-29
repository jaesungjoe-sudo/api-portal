# table-list-page 패턴

> 엔티티 리스트를 보여주는 대시보드 페이지의 표준 구조. Breadcrumb → Title → (Tabs?) → Toolbar (Search + CTA) → Table → Pagination. 본 패턴이 통일되면 새 리스트 페이지 추가가 "이 골격에 맞추기" 가 된다.

## 적용 범위

- `/api-keys` — API Key 리스트
- `/users` (User / Team / Pending Approvals 탭) — 멤버 / 팀 / 승인대기 리스트
- `/users/team/[name]` — 팀별 멤버 리스트
- 향후 Webhooks 등 동일 구조 적용 예정

엔티티 상세 페이지·폼 페이지·랜딩 페이지는 본 패턴 적용 대상 아님.

---

## 1. 페이지 외곽 wrapper

```tsx
<div className="flex flex-col gap-10">
  {/* ... 슬롯들 ... */}
</div>
```

- `gap-10` (40px) — Breadcrumb · Header · Tabs · Toolbar · Table · Pagination 사이 일관 간격. CLAUDE.md 의 "헤더 영역 gap 통일" (2026-05-14) 룰 정합.
- 외곽에 `<main>` 또는 `<section>` 별도 추가 X — 라우트 layout (`(dashboard)/layout.tsx`) 가 이미 `<main>` 제공.

---

## 2. Breadcrumb (필수)

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>{현재 페이지}</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

마지막 항목은 `BreadcrumbPage` (현재 페이지, 링크 없음). 상세 페이지는 한 단계 추가 (예: Team detail 의 경우 "Users > Default").

---

## 3. Header

### Title

```tsx
<h1 className="text-3xl font-semibold text-foreground">{페이지 제목}</h1>
```

`text-3xl font-semibold` (30px / 600). 모든 table-list-page 공통.

### Subtitle (선택)

Title 하단에 카피가 필요할 때:

```tsx
<div className="flex flex-col gap-1">
  <h1 className="text-3xl font-semibold text-foreground">{제목}</h1>
  <p className="text-sm text-muted-foreground">{subtitle}</p>
</div>
```

사용 예: `/api-keys` 의 "Production expires in 5 days". 일반 카탈로그 페이지엔 불필요.

---

## 4. Tabs (선택)

`/users` 같이 여러 리스트가 한 페이지에 묶일 때만 사용. shadcn `<Tabs>` primitive — 자세한 룰은 `components/tabs.md`.

```tsx
<Tabs value={activeTab} onValueChange={handleTabChange} className="-mt-2">
  <TabsList>
    <TabsTrigger value="user">User</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
    <TabsTrigger value="pending">
      Pending Approvals
      {pendingCount > 0 && <CountBadge>{pendingCount}</CountBadge>}
    </TabsTrigger>
  </TabsList>
</Tabs>
```

- `-mt-2` — Tab 아래 underline 과 콘텐츠 간격을 자연스럽게.
- URL 쿼리 (`?tab=team`) 양방향 sync — `useSearchParams` + `router.replace`. Next.js 16+ 에선 `<Suspense>` 경계 필수.

---

## 5. Toolbar — Search + Primary CTA

```tsx
<div className="flex items-center justify-between gap-4">
  {/* Search (좌) */}
  <div className="relative w-60">
    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input className="pl-8 h-8 text-sm" placeholder={`Search ${Entity}`} />
  </div>
  {/* Primary CTA (우) */}
  <Button onClick={openCreate}>{Create/Invite Action}</Button>
</div>
```

### Search 룰

- Wrapper: `relative w-60` (240px 고정)
- Icon: `Search` (lucide), 절대 위치 `left-2.5` (10px), `h-4 w-4`, `text-muted-foreground`
- Input: `pl-8 h-8 text-sm` (icon 자리 + 32px height + 14px font)
- Placeholder: **`Search {Entity}`** (entity 명을 단수형으로 명시 — "Search User", "Search API Key", "Search Team"). 단순 `"Search"` 금지.

### Primary CTA 룰

- Default Button (`<Button>`, size=default = `h-9`)
- 라벨: 동사+명사 ("Create API Key", "Invite User", "Create Team")
- variant 임의 override 금지 — CLAUDE.md Button 룰

### Toolbar 없는 변형

`/users` Pending Approvals 탭 — Search·CTA 둘 다 없음. Toolbar 자체를 생략. 빈 줄을 차지하지 않음.

---

## 6. Table wrapper

```tsx
<div className="rounded-md border border-border overflow-x-auto">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>
```

- 외곽: `rounded-md border border-border` — 카드 같은 외형
- 스크롤: `overflow-x-auto` — 모바일에서 가로 스크롤. 외곽 wrapper 가 잘림 처리.

### TableHeader 룰

```tsx
<TableHeader>
  <TableRow>
    <TableHead className="min-w-[160px] pl-5">
      <SortableHead col="name" {...sp}>Name</SortableHead>
    </TableHead>
    <TableHead className="min-w-[160px]">Owner</TableHead>
    {/* ... more cells ... */}
    <TableHead className="w-14" />  {/* action ⋯ 칸 */}
  </TableRow>
</TableHeader>
```

- 첫 컬럼: `pl-5` (20px 왼쪽 padding) — CLAUDE.md "첫 컬럼 좌측 padding `pl-5` 통일" 룰
- 마지막 컬럼: `w-14` (56px) — 행 우측 끝 ⋯ DropdownMenu 자리. 헤더는 라벨 없이 빈 셀.
- 정렬 가능 컬럼: `<SortableHead col="key" {...sp}>` — `sortable-head.tsx`
- 컬럼 width: `min-w-[Npx]` (자연 폭 + 최소 보장) 또는 `w-[Npx]` (고정).

### TableBody — 첫 컬럼은 강조

```tsx
<TableCell className="pl-5 text-sm font-medium text-foreground">{name}</TableCell>
<TableCell className="text-sm text-foreground">{value}</TableCell>
{/* 보조 정보는 text-muted-foreground */}
<TableCell className="text-sm text-muted-foreground">{secondary}</TableCell>
```

- 첫 컬럼: `font-medium` (강조)
- 본문 컬럼: 일반 weight
- 부가 정보 (날짜·마지막 사용 등): `text-muted-foreground`

### Action 컬럼 (⋯ DropdownMenu)

```tsx
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label={`Actions for ${name}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuItem className="px-2 py-1.5" onClick={() => onEdit(item)}>Edit</DropdownMenuItem>
      {/* ... */}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
```

- `aria-label` 필수 (CLAUDE.md 메뉴 리스트 룰)
- 트리거 자체는 `h-8 w-8` (32×32). 아이콘은 `h-4 w-4`.
- `DropdownMenu` 사용. `Popover` 금지 (메뉴 리스트는 DropdownMenu).

---

## 7. Pagination

```tsx
<TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
```

- 모든 table-list-page 에 `<TablePagination>` (`src/components/api-portal/table-pagination.tsx`).
- 페이지 사이즈 표준 = `PAGE_SIZE = 10` (페이지별 상수).
- `Math.max(1, Math.ceil(items.length / PAGE_SIZE))` — 빈 데이터에도 totalPages = 1 보장.

---

## 8. Empty state

데이터가 비었을 때는 **table body 자리에 `<EmptyState>`** 컴포넌트 사용 (`rules/states.md` §4 + `components/empty-state.md`).

```tsx
{paged.length === 0 ? (
  <TableRow>
    <TableCell colSpan={TOTAL_COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<UserPlus />}  // Figma 인스펙트 결과 (icons.md 워크플로우)
        title="No pending approvals"
        description="New registrations awaiting review will appear here."
      />
    </TableCell>
  </TableRow>
) : (
  paged.map((row) => <TableRow>...</TableRow>)
)}
```

- 컨테이너 padding: `py-16` (64px) — `states.md` §4.2 의 테이블 본문 권장값
- `colSpan` 은 컬럼 총수 (action 칸 포함)
- variant 선택: `no-data` (아직 데이터 없음) / `no-results` (검색 결과 없음)
- 아이콘은 **Figma 인스펙트 결과 사용** — 추측 금지 (`icons.md` 워크플로우)

### 단순 텍스트 fallback 금지

```tsx
// ❌ states.md 위반
<TableCell colSpan={N} className="text-center text-sm text-muted-foreground py-8">
  No pending approvals
</TableCell>

// ✅
<TableCell colSpan={N} className="py-16">
  <EmptyState variant="no-data" icon={...} title="No pending approvals" ... />
</TableCell>
```

---

## 9. Loading / Error state

`rules/states.md` 의 표면×상태 매트릭스 — Loading: row skeleton, Error: 테이블 자리에 Alert. 본 패턴은 cross-ref 만, 별도 재정의 X.

---

## 10. 안티패턴

| ❌ | 이유 |
|---|---|
| 페이지 wrapper 의 `gap-*` 가 `gap-10` 외 값 | 헤더 영역 정합 룰 위반. 4 페이지 일관성 깨짐. |
| 첫 컬럼 `pl-5` 누락 | CLAUDE.md "첫 컬럼 좌측 padding pl-5 통일" 위반. |
| Action 컬럼 (`w-14`) 의 헤더에 라벨 텍스트 ("Action") 명시 | Figma 정합 — 헤더는 빈 셀. 라벨은 ⋯ 의 `aria-label` 으로 충분. |
| Search placeholder 가 `"Search"` 단순 텍스트 | Entity 명 누락. `"Search {Entity}"` 형태로. |
| Primary CTA 가 `size="sm"` 등 임의 사이즈 | Button 룰 1:1 Figma 위반. Toolbar CTA 는 default size (`h-9`). |
| 빈 데이터에 `<p>No data</p>` 같은 단순 텍스트 | `states.md` §4 / `empty-state.md` 안티패턴. `<EmptyState>` 사용. |
| Action 메뉴를 `<Popover>` 로 작성 | 메뉴 리스트는 DropdownMenu (CLAUDE.md). |
| `<TablePagination>` 미사용 — 직접 페이지 버튼 작성 | 공용 컴포넌트 우회. |

---

## 11. 적용 페이지 (Phase1)

| 페이지 | Tabs | Toolbar | 본문 |
|---|---|---|---|
| `/api-keys` | — | Search "Search API Key" + Create API Key | 7-col table |
| `/users` User 탭 | ✅ | Search "Search User" + Invite User | 6-col table |
| `/users` Team 탭 | ✅ | Search "Search Team" + Create Team | 카드 그리드 (테이블 아님) |
| `/users` Pending 탭 | ✅ | — | 7-col table + EmptyState |
| `/users/team/[name]` | — | Search "Search User" + Invite User | 6-col table |

Team 탭은 카드 그리드라 일부 예외 (테이블 wrapper 대신 grid). 헤더·toolbar·페이지 wrapper 룰은 동일 적용.

---

## 관련 문서

- `components/table.md` — Table primitive spec
- `components/pagination.md` — TablePagination component spec
- `components/empty-state.md` — EmptyState 컴포넌트 spec
- `components/button.md` — Button variant / size 룰 (Toolbar CTA)
- `rules/states.md` — 상태 (Loading / Empty / Error) 패턴
- `patterns/form-dialog.md` — Toolbar CTA 가 여는 다이얼로그 패턴
- `patterns/confirm-dialog.md` — Action 메뉴 의 Delete / Revoke 가 여는 패턴
