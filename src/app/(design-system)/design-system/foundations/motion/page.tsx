/* ── /design-system/foundations/motion ────────────────────────
 * 3 duration × 1 easing. Code truth — Figma library has a spec page only.
 * Spec: design-system/rules/motion.md
 */
import { DurationDemo, EasingDemo } from "./motion-demo";

export const metadata = { title: "Motion — Design System" };

export default function MotionFoundationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <article className="space-y-12">
        <header className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Foundations</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Motion</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            3 durations × 1 easing. For duration, Tailwind&apos;s <code className="rounded bg-muted px-1 py-0.5 text-sm">duration-100/200/300</code> are equivalent to our canonical values.
            <code className="rounded bg-muted px-1 py-0.5 text-sm">ease-emphasized</code> is enabled by registering it via <code className="rounded bg-muted px-1 py-0.5 text-sm">@theme inline</code>.
          </p>
        </header>

        {/* Duration table */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Duration</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Tailwind</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Where used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-2.5 font-mono text-xs">--duration-fast</td><td className="px-4 py-2.5">100ms</td><td className="px-4 py-2.5 font-mono text-xs">duration-100</td><td className="px-4 py-2.5 text-muted-foreground">Popover / Dropdown / Select / Dialog / Tooltip</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--duration-base</td><td className="px-4 py-2.5">200ms</td><td className="px-4 py-2.5 font-mono text-xs">duration-200</td><td className="px-4 py-2.5 text-muted-foreground">Sheet, Sidebar collapse/expand, Accordion</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--duration-slow</td><td className="px-4 py-2.5">300ms</td><td className="px-4 py-2.5 font-mono text-xs">duration-300</td><td className="px-4 py-2.5 text-muted-foreground">NavigationMenu, hero motion</td></tr>
              </tbody>
            </table>
          </div>
          <DurationDemo />
        </section>

        {/* Easing table + visualization + live demo */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Easing</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Token</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Tailwind</th>
                  <th className="px-4 py-2.5 font-medium text-muted-foreground">Where used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-4 py-2.5 font-mono text-xs">(default)</td><td className="px-4 py-2.5">linear</td><td className="px-4 py-2.5 font-mono text-xs">ease-linear</td><td className="px-4 py-2.5 text-muted-foreground">Simple size/position interpolation (default)</td></tr>
                <tr><td className="px-4 py-2.5 font-mono text-xs">--ease-emphasized</td><td className="px-4 py-2.5">cubic-bezier(0.22, 1, 0.36, 1)</td><td className="px-4 py-2.5 font-mono text-xs">ease-emphasized</td><td className="px-4 py-2.5 text-muted-foreground">NavigationMenu, spring-like feel</td></tr>
              </tbody>
            </table>
          </div>

          {/* Easing curve SVGs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">ease-linear</p>
              <svg viewBox="0 0 100 100" className="h-32 w-full text-foreground/70">
                <path d="M 0 100 L 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">ease-emphasized</p>
              <svg viewBox="0 0 100 100" className="h-32 w-full text-foreground/70">
                <path d="M 0 100 C 22 100, 36 64, 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>

          <EasingDemo />
        </section>

        {/* prefers-reduced-motion box */}
        <section className="rounded-xl border border-warning-border bg-warning-subtle/50 p-4">
          <p className="text-sm font-medium text-foreground">prefers-reduced-motion policy</p>
          <p className="mt-2 text-sm text-muted-foreground">
            When a user enables Reduce motion in their OS, all transitions must be shortened to <code className="rounded bg-muted px-1 py-0.5 text-xs">0ms</code>.
            No global handler is applied yet — a follow-up item to review. The demos in this catalog also currently ignore reduce motion.
          </p>
        </section>

        {/* Usage guide */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Usage</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li><strong className="text-foreground">popup</strong> (Tooltip / Popover / Dropdown / Select / Dialog) → <code className="rounded bg-muted px-1 py-0.5 text-xs">duration-100</code></li>
            <li><strong className="text-foreground">drawer / sidebar / accordion</strong> → <code className="rounded bg-muted px-1 py-0.5 text-xs">duration-200</code></li>
            <li><strong className="text-foreground">nav / hero</strong> large transitions → <code className="rounded bg-muted px-1 py-0.5 text-xs">duration-300 ease-emphasized</code></li>
          </ul>
        </section>

        {/* Anti-patterns */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Anti-patterns</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li>Literal ms — arbitrary values like <code className="rounded bg-muted px-1 py-0.5 text-xs">duration-[180ms]</code>.</li>
            <li>Using 5 or more durations — expanding the 3-step vocabulary.</li>
            <li>Mismatched pairing — <code className="rounded bg-muted px-1 py-0.5 text-xs">duration-100</code> + <code className="rounded bg-muted px-1 py-0.5 text-xs">ease-emphasized</code> (emphasized pairs with slow).</li>
            <li>Always-on animation that ignores <code className="rounded bg-muted px-1 py-0.5 text-xs">prefers-reduced-motion</code>.</li>
            <li>Mixing 200ms and 150ms.</li>
          </ul>
        </section>

        {/* Cross-refs */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Cross-refs</h2>
          <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            <li>Spec: <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/superpowers/specs/2026-06-02-p3-8-token-gaps-design.md</code></li>
            <li>Rule: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/motion.md</code></li>
            <li>Sync policy: <code className="rounded bg-muted px-1 py-0.5 text-xs">design-system/rules/figma-token-sync.md</code></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
