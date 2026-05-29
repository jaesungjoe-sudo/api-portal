# 화면 상태 규칙 (Loading / Empty / Error / Disabled)

> 새 화면이 백엔드 데이터에 붙는 순간 가장 먼저 갈리는 영역. 각 상태별 truth 출처가 다르므로 본 문서 §1 경계 표를 먼저 확인할 것.

---

## 1. Truth 출처 경계

상태마다 "정답이 어디에서 오는가"가 다르다. 이 문서는 그 경계가 명확한 하이브리드 룰이다.

| 상태 | truth 출처 | 처방 요약 |
|---|---|---|
| **Loading** | Figma 라이브러리 `Skeleton` (코드: `src/components/ui/skeleton.tsx`) | primitive 그대로, 표면별 형태만 조합 |
| **Empty** | **이 문서가 정의** (라이브러리에 전용 컴포넌트 없음) | EmptyState 베이스라인 = 본 문서 §4 + `components/empty-state.md` |
| **Error** | shadcn `Alert` 재사용 + 이 문서가 패턴 정의 | 페이지/섹션 = Alert(destructive)+재시도, 일시적 = toast |
| **Disabled** | 기존 룰 (CLAUDE.md / `instance-variant.md`) | 본 문서에서 재정의 X, cross-ref 만 |

### 수명 조건

- Empty 는 현재 라이브러리에 전용 컴포넌트가 없어서 이 문서가 truth. **라이브러리에 `EmptyState` 컴포넌트가 추가되는 시점**부터 이 문서는 라이브러리 정합 가이드로 격하되고, `components/empty-state.md` 의 베이스라인 spec 은 라이브러리 spec 으로 마이그레이션한다.
- Loading / Error 는 라이브러리/기존 primitive 기반이므로 수명 조건 없음.

---

## 2. 표면 × 상태 매트릭스

세로축 = 상태가 표시되는 표면(surface), 가로축 = 상태. 각 셀이 표준 처방.

| 표면 | Loading | Empty | Error |
|---|---|---|---|
| **페이지 전체 전환** | 블록 skeleton (헤더 윤곽 + 본문 영역) | — (보통 하위 표면이 담당) | 페이지 자리에 Alert destructive + 재시도 |
| **테이블** | row skeleton ×N (헤더 유지) | EmptyState `no-data` / 검색 결과면 `no-results` | 테이블 자리에 Alert + 재시도 |
| **카드 그리드** | Card 스켈레톤 ×N | EmptyState (그리드 자리) | Alert + 재시도 |
| **폼** | 필드 skeleton (Edit pre-fill 로딩 시) | — | 필드 위 Alert / 필드별 `aria-invalid` |
| **차트** | 차트 영역 skeleton 박스 | EmptyState `no-data` (차트 자리) | Alert (차트 자리) |
| **인라인 액션 버튼** | **disabled 만** (spinner 없음) | — | toast (일시적 에러) |

### 인라인 액션 단순 룰

라이브러리에 spinner 컴포넌트가 없고, 1초 초과 타이밍 인프라(타이머 훅 등)도 없으므로 **인라인 액션은 disabled 만**으로 단순 유지한다. 향후 실 API 연동에서 1초 이상 걸리는 액션 사례가 누적되면 그때 별도 정의를 추가한다.

### 리스트(non-table) 표면은 현재 미정의

예: Documentation Quick Links, Sidebar 메뉴, TopApis 행 — 이 표면들이 비거나 로딩될 때의 룰은 아직 정의하지 않았다. 필요한 화면이 들어오면 본 매트릭스에 행을 추가한다.

---

## 3. Loading 상세

### 3.1 Skeleton primitive 사용

- 모든 로딩 자리표시는 `src/components/ui/skeleton.tsx` 의 `<Skeleton />` 사용. raw `animate-pulse bg-muted` 패턴 새로 만들지 말 것.
- 행/카드 등 반복 단위는 동일한 컴포넌트의 실 콘텐츠와 같은 높이·radius·간격으로 맞춰 layout shift 를 최소화.

