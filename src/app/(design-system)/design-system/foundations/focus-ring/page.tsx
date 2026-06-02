/* ── /design-system/foundations/focus-ring ────────────────────
 * Focus ring width (3px) + color tokens. Tab through to compare.
 * Spec: design-system/rules/focus-ring.md (visual tokens) + a11y.md §3 (behavior)
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata = { title: "Focus Ring — Design System" };

export default function FocusRingFoundationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <article className="space-y-12">
        <header className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Foundations</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Focus ring</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Width 3px + color 2종 (default <code className="rounded bg-muted px-1 py-0.5 text-sm">ring-ring/50</code> / invalid <code className="rounded bg-muted px-1 py-0.5 text-sm">ring-destructive/20</code>). 모든 focusable primitive 가 동일 두께.
          </p>
        </header>

        {/* Tab 키 안내 */}
        <section className="rounded-xl border border-info-border bg-info-subtle/40 p-4">
          <p className="text-sm font-medium text-foreground">⌨ Tab 키로 순회</p>
          <p className="mt-2 text-sm text-muted-foreground">
            이 페이지의 컴포넌트를 Tab 키로 순회하면 ring 두께·색이 어떻게 동작하는지 직접 확인할 수 있습니다.
          </p>
        </section>

        {/* 토큰 표 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Tokens</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">사용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-width</td><td className="px-4 py-2.5">3px</td><td className="px-4 py-2.5 text-muted-foreground">모든 focus-visible (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-3</code>)</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-color-default</td><td className="px-4 py-2.5">var(--ring) / 50%</td><td className="px-4 py-2.5 text-muted-foreground">일반 focus (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-ring/50</code>)</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-color-invalid</td><td className="px-4 py-2.5">var(--destructive) / 20%</td><td className="px-4 py-2.5 text-muted-foreground">aria-invalid focus (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-destructive/20</code>)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 컴포넌트별 ring 비교 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">컴포넌트별 ring</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Input</p>
              <Input placeholder="Focus me" />
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Button</p>
              <Button>Focus me</Button>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Badge (tabbable when wrapped in &lt;a&gt;)</p>
              <a href="#" className="inline-block focus:outline-none">
                <Badge>Focus me</Badge>
              </a>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Select</p>
              <Select>
                <SelectTrigger><SelectValue placeholder="Focus me" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* aria-invalid 데모 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">aria-invalid 자동 색 변환</h2>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Input with aria-invalid (Tab → destructive ring)</p>
            <Input aria-invalid={true} placeholder="Invalid input" />
          </div>
          <p className="text-sm text-muted-foreground">
            같은 데모가 <code className="rounded bg-muted px-1 py-0.5 text-xs">/design-system/rules/a11y</code> 에도 — 본 페이지는 *시각 토큰* 위주, a11y 는 *행동* 위주.
          </p>
        </section>

        {/* ring-2 vs ring-3 비교 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">ring-2 vs ring-3 (refactor 전후)</h2>
          <p className="text-sm text-muted-foreground">
            P3-8 이전 일부 컴포넌트는 <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-2</code> 사용. 현재는 모두 <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-3</code> 통일.
          </p>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border border-border p-6 text-center">
              <button className="rounded-md bg-secondary px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                ring-2 (deprecated)
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Tab 후 ring 비교</p>
            </div>
            <div className="flex-1 rounded-lg border border-border p-6 text-center">
              <button className="rounded-md bg-secondary px-4 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                ring-3 (canonical)
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Tab 후 ring 비교</p>
            </div>
          </div>
        </section>

        {/* 표준 패턴 cva 스니펫 */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">표준 cva 패턴</h2>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">{`// Input / Select / Button / Badge / Checkbox / Toggle 동일
"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// aria-invalid 자동 색 변환
"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"`}</pre>
        </section>

        {/* Anti-patterns */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Anti-patterns</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">ring-2</code> 또는 <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-[Npx]</code> 리터럴 — width 통일 위반.</li>
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">outline-none</code> 만 두고 ring 없음 — 키보드 사용자 차단.</li>
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">focus:</code> 사용 — 마우스 클릭 시에도 ring 표시. <code className="rounded bg-muted px-1 py-0.5 text-xs">focus-visible:</code> 사용.</li>
            <li>aria-invalid 색을 ring 에만 적용하고 border 누락 — 시각 누설.</li>
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">ring-ring/50</code> 외 임의 alpha (<code className="rounded bg-muted px-1 py-0.5 text-xs">/40</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">/60</code> 등) — 합의 깨짐.</li>
          </ul>
        </section>

        {/* Cross-refs */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Cross-refs</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li>Spec: <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md</code></li>
            <li>Rule: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/focus-ring.md</code></li>
            <li>A11y (행동): <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/a11y.md</code> §3 포커스 관리</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
