# 반응형 / 브레이크포인트 규칙

> "언제 sm/md/lg/xl 을 쓰는가" 의 시맨틱을 명시. 단순 픽셀 값이 아니라 *어떤 전환점*인지 기록해서 새 화면이 일관된 브레이크포인트로 갈리도록 한다.

---

## 1. Breakpoint 의미 표

Tailwind 기본값 그대로 사용. 각 BP 는 **고유한 전환 의미**를 가진다 (단순 픽셀이 아님).

| BP | Px | 시맨틱 의도 | 주요 사용 |
|---|---|---|---|
| (기본) | 0 | **모바일 우선** — 가장 좁은 상태 | 1-col layout, full-width dialog, 햄버거 메뉴 |
| **`sm`** | 640 | Dialog 가 모바일 full-width 를 벗어남 / 첫 grid 분할 | `sm:max-w-[423px]` (form-dialog), `sm:grid-cols-2`, `sm:flex-row` (DialogFooter) |
| **`md`** | 768 | **사이드바 표시 전환점** + 페이지 padding 확장 + 인라인 nav 표시 | `md:block` (sidebar), `md:px-10`, `md:flex` (TopNav 메인 메뉴), `md:grid-cols-2` |
| **`lg`** | 1024 | 데스크탑 톤 — TopNav 검색바 인라인 표시, grid 3-4 col | `lg:flex` (TopNav 검색바), `lg:grid-cols-3` / `lg:grid-cols-4` |
| **`xl`** | 1280 | 와이드 데스크탑 — **TocSidebar 옆/위 전환** | `xl:block` (TocSidebar), `xl:hidden` (MobileToc) |
| `2xl` | 1536 | **사용 안 함** (현재 정책) | — |

→ **2xl 미사용 정책**: Phase1 디자인이 1440px 이상을 별도 설계하지 않음. 향후 Figma 가 2xl 레이아웃을 정의하면 그때 도입.

---

## 2. Mobile-first 원칙

기본 클래스 = 모바일 상태. BP suffix 는 **위로 진화**한다.

```tsx
// ✅ Mobile-first — 기본 1 col, md+ 에서 2 col, lg+ 에서 4 col
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ❌ Desktop-first 회피 — `md:hidden` 만으로 분기하면 모바일에서 깜빡임/SSR 불일치 위험
<div className="grid-cols-4 md:hidden">  // 안 좋은 패턴
```

`md:hidden` / `xl:hidden` 자체는 OK (다른 요소와 짝을 이룰 때 — 예: Sidebar md:block + SidebarTrigger md:hidden). 단일 요소를 desktop-first 로 작성하지 않는 것이 원칙.

---

## 3. 페이지 wrapper padding 표준

```tsx
<div className="px-6 py-10 md:px-10">
```

- **모바일**: `px-6` (24px)
- **md+**: `px-10` (40px)
- 세로 padding 은 일관 (`py-10` 등)

이 룰은 **모든 페이지·카탈로그·DocsPageShell** 에 동일 적용. 페이지 wrapper 작성 시 별도 결정 불필요.

예외: 풀-bleed 페이지 (예: 랜딩의 Hero 영역) — 별도 패턴.

---

## 4. 컨테이너 max-width 룰

페이지 종류별로 max-width 가 다르다. 본문 가독성·콘텐츠 종류에 맞춘 의도.

| 페이지 종류 | max-width | 이유 |
|---|---|---|
| 대시보드 (table-list-page) | **없음** — `flex-1` 채움 | 테이블이 가용 폭 전부 사용 |
| docs-page-shell | `max-w-[1160px]` | 본문 + TocSidebar 조합 최대 폭 |
| 카탈로그 페이지 | `max-w-4xl` (896px) | 읽기 좋은 본문 폭 |
| form-dialog | `sm:max-w-[423px]` | Figma 정합 |
| confirm-dialog | `sm:max-w-[512px]` | Figma 정합 |

→ 새 페이지는 위 5 카테고리 중 하나로 결정. 임의 값 사용 전 이 표 먼저 확인.

---

## 5. 알려진 반응형 패턴

### 5.1 Sidebar: md 햄버거 ↔ 인라인 aside

```tsx
// AppSidebar / DocsSidebar / CatalogSidebar 공통
if (isMobile) {
  return <Sheet>...drawer...</Sheet>;
}
return (
  <aside className="sticky top-[69px] hidden ... md:block">
    ...
  </aside>
);
```

- 모바일 (md 미만): `<SidebarTrigger>` 햄버거 → `<Sheet>` drawer
- md+: 고정 sticky `<aside>` (255px)
- `SidebarProvider` (shadcn) 의 `isMobile` 훅 사용

### 5.2 TopNav 단계적 축소

