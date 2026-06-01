# 타이포그래피 역할 (Role → Class)

> 코드 전반에 흩어진 텍스트 클래스 조합을 **시맨틱 역할 이름** 으로 정리한 lookup table. 코드는 그대로 Tailwind 유틸리티를 직접 쓴다 — 본 문서는 *역할 → 클래스 매핑 참조표* 일 뿐이며 새 CSS 유틸리티를 정의하지 않는다.

---

## 1. Scope — shadcn primitive 는 제외

본 룰의 적용 범위는 **페이지 레벨 (h1/h2/h3, 본문, 캡션) 과 도메인 컴포넌트** (`src/components/api-portal/*` 의 EmptyState / TeamCard / DocsSection 등).

| 영역 | 본 룰 적용 |
|---|---|
| 페이지 (`/users`, `/api-keys`, `/documentation/*` 등) | ✅ |
| 도메인 컴포넌트 (`src/components/api-portal/*`) | ✅ |
| **shadcn primitive 내부** (`src/components/ui/*`) | ❌ Out of scope |
| 카탈로그 페이지 (`/design-system/*`) | ✅ |

### shadcn primitive 가 out of scope 인 이유

shadcn primitive 들은 자기 안에 **하드코딩된 typography 결정** 을 가짐 — `DialogTitle = text-lg font-semibold`, `Label = text-sm font-medium`, `TableHead = text-sm font-medium`. 이는 shadcn 의 설계 철학상 변경 대상이 아님 (`rules/shadcn.md` 의 변환 규약 참조).

primitive 의 typography 가 **마침 본 표의 어떤 role 과 일치**하면 검증된 것이고, 다르면 그건 primitive 의 결정으로 받아들임. 본 표가 primitive 를 *간섭하지 않음*.

> **실용 결과**: shadcn 컴포넌트 새로 추가 (예: `Tooltip`, `Hover Card`) 시 본 문서와 충돌하지 않음. primitive 는 자기 typography 를 가진 채 도착하고, 우리는 그 위에 페이지 / 도메인 typography 만 책임짐.

---

## 2. 역할 표

12 개 역할. 각 역할은 *클러스터 라벨* — 코드엔 우측 클래스 그대로 쓰고, 본 표는 *어디서 쓰는지 / 왜 이 조합인지* 참조용.

### 2.1 Heading 계열

| Role | Class | 사용처 | 빈도 |
|---|---|---|---|
| `display` | `text-5xl md:text-6xl font-semibold tracking-tight text-foreground` | 랜딩 hero | 5 |
| **`page-title`** (dashboard) | `text-3xl font-semibold text-foreground` | `<h1>` — `/users`, `/api-keys`, `/analytics` 등 table-list-page | 15 |
| **`page-title`** (docs) | `text-4xl font-semibold text-foreground` | `<h1>` — `/documentation/*`, `/api-reference/*` (DocsPageShell 사용) | 2 |
| **`section-title`** (docs body) | `text-2xl font-semibold text-foreground` | `<h2>` — DocsSection 내부 | 5 |
| **`section-title`** (catalog) | `text-xl font-semibold text-foreground` | `<h2>` — 카탈로그 페이지 섹션 | 10 |
| `card-title-lg` | `text-lg font-semibold text-foreground` | TeamCard 등 큰 카드 헤더 | 3 |
| `card-title` | `text-base font-medium text-foreground` | EmptyState title, DemoCard 등 일반 카드 헤더 | 9 |

### 2.2 Body / Supportive 계열

| Role | Class | 사용처 | 빈도 |
|---|---|---|---|
| `label` | `text-sm font-medium text-foreground` | 폼 Label, 작은 sub-heading | 12 |
| `body` | `text-base text-muted-foreground` | 페이지 description (h1 아래) | 14 |
| `body-sm` | `text-sm text-muted-foreground` | 카드 description, 테이블 secondary cell, 일반 보조 텍스트 | 25+ |
| `caption` | `text-xs text-muted-foreground` | 메타데이터, 푸터 메모, 보조 안내 | 12 |
| `error` | `text-sm text-destructive` | 폼 validation 에러 메시지 | 5+ |

### 2.3 Code / Link 계열

| Role | Class | 사용처 |
|---|---|---|
| `code-inline` | `rounded-sm bg-muted px-1 py-0.5 font-mono text-sm` | 본문 안 inline `<code>` (속성명·식별자 강조) |
| `code-block` | `font-mono text-xs` 또는 `text-sm` + `bg-muted/30 p-4 rounded-md` | 코드 스니펫 블록 |
| `link` | `text-info hover:underline` | cross-ref / 외부 링크 |

---

## 3. 같은 Role 의 2 가지 variant — page-title / section-title

두 role 은 의도된 size variant 를 가짐.

### `page-title` — dashboard vs docs

| Variant | Class | 적용 |
|---|---|---|
| **dashboard** | `text-3xl font-semibold` | table-list-page 패턴 (테이블 위주 콘텐츠 — 헤더가 너무 크면 시각 위계 깨짐) |
| **docs** | `text-4xl font-semibold` | docs-page-shell 패턴 (긴 본문 — 타이틀이 시작점 명확히 분리) |