```tsx
// ✅ 테이블 row skeleton — 헤더 유지, 본문만 교체
<TableBody>
  {Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      ...
    </TableRow>
  ))}
</TableBody>
```

### 3.2 페이지/정렬 전환 — row 유지 권장

정렬·페이지 전환 같이 **기존 데이터 컨텍스트가 유지되는** 재요청에서는 row 를 통째로 skeleton 으로 갈아치우지 않는다. 즉시 응답인 경우(mock / client-side 정렬) 인디케이터 자체가 불필요하고, 서버 정렬·서버 페이지네이션 등 가시적 지연이 발생하는 경우 **테이블 헤더 위에 2px 얇은 indeterminate bar** 를 표시한다.

> **컴포넌트는 도입 시점에 정의.** 본 PR 스코프에선 룰만 권장하고 별도 `TableLoadingBar` 는 만들지 않는다. shadcn `Progress` 는 indeterminate 를 기본 지원하지 않으므로, 실제 필요 시점에 전용 컴포넌트로 정의한다.

### 3.3 캐시된 데이터 백그라운드 재검증

캐시 hit 후 백그라운드에서 stale-while-revalidate 식으로 재검증할 때는 **인디케이터 없음**. 사용자에게는 캐시 데이터가 즉시 보이는 게 자연스럽고, 재검증 자체가 노이즈가 되면 안 된다.

> 현재 적용 케이스 없음. SWR / React Query 등 데이터 페칭 라이브러리 도입 시 이 룰 적용.

---

## 4. Empty 상세

### 4.1 EmptyState 컴포넌트 사용

표면 본문이 비는 모든 케이스는 `EmptyState` 컴포넌트로 표현. 직접 `<p>No data</p>` 같은 단순 텍스트 fallback 금지.

- 컴포넌트 spec: **`design-system/components/empty-state.md`** 참조.
- 2 variant: `no-data` (데이터 자체 없음) / `no-results` (검색·필터 결과 없음). 카피와 CTA 정책이 다르다.

### 4.2 컨테이너 padding 위임

EmptyState 자체는 외부 padding 을 가지지 않는다(antipattern 참조). **컨테이너가 표면에 맞는 vertical padding 을 제공**한다.

| 표면 | 권장 padding |
|---|---|
| 테이블 본문 / 카드 그리드 | `py-16` (64px) |
| 차트 | `py-10` (40px) |
| 폼 | `py-8` (32px) |
| 카드 내부 위젯 (작은 영역) | `py-6` (24px) |

> 위 수치는 권장값. 실 Figma 디자인이 들어오면 해당 수치로 조정 가능. 단 표면 간 위계(테이블이 가장 크고, 위젯이 가장 작다)는 유지.

```tsx
// ✅ 빈 테이블 — 컨테이너가 py-16 제공
<TableBody>
  <TableRow>
    <TableCell colSpan={COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<Key />}            // Figma 인스펙트 결과 사용
        title="No API keys yet"
        description="Create your first key to start integrating."
        action={{ label: "Create API key", onClick: openCreate }}
      />
    </TableCell>
  </TableRow>
</TableBody>
```

---

## 5. Error 상세

### 5.1 3분류

| 분류 | 처방 | 예시 |
|---|---|---|
| **영구/블로킹** | 해당 표면 자리에 `Alert variant="destructive"` + 재시도 버튼. 페이지 통째 실패면 페이지 레벨. | 권한 없음, 데이터 fetch 실패, 의존 리소스 부재 |
| **일시적/액션 에러** | `toast` (sonner wrapper) | 저장 실패, 일시적 네트워크 오류 |
| **폼 검증 에러** | 기존 룰 — `aria-invalid` + 필드 인라인 메시지. 본 문서에서 재정의 X. | 필수값 누락, 형식 오류 |

### 5.2 결정 트리 — 표면 자리 vs 페이지 레벨

