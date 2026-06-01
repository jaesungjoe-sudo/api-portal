"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Monitor, Smartphone, Tablet } from "lucide-react";

/* ── /design-system/rules/responsive ──────────────────────────
 * Static reference for the breakpoint policy. Live current viewport
 * width pill at the top so designers/devs can see what BP they're at.
 *
 * Spec: design-system/rules/responsive.md
 */

const BREAKPOINTS = [
  { name: "(base)", min: 0, max: 639, intent: "Mobile-first base. 1-col, full-width dialog, hamburger nav.", icon: Smartphone },
  { name: "sm", min: 640, max: 767, intent: "Dialog escapes mobile full-width. First grid split (1→2). DialogFooter row.", icon: Smartphone },
  { name: "md", min: 768, max: 1023, intent: "Sidebar shows inline. Page padding widens (24→40). TopNav main menu visible.", icon: Tablet },
  { name: "lg", min: 1024, max: 1279, intent: "Desktop tone. TopNav search bar inline. Grid 3-4 col.", icon: Monitor },
  { name: "xl", min: 1280, max: Infinity, intent: "Wide desktop. TocSidebar moves from top (collapsible) to right (sticky).", icon: Monitor },
];

export default function ResponsivePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Responsive</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Breakpoint semantics — when to reach for sm / md / lg / xl. Each BP carries a specific
          transition meaning, not just a pixel value.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/responsive.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View rule spec on GitHub →
          </a>
        </p>
      </header>

      {/* Current viewport pill */}
      <Section
        title="Current viewport"
        description="Resize your browser to watch the active breakpoint change live."
      >
        <DemoBox>
          <CurrentViewport />
        </DemoBox>
      </Section>

      {/* BP table */}
      <Section title="Breakpoint semantics" description="Tailwind defaults. Each BP has a specific intent — not just a pixel value.">
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground w-24">BP</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-32">Px range</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Semantic intent</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((bp) => (
                <tr key={bp.name} className="border-t border-border">
                  <td className="px-4 py-3">
                    <code className="font-mono text-sm font-medium text-foreground">{bp.name}</code>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {bp.max === Infinity ? `${bp.min}+` : `${bp.min}–${bp.max}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{bp.intent}</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-muted/20">
                <td className="px-4 py-3">
                  <code className="font-mono text-sm font-medium text-muted-foreground">2xl</code>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">1536+</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">Not used.</strong> Reintroduce only when Figma defines a 2xl layout.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Mobile-first principle */}
      <Section title="Mobile-first principle" description="Base classes target mobile. BP suffixes evolve upward.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DemoBox>
            <p className="mb-2 text-xs font-medium text-success">✓ Mobile-first</p>
            <pre className="overflow-x-auto text-xs font-mono text-foreground">
              <code>{`<div className="grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-4">`}</code>
            </pre>
          </DemoBox>
          <DemoBox>
            <p className="mb-2 text-xs font-medium text-destructive">✗ Desktop-first</p>
            <pre className="overflow-x-auto text-xs font-mono text-foreground">
              <code>{`<div className="grid-cols-4
  md:hidden">`}</code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              Single element hidden at a BP without a paired companion — flicker/SSR risk.
            </p>
          </DemoBox>
        </div>
      </Section>

      {/* Page padding */}
      <Section
        title="Page wrapper padding"
        description="Every page uses px-6 md:px-10. No discussion needed when scaffolding."
      >
        <DemoBox>
          <pre className="overflow-x-auto text-xs font-mono text-foreground">
            <code>{`<div className="px-6 py-10 md:px-10">
  {/* page content */}
</div>`}</code>
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            24px on mobile, 40px from md+. Vertical padding (py-10 here) stays constant by default.
          </p>
        </DemoBox>
      </Section>

      {/* Max-width table */}
      <Section
        title="Container max-width"
        description="By page type. Pick from this table — magic numbers are anti-patterns."
      >
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Page / container type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">max-width</th>
              </tr>
            </thead>
            <tbody>
              <MaxWidthRow type="Dashboard (table-list-page)" mw="None (flex-1 fills)" />
              <MaxWidthRow type="docs-page-shell" mw={"max-w-[1160px]"} />
              <MaxWidthRow type="Catalog pages (this one)" mw={"max-w-4xl"} />
              <MaxWidthRow type="form-dialog" mw={"sm:max-w-[423px]"} />
              <MaxWidthRow type="confirm-dialog" mw={"sm:max-w-[512px]"} />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Known patterns */}
      <Section title="Known responsive patterns" description="The four major transitions in this app.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PatternCard
            title="Sidebar — md hamburger ↔ inline aside"
            badge="md"
            note="Mobile: <Sheet> drawer triggered by hamburger. md+: sticky <aside> (255px). Same isMobile check across AppSidebar, DocsSidebar, CatalogSidebar."
          />
          <PatternCard
            title="TopNav — 3-stage collapse"
            badge="sm / md / lg"
            note="sm: Ask AI label → icon. md: main nav → hamburger. lg: search bar → search icon."
          />
          <PatternCard
            title="TocSidebar — xl right ↔ top collapsible"
            badge="xl"
            note="xl-: <details> at the top of the body. xl+: sticky right sidebar (265px). Same toc[] prop drives both."
          />
          <PatternCard
            title="Grid steps — 1 → sm:2 → lg:4"
            badge="sm / lg"
            note="Base 1-col, sm:2 for the first split, md/lg for further density. xl:n only when the design calls for it explicitly."
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Magic-number widths — <code className="rounded-sm bg-muted px-1 font-mono text-xs">min-w-[1234px]</code>,{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">lg:max-w-[1200px]</code>. Use the max-width table.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">2xl:</code> usage — reserved policy. Wait for Figma.
          </li>
          <li>
            Page wrapper padding other than <code className="rounded-sm bg-muted px-1 font-mono text-xs">px-6 md:px-10</code>.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">md:hidden</code> on a lone element with no paired counterpart — that&apos;s a desktop-first signal.
          </li>
          <li>
            Skipping <code className="rounded-sm bg-muted px-1 font-mono text-xs">md:</code> when content is heavy — tablet (md) shouldn&apos;t inherit mobile density verbatim.
          </li>
          <li>
            Rendering two completely separate component trees per BP (Mobile vs Desktop variants) when one component could adapt. DOM duplication is the last resort.
          </li>
        </ul>
      </Section>

      {/* Live pages to resize */}
      <Section title="Try resizing these pages" description="Each demonstrates one of the four transitions above.">
        <ul className="flex flex-col gap-2 text-sm">
          <ResizeLink
            href="/users"
            label="/users"
            note="Sidebar md transition + TopNav 3-stage. Hamburger appears under md."
          />
          <ResizeLink
            href="/documentation/inbound-calls"
            label="/documentation/inbound-calls"
            note="TocSidebar xl transition. Cross xl to see the right sidebar appear/disappear."
          />
          <ResizeLink
            href="/users?tab=team"
            label="/users?tab=team"
            note="Card grid — 1 / sm:2 / xl:3."
          />
          <ResizeLink
            href="/api-keys"
            label="/api-keys"
            note="Toolbar + table wrapper overflow-x-auto. Try mobile width to see horizontal scroll."
          />
        </ul>
      </Section>
    </div>
  );
}

/* ── Live viewport pill ──────────────────────────────────── */

function CurrentViewport() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      setWidth(window.innerWidth);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (width === null) return <p className="text-sm text-muted-foreground">Loading...</p>;

  const active = BREAKPOINTS.find((bp) => width >= bp.min && width <= bp.max) ?? BREAKPOINTS[BREAKPOINTS.length - 1];
  const Icon = active.icon;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-md border border-info-border bg-info-subtle px-3 py-2 text-sm font-medium text-info">
        <Icon className="h-4 w-4" />
        <span>
          Active BP: <code className="font-mono">{active.name}</code>
        </span>
        <span className="text-info/70">·</span>
        <span className="font-mono text-xs">{width}px wide</span>
      </div>
      <p className="text-xs text-muted-foreground">{active.intent}</p>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────── */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-1 text-xl font-semibold text-foreground">{title}</h2>
      {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

function DemoBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-card p-6">{children}</div>;
}

function MaxWidthRow({ type, mw }: { type: string; mw: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-sm text-foreground">{type}</td>
      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{mw}</td>
    </tr>
  );
}

function PatternCard({
  title,
  badge,
  note,
}: {
  title: string;
  badge: string;
  note: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{badge}</code>
      </div>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function ResizeLink({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <li>
      <Link
        href={href}
        target="_blank"
        className="group flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-muted/30"
      >
        <div className="flex flex-col gap-0.5">
          <code className="text-sm font-mono font-medium text-foreground group-hover:underline">{label}</code>
          <span className="text-xs text-muted-foreground">{note}</span>
        </div>
      </Link>
    </li>
  );
}
