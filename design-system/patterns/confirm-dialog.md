# confirm-dialog 패턴

> 파괴적·되돌리기 어려운 단일 액션을 확인받는 모달 (Figma 명: "Alert dialog"). Dialog primitive 위에 본 문서의 룰을 얹는다. 입력 폼이 필요한 경우는 별도 패턴 — `patterns/form-dialog.md` 참조.

## 적용 범위

본 패턴은 다음 형태의 다이얼로그를 다룬다:

- Delete-* (예: Delete API Key, Delete Team)
- Revoke-* (예: Revoke API Key)
- Deactivate-* (예: Deactivate User)
- Reject-* (예: Reject Registration)

입력 폼이 있는 다이얼로그(Create / Edit / Invite / View) 는 `form-dialog` 패턴.

---

## 1. 사용 — `ConfirmDialog` 공용 컴포넌트

본 패턴의 모든 다이얼로그는 **`<ConfirmDialog>` 공용 컴포넌트**로 작성한다. 직접 Dialog primitive 를 조립하지 말 것.

```tsx
import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";

<ConfirmDialog
  open={target !== null}
  onOpenChange={(o) => { if (!o) setTarget(null); }}
  title="Delete API Key"
  description="Are you sure you want to delete this API Key?"
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

엔티티 이름·이메일 등을 본문에 강조해서 넣을 때는 `description` 에 JSX 그대로 전달:

```tsx
<ConfirmDialog
  ...
  description={
    <>Are you sure you want to delete the <strong>{team.name}</strong> team?</>
  }
/>
```

---

## 2. 구조 (ConfirmDialog 내부)

```tsx
<Dialog>
  <DialogContent className="sm:max-w-[512px]" showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">{confirmLabel}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 3. Width — 512px (form-dialog 와 차이)

| 패턴 | width |
|---|---|
| form-dialog | `sm:max-w-[423px]` |
| **confirm-dialog (본 패턴)** | `sm:max-w-[512px]` |

→ Figma 정합. confirm 은 본문 카피가 길어지는 경향이라 좀 더 넓다.

---

## 4. `showCloseButton={false}` — 항상

Dialog primitive 의 우상단 X 버튼을 **숨긴다**. 이는 사용자에게 "명시적으로 Cancel 또는 Confirm 을 누르도록" 강제하기 위함이며, 파괴적 액션의 핵심 안전장치.

→ form-dialog 는 `showCloseButton` 기본 true (X 노출 OK) / confirm-dialog 는 항상 false.

---

## 5. Header / Description 정책

- **DialogTitle**: 필수. 동사+명사 ("Delete API Key", "Revoke API Key", "Deactivate User", "Reject registration request").
- **DialogDescription**: **항상 필수** (form-dialog 는 조건부). a11y 정합 + Figma 정합. 단순 텍스트 또는 엔티티 이름이 강조된 JSX 모두 OK.

---

## 6. Footer

`DialogFooter` primitive (plain footer 정합) + outline Cancel + destructive Confirm.

| 위치 | variant |
|---|---|
| Cancel (왼쪽) | `outline` |
| Confirm (오른쪽) | `destructive` (기본) |

JSX 순서는 Cancel → Confirm (좌→우). 모바일에선 DialogFooter primitive 가 자동 `flex-col-reverse` 로 CTA 가 위로 가게 반전.

### 비-파괴적 confirm — `confirmVariant="default"`

극히 드문 케이스. Logout 같이 "파괴적이진 않지만 의도 확인이 필요한" 액션 — `confirmVariant="default"` 로 override.

```tsx
<ConfirmDialog
  ...
  title="Log out"
  description="You'll need to sign in again to continue."
  confirmLabel="Log out"
  confirmVariant="default"
  onConfirm={handleLogout}
/>
```

현재 Phase1 에서 사용 사례 0건 — `destructive` 가 기본값이므로 명시 안 하면 자동.

---

## 7. form-dialog 와의 차이 (한눈에)

| | form-dialog | confirm-dialog |
|---|---|---|
| **목적** | 입력 받기 (Create / Edit / Invite / View) | 단일 액션 확인 (Delete / Revoke / Deactivate / Reject) |
| **Width** | `sm:max-w-[423px]` | `sm:max-w-[512px]` |
| **showCloseButton** | 기본 true (X 노출) | **`false` (X 숨김)** |
| **본문** | 다중 필드 (Label + Input/Select + 검증) | **DialogDescription 1개** (필수) |
| **DialogDescription** | 조건부 권장 | **항상 필수** |
| **Footer** | DialogFooter (outline Cancel + default CTA) | DialogFooter (outline Cancel + **destructive** CTA) |
| **autoFocus 차단** | sr-only span + autoFocus={false} | 입력 없음 → 불필요 |
| **공용 컴포넌트** | 없음 (각 다이얼로그가 직접 작성) | **`<ConfirmDialog>` 강제** |

---

## 8. 안티패턴

| ❌ | 이유 |
|---|---|
| Dialog primitive 를 직접 조립해 confirm 만들기 | `<ConfirmDialog>` 강제. 룰 이탈 (showCloseButton, 본문 노드, 풋터) 위험. |
| `showCloseButton` 미명시 (= true) | confirm 의 핵심 안전장치를 무력화. 본 패턴 §4 위반. |
| Body 를 `<p>` 또는 `<span>` 으로 직접 작성 | DialogDescription 사용 — a11y 정합. screen reader 가 다이얼로그 본문으로 인식해야 함. |
| Confirm 버튼이 `default` variant (파괴적 액션인데) | destructive 가 기본. 파괴적 액션의 시각 신호. §6 위반. |
| Cancel 버튼이 `secondary` 또는 `default` | form-dialog 와 통일 — Cancel 은 항상 `outline`. |
| Width 임의 변경 (512 외) | Figma 위반. form-dialog 가 필요한 케이스면 패턴 자체를 바꿔야 함. |
| confirm-dialog 에 입력 필드 추가 | 패턴 위반. 입력이 필요하면 form-dialog 로 전환 또는 두 단계로 분리. |

---

## 9. 적용 컴포넌트 (Phase1)

본 패턴(=`ConfirmDialog`)을 사용하는 다이얼로그:

| 파일 / 위치 | 액션 | Confirm variant |
|---|---|---|
| `DeleteApiKeyDialog.tsx` | Delete API Key | destructive |
| `RevokeApiKeyDialog.tsx` | Revoke API Key | destructive |
| `users/page.tsx` 인라인 | Deactivate User | destructive |
| `users/page.tsx` 인라인 | Reject Registration | destructive |
| `users/page.tsx` 인라인 | **Delete Team** (2026-05-29 추가) | destructive |

각 다이얼로그 파일은 `<ConfirmDialog>` 의 thin wrapper — title / description / confirmLabel 만 다름.

---

## 관련 문서

- `patterns/form-dialog.md` — 입력 폼 다이얼로그 (대조)
- `components/dialog.md` — Dialog primitive spec (Width, showCloseButton, focus 룰)
- `components/button.md` — Button variant 정의 (destructive 등)
- `rules/states.md` §5 — Error 처리 (Optimistic rollback 시 toast)