> **헷갈리면 더 좁은 범위를 선택한다.** 페이지 전체를 에러 화면으로 덮기 전에, 정말 페이지의 모든 부분이 무의미해진 상태인지 확인.

- 헤더 + 본문 중 본문 하나만 실패 → 본문 자리에만 Alert
- 차트 한 개만 실패 → 차트 자리에만 Alert (나머지 카드는 정상)
- 페이지의 모든 콘텐츠가 같은 fetch 에 의존하고 그게 실패 → 페이지 레벨 Alert

### 5.3 Button 규칙 예외 — Alert 내부 액션 버튼

> ⚠️ **CLAUDE.md / `components/button.md` Button 규칙의 명시적 예외**

Alert 내부의 액션 버튼(재시도 / 새로고침 등)은 다음을 사용한다:

```tsx
<Button variant="outline" size="sm" onClick={retry}>
  Retry
</Button>
```

- `variant="outline"` + `size="sm"` 허용.
- **근거**: Alert 는 페이지 메인 콘텐츠 대비 시각 무게가 작은 보조 영역이며, `default` 사이즈 Button(h-9)은 Alert 본문 텍스트(`text-sm`)와 시각 위계가 무너진다.
- **적용 범위 한정**: 이 예외는 **Alert 내부에 한정**. 페이지 헤더 액션, Dialog footer, 테이블 toolbar 등 다른 표면의 Button 사이즈/variant 는 **기존 Button 규칙(Figma `componentProperties` 1:1 매칭) 그대로** 적용.

### 5.4 Alert 내부 재시도 버튼 배치

description 하단에 **inline + 좌측 정렬**. Alert 우상단 X 등 별도 dismiss 영역에 두지 않는다.

```tsx
<Alert variant="destructive">
  <AlertTitle>Failed to load API keys</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
    <div className="mt-3">
      <Button variant="outline" size="sm" onClick={retry}>Retry</Button>
    </div>
  </AlertDescription>
</Alert>
```

### 5.5 백엔드 raw 에러 메시지 노출 금지

`err.message`, stack trace, status code 문자열을 그대로 사용자에게 노출하지 않는다. 사용자 언어로 일반화한 카피 + (개발자 콘솔 로그는 별개로) 사용.

```tsx
// ❌
<AlertDescription>{err.message}</AlertDescription>

// ✅
<AlertDescription>
  Failed to load API keys. Please try again.
</AlertDescription>
```

### 5.6 Optimistic update 롤백

- 케이스별 판단. 핵심은 **롤백이 사용자에게 보여야 한다는 것**.
- 실패 시 UI 상태를 직전 값으로 되돌리고, **toast 로 실패 사실을 알린다**. 조용한 롤백 금지.

---

## 6. Disabled

신규 정의 없음. 다음 cross-ref 만 유지한다.

- **폼 필드 disabled** — Figma `componentProperties.State === "disabled"` 일 때만 적용 (CLAUDE.md / `rules/instance-variant.md`).
- **버튼 disabled (액션 진행 중)** — 본 문서 §2 매트릭스 "인라인 액션 버튼" 셀 참조 (spinner 없이 disabled 만).
- **메뉴 항목 disabled (권한 등)** — 케이스별. 단 disabled 사유가 "어떤 조건을 충족하면 풀리는" 종류면 **Tooltip 으로 사유 표시 권장** ("Default 팀은 삭제할 수 없음" 등).

---

## 관련 문서

- `components/empty-state.md` — EmptyState 컴포넌트 spec (본 문서 §1 수명 조건 적용 대상)
- `components/alert.md` — Alert primitive spec (Error 처방의 기반)
- `components/button.md` — Button 규칙 (§5.3 예외의 본문)
- `rules/instance-variant.md` — Disabled 판별 기준
- `icons.md` — EmptyState 아이콘 선택 워크플로우 (Figma 인스펙트 → lucide → 없으면 질문)
