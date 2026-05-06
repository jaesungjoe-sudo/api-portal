# 레이아웃 규칙

> 반복적으로 발생한 버그에서 도출한 규칙. 새 레이아웃 작성 전 반드시 확인.

---

## 1. `h-screen` vs `min-h-screen` — flex 레이아웃에서 높이 전파

### 규칙
자식이 `h-full`을 쓰는 flex 레이아웃은 루트 컨테이너에 **`h-screen`** 을 써야 한다. `min-h-screen`은 안 된다.

### 이유
`min-h-screen`은 최소 높이만 보장하고 확정 높이를 주지 않는다. 자식의 `h-full`은 부모의 확정 높이를 참조하므로, `min-h-*` 부모에서는 0 또는 콘텐츠 크기로 무너진다.

```tsx
// ❌ 사이드바 h-full이 무너짐
<div className="flex min-h-screen flex-col">
  <TopNav />                        {/* 69px */}
  <SidebarProvider className="flex-1">
    <Sidebar collapsible="none" />  {/* h-full → 0으로 무너짐 */}
    <main>...</main>
  </SidebarProvider>
</div>

// ✅ 사이드바 h-full이 정상 동작
<div className="flex h-screen flex-col">
  <TopNav />                        {/* 69px */}
  <SidebarProvider className="min-h-0 flex-1">
    <Sidebar collapsible="none" />  {/* h-full → 100vh - 69px */}
    <main>...</main>
  </SidebarProvider>
</div>
```

### 적용 기준
- 고정 헤더 + 사이드바 + 스크롤 콘텐츠 구조 → 항상 `h-screen`
- 단순 페이지 (헤더 없음, 자연 스크롤) → `min-h-screen` 무방

---

## 2. flex 자식의 `overflow-auto` — `min-h-0` 필수

### 규칙
flex 자식에서 `overflow-auto` (또는 `overflow-scroll`)를 쓰려면 반드시 **`min-h-0`** 을 함께 써야 한다.

### 이유
flex 자식의 기본 `min-height`는 `auto` (콘텐츠 크기). 이 상태에서는 flex가 자식을 콘텐츠 크기 이하로 줄이지 않아 `overflow-auto`가 트리거되지 않는다. `min-h-0`으로 최솟값을 0으로 내려야 flex 알고리즘이 자식 높이를 제한하고 overflow가 발동된다.

```tsx
// ❌ 콘텐츠가 viewport 밖으로 overflow, 스크롤 안 됨
<main className="flex-1 overflow-auto">...</main>

// ✅ flex 컨텍스트에서 정상 스크롤
<main className="min-h-0 flex-1 overflow-auto">...</main>
```

flex-col에서 가로 스크롤도 동일: `min-w-0 overflow-x-auto`.

---

## 3. shadcn 컴포넌트 기본 사이즈 — Figma 수치와 반드시 대조

### 규칙
shadcn 컴포넌트는 내부 padding/height가 Figma 스펙과 다를 수 있다. 레이아웃·사이드바·네비게이션처럼 높이·간격이 중요한 컴포넌트는 **코드 작성 직후 브라우저에서 시각 확인**한다.

### 알려진 기본값

| 컴포넌트 | shadcn 기본 | Figma 스펙 | 재정의 |
|---|---|---|---|
| `SidebarMenuButton` | `p-2` → ~36px | 44px | `h-11 py-0` |
| `SidebarHeader` | `flex-col p-2` | 44px | `h-11 justify-center py-0` |
| `SidebarContent` | `py-2` 여백 포함 | 0px 여백 | `py-0` |

### flex 축 방향 주의
`SidebarHeader`는 `flex-col`이다.
- `items-center` → **수평** 중앙 정렬 (콘텐츠가 사이드바 너비 중앙으로 쏠림) ← 틀림
- `justify-center` → **수직** 중앙 정렬 ← 올바름

---

## 4. 전체 대시보드 레이아웃 패턴 (참고)

```tsx
// 고정 헤더 + 인라인 사이드바 + 스크롤 메인 구조
<div className="flex h-screen flex-col">
  <Header className="shrink-0" />          {/* 고정 높이 */}
  <SidebarProvider className="min-h-0 flex-1" style={{ minHeight: 0 }}>
    <Sidebar collapsible="none" />          {/* h-full 동작 */}
    <main className="min-h-0 flex-1 overflow-auto">
      {children}
    </main>
  </SidebarProvider>
</div>
```
