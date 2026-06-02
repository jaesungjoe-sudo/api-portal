/* ── /design-system/foundations/z-index ───────────────────────
 * 4-step layer stack. Code-only — not modeled in Figma.
 * Spec: design-system/rules/z-index.md
 */

export const metadata = {
  title: "z-index — Design System",
};

export default function ZIndexFoundationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <article className="space-y-12">
        {/* 헤더 */}
        <header className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Foundations</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">z-index</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            4 단계 layer stack. code-only — Figma 에서 모델링하지 않음.
            Tailwind 의 <code className="rounded bg-muted px-1 py-0.5 text-sm">z-50</code> ≡ <code className="rounded bg-muted px-1 py-0.5 text-sm">--z-overlay</code>.
          </p>
        </header>

        {/* 토큰 표 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Tokens</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Tailwind</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">사용처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">--z-base</td>
                  <td className="px-4 py-2.5">0</td>
                  <td className="px-4 py-2.5 font-mono text-xs">z-0</td>
                  <td className="px-4 py-2.5 text-muted-foreground">페이지 콘텐츠</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">--z-sticky</td>
                  <td className="px-4 py-2.5">10</td>
                  <td className="px-4 py-2.5 font-mono text-xs">z-10</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Sidebar wrapper, sticky 헤더</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">--z-overlay</td>
                  <td className="px-4 py-2.5">50</td>
                  <td className="px-4 py-2.5 font-mono text-xs">z-50</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Dialog / Sheet / Popover / Dropdown / Select</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-mono text-xs">--z-toast</td>
                  <td className="px-4 py-2.5">100</td>
                  <td className="px-4 py-2.5 font-mono text-xs">z-[100]</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Sonner toast</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 시각 데모 — 겹친 카드 stack */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">시각 데모</h2>
          <p className="text-sm text-muted-foreground">
            4 layer 가 겹쳤을 때의 시각 우선순위. 각 카드의 z-index 가 명시돼 있음.
          </p>
          <div className="relative h-64 rounded-xl border border-border bg-muted/30 p-6">
            <div className="absolute inset-6 z-0 flex items-center justify-center rounded-lg bg-card shadow-sm">
              <span className="text-sm text-muted-foreground">--z-base (page content)</span>
            </div>
            <div className="absolute top-12 left-12 z-10 flex h-32 w-64 items-center justify-center rounded-lg bg-secondary shadow-md">
              <span className="text-sm">--z-sticky (sidebar)</span>
            </div>
            <div className="absolute top-20 left-32 z-50 flex h-32 w-64 items-center justify-center rounded-lg bg-popover shadow-lg ring-1 ring-foreground/10">
              <span className="text-sm">--z-overlay (dialog)</span>
            </div>
            <div className="absolute top-28 left-56 z-[100] flex h-20 w-72 items-center justify-center rounded-lg bg-foreground text-background shadow-xl">
              <span className="text-sm">--z-toast (toast)</span>
            </div>
          </div>
        </section>

        {/* 안티패턴 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Anti-patterns</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">z-[9999]</code> 등 극단값 — 단계 어휘 무시.</li>
            <li>임의 <code className="rounded bg-muted px-1 py-0.5 text-xs">z-[N]</code> 리터럴 — 4 단계 합의 우회.</li>
            <li>같은 layer 내 우열 다툼 (예: 두 Popover 동시 열림) — DOM 순서로 자연스럽게 해결, z 손대지 말 것.</li>
            <li>Toast 를 overlay 아래로 — confirm/alert 시 toast 가 가려져 사용자가 못 봄.</li>
          </ul>
        </section>

        {/* Cross-refs */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Cross-refs</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li>Spec: <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md</code></li>
            <li>Rule doc: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/z-index.md</code></li>
            <li>Sync 정책: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/figma-token-sync.md</code></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
