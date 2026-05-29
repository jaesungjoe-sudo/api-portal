# docs-page-shell 패턴

> Documentation 및 API Reference 페이지의 표준 shell. Breadcrumb → (Tag?) → Title → Description → Sections (+TOC) → Prev/Next 풋터. 본 패턴은 `<DocsPageShell>` 단일 컴포넌트로 강제되며, 호출부는 props 만 채워 사용한다.

## 적용 범위

- `/documentation` 및 `/documentation/*` — Quick Start, Inbound Calls, Tutorials, 그 외 모든 Documentation 페이지
- `/api-reference/*` — Create Call (구현됨), Get Call / Update Call (placeholder)

표 / 폼 / 랜딩 페이지는 본 패턴 대상이 아니다. 리스트형은 `patterns/table-list-page.md`, 다이얼로그는 `patterns/form-dialog.md` / `patterns/confirm-dialog.md`.

---

## 1. 사용 — `DocsPageShell` 컴포넌트

본 패턴의 모든 페이지는 **`<DocsPageShell>` 단일 컴포넌트**로 작성한다. 직접 Breadcrumb / Title / TOC 등을 조립하지 말 것.

```tsx
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";
import { MethodBadge } from "@/components/api-portal/MethodBadge";

export default function MyDocsPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "My Page" },
      ]}
      tag={<MethodBadge method="POST" />}  // optional
      title="My Page"
      description="One-line intent for the reader."
      toc={[
        { id: "intro", label: "Introduction" },
        { id: "usage", label: "Usage" },
      ]}
      next={{ label: "Next Page", href: "/documentation/next" }}
    >
      <DocsSection id="intro" title="Introduction">
        <p>...</p>
      </DocsSection>
      <DocsSection id="usage" title="Usage">
        <p>...</p>
      </DocsSection>
    </DocsPageShell>
  );
}
```

---

## 2. Props

| Prop | Type | Required | 용도 |
|---|---|---|---|
| `breadcrumb` | `{ label: string; href?: string }[]` | ✅ | 빵부스러기. 마지막 항목은 `href` 없이 — 현재 페이지로 자동 인식 (BreadcrumbPage). |
| `tag` | `React.ReactNode` | — | Title 위 슬롯 — API Reference 의 method 배지 등. 없으면 Title 이 breadcrumb 바로 아래. |
| `title` | `string` | ✅ | `<h1>` 페이지 제목. `text-4xl font-semibold` 자동 적용. |
| `description` | `string` | — | Title 아래 한 줄 설명. `text-base text-muted-foreground`. |
| `toc` | `{ id: string; label: string }[]` | — | TOC 항목들. 자동으로 우측 TocSidebar (xl 이상) + 본문 상단 MobileToc (xl 미만) 양쪽에 렌더. id 는 `DocsSection.id` 와 일치해야 scrollSpy 동작. |
| `prev` | `{ label: string; href: string }` | — | 풋터 좌측 prev 링크. |
| `next` | `{ label: string; href: string }` | — | 풋터 우측 next 링크. |
| `children` | `React.ReactNode` | ✅ | `<DocsSection>` 들. 일반 `<p>` / `<div>` 도 가능하지만 TOC 와 연동되려면 DocsSection 권장. |

---

## 3. Anatomy

```
┌─ DocsPageShell (max-w-1160, gap-10 center column + right TOC) ──────────────┐
│                                                                              │
│  Breadcrumb                                                                  │
│                                                                              │
│  (tag — optional, mb-3)                                                      │
│                                                                              │
│  <h1> Title — text-4xl font-semibold                                         │
│  description — text-base text-muted-foreground                               │
│                                                                              │
│  [MobileToc — xl 미만에서만 표시]                                            │
│                                                                              │
│  DocsSection #1 (id="intro")                                                 │
│    <h2> Introduction — text-2xl font-semibold                                │
│    body — text-base text-muted-foreground                                    │
│  DocsSection #2 (id="usage")                                                 │
│  ...                                                                         │
│                                                                              │
│  ─────────────────                                                           │
│  [prev]                                                          [next →]    │
│                                                                              │
└───────────────────────────────────────────────────────────────  ─────────────┘
                                                                  TocSidebar
                                                                  (xl 이상,
                                                                   sticky)
```

레이아웃 핵심:
- 외곽 `<div className="flex justify-center px-6 pb-20 pt-10 md:px-10">` — 가운데 정렬 + 위아래 padding
- 내부 `<div className="flex w-full max-w-[1160px] gap-10">` — 본문(`flex-1`) + 우측 TocSidebar(`w-[265px]`)
- 본문 wrapper: `<div className="min-w-0 flex-1">` — `min-w-0` 으로 자식 overflow 정상 처리
- 본문 sections wrapper: `<div className="flex flex-col gap-10">` — 섹션 사이 40px 간격 (table-list-page wrapper 와 같은 값, 의도된 일관성)

---

## 4. Title typography — `text-4xl` (table-list-page 와 차이)

| 패턴 | h1 클래스 | 이유 |
|---|---|---|
| table-list-page | `text-3xl font-semibold` (30px) | 페이지 콘텐츠가 데이터 테이블 — 헤더가 너무 무거우면 시각 위계 어긋남 |
| **docs-page-shell** | `text-4xl font-semibold` (36px) | 페이지 콘텐츠가 긴 본문 — 타이틀이 본문 시작점을 명확히 분리해야 함 |

