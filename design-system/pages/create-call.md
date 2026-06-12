# Create Call (API Reference) page spec

> Figma: `[Phase1] Design` → `API Reference/createcall` (node `1527:72879`)
> Code: `src/app/(api-reference)/api-reference/create-call/page.tsx`
> URL: `/api-reference/create-call`

## Layout

3-column layout (`(api-reference)` route group layout):
- ApiReferenceSidebar 255w
- Body 760w (DocsPageShell common)
- Right TOC 305w

## Endpoint

`POST https://{subdomain}.ujet.cx/apps/api/v1/calls` — Bearer token (Apps API key) authentication

## Body composition (10 sections)

| # | TOC id | Section title | Note |
|---|---|---|---|
| 1 | (header) | Header | POST badge + title "Create Call" + one-line description |
| 2 | `authentication` | Endpoint | `EndpointCard` (POST + URL) + "Authentication: Bearer token (Apps API key)" |
| 3 | `request` | Request Structure | Headers table (Header / Value / Required) + `body-parameters` Body Parameters table (Parameter / Type / Required / Description) |
| 4 | `response` | Response Structure | `CodeBlock` Success Response (TypeScript label, JSON content) |
| 5 | — | Response Fields | table (Field / Type / Description). No TOC item (h2 shown only) |
| 6 | (Lifecycle) | Call Lifecycle | description + inline `LifecycleDiagram` (chip flow) + Status Definitions table |
| 7 | (Monitoring) | Monitoring State Changes | description + `CodeBlock` Polling Example |
| 8 | `notes` | Notes | one paragraph of description |
| 9 | `related-api` | Related API endpoints | 2 `RelatedEndpoint`s (GET Get Call / PATCH Update Call) |
| 10 | `related-docs` | Related Documentation | 3 `RelatedDoc`s (Inbound Calls / IVR Menu / Authentication) |

Page footer nav: Next = `Get Call` (/api-reference/get-call).

## TOC (matches Figma spec)

7 items — Authentication / Body Parameters / Request / Response / Notes / Related API endpoints / Related Documentation.

(Per the Figma design intent, Lifecycle / Monitoring are in the body but not shown in the TOC.)

## Colors / badges

- POST badge: `<MethodBadge method="POST">` → variant=`info` (blue)
- Table value badges (Authorization, Bearer {API_KEY}, content-type, status values, etc.): `<CodeBadge>` → variant=`destructive` + `font-mono` (matches Figma `Property=destructive`)
- Related API endpoint method badge: MethodBadge

## Page inline components

- `EndpointCard` (Method + URL)
- `ParamTable` (sort icon is visual only, no behavior)
- `RelatedEndpoint` (Method + name + description + chevron)
- `RelatedDoc` (title underline + description + chevron)
- `LifecycleDiagram` (status chip → chevron → ... inline flow; temporary placeholder for the Figma RECTANGLE image)
- `PostBadge` (wrapper that adjusts the POST badge position in the header area)

Not reused on other pages. Consider extracting the pattern when adding another endpoint page.

## Content mock

The Request payload, Response JSON, Body Parameters, and Polling Example code are all presumed UJet mock (Phase1). Once the actual spec is received, just swap the constants.

## hidden nodes

- The `Wrapper` header (Bulk select / Hidden header) of each data table — visible=false
- The `lucide/arrow-up-down` instance — actually hidden, but shown as visual-only in ParamTable (sorting disabled in Phase1)
- `Call lifecycle image` (RECTANGLE 760×418) — replaced with the inline chip flow until the actual image is received

## Sidebar

`ApiReferenceSidebar` — Calls / Queues / Agents groups. Only Calls is expanded. Method badge + label left-aligned (w-14 fixed-width container).
