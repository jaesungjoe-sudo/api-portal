# 아이콘 규칙

> 아이콘 라이브러리: `lucide-react`
> Figma 스캔 기준: `[Phase1] Design` → User & Team, API Keys 섹션 (2026-04-23)

---

## 🔄 아이콘 사용 워크플로우 (필독)

**아이콘이 필요할 때마다 이 절차를 따른다.** 임의 추측·기억으로 아이콘 결정 금지.

### 1단계 — Figma에서 정확한 아이콘 이름 확인
- 디자인 노드의 InstanceNode 이름 확인 (`lucide/align-left`, `lucide/file-text` 등)
- 또는 인스턴스의 `mainComponent.name` 인스펙트
- **추측 금지** (예: "리스트 아이콘이니까 `List`겠지" → 실제로는 `AlignLeft` 같은 케이스 빈번)

### 2단계 — lucide-react에서 해당 아이콘 import
- Figma `lucide/kebab-case` → `PascalCase` 변환 (예: `lucide/align-left` → `AlignLeft`)
- Suffix 컨벤션:
  - 직접 작성 파일 (`src/app`, `src/components/api-portal`): suffix 없이 (`AlignLeft`)
  - shadcn 자동 생성 (`src/components/ui/*`): `Icon` suffix 유지 (`AlignLeftIcon`)
- 사이즈도 Figma 값 따르기 (보통 16/20/24)

### 3단계 — lucide-react에 없으면 사용자에게 질문
- Figma 노드 prefix가 `hugeicons/`, `icon/` (custom) 등이거나, 검색해도 lucide에 없는 경우
- **임의 대체 금지** — 다음 정보를 사용자에게 물어보기:
  - Figma 노드명 + 출처 라이브러리(예: HugeIcons, Phosphor, custom SVG)
  - 가장 비슷한 lucide 아이콘 후보 1~2개
  - 옵션: (a) 라이브러리 추가 도입, (b) custom SVG 직접 추가, (c) 비슷한 lucide로 대체
- 사용자 결정 후 진행

### 4단계 — 아래 매핑 테이블에 등록
- 새 아이콘 사용 시 "사용 중인 아이콘" 표에 추가
- 미해결(라이브러리 미도입 등)은 "별도 처리 필요" 섹션에 기록

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
| `lucide/align-left` | `AlignLeft` | TocSidebar.tsx | "On This Page" 헤더 (20×20) |
| `lucide/file-text` | `FileText` | DocsSidebar.tsx | Docs 사이드바 헤더 아이콘 (16 in 32 box) |
| `lucide/chevron-right` (single rotate) | `ChevronRight` | accordion.tsx, DocsPageShell.tsx | accordion: 단일 chevron 90° 회전 (collapsed → expanded) / DocsPageShell: Next 버튼 |
| `lucide/chevron-left` | `ChevronLeft` | DocsPageShell.tsx | Prev 버튼 |
| `lucide/copy` | `Copy` | ViewApiKeyDialog.tsx, CodeBlock.tsx | API key 복사 / 코드 블록 복사 |
| `lucide/eye` | `Eye` | ViewApiKeyDialog.tsx | 마스킹된 토큰 표시 토글 |
| `lucide/eye-off` | `EyeOff` | ViewApiKeyDialog.tsx | Eye 토글 짝 (revealed 상태) |
| — | `Check` | CodeBlock.tsx | **코드 전용** — Figma 디자인엔 없음. 복사 후 2초간 success 피드백용 (`lucide/check`은 shadcn 자동 import에서 별도 사용) |
| `lucide/phone` | `Phone` | documentation/page.tsx | Quick Start "What You'll Find Here" — Calls 항목 |
| `lucide/network` | `Network` | documentation/page.tsx | Quick Start — Queues 항목 |
| `lucide/headset` | `Headset` | documentation/page.tsx | Quick Start — Agents 항목 |
| `lucide/message-square-more` | `MessageSquareMore` | documentation/page.tsx | Quick Start — Chat 항목 |
| `lucide/user-plus` | `UserPlus` | tutorials/page.tsx | "What You'll Build" Step 2 — Create Agent |
| `lucide/layers` | `Layers` | tutorials/page.tsx | "What You'll Build" Step 3 — Create Queue |
| `lucide/link-2` | `Link2` | tutorials/page.tsx | "What You'll Build" Step 4 — Assign Agent to Queue |
| `lucide/phone-call` | `PhoneCall` | tutorials/page.tsx | "What You'll Build" Step 5 — Make a Test Call (LIVE DEMO) |
| `lucide/code-2` | `Code2` | ApiReferenceSidebar.tsx | 사이드바 헤더 아이콘 (API Reference) |
| `lucide/arrow-up-down` | `ArrowUpDown` | api-reference/create-call/page.tsx | ParamTable 헤더 정렬 표시 (Phase1 시각만, 동작 없음) |
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
