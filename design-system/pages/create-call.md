# Create Call (API Reference) 페이지 스펙

> Figma: `[Phase1] Design` → `API Reference/createcall` (node `1527:72879`)
> 코드: `src/app/(api-reference)/api-reference/create-call/page.tsx`
> URL: `/api-reference/create-call`

## 레이아웃

3-column 레이아웃 (`(api-reference)` 라우트 그룹 layout):
- ApiReferenceSidebar 255w
- Body 760w (DocsPageShell 공통)
- Right TOC 305w

## Endpoint

`POST https://{subdomain}.ujet.cx/apps/api/v1/calls` — Bearer token (Apps API key) 인증

## 본문 구성 (10 섹션)

| # | TOC id | 섹션 제목 | 비고 |
|---|---|---|---|
| 1 | (헤더) | Header | POST 배지 + 제목 "Create Call" + 한 줄 설명 |
| 2 | `authentication` | Endpoint | `EndpointCard` (POST + URL) + "Authentication: Bearer token (Apps API key)" |
| 3 | `request` | Request Structure | Headers 테이블 (Header / Value / Required) + `body-parameters` Body Parameters 테이블 (Parameter / Type / Required / Description) |
| 4 | `response` | Response Structure | `CodeBlock` Success Response (TypeScript label, JSON content) |
| 5 | — | Response Fields | 테이블 (Field / Type / Description). TOC 항목 없음 (h2 노출만) |
| 6 | (Lifecycle) | Call Lifecycle | 설명 + 인라인 `LifecycleDiagram` (chip 흐름) + Status Definitions 테이블 |
| 7 | (Monitoring) | Monitoring State Changes | 설명 + `CodeBlock` Polling Example |
| 8 | `notes` | Notes | 한 단락 설명 |
| 9 | `related-api` | Related API endpoints | `RelatedEndpoint` 2개 (GET Get Call / PATCH Update Call) |
| 10 | `related-docs` | Related Documentation | `RelatedDoc` 3개 (Inbound Calls / IVR Menu / Authentication) |

페이지 푸터 nav: Next = `Get Call` (/api-reference/get-call).

## TOC (Figma 스펙 정합)

7 항목 — Authentication / Body Parameters / Request / Response / Notes / Related API endpoints / Related Documentation.

(Figma 디자인 의도상 Lifecycle / Monitoring 은 본문에는 있지만 TOC 노출 안 함.)

## 색상 / 배지

- POST 배지: `<MethodBadge method="POST">` → variant=`info` (파랑)
- 테이블 값 배지 (Authorization, Bearer {API_KEY}, content-type, status 값 등): `<CodeBadge>` → variant=`destructive` + `font-mono` (Figma `Property=destructive` 정합)
- Related API endpoint method 배지: MethodBadge

## 페이지 인라인 컴포넌트

- `EndpointCard` (Method + URL)
- `ParamTable` (정렬 아이콘 시각만, 동작 없음)
- `RelatedEndpoint` (Method + 이름 + 설명 + chevron)
- `RelatedDoc` (제목 underline + 설명 + chevron)
- `LifecycleDiagram` (status chip → chevron → ... 인라인 흐름; Figma 의 RECTANGLE 이미지 자리표시자 자리 임시)
- `PostBadge` (헤더 영역 POST 배지 위치 조정 wrapper)

다른 페이지에서 재사용 안 함. 다른 endpoint 페이지 추가 시 패턴 추출 검토.

## 콘텐츠 mock

Request payload·Response JSON·Body Parameters·Polling Example 코드 모두 UJet 추정 mock (Phase1). 실제 스펙 받으면 상수만 교체.

## hidden 노드

- 각 데이터 테이블의 `Wrapper` 헤더 (Bulk select / Hidden header) — visible=false
- `lucide/arrow-up-down` 인스턴스 — 실제 hidden 이지만 ParamTable 에선 시각용으로 표시 (Phase1 정렬 비활성)
- `Call lifecycle image` (RECTANGLE 760×418) — 실제 이미지 받기 전까지 인라인 chip 흐름으로 대체

## 사이드바

`ApiReferenceSidebar` — Calls / Queues / Agents 그룹. Calls 만 expand. Method 배지 + 라벨 좌측 정렬 (w-14 고정 폭 컨테이너).
