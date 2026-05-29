# EmptyState

> 라이브러리에 전용 컴포넌트가 없어 자체 정의한 베이스라인. 본 문서가 곧 컴포넌트 spec. 수명 조건은 `rules/states.md` §1 참조 — 라이브러리에 추가되면 라이브러리 spec 으로 이관.

## 사용 컨텍스트

- 표면 본문이 비는 모든 케이스의 표준 표현. 단순 `<p>No data</p>` 텍스트 fallback 금지.
- 컨테이너의 vertical padding 위임 룰은 `rules/states.md` §4.2 참조 (테이블 `py-16`, 차트 `py-10`, 폼 `py-8`, 위젯 `py-6`).
- 사용 표면: 빈 테이블, 빈 카드 그리드, 빈 차트, 카드 내부 위젯, (필요 시) 빈 폼.

---

## 1. 구조

세로 중앙 정렬. 위→아래 순서:

```
┌──────────────────────────┐
│      (아이콘)            │  ← variant 별 (no-data: 필수 / no-results: 선택)
│       제목               │  ← 필수, text-base font-medium
│   설명 (선택, max-w-sm)  │  ← 선택, text-sm text-muted-foreground
│        [CTA]             │  ← 선택, variant 별 정책
└──────────────────────────┘
```

- **외부 padding 을 가지지 않는다** — 컨테이너 책임. (안티패턴 §6 참조)
- 가로 정렬: `items-center`, 텍스트 정렬: `text-center`.

---

## 2. Variant

### 2.1 `no-data` — 데이터 자체가 아직 없음

- **아이콘**: 필수.
- **제목**: 능동적 카피 ("No API keys yet", "No teams yet" 등).
- **설명**: 다음 행동을 안내 (선택이지만 권장).
- **CTA**: `primary` Button (생성/초대 등 능동 액션).

> **아이콘 선택 — 권장 목록을 박지 않는다.** 각 페이지의 EmptyState 아이콘은 **해당 화면의 Figma 디자인 인스펙트 결과**를 그대로 사용한다. 예: API Keys empty 상태라면 Figma 에서 확인된 아이콘(예: `Key`), Users empty 상태라면 Figma 에서 확인된 아이콘(예: `UserPlus`) 등 — **실 디자인 확인 필수**. 추측한 lucide 아이콘을 그냥 끼우지 말 것. 워크플로우는 `icons.md` 의 4단계 절차(Figma 인스펙트 → lucide import → 없으면 질문 → 표 갱신) 그대로 따른다.

### 2.2 `no-results` — 검색/필터 결과 없음

- **아이콘**: 선택. 사용한다면 `Search` 권장.
- **제목**: `No results found` (또는 동등 카피).
- **설명**: 검색어/필터 조정을 안내 (예: "Try adjusting your filters.").
- **CTA**: 생략하거나 `ghost` Button ("Clear filters" 등). primary CTA 금지 (§6 안티패턴).

---

## 3. Props

```tsx
type EmptyStateProps = {
  variant: "no-data" | "no-results";
  /** 아이콘 노드. no-data 에선 필수, no-results 에선 선택. */
  icon?: React.ReactNode;
  /** 필수. */
  title: string;
  /** 선택. max-w-sm 로 줄바꿈. */
  description?: string;
  /** 선택. variant 정책에 맞게 사용. */
  action?: {
    label: string;
    onClick: () => void;
    /** no-data → "default" 권장. no-results → "ghost" 권장. 기본은 variant 따라 자동. */
    variant?: "default" | "ghost" | "outline" | "secondary";
  };
};
```

- `icon` 은 노드(JSX). 컴포넌트 내부에서 `text-muted-foreground size-10` 등 토큰을 자동 부여.
- `action.variant` 를 명시하지 않으면 EmptyState 의 `variant` 에 따라 합리적 기본을 사용 (no-data → `default`, no-results → `ghost`).

---

## 4. 토큰

| 영역 | 클래스 |
|---|---|
| 컨테이너 | `flex flex-col items-center text-center gap-3` |
| 아이콘 | `text-muted-foreground size-10` (40×40) |
| 제목 | `text-base font-medium text-foreground` |
| 설명 | `text-sm text-muted-foreground max-w-sm` |
| CTA | `mt-2` (gap-3 위에 추가 8px 확보) |

