# Tutorials 페이지 스펙

> Figma: `[Phase1] Design` → `Documentation/tutorials` (node `1630:27361`)
> 코드: `src/app/(docs)/documentation/tutorials/page.tsx`

## 레이아웃

3-column docs 레이아웃 (DocsLayout 공통):
- Sidebar 255w (DocsSidebar)
- Body 760w (max-width container, padding 좌우)
- Right TOC 305w (TocSidebar)

## 본문 구성 (11 섹션)

| # | TOC id | 섹션 제목 | 비고 |
|---|---|---|---|
| 1 | `what-youll-build` | What You'll Build | `BuildOverviewCard` (highlight-subtle 패널 안에 SETUP 4단계 + LIVE DEMO 1단계 카드 그룹) |
| 2 | `prerequisites` | Prerequisites | 4개 항목 (Sign up / API key / 전화 / 5분) |
| 3 | `step-1` | Step 1. Get your phone number | `NumberedStep` 1, Request/Response code + WhatYouGet + TestPhoneField |
| 4 | `step-2` | Step 2. Create Agent | `NumberedStep` 2, Request/Response + AgentCard |
| 5 | `step-3` | Step 3. Create Queue | `NumberedStep` 3, Request/Response + IVR 안내 멘트 박스 |
| 6 | `step-4` | Step 4. Assign agent to queue | `NumberedStep` 4, Request/Response + AgentCard (assigned queue 목록) |
| 7 | `step-5` | Step 5. Make a test call | `NumberedStep` 5, 4 sub-step + Ready 배지 + Callout "Why deflection?" |
| 8 | `view-call-data` | View your call data | 4 항목 bullet |
| 9 | `accomplished` | What you accomplished | 5 체크리스트 ✓ |
| 10 | `continue-learning` | Continue learning | 4 next-step |
| 11 | `need-help` | Need Help? | 3 링크 |

페이지 푸터 nav: Prev = `Quick Start` (/documentation), Next = `Inbound Calls` (/documentation/inbound-calls).

## BuildOverviewCard 색상 정합 (Figma 인스펙트 truth)

- **외곽 패널**: `bg-background border-border` (흰 카드 + 일반 border)
- **SETUP 4행**: `bg-highlight-subtle border-highlight-border` (보라 톤)
- **LIVE DEMO 행**: `bg-success-subtle border-success-border` (녹 톤)
- **아이콘 컨테이너** (4 + 1 행 모두 공통): `h-12 w-12 rounded-full bg-background border border-border` (흰 원 + border)
  - 내부 lucide 아이콘: `text-foreground`, `h-5 w-5`
- **"SETUP" / "LIVE DEMO" 라벨**: `text-muted-foreground` (회색), `uppercase tracking-wider text-xs font-semibold`

> ⚠️ Phase1 작업 중 외곽/행 색이 안팎으로 뒤집힌 채 머지된 사례가 있었음 (2026-05-14). 스크린샷만 보고 톤 위치 추정 금지 → 각 레이어 `fillVar` 인스펙트 후 구현 (`design-system/rules/figma-reading.md` "다층 톤 카드 인스펙트 의무화" 참조).

## NumberedStep 색상 정합

좌측 번호 배지: `h-7 w-7 rounded-md bg-highlight-subtle text-highlight`

## 페이지 인라인 컴포넌트

- `BuildOverviewCard` / `StepRow` (highlight | success tone)
- `NumberedStep` (id + 번호 + 제목)
- `WhatYouGet` (mt-2 회색 박스 안 콘텐츠)
- `TestPhoneField` (read-only 전화번호 표시)
- `AgentCard` (●  이름 + 설명)
- `Callout` (info-subtle 박스, 제목 + 본문)
- `Divider` (h-px border)

이 컴포넌트들은 페이지 전용 — 다른 페이지에서 재사용 안 함. 다른 페이지에서 비슷한 패턴 필요하면 도메인 컴포넌트로 승격.

## 콘텐츠 mock

Step 1-4 의 Request / Response 코드는 UJet 추정 mock (실제 endpoint payload 와 정확히 일치하지 않음). 실제 스펙 받으면 상수만 교체.

## hidden 노드

- 각 단계의 `Buttons` (외부 링크 / "View Reference" 같은 보조 버튼) — 모두 visible=false. 미구현.
- Step 4 의 `Default/alert/badge`, Step 4 의 `Default/alert` — visible=false (대신 AgentCard 로 표시).
- Step 5 의 `Final Step/Frame 51`, `Field/Divider`, `Field/With_label`, `Field/Section` (일부) — visible=false.