→ 두 패턴 의도된 차이. table-list-page 와 docs-page-shell 을 혼동하지 말 것 (예: API Reference 페이지에 table-list-page 스타일 적용 X).

---

## 5. `DocsSection` 헬퍼

```tsx
<DocsSection id="usage" title="Usage">
  <p>...</p>
  <CodeBlock>...</CodeBlock>
</DocsSection>
```

- `id` 필수 — TOC scrollSpy 연동
- `title` — `<h2 className="text-2xl font-semibold">`
- children wrapper — `<div className="flex flex-col gap-3 text-base leading-6 text-muted-foreground">` (섹션 내부 요소 사이 12px 간격, 본문은 자동으로 muted-foreground)
- 일반 `<p>` 는 wrapping 으로 자동 스타일 적용. 강조 텍스트가 필요하면 `<span className="text-foreground font-medium">` override.

---

## 6. TOC 통합

`toc` prop 을 제공하면 자동으로 두 가지 렌더:

| 컴포넌트 | 위치 | 표시 조건 |
|---|---|---|
| `TocSidebar` | 우측 sticky, `w-[265px]` | `xl` 이상 (1280px+) |
| `MobileToc` | 본문 상단, `<details>` collapsible | `xl` 미만 |

scrollSpy (`useScrollSpy` 훅) 가 현재 viewport 의 section id 를 추적해서 활성 항목을 표시. `DocsSection.id` 와 `toc[].id` 가 정확히 일치해야 동작.

---

## 7. Prev / Next 풋터 네비

```tsx
prev={{ label: "Quick Start", href: "/documentation" }}
next={{ label: "Inbound Calls", href: "/documentation/inbound-calls" }}
```

- 둘 다 optional. 한 쪽만 있으면 그쪽만 표시.
- 시각 — 외곽 `border border-border bg-background ... hover:bg-accent` (outline Button 과 유사한 모양, 단 anchor 태그).
- 풋터는 본문과 `border-t border-border` + `pt-10 mt-12` 로 분리.

---

## 8. `tag` prop — 2026-05-29 추가

API Reference 페이지에서 method 배지(GET / POST / PATCH 등) 를 Title 위에 표시하기 위해 추가된 슬롯.

```tsx
<DocsPageShell
  tag={<MethodBadge method="POST" />}
  title="Create Call"
  ...
>
```

- 위치: Breadcrumb 아래, Title 위. `mb-3` 으로 Title 과 12px 간격.
- 이전엔 인라인 `PostBadge()` 컴포넌트 + `-mt-6` 마진 hack 으로 우회 → `tag` prop 으로 정식화.
- API Reference 외 페이지에서도 활용 가능 (status 배지, version 배지 등).

---

## 9. 안티패턴

| ❌ | 이유 |
|---|---|
| Breadcrumb / Title / TocSidebar 등을 직접 조립 | `<DocsPageShell>` 강제. 룰 이탈 위험 (max-width / gap / typography 일관성 깨짐). |
| `<DocsPageShell>` 안에 `<h1>` 직접 작성 | Title 은 prop 으로 전달. `text-4xl font-semibold` 자동 부여. |
| `DocsSection` 의 `id` 와 `toc[].id` 불일치 | scrollSpy 가 활성 항목 추적 못 함. TOC active 표시 안 됨. |
| 인라인 `*Badge()` + 마진 hack 으로 Title 위 배지 표현 | `tag` prop 사용. (2026-05-29 정식화) |
| table-list-page 톤의 `text-3xl` Title 사용 | docs-page-shell 은 `text-4xl`. shell 자체가 적용함 — override 시도 자체가 룰 위반. |
| `<Section>` 같은 custom 헬퍼 자체 정의 | `<DocsSection>` 재사용. id + title + children wrapping 이 표준. |
| 본문 wrapper 의 `min-w-0` 누락 | 긴 코드 블록·표가 가로 overflow 시 layout 깨짐. |

---

## 10. 적용 페이지 (Phase1)

| 페이지 | 구현 상태 | tag |
|---|---|---|
| `/documentation` (Quick Start) | ✅ 완전 구현 (5 sections) | — |
| `/documentation/inbound-calls` | ✅ 완전 구현 (5 sections) | — |
| `/documentation/tutorials` | Placeholder | — |
| `/documentation/*` (나머지 8 페이지) | Blank | — |
| `/api-reference/create-call` | ✅ 완전 구현 (10 sections) | POST 배지 |
| `/api-reference/get-call` | Placeholder | GET 배지 |
| `/api-reference/update-call` | Placeholder | PATCH 배지 |

---

## 관련 문서

- `components/breadcrumb.md` — Breadcrumb primitive (작성 예정)
- `patterns/table-list-page.md` — 대시보드 페이지 패턴 (대조)
- `patterns/form-dialog.md` / `patterns/confirm-dialog.md` — 다이얼로그 패턴 (대조)
- `components/badge.md` — `tag` prop 에 자주 사용되는 Badge / MethodBadge