→ 어느 variant 인지는 **페이지 패턴이 결정** (`patterns/table-list-page.md` / `patterns/docs-page-shell.md`). 임의 변경 X.

### `section-title` — docs body vs catalog

| Variant | Class | 적용 |
|---|---|---|
| **docs body** | `text-2xl font-semibold` | DocsSection 내부 (h1 text-4xl 의 명확한 하위) |
| **catalog** | `text-xl font-semibold` | 카탈로그 페이지 섹션 (h1 text-3xl 의 명확한 하위) |

→ 패턴별 hierarchy 일관성 유지 — h1 사이즈에 맞춰 h2 도 단계적.

---

## 4. 사용 예시

### 4.1 표준 페이지 헤더

```tsx
// Dashboard (table-list-page)
<h1 className="text-3xl font-semibold text-foreground">{title}</h1>     {/* page-title (dashboard) */}
<p className="text-sm text-muted-foreground">{subtitle}</p>              {/* body-sm */}

// Docs (docs-page-shell)
<h1 className="text-4xl font-semibold text-foreground">{title}</h1>     {/* page-title (docs) */}
<p className="text-base text-muted-foreground">{description}</p>         {/* body */}
```

### 4.2 카드 헤더 + 본문

```tsx
<div className="rounded-md border border-border bg-card p-4">
  <h3 className="text-base font-medium text-foreground">{cardTitle}</h3>  {/* card-title */}
  <p className="text-xs text-muted-foreground">{cardCaption}</p>          {/* caption */}
</div>
```

### 4.3 폼 필드 + 에러

```tsx
<Label className="text-sm font-medium text-foreground">Email</Label>     {/* label */}
<Input ... />
{error && (
  <p className="text-sm text-destructive">Email is required</p>           {/* error */}
)}
```

### 4.4 EmptyState

```tsx
<EmptyState
  variant="no-data"
  icon={<UserCheck />}
  title="No pending approvals"        // 내부적으로 card-title 적용 (text-base font-medium)
  description="..."                    // 내부적으로 body-sm 적용 (text-sm muted)
/>
```

---

## 5. 의도된 누락 / 향후 추가 검토

| 미정의 영역 | 사유 |
|---|---|
| `display` 외 마케팅 페이지 typography | 마케팅 영역은 brand 토큰처럼 별도 룰 (`rules/color.md` 참조) — Phase1 외 |
| `text-foreground font-mono` 인라인 (chip 없이) | 흔치 않음 — 필요 시 case-by-case |
| Heading anchors / TOC 항목 typography | DocsSection / TocSidebar 가 자체 처리 (`patterns/docs-page-shell.md` 참조) |
| 모바일 별도 size variant (예: 모바일 page-title 축소) | 현재 코드 미사용 — 필요 시 `rules/responsive.md` 와 연결 정의 |

---

## 6. 안티패턴

| ❌ | 이유 |
|---|---|
| 본 표에 없는 임의 클래스 조합 사용 (예: `text-[22px] font-semibold`) | 표 내 role 중 유사한 것 선택 — 없으면 추가 결정 필요 (사용자에게 질문) |
| shadcn primitive 내부 typography 를 본 표로 override (`<DialogTitle className="text-2xl">`) | primitive 가 자기 typography 가짐 — scope 외 (§1). 필요 시 primitive 직접 수정 (`rules/shadcn.md` 룰 10). |
| 같은 페이지에서 page-title variant 혼용 (table-list-page 인데 `text-4xl` 쓰기) | 패턴별 hierarchy 깨짐. 패턴이 variant 결정. |
| `text-sm font-medium` 으로 body 작성 (label role 인데) | label 은 폼 필드 / 작은 sub-heading 전용. body 는 `text-sm text-muted-foreground`. |
| 본 표 외 사용처에 새 시맨틱 의미 만들기 | 표가 *현재 코드의 클러스터 라벨* — 새 패턴 만들 땐 표에 row 추가 후 사용. |

---

## 7. 본 표를 갱신할 때

- 코드에 새 typography 조합이 의도적으로 도입되면 본 표 갱신
- 표에 없는 클래스 조합이 코드에 보이면 **둘 중 하나**:
  - 기존 role 로 마이그레이션 (Tailwind class 변경)
  - 표에 새 role 추가 (사용 사례 충분히 누적된 경우)
- 임의 추가는 비추 — *clustering* 이 본 표의 가치이므로, 1-2건 사례로는 role 신설 X

---

## 8. 관련 문서

- `rules/shadcn.md` — shadcn primitive 변환 규약 (본 룰의 scope 외)
- `rules/color.md` — color 토큰 (typography 의 `text-foreground`, `text-muted-foreground` 등이 의존)
- `rules/responsive.md` — 반응형 (현재 page-title 은 BP 별 size variant 없지만 향후 가능성)
- `patterns/table-list-page.md` — page-title (dashboard variant) 사용
- `patterns/docs-page-shell.md` — page-title (docs variant) + section-title 사용
- `components/empty-state.md` — card-title / body-sm 사용 (본 표 도입 후 spec 갱신)
- `rules/states.md` — body-sm / error role 사용 (본 표 도입 후 spec 갱신)