```tsx
<SidebarTrigger className="mr-2 md:hidden" />        {/* 모바일 햄버거 */}
<nav className="hidden items-center gap-3 md:flex">  {/* 메인 메뉴 */}
<div className="hidden ... lg:flex">                 {/* 검색바 */}
<Button className="lg:hidden" aria-label="Search">   {/* 검색 아이콘만 */}
<span className="hidden sm:inline">Ask AI</span>     {/* Ask AI 라벨 */}
```

3-단계 축소:
- **sm 미만**: Ask AI = icon-only
- **md 미만**: 메인 nav hidden, SidebarTrigger 표시
- **lg 미만**: 검색바 hidden, search 아이콘만

### 5.3 TocSidebar: xl 옆 ↔ MobileToc 위

```tsx
// 우측 TocSidebar — xl 이상
<aside className="sticky top-[89px] hidden ... xl:block">

// 본문 상단 MobileToc — xl 미만
<details className="... xl:hidden">
```

- 같은 `toc[]` prop 으로 양쪽이 렌더됨 (DocsPageShell 내부 처리)
- xl 미만에선 본문 위 collapsible `<details>` 로 변환
- xl+ 에선 우측 sticky sidebar

### 5.4 Grid 분할 단계

| 패턴 | 클래스 |
|---|---|
| Card 그리드 (2 col) | `grid grid-cols-1 sm:grid-cols-2` |
| Card 그리드 (3 col) | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Card 그리드 (4 col) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| TeamCard (3 col 변형) | `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3` |

기본 1 col → sm 첫 분할 → md/lg 다단. xl 사용은 콘텐츠 밀도에 따라.

### 5.5 Dialog 반응형 width

```tsx
<DialogContent className="sm:max-w-[423px]">
```

- 모바일 (sm 미만): full-width 에서 `calc(100% - 2rem)` (`DialogContent` 기본값)
- sm+: 고정 max-width (423 form / 512 confirm)
- `DialogFooter` 모바일에선 `flex-col-reverse` (CTA 위로) → sm+ 에서 `flex-row sm:justify-end`

### 5.6 페이지 헤더 stacked → row (Analytics)

```tsx
<div className="flex flex-col md:flex-row ...">
```

- 모바일: 세로 스택
- md+: 가로 정렬

Analytics 헤더, Toolbar 등에서 사용.

---

## 6. 안티패턴

| ❌ | 이유 |
|---|---|
| 임의 BP — `min-w-[1234px]`, `lg:max-w-[1200px]` 같은 매직 넘버 | §4 max-width 표 위반. Tailwind BP + 정의된 값만. |
| `2xl:` 사용 | §1 정책 — Figma 가 2xl 디자인을 정의하기 전까지 미사용. |
| `md:hidden` 만으로 단일 요소 분기 (짝 없이) | desktop-first 톤. 짝(다른 요소가 md:block) 이 있어야 함. |
| 페이지 wrapper 가 `px-6 md:px-10` 외 값 사용 | §3 표준 위반. |
| `sm:` 만 쓰고 `md:` 누락 (테이블 같은 큰 콘텐츠) | 태블릿 (md) 에서 시각 위계 깨짐. sm → md → lg 단계 진화 권장. |
| BP 별로 완전히 다른 컴포넌트 트리 렌더 (`md:hidden` `<MobileFoo />` + `hidden md:block` `<DesktopFoo />`) | DOM 중복. 가능하면 같은 컴포넌트가 BP 적응하도록. (불가피한 경우만 — Sheet vs aside 같이.) |

---

## 7. Sidebar / Toaster / 외부 layout 영향

본 패턴은 *컴포넌트가 layout 안에서 어떻게 적응* 하는지만 다룬다. 다음은 별도 룰:

- **사이드바 layout 자체** — `(dashboard)/layout.tsx`, `(docs)/layout.tsx` 등이 SidebarProvider + aside 조합 정의. `patterns/docs-page-shell.md` cross-ref.
- **모바일 Sheet drawer** — shadcn `Sheet` primitive 룰. 사이드바 컴포넌트 내부에서 isMobile 체크.
- **Toaster 위치** — 모바일에서도 화면 우하단 동일. 별도 반응형 분기 없음.

---

## 8. 관련 문서

- `patterns/docs-page-shell.md` — TocSidebar / MobileToc 의 xl 전환
- `patterns/table-list-page.md` — 페이지 wrapper padding (px-6 md:px-10), Toolbar 반응형
- `patterns/form-dialog.md` / `patterns/confirm-dialog.md` — Dialog sm:max-w
- `components/dialog.md` — DialogFooter 모바일 flex-col-reverse
- `rules/layout.md` — h-screen / overflow / 사이드바 높이 룰
