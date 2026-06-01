# Sonner (Toast)

> 일시적 액션 결과 알림 — "Invitation sent", "Team deleted", "Failed to copy" 등. `rules/states.md` §5 의 "일시적/액션 에러" 처방에서 권장. 영구 / 블로킹 에러는 Alert.

## Import

```tsx
import { toast } from "sonner";
```

> `<Toaster>` 자체는 **루트 layout 에 mount 됨** (`src/app/layout.tsx`). 페이지에서 호출만 하면 됨.

## 호출 방법

```tsx
import { toast } from "sonner";

toast.success("Team created");
toast.error("Failed to copy key");
toast.info("Subscription updated");
toast.warning("Invitation expires soon");
toast.loading("Saving...");  // 보통 promise 패턴과 조합
```

### Description 추가

```tsx
toast.success("Invitation sent", {
  description: `An invite has been sent to ${email}.`,
});
```

### Promise 패턴 (loading + 결과)

```tsx
toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved",
  error: "Failed to save",
});
```

## 표준 시각 (커스텀 wrapper)

`src/components/ui/sonner.tsx` 가 sonner primitive 위에 다음을 강제:

| 항목 | 값 |
|---|---|
| Position | `top-center` |
| Container | `flex items-center gap-1.5 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md` |
| Title | `text-sm font-medium text-foreground` (= typography role `label`) |
| Description | `text-sm text-muted-foreground` (= typography role `body-sm`) |
| Shadow | `shadow-md` (Dropdown / Tooltip 과 동일 — CLAUDE.md shadow 표) |

### 시맨틱 아이콘 매핑

| toast 타입 | lucide 아이콘 | 색 토큰 |
|---|---|---|
| `success` | `CircleCheck` | `text-success` |
| `info` | `Info` | `text-info` |
| `warning` | `TriangleAlert` | `text-warning` |
| `error` | `OctagonX` | `text-destructive` |
| `loading` | `LoaderCircle` (animate-spin) | `text-muted-foreground` |

→ Figma `Sonner` 컴포넌트 set 정합. 인스턴스 레벨 override 가 디자인에선 일관성 깨졌지만 wrapper 에서 토큰으로 통일.

## 사용 표 (Phase1)

| 위치 | 호출 | 타입 |
|---|---|---|
| Create API Key 성공 | `toast.success("API key created")` | success |
| Delete API Key | `toast.success("API key deleted")` | success |
| Revoke API Key | `toast.success("API key revoked")` | success |
| Invite User | `toast.success("Invitation sent", { description })` | success + desc |
| Edit User | `toast.success("User updated")` | success |
| Create Team / Edit / Delete | `toast.success("Team ... ")` | success |
| Resend Invitation | `toast.success("Invitation resent to ...")` | success |
| Approve / Reject | `toast.success("... approved/rejected")` | success |
| Deactivate User | `toast.success("... deactivated")` | success |
| ViewApiKey 복사 성공 | `toast.success("API key copied to clipboard")` | success |
| ViewApiKey 복사 실패 | `toast.error("Failed to copy key")` | error |
| Profile / Phase1 mock placeholder | `toast.info("... — Phase1 design pending")` | info |

→ 대부분 success. error 는 1건 (clipboard). info 는 placeholder 안내용.

## 사용 가이드라인

### 언제 toast vs Alert

| 상황 | 처방 |
|---|---|
| 액션 성공 ("저장됨", "삭제됨") | **toast.success** |
| 일시적 액션 실패 ("Failed to copy", 일시 네트워크 오류) | **toast.error** |
| 영구 / 블로킹 에러 (fetch 실패, 권한 없음) | Alert (`states.md` §5) |
| 폼 검증 에러 | 필드 인라인 (`form-dialog.md` §5) |

### 카피 가이드라인

- **간결한 동사 + 명사**: "Team created" / "Invitation sent" / "API key deleted"
- **사용자 언어로 일반화** — 백엔드 raw 에러 (`err.message`, stack trace) 노출 금지 (`states.md` §5.5)
- **Description 은 부가 정보일 때만**: 이메일·이름 등 구체 정보 필요시. 단순 confirm 은 title 만으로 충분.

## a11y

- sonner primitive 가 `role="status"` (success/info/warning) 또는 `role="alert"` (error) 자동 부여
- screen reader 가 toast 표시 시 자동 announce
- 키보드: ESC 로 dismiss (primitive 기본)

## 안티패턴

| ❌ | 이유 |
|---|---|
| 영구 에러를 toast 로 알림 | 자동 dismiss 되어 사용자가 놓침. 블로킹 에러는 Alert. |
| 백엔드 raw 에러 메시지 노출 (`toast.error(err.message)`) | UX / 보안. 사용자 언어로 일반화. (`states.md` §5.5) |
| 정보를 toast 에만 표시 (사용자가 페이지 떠나면 사라짐) | 영구 정보는 본문 / Dialog. toast 는 ephemeral. |
| `<Toaster />` 를 페이지마다 추가 mount | 루트 layout 에 이미 있음. 중복 mount 시 toast 가 여러 위치에 표시됨. |
| Custom 시각 / 색 (`bg-`, `text-` 클래스 inline 으로) | wrapper 가 시맨틱 토큰으로 통일. inline override 시 라이트/다크 정합 깨짐. |
| 5초 이상 표시 / 사용자 dismiss 강제 (`duration: Infinity` 일반화) | sonner 기본 duration 적정. 너무 길면 화면 가림, 너무 짧으면 못 봄. |

## 주의사항

- 동시에 여러 toast — sonner 가 자동 stack (최대 3개 기본)
- mobile 에서 top-center 가 TopNav 와 겹칠 수 있음 — 현재 디자인 OK 이지만 추가 알림 채널 도입 시 재검토
- toast 호출 후 즉시 페이지 navigate 가능 — toast 는 layout 레벨이라 unmount 안 됨
- `toast.promise` 는 async 작업 패턴 — Phase1 mock 은 즉시 응답이라 unused, 실 API 도입 시 활용
