# Icon rules

> Icon library: `lucide-react`
> Figma scan basis: `[Phase1] Design` → User & Team, API Keys sections (2026-04-23)

---

## 🔄 Icon usage workflow (must read)

**Follow this procedure every time you need an icon.** Don't decide an icon by arbitrary guessing or memory.

### Step 1 — Confirm the exact icon name in Figma
- Check the design node's InstanceNode name (`lucide/align-left`, `lucide/file-text`, etc.)
- Or inspect the instance's `mainComponent.name`
- **No guessing** (e.g. "it's a list icon so it must be `List`" → it's frequently actually something like `AlignLeft`)

### Step 2 — Import the icon from lucide-react
- Convert Figma `lucide/kebab-case` → `PascalCase` (e.g. `lucide/align-left` → `AlignLeft`)
- Suffix convention:
  - Hand-written files (`src/app`, `src/components/api-portal`): no suffix (`AlignLeft`)
  - shadcn auto-generated (`src/components/ui/*`): keep the `Icon` suffix (`AlignLeftIcon`)
- Follow the Figma value for size too (usually 16/20/24)

### Step 3 — If not in lucide-react, ask the user
- When the Figma node prefix is `hugeicons/`, `icon/` (custom), etc., or it's not in lucide even after searching
- **No arbitrary substitution** — ask the user with the following info:
  - The Figma node name + source library (e.g. HugeIcons, Phosphor, custom SVG)
  - 1–2 closest lucide icon candidates
  - Options: (a) add the library, (b) add a custom SVG directly, (c) substitute with a similar lucide icon
- Proceed after the user decides

### Step 4 — Register in the mapping table below
- When using a new icon, add it to the "Icons in use" table
- Record unresolved ones (library not added, etc.) in the "Needs separate handling" section

---

## Icons in use

| Figma node name | lucide-react | Code usage | Note |
|---|---|---|---|
| `lucide/arrow-up-down` | `ArrowUpDown` | sortable-head.tsx | |
| `lucide/arrow-up-right` | `ArrowUpRight` | (unused) | User & Team page — usage unconfirmed |
| `lucide/check` | `Check` | checkbox.tsx, select.tsx | imported as `CheckIcon` inside shadcn |
| `lucide/circle-check` | `CircleCheck` | sonner.tsx, ViewApiKeyDialog.tsx | toast success / Alert success |
| `lucide/info` | `Info` | sonner.tsx, users/page.tsx | toast info icon / page inline |
| `lucide/loader-circle` | `LoaderCircle` | sonner.tsx | toast loading state |
| `lucide/octagon-x` | `OctagonX` | sonner.tsx | toast error icon |
| `lucide/triangle-alert` | `TriangleAlert` | sonner.tsx, users/page.tsx | toast warning / Alert warning |
| `lucide/chevron-down` | `ChevronDown` | navigation-menu.tsx, select.tsx | imported as `ChevronDownIcon` inside shadcn |
| `lucide/chevron-left` | `ChevronLeft` | pagination.tsx | imported as `ChevronLeftIcon` inside shadcn |
| `lucide/chevron-right` | `ChevronRight` | pagination.tsx, breadcrumb.tsx | imported as `ChevronRightIcon` inside shadcn |
| `lucide/chevrons-up-down` | `ChevronsUpDown` | (unused) | presumed for Select/Combobox |
| `lucide/ellipsis` | `MoreHorizontal` | users/page.tsx, api-keys/page.tsx, pagination.tsx, breadcrumb.tsx | → [see ellipsis vs MoreHorizontal](#ellipsis-vs-morehorizontal) |
| `lucide/gallery-vertical-end` | `GalleryVerticalEnd` | layout.tsx | icon next to the sidebar logo |
| `lucide/search` | `Search` | users/page.tsx, api-keys/page.tsx | |
| `lucide/user` | `User` | users/page.tsx (TeamCard), AccountDropdown.tsx | member-count icon / Profile menu item |
| `lucide/x` | `X` | dialog.tsx, sheet.tsx | imported as `XIcon` inside shadcn |
| `lucide/align-left` | `AlignLeft` | TocSidebar.tsx | "On This Page" header (20×20) |
| `lucide/file-text` | `FileText` | DocsSidebar.tsx | Docs sidebar header icon (16 in 32 box) |
| `lucide/chevron-right` (single rotate) | `ChevronRight` | accordion.tsx, DocsPageShell.tsx | accordion: single chevron rotated 90° (collapsed → expanded) / DocsPageShell: Next button |
| `lucide/chevron-left` | `ChevronLeft` | DocsPageShell.tsx | Prev button |
| `lucide/copy` | `Copy` | ViewApiKeyDialog.tsx, CodeBlock.tsx | copy API key / copy code block |
| `lucide/eye` | `Eye` | ViewApiKeyDialog.tsx | toggle masked-token display |
| `lucide/eye-off` | `EyeOff` | ViewApiKeyDialog.tsx | Eye toggle counterpart (revealed state) |
| — | `Check` | CodeBlock.tsx | **code-only** — not in the Figma design. For 2-second success feedback after copying (`lucide/check` is used separately in the shadcn auto-import) |
| `lucide/phone` | `Phone` | documentation/page.tsx | Quick Start "What You'll Find Here" — Calls item |
| `lucide/network` | `Network` | documentation/page.tsx | Quick Start — Queues item |
| `lucide/headset` | `Headset` | documentation/page.tsx | Quick Start — Agents item |
| `lucide/message-square-more` | `MessageSquareMore` | documentation/page.tsx | Quick Start — Chat item |
| `lucide/user-plus` | `UserPlus` | tutorials/page.tsx | "What You'll Build" Step 2 — Create Agent |
| `lucide/layers` | `Layers` | tutorials/page.tsx | "What You'll Build" Step 3 — Create Queue |
| `lucide/link-2` | `Link2` | tutorials/page.tsx | "What You'll Build" Step 4 — Assign Agent to Queue |
| `lucide/phone-call` | `PhoneCall` | tutorials/page.tsx | "What You'll Build" Step 5 — Make a Test Call (LIVE DEMO) |
| `lucide/code-2` | `Code2` | ApiReferenceSidebar.tsx | sidebar header icon (API Reference) |
| `lucide/arrow-up-down` | `ArrowUpDown` | api-reference/create-call/page.tsx | ParamTable header sort indicator (visual only in Phase1, no behavior) |
| — | `ArrowDown` | sortable-head.tsx | Figma expresses it with a single `arrow-up-down`; for the active sort state |
| — | `ArrowUp` | sortable-head.tsx | same as above |
| — | `BarChart2` | (unused) | removed from layout.tsx (sidebar icon → not in the Figma design) |
| — | `Calculator` | (unused) | hidden in Figma (removed 2026-04-24) |
| — | `ChevronUp` | select.tsx | imported as `ChevronUpIcon` inside shadcn |
| — | `KeyRound` | (unused) | removed from layout.tsx |
| — | `LogOut` | AccountDropdown.tsx | Account dropdown "Log out" item |
| — | `PanelLeft` | sidebar.tsx | sidebar toggle. imported as `PanelLeftIcon` inside shadcn |
| — | `Settings` | (unused) | hidden in Figma (removed 2026-04-24) |
| — | `Sparkles` | layout.tsx | Ask AI button (substitute for Figma `hugeicons/ai-magic`) |
| — | `Users` | (unused) | removed from layout.tsx |
| — | `Webhook` | (unused) | removed from layout.tsx |

---

## Icon suffix convention

lucide-react exports both `Search` and `SearchIcon` as aliases of the same icon.
This project distinguishes them based on the **file source**.

| File location | Convention | Reason |
|---|---|---|
| `src/components/ui/` | **keep** the `Icon` suffix (`ChevronRightIcon`, `XIcon` …) | shadcn auto-generated files — don't touch them |
| Other hand-written files | **no** `Icon` suffix (`Search`, `MoreHorizontal` …) | the entire current codebase is already unified on this pattern |

```tsx
// ✅ src/app/ or src/components/api-portal/
import { Search, MoreHorizontal, TriangleAlert } from "lucide-react";

// ✅ src/components/ui/ (shadcn auto-generated — do not modify)
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

// ❌ mixing suffixes in a hand-written file
import { SearchIcon, MoreHorizontalIcon } from "lucide-react";
```

---

## ellipsis vs MoreHorizontal

The Figma node name is `lucide/ellipsis`, but in code we unify on `MoreHorizontal`.

- In lucide-react, `Ellipsis` and `MoreHorizontal` are aliases of the same icon
- The entire codebase is already unified on `MoreHorizontal`, so no change is needed
- **Even when you see `ellipsis` in Figma, import `MoreHorizontal` in code**

---

## Conversion rules

Base rule for Figma node name → lucide-react import name:

```
lucide/kebab-case  →  PascalCase
lucide/arrow-up-down  →  ArrowUpDown
lucide/triangle-alert  →  TriangleAlert
lucide/chevron-right  →  ChevronRight
```

However, for exception cases with a different name like `lucide/ellipsis` → `MoreHorizontal`, check the mapping table above.

---

## Needs separate handling

Icons that are in the Figma design but not in lucide-react. **Currently not implemented.**

| Figma node name | Source | Status |
|---|---|---|
| `hugeicons/ai-magic` | HugeIcons library | not implemented — whether to add the library is undecided |
| ` Icon / Search` | custom component (leading-space prefix) | not implemented — custom SVG or inside a shadcn component |
| ` Icon / ArrowLeft` | custom component (leading-space prefix) | not implemented |
| ` Icon / ArrowRight` | custom component (leading-space prefix) | not implemented |
| `icon/chevron-up` | custom component | not implemented |

---

## Not yet mapped

None at present. Based on the completed Figma scan (User & Team + API Keys).
Update this file when implementing new pages (Webhooks, Analytics).