> **타이포 토큰은 잠정값**. 정확한 제목·설명 사이즈는 P2-5 "타이포 역할표(display / page-title / section / body / caption)" 도입 시 시맨틱 토큰(`text-section`, `text-body` 등)으로 교체 예정. 본 spec 의 `text-base` / `text-sm` 은 그때까지의 placeholder.

- 색 토큰은 시맨틱 토큰만 사용. raw RGB/hex/팔레트 클래스 금지 (CLAUDE.md).
- `gap-3` (12px) — 아이콘·제목·설명 사이 간격. CTA 만 추가 `mt-2` 로 한 단계 띄움.

---

## 5. 사용 예시

### 5.1 빈 테이블 (no-data) — API Keys

```tsx
import { EmptyState } from "@/components/api-portal/EmptyState";
import { Key } from "lucide-react"; // ← 실제 페이지에서는 Figma 인스펙트 결과의 아이콘 사용

<TableBody>
  <TableRow>
    <TableCell colSpan={COLS} className="py-16">
      <EmptyState
        variant="no-data"
        icon={<Key />}
        title="No API keys yet"
        description="Create your first key to start integrating with the API."
        action={{ label: "Create API key", onClick: openCreate }}
      />
    </TableCell>
  </TableRow>
</TableBody>
```

### 5.2 검색 결과 없음 (no-results) — Users

```tsx
import { Search } from "lucide-react"; // ← Figma 인스펙트 결과 기준

<div className="py-16">
  <EmptyState
    variant="no-results"
    icon={<Search />}
    title="No results found"
    description="Try adjusting your search or filters."
    action={{ label: "Clear filters", onClick: clearFilters, variant: "ghost" }}
  />
</div>
```

### 5.3 카드 내부 위젯 (작은 영역) — Analytics 차트 빈 데이터

```tsx
// 위젯 컨테이너가 py-6 으로 작게 잡음
<Card className="p-6">
  <CardHeader>
    <CardTitle>Top APIs</CardTitle>
  </CardHeader>
  <CardContent className="py-6">
    <EmptyState
      variant="no-data"
      icon={<BarChart3 />} // ← Figma 인스펙트 결과 기준
      title="No data for this period"
      description="Try a longer time range."
    />
  </CardContent>
</Card>
```

> 위 코드 블록의 아이콘(`Key` / `Search` / `BarChart3`)은 **예시일 뿐**이며, 실제 페이지 구현 시에는 각 화면의 Figma 노드를 인스펙트해서 그 결과 아이콘을 사용한다. `icons.md` 워크플로우 참조.

---

## 6. 안티패턴

| ❌ | 이유 |
|---|---|
| `<p>No data</p>` 같은 단순 텍스트로 EmptyState 대체 | 표면별 시각 위계·CTA 정책이 무너짐. 새 화면 일관성 깨짐. |
| EmptyState 자체에 padding 직접 지정 (`<EmptyState className="py-16" />`) | padding 은 컨테이너 책임. 표면별 padding 표 (`rules/states.md` §4.2) 우회. |
| `no-data` 에서 아이콘 생략 | no-data 는 "여기에 뭔가가 있을 자리"라는 시각 신호가 필요. 아이콘이 그 신호. |
| `no-results` 에 primary CTA | 검색 결과 없음은 사용자가 이미 능동 액션(검색) 중. primary CTA 는 시각 위계상 과함. 필요하면 `ghost` 로 "Clear filters" 정도. |
| `<AlertDescription>{err.message}</AlertDescription>` 같이 백엔드 raw 에러를 EmptyState/Alert 에 그대로 노출 | 보안·UX. 사용자 언어로 일반화 (`rules/states.md` §5.5). |

---

## 관련 문서

- `rules/states.md` — 상태 룰 본문. §1 수명 조건, §4 Empty 상세, §4.2 컨테이너 padding 위임.
- `icons.md` — 아이콘 선택 4단계 워크플로우 (Figma 인스펙트 → lucide → 없으면 질문 → 표 갱신).
- `components/button.md` — CTA 의 Button variant/size 규칙.
