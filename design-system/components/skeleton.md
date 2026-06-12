# Skeleton

> 로딩 자리표시(placeholder). 데이터가 도착하기 전, 들어올 콘텐츠의 윤곽을 펄스 애니메이션으로 보여준다. 모든 로딩 placeholder 는 raw `animate-pulse bg-muted` 대신 이 primitive 를 쓴다.

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton";
```

## Anatomy

```tsx
<Skeleton className="h-4 w-32" />
```

- 단일 `<div>` — `animate-pulse rounded-md bg-muted` + 호출부 `className`.
- variant/size prop 없음. 크기·모양은 전적으로 `className` (`h-*`/`w-*`/`rounded-*`) 으로 지정.

## 디자인 토큰

| 속성 | 값 |
|---|---|
| 배경 | `bg-muted` |
| radius | `rounded-md` (8px) — 호출부에서 `rounded-full`(아바타/배지) 등으로 오버라이드 |
| 애니메이션 | `animate-pulse` |

Figma 원본: 라이브러리 `Skeleton` 컴포넌트.

## 티어 / 아티팩트

Skeleton 은 **variant 없는 Tier-2 primitive** (`rules/component-artifacts.md`). 원칙상 카탈로그 페이지 불필요하나, **로딩 *합성*(table/dashboard 조합)은 글로 읽는 것보다 라이브로 보는 게 훨씬 명확**하므로 카탈로그 데모 페이지를 두는 **의도적 예외**다. → `/design-system/primitives/skeleton`.

## 사용 룰

정책 단일 출처는 **`rules/states.md` §3 (Loading)**. 요약:

1. **항상 `<Skeleton />`** — raw `animate-pulse bg-muted` 새로 만들기 금지.
2. 반복 단위(row/card)는 실 콘텐츠와 **같은 height·radius·간격** → layout shift 최소화.
3. **테이블**: 헤더는 유지하고 본문만 row skeleton ×N 으로 교체.
4. **정렬·페이지 전환**(데이터 컨텍스트 유지): row 통째 교체 ❌. 즉시응답이면 인디케이터 불필요, 서버 지연이면 헤더 위 2px indeterminate bar.
5. **캐시 백그라운드 재검증**(SWR식): 인디케이터 없음.

## 표면별 레시피

```tsx
// 테이블 row (헤더 유지)
<TableRow>
  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>  {/* badge */}
</TableRow>

// 대시보드 summary 카드
<div className="rounded-md border border-border bg-card p-4">
  <Skeleton className="h-3.5 w-24" />     {/* label */}
  <Skeleton className="mt-3 h-7 w-20" />  {/* value */}
</div>

// 차트 영역
<Skeleton className="h-48 w-full rounded-md" />

// 아바타
<Skeleton className="size-10 rounded-full" />
```

## 안티패턴

- ❌ raw `<div className="animate-pulse bg-muted h-4 w-32" />` — primitive 우회.
- ❌ 콘텐츠와 다른 크기의 skeleton → 로드 완료 시 점프(layout shift).
- ❌ 정렬/페이지네이션 같은 컨텍스트 유지 재요청에서 전체 row skeleton.
- ❌ 캐시 hit 후 백그라운드 재검증에 skeleton 노출.

## Cross-refs

- 룰: `rules/states.md` §3 (Loading)
- 패턴: `patterns/table-list-page.md` (테이블 페이지 골격)
- 카탈로그: `/design-system/primitives/skeleton`
