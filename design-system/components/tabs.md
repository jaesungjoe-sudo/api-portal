# Tabs

Underline-less text-only tab switcher. Base UI `@base-ui/react/tabs` wrapping.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
```

## API

```tsx
<Tabs value={value} onValueChange={(v) => setValue(v as MyTab)}>
  <TabsList>
    <TabsTrigger value="a">A</TabsTrigger>
    <TabsTrigger value="b">B</TabsTrigger>
  </TabsList>
  {/* Optional — only when content needs role=tabpanel binding */}
  <TabsContent value="a">…</TabsContent>
  <TabsContent value="b">…</TabsContent>
</Tabs>
```

Base UI 의 `TabsTab.value`는 `any` 라서 string 외 값도 받지만, 본 프로젝트는 string 으로 통일.

## 시각 스펙 (variant: `text` — 기본)

- inactive: `text-muted-foreground`
- hover: `text-foreground`
- active: `text-foreground` (`data-[active]`)
- padding: `px-4 py-2`
- 사이즈: `text-sm font-medium`
- 갭: `TabsList` 자식 간 `gap-1`
- focus ring: `focus-visible:ring-3 focus-visible:ring-ring/50`

Figma 가 향후 underline 인디케이터를 명시하면 `TabsPrimitive.Indicator`를 활용한 `variant="underline"` 추가 검토.

## 자동 부수효과 (Base UI)

- 키보드 화살표 / Home / End 내비게이션
- 활성 탭에 `data-active` + `aria-selected`
- `disabled` prop 표준 처리
- TabsContent ↔ TabsTrigger `aria-controls` / `aria-labelledby` 자동 연결

## TabsContent 사용 여부

각 탭이 완전히 다른 콘텐츠/툴바를 가지면 TabsContent 로 감싸 a11y 향상. 툴바·검색을 공유하고 테이블만 분기되는 경우는 외부에서 `value` 기반 conditional render 유지해도 무방 (a11y 손실은 panel role 뿐).

## URL 동기화 패턴

```tsx
function handleTabChange(next: MyTab) {
  setActive(next);
  const url = next === DEFAULT ? pathname : `${pathname}?tab=${next}`;
  router.replace(url, { scroll: false });
}
```

`router.replace` 로 히스토리 오염 방지. 기본 탭일 때는 `?tab=` 제거.

## 사용처

- `src/app/(dashboard)/users/page.tsx` — User / Team / Pending Approvals (text variant + `?tab=` sync)
