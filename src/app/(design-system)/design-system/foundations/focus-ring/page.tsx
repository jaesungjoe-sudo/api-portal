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
            Width 3px + 2 colors (default <code className="rounded bg-muted px-1 py-0.5 text-sm">ring-ring/50</code> / invalid <code className="rounded bg-muted px-1 py-0.5 text-sm">ring-destructive/20</code>). Every focusable primitive uses the same width.
          </p>
        </header>

        {/* Tab key hint */}
        <section className="rounded-xl border border-info-border bg-info-subtle/40 p-4">
          <p className="text-sm font-medium text-foreground">⌨ Tab through to compare</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tab through the components on this page to see how the ring width and color behave firsthand.
          </p>
        </section>

        {/* Tokens table */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Tokens</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-width</td><td className="px-4 py-2.5">3px</td><td className="px-4 py-2.5 text-muted-foreground">All focus-visible states (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-3</code>)</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-color-default</td><td className="px-4 py-2.5">var(--ring) / 50%</td><td className="px-4 py-2.5 text-muted-foreground">Default focus (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-ring/50</code>)</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ring-color-invalid</td><td className="px-4 py-2.5">var(--destructive) / 20%</td><td className="px-4 py-2.5 text-muted-foreground">aria-invalid focus (<code className="rounded bg-muted px-1 py-0.5 text-xs">ring-destructive/20</code>)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Per-component ring comparison */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Ring by component</h2>
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

        {/* aria-invalid demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">aria-invalid automatic color switch</h2>
          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Input with aria-invalid (Tab → destructive ring)</p>
            <Input aria-invalid={true} placeholder="Invalid input" />
          </div>
          <p className="text-sm text-muted-foreground">
            The same demo also appears under <code className="rounded bg-muted px-1 py-0.5 text-xs">/design-system/rules/a11y</code> — this page focuses on *visual tokens*, while a11y focuses on *behavior*.
          </p>
        </section>

        {/* ring-2 vs ring-3 comparison */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">ring-2 vs ring-3 (before / after refactor)</h2>
          <p className="text-sm text-muted-foreground">
            Before P3-8, some components used <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-2</code>. They are now unified on <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-3</code>.
          </p>
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border border-border p-6 text-center">
              <button className="rounded-md bg-secondary px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                ring-2 (deprecated)
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Tab to compare the ring</p>
            </div>
            <div className="flex-1 rounded-lg border border-border p-6 text-center">
              <button className="rounded-md bg-secondary px-4 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                ring-3 (canonical)
              </button>
              <p className="mt-3 text-xs text-muted-foreground">Tab to compare the ring</p>
            </div>
          </div>
        </section>

        {/* Standard cva pattern snippet */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Standard cva pattern</h2>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">{`// Same for Input / Select / Button / Badge / Checkbox / Toggle
"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// aria-invalid automatic color switch
"aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"`}</pre>
        </section>

        {/* Anti-patterns */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Anti-patterns</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">ring-2</code> or <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-[Npx]</code> literals — breaks the unified width.</li>
            <li><code className="rounded bg-muted px-1 py-0.5 text-xs">outline-none</code> with no ring — blocks keyboard users.</li>
            <li>Using <code className="rounded bg-muted px-1 py-0.5 text-xs">focus:</code> — shows the ring on mouse click too. Use <code className="rounded bg-muted px-1 py-0.5 text-xs">focus-visible:</code>.</li>
            <li>Applying the aria-invalid color to the ring only and omitting the border — visual leak.</li>
            <li>Arbitrary alpha other than <code className="rounded bg-muted px-1 py-0.5 text-xs">ring-ring/50</code> (e.g. <code className="rounded bg-muted px-1 py-0.5 text-xs">/40</code>, <code className="rounded bg-muted px-1 py-0.5 text-xs">/60</code>) — breaks the convention.</li>
          </ul>
        </section>

        {/* Cross-refs */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Cross-refs</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li>Spec: <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md</code></li>
            <li>Rule: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/focus-ring.md</code></li>
            <li>A11y (behavior): <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/a11y.md</code> §3 Focus management</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
