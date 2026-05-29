# form-dialog 패턴

> 단일 객체의 **생성·수정·초대** 를 위한 모달. Dialog primitive 위에 본 문서의 룰을 얹는다. 확인용 다이얼로그(Delete / Revoke / Deactivate / Reject) 는 별도 패턴 — `patterns/confirm-dialog.md` 참조.

## 적용 범위

본 패턴은 다음 형태의 다이얼로그를 다룬다:

- Create-* (예: Create API Key, Create Team)
- Edit-* (예: Edit API Key, Edit Team, Edit User, Profile)
- Invite-* (예: Invite User)
- View-* (예: View API Key — Cancel 없는 변형, §10 참조)

파괴적 액션(Delete / Revoke / Deactivate / Reject) 은 `confirm-dialog` 패턴.

---

## 1. 구조 표준

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-[423px]">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      {/* description 정책은 §3 참조 */}
    </DialogHeader>

    {/* 필드 그룹 — 표준 gap (§4) */}
    <div className="flex flex-col gap-2">
      <Label htmlFor={...} className={error ? "text-destructive" : ""}>
        {label}
      </Label>
      <Input id={...} aria-invalid={error} ... />
      {error && (
        <p className="text-sm text-destructive">{label} is required</p>
      )}
    </div>

    {/* 더 많은 필드 그룹들... */}

    {/* footer — DialogFooter primitive (§6) */}
    <DialogFooter>
      <Button variant="outline" onClick={...}>Cancel</Button>
      <Button onClick={...}>{confirmLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 2. Width

| 다이얼로그 종류 | width | `showCloseButton` |
|---|---|---|
| form-dialog (본 패턴) | `sm:max-w-[423px]` | **false** (X 버튼 없음 — primitive 기본값) |
| confirm-dialog | `sm:max-w-[512px]` (별도 패턴) | false (명시) |

→ Figma 정합. 임의 width 변경 금지.

> **X 버튼 정책 (2026-05-29 정정)** — Figma form-dialog (1489:47265) / confirm-dialog (1460:30528) 모두 우상단 X 가 없다. `DialogContent` primitive 의 `showCloseButton` 기본값을 `true` → `false` 로 변경 (CLAUDE.md 룰 10 정합). dismiss 경로는 Cancel 버튼 / Esc / 백드롭 클릭 3가지로 유지.

---

## 3. Header / Description 정책

- **DialogTitle**: 필수. 동사+명사 ("Create a new key", "Invite User", "Edit Team").
- **DialogDescription**: 조건부 권장.

DialogDescription 을 **추가하는** 조건:
- (a) 액션 결과가 사용자에게 명확하지 않을 때 (예: Invite → "Send an invitation link to start collaborating.")
- (b) 생성될 객체가 다른 사용자에게 영향을 줄 때

단순 CRUD ("Create a new key", "Edit Team") 는 description 없이 Title 만으로 충분. **무의미한 description 추가 금지** (예: Title 이 "Profile" 인데 description 이 "Edit your profile" — 정보 가치 없음).

---

## 4. 필드 그룹 — `gap-2` 표준

### 필드 그룹 내부 간격

Label + Input/Select + 에러 메시지 사이: **`flex flex-col gap-2`** (= 8px)

```tsx
<div className="flex flex-col gap-2">
  <Label ... />
  <Input ... />
  {error && <p ...>...</p>}
</div>
```

### 필드 그룹 사이 간격

`DialogContent` primitive 자체가 자식들 사이에 `gap-4` (= 16px) 를 부여한다. **별도 wrapper 불필요**. Figma `itemSpacing: 16` 정합.

```tsx
// ❌ DialogContent 안에서 또 다른 wrapper 로 묶지 말 것
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <div className="flex flex-col gap-4">  ← 불필요. DialogContent 가 이미 gap-4
    <div className="flex flex-col gap-2">...필드 1...</div>
    <div className="flex flex-col gap-2">...필드 2...</div>
  </div>
  <DialogFooter>...</DialogFooter>
</DialogContent>

// ✅
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <div className="flex flex-col gap-2">...필드 1...</div>
  <div className="flex flex-col gap-2">...필드 2...</div>
  <DialogFooter>...</DialogFooter>
</DialogContent>
```

---

## 5. Validation 룰

필수값 미충족 시 다음을 동시에 적용한다:

| 요소 | 적용 |
|---|---|
| `<Label>` | `className={error ? "text-destructive" : ""}` |
| `<Input>` / `<SelectTrigger>` | `aria-invalid={error}` |
| 에러 메시지 `<p>` | `className="text-sm text-destructive"` |

```tsx
<Label htmlFor="x" className={errors.x ? "text-destructive" : ""}>
  {label}
</Label>
<Input id="x" aria-invalid={errors.x} ... />
{errors.x && (
  <p className="text-sm text-destructive">{label} is required</p>
)}
```

### 입력 변경 시 즉시 해제

```tsx
onChange={(e) => {
  setX(e.target.value);
  if (errors.x) setErrors((p) => ({ ...p, x: false }));
}}
```

### 에러 메시지 카피

표준 카피: **`{Field name} is required`** (예: "Name is required", "Team name is required", "Email is required").

### 색 정책 — `text-destructive` 통일

에러 메시지는 `text-destructive`. **`text-muted-foreground` 금지** (Label 색과 일치해야 의미가 명확).

---

## 6. Footer — `DialogFooter` primitive 사용

raw `<div className="mt-2 flex justify-end gap-2">` 금지. 모든 풋터는 `<DialogFooter>` primitive 로.

```tsx
import { DialogFooter } from "@/components/ui/dialog";

<DialogFooter>
  <Button variant="outline" onClick={handleClose}>Cancel</Button>
  <Button onClick={handleConfirm}>{confirmLabel}</Button>
</DialogFooter>
```

### Figma 정합 — plain footer

`DialogFooter` primitive 는 Figma 정합에 맞춰 **plain (배경/구분선/extra padding 없음)**. 풋터 자체는 단순히 `flex flex-col-reverse gap-2 sm:flex-row sm:justify-end`. 본문과의 위쪽 간격은 `DialogContent` 의 `gap-4` 가 책임지므로 별도 `mt-2` 등 불필요.

> 자세한 Figma 인스펙트 결과는 본 문서 작성 PR의 변경 이력 참조. 풋터 위 가로 구분선 없음 / 배경 본문과 동일 / 풋터 padding 안쪽 머묾 / 둥근 모서리 별도 없음 — 4개 모두 plain.

### 버튼 순서

JSX 에서 좌→우 순서:
- Cancel (왼쪽)
- Confirm CTA (오른쪽)

`DialogFooter` primitive 가 모바일에선 `flex-col-reverse` 로 자동 반전 (CTA 가 위로). 코드에선 데스크탑 기준 순서만 신경쓰면 됨.

---

## 7. Button variant / 라벨

### variant

| 위치 | variant |
|---|---|
| Cancel | `outline` |
| Confirm CTA (Create / Save / Invite) | `default` (생략 = primary) |

> Cancel 이 `outline` 인 이유: form-dialog 와 confirm-dialog 둘 다 outline 으로 통일. `secondary` variant 는 다른 용도(toolbar/header 보조 액션) 로 재할당 — `components/button.md` 참조.

### CTA 라벨 컨벤션

| 다이얼로그 종류 | CTA 라벨 |
|---|---|
| Create-* | `Create` |
| Edit-* / Profile | `Save` |
| Invite-* | `Send Invite` 또는 `Invite` |
| View-* (Cancel 없는 변형) | `Done` |
| Cancel (모든 다이얼로그 공통) | `Cancel` |

---

## 8. autoFocus 차단

Base UI Dialog 기본 동작상 다이얼로그가 열릴 때 첫 focusable 자식에 포커스가 갈 수 있다. CLAUDE.md 룰에 따라 **다이얼로그가 열릴 때 어떤 필드도 active 상태가 되어서는 안 된다**.

### 차단 방법 — 2-Layer

**(1) `DialogContent` 바로 아래 sr-only focus 흡수 span**:

```tsx
<DialogContent className="sm:max-w-[423px]">
  <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
  <DialogHeader>...</DialogHeader>
  ...
</DialogContent>
```

→ Base UI 가 첫 focusable 노드를 찾을 때 이 span 이 잡혀 시각적 포커스 없이 흡수됨.

**(2) 첫 input/select 에 `autoFocus={false}` 명시** (방어적):

```tsx
<Input
  id="..."
  autoFocus={false}  // 명시적으로 차단
  ...
/>
```

Edit / Create / Invite 다이얼로그 모두 동일하게 적용.

### 적용 범위

- Edit 다이얼로그: pre-fill 된 첫 필드에 포커스가 가면 사용자가 의도치 않게 편집 시작 → 차단 필수
- Create / Invite 다이얼로그: 빈 필드에 포커스가 가면 placeholder 사라져서 사용자 disorient → 차단 필수
- View-* 다이얼로그 (ViewApiKeyDialog 등): 입력 필드 없으면 영향 없음. 안전을 위해 sr-only span 은 유지 권장.

---

## 9. Edit pre-fill / Create empty

### Edit 다이얼로그

열릴 때마다 기존 객체 값으로 pre-fill + 에러 초기화:

```tsx
useEffect(() => {
  if (open && initialValue) {
    setName(initialValue.name);
    setX(initialValue.x);
    setErrors({ name: false, x: false });
  }
}, [open, initialValue]);
```

### Create / Invite 다이얼로그

열릴 때마다 빈 필드 + 에러 초기화:

```tsx
useEffect(() => {
  if (open) {
    setName("");
    setX("");
    setErrors({ name: false, x: false });
  }
}, [open]);
```

---

## 10. View 변형 (Cancel 없는 form-dialog)

ViewApiKeyDialog 처럼 **읽기 전용 + 단일 "Done" 버튼** 형태. 입력 없이 정보만 표시.

- Width 동일: `sm:max-w-[423px]`
- Footer: `<DialogFooter>` 안에 Cancel 없이 `<Button>Done</Button>` 만
- DialogTitle 만 사용 (Description 보통 불필요)
- 필드는 모두 `readOnly` 또는 `disabled` (Figma `State === "disabled"` 시)

```tsx
<DialogFooter>
  <Button onClick={() => onOpenChange(false)}>Done</Button>
</DialogFooter>
```

---

## 11. 안티패턴

| ❌ | 이유 |
|---|---|
| raw `<div className="mt-2 flex justify-end gap-2">` 풋터 | DialogFooter primitive 의 반응형·정렬 미적용. §6 위반. |
| `mt-2` 또는 `mt-*` 풋터 위 마진 추가 | DialogContent 의 `gap-4` 와 중복. 풋터-본문 간격이 어색해짐. |
| `text-muted-foreground` 에러 메시지 | Label 색 (text-destructive) 과 불일치. 의미 모호. §5 위반. |
| `aria-invalid` 없이 단순 텍스트만 표시 | 접근성. screen reader 가 에러 인식 못 함. §5 위반. |
| 첫 Input 에 명시적 `autoFocus` 부여 | Edit 다이얼로그가 열리자마자 편집 모드 진입 → 사용자 의도 무시. §8 위반. |
| Width 임의 변경 (423 이외) | Figma 위반. confirm-dialog 가 필요한 케이스면 별도 패턴 사용. §2 위반. |
| `variant="secondary"` Cancel | Cancel 은 `outline` 로 통일 (form / confirm 모두). §7 위반. |
| `DialogContent` 안에서 또 다른 wrapper 로 필드 그룹 묶기 (`<div className="flex flex-col gap-4">...</div>`) | DialogContent 가 이미 `gap-4` 부여. 중복. §4 위반. |
| 단순 CRUD 에 무의미한 Description ("Edit your profile") | 정보 가치 없음. §3 위반. |

---

## 12. 적용 컴포넌트 (Phase1)

본 패턴을 따르는 다이얼로그 (`src/components/api-portal/`):

| 파일 | 종류 | CTA 라벨 |
|---|---|---|
| `CreateApiKeyDialog.tsx` | Create | Create |
| `EditApiKeyDialog.tsx` | Edit | Save |
| `ViewApiKeyDialog.tsx` | View (§10) | Done |
| `CreateTeamDialog.tsx` | Create | Create |
| `EditTeamDialog.tsx` | Edit | Save |
| `ProfileDialog.tsx` | Edit (자기 자신) | Save |
| `InviteUserDialog.tsx` | Invite | Send Invite |
| `EditUserDialog.tsx` | Edit | Save |

---

## 관련 문서

- `components/dialog.md` — Dialog primitive spec (width / Title 타이포 / focus 룰)
- `components/button.md` — Button variant 정의 (secondary 재할당 포함)
- `components/input.md` / `components/select.md` — 필드 컴포넌트 spec
- `patterns/confirm-dialog.md` — 파괴적 액션 다이얼로그
- `rules/instance-variant.md` — Disabled 판별 기준
