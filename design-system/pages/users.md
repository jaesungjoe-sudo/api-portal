# Users Page — Design Data

> Figma: F2lkYCId2xMqcd9RuXL20B / [Phase1] Design
> Last read: 2026-04-21

---

## Used Components

- Button: `design-system/components/button.md`
- Dialog: `design-system/components/dialog.md`
- Badge: `design-system/components/badge.md`
- Table: `design-system/components/table.md`
- Alert: `design-system/components/alert.md`
- Input / Label: `design-system/components/input.md`
- Select: `design-system/components/select.md`
- Popover (Row Action Menu): `design-system/components/popover.md`
- Pagination: `design-system/components/pagination.md`

---

## Used Patterns

<!-- TODO: table-list, confirm-dialog, form-dialog 패턴 분리 후 참조 추가 -->

---

## Page Structure

### 전체 레이아웃
- Full page: VERTICAL, w=1440
- Body: HORIZONTAL — Sidebar(255px) + Main-Content(1185px)
- Main-Content padding: 40px top, 80px bottom, 60px left/right, gap=40

### 탭 구성
- Layout: HORIZONTAL, gap=4px
- 탭 목록: **User (64px)** | **Team (69px)** | **Pending Approvals (182px)**
- Active 탭 텍스트: rgb(10,10,10) / Inactive: rgb(115,115,115)
- Pending Approvals 탭 옆 count badge: pending 건수 표시 (badge 패턴은 `components/badge.md` 참조)

### 툴바 (탭 아래)
- 왼쪽: Search Input (`w-60`, `h-8`, placeholder `Search User`)
- 오른쪽: **Invite User** 버튼 (`size="sm"`, `variant="default"`)
  - **Pending Approvals 탭에선 숨김** — User / Team 탭에서만 표시

### Footer (Pagination 배치)
- `grid grid-cols-3 items-center`
  - 왼쪽: 빈 div (선택 개수 표시 사용 안 함)
  - 중앙: Pagination
  - 오른쪽: 빈 div

---

## Users Tab

### 테이블 컬럼

| Column | min-width | notes |
|---|---|---|
| Checkbox | w-10 | |
| Name | 160px | sortable |
| Email | 220px | sortable |
| Team | 130px | sortable |
| Role | 100px | sortable |
| Status | 110px | sortable, StatusBadge |
| Updated | 140px | sortable + Info tooltip |
| Actions | w-14 | MoreHorizontal → Popover |

**Hidden / excluded columns (의도적으로 구현하지 않음)**
- **Permission** — Figma 헤더 노드는 존재하나 실제 row cell 이 없음 → 구현 제외
- **Created** — 이전 버전에 있었으나 현재 구현에서 제거됨 → `createdAt`, `createdAtMs` 필드도 User 타입에서 제거

### Row Action Menu (MoreHorizontal 클릭 시 열림)

- **Edit** → shortcut `⇧⌘P` → Edit User Dialog 열림
- **Deactivate** → shortcut `⌘B` → Deactivate Confirm Dialog 열림
- [Separator]
- **Resend invite mail** → shortcut `⌘S` → toast `Invitation resent to {email}`

### Edit User Dialog

Form Dialog (width 423px).

**필드 (gap=16px)**

1. **Name** — Input (pre-filled, no autofocus)
2. **Email** — Input (pre-filled, no autofocus)
3. **Status** — Label + StatusBadge (HORIZONTAL, justify-between)
   - 우측: **Invited 상태일 때만** `<Button variant="outline" size="sm">Resend invitation</Button>` 표시
   - 아래: 상태별 Alert 표시
     - **Invited** → `Invitation sent and waiting for acceptance`
     - **그 외** → `Awaiting administrator approval.`
4. **Select Role** — Label + Select
   - 바로 아래 Info alert 노드: `visible=false → 구현 제외`
5. **Team** — Label + Select

**Footer**
- Cancel (`variant="secondary"`) + Save (`variant="default"`)

**Focus 동작**: Dialog 열릴 때 어떤 필드도 autofocus 되지 않도록 sr-only span 으로 focus 흡수 (상세 `components/dialog.md`).

### Deactivate Confirm Dialog

Confirm Dialog (width 512px).

- **Title**: `Deactivate User`
- **Body**: `Are you sure you want to deactivate this user ({email})?`
- **Footer**: Cancel (`variant="outline"`) + Deactivate (`variant="destructive"`)
- **동작**: Deactivate 클릭 시 해당 row의 `status → Deactivated` 로 업데이트 + toast `{name|email} deactivated`

---

## Pending Approvals Tab

### 테이블 컬럼

| Column | x | w | notes |
|---|---|---|---|
| Checkbox | 0 | 33px | |
| Name | 33 | 141px | |
| Email | 174 | 200px | |
| Team | 374 | 160px | |
| Role | 534 | 120px | |
| Status | 654 | 120px | Verified StatusBadge |
| Updated | 774 | 120px | |
| **HIDDEN** | 845 | 160px | visible=false → 구현 제외 |
| Action | 894 | 171px | Reject + Approve 버튼 |

### Approve / Reject 동작

- **Approve 버튼** (`variant="outline"` + `className="text-success"`, `size="sm"`)
  - 클릭 시 해당 row의 `status → Active` 로 업데이트 + toast `{name|email} approved`
  - 확인 다이얼로그 없이 즉시 실행
- **Reject 버튼** (`variant="outline"`, `size="sm"`)
  - 클릭 시 **Reject Confirm Dialog** 열림

### Reject Confirm Dialog

Confirm Dialog (width 512px).

- **Title**: `Reject registration request`
- **Body**: `Are you sure you want to reject this registration ({email}) request?`
- **Footer**: Cancel (`variant="outline"`) + Reject (`variant="destructive"`)
- **동작**: Reject 클릭 시 해당 row의 `status → Deactivated` 로 업데이트 + toast `{name|email} rejected`

---

## Invite User Dialog

Form Dialog (width 423px). User / Team 탭의 툴바 "Invite User" 버튼 클릭으로 열림.

**필드 (모두 필수)**

1. **Email** — Input (빈 필드 + placeholder)
2. **Select Role** — Select (placeholder `Select role`)
3. **Team** — Select (placeholder `Select team`)

**유효성 검사**
- Submit 시 비어있는 필드는 `aria-invalid=true` + Label `text-destructive` + 에러 메시지 `{Field} is required`
- 값 입력 시 해당 필드의 에러 즉시 해제

**Footer**
- Cancel (`variant="secondary"`) + Send Invite (`variant="default"`)

**동작**: Send Invite 클릭 시 `status: Invited` 로 신규 유저가 목록 상단에 추가 + toast `Invitation sent` + dialog 닫힘

---

## Figma Node IDs

| Screen | Node ID |
|---|---|
| User tab (frame) | 1175:24855 |
| Pending Approvals tab (frame) | 1175:26199 |
| Navigation_menu (tabs) | 1175:26352 |
| Row Action Menu (popover) | 1175:21747 / 1282:9940 |
| Edit User Dialog | 1175:23785 / 1175:24292 |
| Edit User — Warning Alert (awaiting) | 1175:24309 |
| Invite User Dialog (validation) | 1276:5719 |
| Deactivate Confirm Dialog | 1284:14206 |
| Reject Confirm Dialog (screen) | 1296:4658 |
| Reject Confirm Dialog (spec) | 1296:5431 |
