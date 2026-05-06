# 아이콘 규칙

> 아이콘 라이브러리: `lucide-react`
> Figma 스캔 기준: `[Phase1] Design` → User & Team, API Keys 섹션 (2026-04-23)

---

## 사용 중인 아이콘

| Figma 노드명 | lucide-react | 코드 사용처 | 비고 |
|---|---|---|---|
| `lucide/arrow-up-down` | `ArrowUpDown` | sortable-head.tsx | |
| `lucide/arrow-up-right` | `ArrowUpRight` | (미사용) | User & Team 페이지 — 용도 미확인 |
| `lucide/check` | `Check` | checkbox.tsx, select.tsx | shadcn 내부에서 `CheckIcon`으로 import |
| `lucide/circle-check` | `CircleCheck` | sonner.tsx, ViewApiKeyDialog.tsx | 토스트 success / Alert success |
| `lucide/info` | `Info` | sonner.tsx, users/page.tsx | 토스트 info 아이콘 / 페이지 인라인 |
| `lucide/loader-circle` | `LoaderCircle` | sonner.tsx | 토스트 loading 상태 |
| `lucide/octagon-x` | `OctagonX` | sonner.tsx | 토스트 error 아이콘 |
| `lucide/triangle-alert` | `TriangleAlert` | sonner.tsx, users/page.tsx | 토스트 warning / Alert warning |
| `lucide/chevron-down` | `ChevronDown` | navigation-menu.tsx, select.tsx | shadcn 내부에서 `ChevronDownIcon`으로 import |
| `lucide/chevron-left` | `ChevronLeft` | pagination.tsx | shadcn 내부에서 `ChevronLeftIcon`으로 import |
| `lucide/chevron-right` | `ChevronRight` | pagination.tsx, breadcrumb.tsx | shadcn 내부에서 `ChevronRightIcon`으로 import |
| `lucide/chevrons-up-down` | `ChevronsUpDown` | (미사용) | Select/Combobox용 추정 |
| `lucide/ellipsis` | `MoreHorizontal` | users/page.tsx, api-keys/page.tsx, pagination.tsx, breadcrumb.tsx | → [ellipsis vs MoreHorizontal 참조](#ellipsis-vs-morehorizontal) |
| `lucide/gallery-vertical-end` | `GalleryVerticalEnd` | layout.tsx | 사이드바 로고 옆 아이콘 |
| `lucide/search` | `Search` | users/page.tsx, api-keys/page.tsx | |
| `lucide/user` | `User` | users/page.tsx (TeamCard), AccountDropdown.tsx | 멤버 수 아이콘 / Profile 메뉴 항목 |
| `lucide/x` | `X` | dialog.tsx, sheet.tsx | shadcn 내부에서 `XIcon`으로 import |
| — | `ArrowDown` | sortable-head.tsx | Figma는 `arrow-up-down` 하나로 표현; 정렬 활성 상태용 |
| — | `ArrowUp` | sortable-head.tsx | 위 동일 |
| — | `BarChart2` | (미사용) | layout.tsx에서 제거됨 (사이드바 아이콘 → Figma 디자인에 없음) |
| — | `Calculator` | (미사용) | Figma에서 hidden 처리됨 (2026-04-24 제거) |
| — | `ChevronUp` | select.tsx | shadcn 내부에서 `ChevronUpIcon`으로 import |
| — | `KeyRound` | (미사용) | layout.tsx에서 제거됨 |
| — | `LogOut` | AccountDropdown.tsx | Account 드롭다운 "Log out" 항목 |
| — | `PanelLeft` | sidebar.tsx | 사이드바 토글. shadcn 내부에서 `PanelLeftIcon`으로 import |
| — | `Settings` | (미사용) | Figma에서 hidden 처리됨 (2026-04-24 제거) |
| — | `Sparkles` | layout.tsx | Ask AI 버튼 (Figma `hugeicons/ai-magic` 대체) |
| — | `Users` | (미사용) | layout.tsx에서 제거됨 |
| — | `Webhook` | (미사용) | layout.tsx에서 제거됨 |

---

## Icon suffix 컨벤션

lucide-react는 `Search`와 `SearchIcon`을 동일 아이콘의 alias로 모두 export한다.
이 프로젝트에서는 **파일 출처**를 기준으로 구분한다.

| 파일 위치 | 컨벤션 | 이유 |
|---|---|---|
| `src/components/ui/` | `Icon` suffix **유지** (`ChevronRightIcon`, `XIcon` …) | shadcn이 자동 생성한 파일 — 건드리지 않는다 |
| 그 외 직접 작성 파일 | `Icon` suffix **없이** (`Search`, `MoreHorizontal` …) | 현재 코드 전체가 이미 이 패턴으로 통일되어 있음 |

```tsx
// ✅ src/app/ 또는 src/components/api-portal/
import { Search, MoreHorizontal, TriangleAlert } from "lucide-react";

// ✅ src/components/ui/ (shadcn 자동생성 — 수정 금지)
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

// ❌ 직접 작성 파일에서 suffix 혼용
import { SearchIcon, MoreHorizontalIcon } from "lucide-react";
```

---

## ellipsis vs MoreHorizontal

Figma 노드명은 `lucide/ellipsis`이지만 코드에서는 `MoreHorizontal`로 통일한다.

- lucide-react에서 `Ellipsis`와 `MoreHorizontal`은 동일한 아이콘의 alias
- 코드 전체가 이미 `MoreHorizontal`로 통일되어 있어 변경 불필요
- **Figma에서 `ellipsis`를 봐도 코드에서는 `MoreHorizontal`을 import할 것**

---

## 변환 규칙

Figma 노드명 → lucide-react import명 기본 규칙:

```
lucide/kebab-case  →  PascalCase
lucide/arrow-up-down  →  ArrowUpDown
lucide/triangle-alert  →  TriangleAlert
lucide/chevron-right  →  ChevronRight
```

단, `lucide/ellipsis` → `MoreHorizontal`처럼 이름이 다른 예외 케이스는 위 매핑 테이블에서 확인.

---

## 별도 처리 필요

Figma 디자인에 있지만 lucide-react가 아닌 아이콘. **현재 미구현**.

| Figma 노드명 | 출처 | 상태 |
|---|---|---|
| `hugeicons/ai-magic` | HugeIcons 라이브러리 | 미구현 — 라이브러리 도입 여부 미결정 |
| ` Icon / Search` | 커스텀 컴포넌트 (공백 prefix) | 미구현 — 커스텀 SVG 또는 shadcn 컴포넌트 내부 |
| ` Icon / ArrowLeft` | 커스텀 컴포넌트 (공백 prefix) | 미구현 |
| ` Icon / ArrowRight` | 커스텀 컴포넌트 (공백 prefix) | 미구현 |
| `icon/chevron-up` | 커스텀 컴포넌트 | 미구현 |

---

## 아직 매핑 안 된 아이콘

현재 없음. Figma 스캔 완료 기준 (User & Team + API Keys).
새 페이지(Webhooks, Analytics) 구현 시 이 파일 업데이트할 것.
