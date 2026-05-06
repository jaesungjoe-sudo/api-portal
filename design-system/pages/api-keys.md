# API Keys Page — Design Data

> Figma: F2lkYCId2xMqcd9RuXL20B / [Phase1] Design / API Keys
> Last read: 2026-04-22
> 범위: Phase1 에는 list 프레임만 존재. Create/Edit/Delete 다이얼로그 및 Row Action Menu 는 미디자인 상태 → **stub 구현**.

---

## Used Components

- Button: `design-system/components/button.md`
- Table: `design-system/components/table.md`
- Input / Label: `design-system/components/input.md`
- Pagination: `design-system/components/pagination.md`

> Dialog / Popover / Alert / Badge / Select 는 현재 페이지에서 사용하지 않음 (Phase1 디자인 미비로 stub).

---

## Used Patterns

<!-- TODO: table-list, confirm-dialog, form-dialog 패턴 분리 후 참조 추가 -->

---

## Page Structure

### 전체 레이아웃
- 페이지 프레임: VERTICAL, w=1440, h=991
- Body: Sidebar(255px) + Main-Content(1185px)
- Main-Content padding / Footer Pagination 레이아웃 은 dashboard 공통 (layout.tsx 에서 처리)
- **탭 없음** (`Navigation_menu visible=false`)

### 툴바 (Toolbar)
- 왼쪽: Search Input (`w-60`, `h-8`, placeholder `Search`)
- 오른쪽: **Create API Key** 버튼 (`variant="default"`, `size="default"`)
- 중앙 Columns 드롭다운: `visible=false` → 구현 제외

### Footer
- Pagination 중앙 정렬 (`grid grid-cols-3` 래퍼, 좌/우 빈 div)
- 우측 outline 버튼 2개 Wrapper: `visible=false` → 구현 제외

---

## Table 컬럼

| Column | x | w | sortable | 비고 |
|---|---|---|---|---|
| Checkbox | 0 | 33px | — | |
| Name | 33 | 492px | ✓ | 예: "Playground demo". 넓은 이유는 name 한 줄만 표기하면서 여백 확보 |
| Token | 525 | 240px | — | 예: `ujet_...` (마스킹 표시). 정렬 없음 |
| Last Used | 765 | 120px | ✓ | 날짜 포맷 `MM/DD/YYYY` |
| Created | 885 | 120px | ✓ | 날짜 포맷 `MM/DD/YYYY`, tooltip Info 아이콘 `visible=false` |
| Action | 1005 | 60px | — | `lucide/ellipsis` + `Type=icon ghost, Size=sm` (→ 현재 stub) |

**Hidden / excluded columns (의도적으로 구현하지 않음)**
- **Permission** (header x=585) — row cell 없음, `visible=false`
- **Created** (header x=845, 중복) — 기존 Created 컬럼과 충돌, `visible=false`
- **Quota Tier** (header x=845) — `visible=false`
- **Last Used** (row cell x=845, 중복) — `visible=false`

---

## Stub 동작 (Phase1 디자인 미비 대응)

### Create API Key 버튼
- 클릭 시 `toast.info("Create API Key dialog — Phase1 design pending")` 로 stub.
- 실제 다이얼로그는 Phase1 디자인이 추가된 뒤 구현.

### Row Action Menu (ellipsis 버튼)
- 클릭 시 `toast.info("Row action menu — Phase1 design pending")` 로 stub.
- 실제 Popover 메뉴는 Phase1 디자인이 추가된 뒤 구현.

---

## Figma Node IDs

| Screen | Node ID |
|---|---|
| API Keys page (root frame) | 1314:91052 |
| API Keys section | 1314:91361 |
| Main-Content | 1314:92188 |
| Header (title) | 1314:92191 |
| Content Container | 1314:92195 |
| Navigation_menu (탭, hidden) | 1314:92196 |
| Data table | 1314:92197 |
| Toolbar (Wrapper top) | 1314:92198 |
| Create API Key button | 1314:92203 |
| Table header | 1314:92209 |
| Row (sample) | 1314:92258 |
| Action cell (row1) | 1314:92283 |
| Footer Pagination | 1314:92544 |

## 참고: POC 디자인 (참조용)

Phase1 에 없는 다이얼로그는 `[POC] Design / Dashboard` 섹션에 POC 버전이 있음. Phase1 디자인이 추가되면 재확인 필요.

| POC Frame | Node ID |
|---|---|
| dashboard-API-popover | 748:9951 |
| dashboard-API-create | 733:28797 |
| dashboard-API-edit | 748:11033 |
| dashboard-API-created | 748:10683 |
