# Code Block

Phase1 단순 코드 표시 컴포넌트 (syntax highlighter 미사용 — styled span 토큰 또는 plain 단색).

## Import / 위치

```tsx
import { CodeBlock } from "@/components/api-portal/CodeBlock"
// syntax 토큰 span: TokKeyword / TokString / TokNumber / TokFn / TokIdent / TokPunct / TokComment
```

도메인 컴포넌트 — `src/components/api-portal/CodeBlock.tsx`.

## 구조 (anatomy)

```
<div rounded-md border border-border overflow-hidden>   ← 외곽 카드
  <div header bar>      (title || language 있을 때만)
    title  +  [language chip · copy 버튼]
  <div body>           ← 코드 영역
    <pre><code>…</code></pre>
```

| 영역 | 클래스 | 값 |
|---|---|---|
| 외곽 | `rounded-md border border-border overflow-hidden` | radius 8 |
| 헤더 바 | `flex items-center justify-between border-b border-border bg-muted px-4 py-3` | 가로 16 / 세로 12 |
| 제목 | `text-sm font-medium text-foreground` | — |
| language chip | `rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground` | — |
| copy 버튼 | `<Button variant="ghost" size="icon-xs">` (`Copy`→`Check` text-success) | — |
| **본문** | `overflow-x-auto bg-background p-4` | **`p-4` = 16px (상하 포함)** |
| `<pre>` | `m-0 font-mono text-sm leading-5` | — |

## 핵심 규칙

- **본문 세로 여백은 16px(`p-4`)** — 코드가 헤더 구분선·하단에 붙지 않게 상하 16px 확보. 이보다 줄이면 가독성 저하(정보 확인 어려움). 가로도 동일하게 16px.
- 헤더 바는 `bg-muted`, 본문은 `bg-background` — 두 영역을 `border-b`로 구분.
- language chip / copy 는 헤더 우측. 제목 없이 language만 있어도 헤더 바 렌더.
- 코드 줄은 `font-mono`(Geist Mono) + `text-sm` + `leading-5`. 색은 styled span 토큰(`Tok*`)으로, syntax highlighter 도입 시 본문만 교체.

## Figma 작성 주의 (code-as-spec)

Figma `Code block` 컴포넌트 인스턴스를 재사용·복제할 때, **본문(`Text`) 프레임의 세로 padding이 0으로 남아 코드가 붙는 사례**가 있다(라이브러리 인스턴스 기본값/override 잔재). 반드시 본문 프레임 `paddingTop = paddingBottom = 16`을 확인·설정할 것. 상세 gotcha: 메모리 `reference-figma-table-fixed-height-hug` 참조(표·코드블록 공통 — 컴포넌트 재사용 시 0-padding/고정높이 붕괴).
