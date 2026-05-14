# API Portal

UJET 개발자용 API 관리 콘솔. Figma의 `[Phase1] Design` 시안을 Next.js + Tailwind + shadcn/ui로 구현한 프로젝트.

## 페이지

| 영역 | 페이지 | 상태 |
|---|---|---|
| **Dashboard** | `/api-keys` | ✅ 완료 (CRUD + Revoke + Status/Owner/Expires 컬럼) |
| Dashboard | `/users` | ✅ User/Pending Approvals/Team 탭, CRUD |
| Dashboard | `/users/team/[name]` | ✅ Team 상세 |
| Dashboard | `/analytics`, `/webhooks` | 🔸 placeholder (디자인 대기) |
| **Documentation** | `/documentation` (Quick Start) | ✅ 완료 |
| Documentation | `/documentation/inbound-calls` | ✅ 완료 |
| Documentation | 그 외 8개 메뉴 | 🔸 blank (콘텐츠 대기) |

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** — `@theme inline` 기반 토큰
- **shadcn/ui** (Base UI 위에)
- **lucide-react** 아이콘
- **sonner** toast
- **Figma Desktop Bridge MCP** — 디자인 토큰 자동 동기화

## Getting Started

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

루트에 `.env.local` 생성:

```bash
# HTTP Basic Auth (middleware로 모든 페이지 보호)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=your_dev_password
```

> 환경변수 없으면 모든 페이지가 **401**을 반환합니다. `src/middleware.ts`가 모든 요청에 Basic Auth를 강제합니다 (static 파일·이미지 제외).

### 3. Dev 서버 실행

```bash
npm run dev
```

→ http://localhost:3000 (Basic Auth 팝업에서 위 credentials 입력)

### 4. 빌드 + 타입 체크

```bash
npm run build
```

## 디자인 토큰 동기화

색상·radius scale은 Figma 라이브러리가 SSOT(single source of truth). `design-system/tokens/*.json`을 통해 코드와 동기화:

```bash
npm run sync-tokens        # tokens.generated.css 재생성
npm run sync-tokens:check  # CI용 drift 체크
```

- 입력: `design-system/tokens/{colors.json, misc.json}`
- 출력: `src/styles/tokens.generated.css` (자동 생성, **직접 수정 금지**)
- 스크립트: `scripts/sync-tokens.ts`

상세 워크플로우 + 룰: `design-system/rules/figma-token-sync.md`

## 폴더 구조

```
api-portal/
├── CLAUDE.md             # 프로젝트 가이드 (매 세션 첫 참조)
├── PROGRESS.md           # 작업 진행 상황 / 백로그
├── design-system/        # Figma → 코드 룰 + 토큰 + 컴포넌트 스펙
│   ├── rules/            # color, layout, shadcn, figma-reading 등
│   ├── components/       # button, badge, dialog 등 spec
│   ├── icons.md          # 아이콘 매핑 + 워크플로우
│   └── tokens/           # colors.json, misc.json (SSOT)
├── public/               # SVG, 정적 파일
├── scripts/              # sync-tokens.ts
└── src/
    ├── app/
    │   ├── (dashboard)/  # Dashboard 영역 (api-keys, users, ...)
    │   └── (docs)/       # Documentation 영역
    ├── components/
    │   ├── ui/           # shadcn primitives (Button, Dialog, ...)
    │   └── api-portal/   # 도메인 컴포넌트 (TopNav, AppSidebar, ...)
    ├── lib/              # mock 데이터, auth-context, utils
    ├── hooks/            # useScrollSpy
    ├── middleware.ts     # Basic Auth
    └── styles/           # tokens.generated.css (auto-generated)
```

## 인증 / 로그인 상태

두 종류의 인증 레이어:

1. **HTTP Basic Auth** (`src/middleware.ts`) — 외부 접근 차단 (dev/배포 환경 보호)
2. **UI 로그인 상태** (`src/lib/auth-context.tsx`) — TopNav UX 분기용 in-memory state
   - 로그아웃: Documentation / API Reference 메뉴 + "Log in" 버튼
   - 로그인: + Dashboard 메뉴 + Avatar (AccountDropdown)
   - 새로고침 시 항상 로그아웃 상태로 리셋 (Phase1 mock)

실제 로그인 플로우(다이얼로그/페이지)는 추후 추가 예정 — 그때 `useAuth().login()` 호출 지점만 바꾸면 됨.

## 배포 (Vercel)

GitHub → Vercel 자동 배포 설정:

1. https://vercel.com 접속 → GitHub 로그인
2. "Add New" → "Project" → 이 리포 import
3. **환경변수 설정** (`BASIC_AUTH_USER`, `BASIC_AUTH_PASSWORD`) — 빠뜨리면 401
4. Deploy

이후 `git push origin main`마다 자동 재배포.

## 작업 룰 / 컨벤션

- **Figma is truth** — Figma에서 확인한 토큰/속성만 적용 (`CLAUDE.md` § 디자인 원칙)
- **Tailwind 변수 토큰만** — `text-[14px]`, `text-blue-600` 같은 임의값/팔레트 직접 사용 금지
- **shadcn 기본값 ≠ Figma면 `src/components/ui/*.tsx` 직접 수정** — className override 우회 X
- **아이콘**: Figma `lucide/*` 노드명 → PascalCase, 없으면 사용자에게 질문 (`design-system/icons.md`)

상세는 `CLAUDE.md`, `design-system/rules/*.md` 참조.

## 라이선스

UJET 내부 프로젝트.
