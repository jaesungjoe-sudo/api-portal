import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ── /design-system/patterns/docs-page-shell ──────────────────
 * Static visual reference for DocsPageShell + DocsSection + TocSidebar.
 *
 * Spec: design-system/patterns/docs-page-shell.md
 */

export default function DocsPageShellPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Docs Page Shell</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Standard shell for Documentation and API Reference pages. Single component (
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">{`<DocsPageShell>`}</code>
          ) — props drive everything (breadcrumb, tag, title, description, TOC, prev/next).
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/docs-page-shell.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View pattern spec on GitHub →
          </a>
        </p>
      </header>

      {/* Live references */}
      <Section
        title="Live references"
        description="Real production pages built on this shell — open in a new tab to see the full layout with TocSidebar."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RefCard
            title="/documentation"
            description="Quick Start — full implementation, 5 sections, no tag."
            href="/documentation"
          />
          <RefCard
            title="/documentation/inbound-calls"
            description="5 sections including code block + table. Strong example."
            href="/documentation/inbound-calls"
          />
          <RefCard
            title="/api-reference/create-call"
            description="10 sections + POST tag. Densest usage in the codebase."
            href="/api-reference/create-call"
          />
          <RefCard
            title="/api-reference/get-call"
            description="Placeholder shell with GET tag — minimal example."
            href="/api-reference/get-call"
          />
        </div>
      </Section>

      {/* Mock skeleton */}
      <Section
        title="Skeleton"
        description="What DocsPageShell renders, with the gap-10 column outlined for clarity."
      >
        <DemoBox>
          <DocsShellMock />
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="Vertical stack inside <DocsPageShell>.">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="Outer wrapper" note="flex justify-center px-6 pb-20 pt-10 md:px-10 — centers the content column with vertical breathing room." />
            <AnatomyRow label="Inner row" note="flex w-full max-w-[1160px] gap-10 — 1160px max, 40px gap between content and TocSidebar." />
            <AnatomyRow label="Content column" note="min-w-0 flex-1 — min-w-0 is critical for child overflow." />
            <AnatomyRow label="Breadcrumb" note="mb-8 after." />
            <AnatomyRow label="tag (optional)" note="mb-3 after — only renders when prop is provided." />
            <AnatomyRow label="<h1>" note="text-4xl font-semibold text-foreground, mb-4. Bigger than table-list-page's text-3xl." />
            <AnatomyRow label="Description (optional)" note="text-base text-muted-foreground, mb-10." />
            <AnatomyRow label="MobileToc (xl 미만 only)" note="<details> collapsible — same TocItems as the right sidebar." />
            <AnatomyRow label="Sections wrapper" note="flex flex-col gap-10 — 40px between each <DocsSection>." />
            <AnatomyRow label="Bottom nav (optional)" note="mt-12 + pt-10 + border-t. Prev (left) / Next (right) outline-button-styled anchors." />
            <AnatomyRow label="TocSidebar (xl 이상 only)" note="sticky top-[89px], w-[265px], scroll-spy via useScrollSpy." />
          </div>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="Key decisions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DecisionCard
            title="One component, props-driven"
            note="No direct assembly of Breadcrumb / Title / TocSidebar. The shell guarantees max-width / gap / typography stay aligned."
          />
          <DecisionCard
            title="Title = text-4xl (≠ text-3xl)"
            note="Larger than table-list-page intentionally — long-form content needs a stronger title anchor."
          />
          <DecisionCard
            title="tag slot — 2026-05-29"
            note="Optional ReactNode between breadcrumb and title. Replaced the previous PostBadge() + -mt-6 hack in API Reference."
          />
          <DecisionCard
            title="TOC: dual render"
            note="Same toc[] prop renders both TocSidebar (xl+) and MobileToc (xl-). scrollSpy keeps active item in sync with viewport."
          />
          <DecisionCard
            title="DocsSection.id ↔ toc[].id"
            note="Must match exactly. Active state in TOC won't light up otherwise."
          />
          <DecisionCard
            title="Prev / Next — optional both"
            note="Pass only the side that has a neighbor. Styled as outline-anchor (border / hover:bg-accent)."
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in docs-page-shell.md §9.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Assembling Breadcrumb / Title / TocSidebar manually instead of using{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<DocsPageShell>`}</code>.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<h1>`}</code> as a child — title is a prop.
          </li>
          <li>
            Mismatched <code className="rounded-sm bg-muted px-1 font-mono text-xs">DocsSection.id</code> ↔{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">toc[].id</code> — breaks scrollSpy.
          </li>
          <li>
            Inline <code className="rounded-sm bg-muted px-1 font-mono text-xs">*Badge()</code> + negative margin hack for a tag — use the <code className="rounded-sm bg-muted px-1 font-mono text-xs">tag</code> prop.
          </li>
          <li>
            Overriding title to <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-3xl</code> — that&apos;s table-list-page&apos;s scale, not this pattern&apos;s.
          </li>
          <li>
            Defining a per-page <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<Section>`}</code> helper — use <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<DocsSection>`}</code>.
          </li>
          <li>
            Removing <code className="rounded-sm bg-muted px-1 font-mono text-xs">min-w-0</code> from the content column — long code blocks/tables will break the layout.
          </li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md">
            patterns/table-list-page.md — dashboard list pattern (contrast — text-3xl vs text-4xl, different layout)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/badge.md">
            components/badge.md — Badge / MethodBadge often used in the tag prop
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/breadcrumb.md">
            components/breadcrumb.md — Breadcrumb primitive (작성 예정)
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

/* ── Mock skeleton ────────────────────────────────────────── */

function DocsShellMock() {
  return (
    <div className="flex flex-col gap-6">
      {/* Mock outer wrapper with dashed border to visualize gap-10 column */}
      <div className="flex flex-col gap-10 rounded-md border border-dashed border-info-border bg-info-subtle/30 p-6">
        {/* Breadcrumb mock */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Home</span>
          <span>/</span>
          <span>Documentation</span>
          <span>/</span>
          <span className="text-foreground">Sample Page</span>
        </nav>

        {/* tag */}
        <div>
          <Badge variant="info">tag prop slot</Badge>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold text-foreground">Sample Title</h1>
          <p className="text-base text-muted-foreground">
            Description prop — one line of intent. Shows directly below the title.
          </p>
        </div>

        {/* Sections (mock) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-foreground">First Section</h2>
          <p className="text-base leading-6 text-muted-foreground">
            Section body — DocsSection wraps its children in a flex-col gap-3 div with{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-sm">text-muted-foreground</code>{" "}
            auto-applied.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Second Section</h2>
          <p className="text-base leading-6 text-muted-foreground">
            Sections sit inside a <code className="rounded-sm bg-muted px-1 font-mono text-sm">flex flex-col gap-10</code> wrapper — 40px vertical spacing between each.
          </p>
        </section>

        {/* Bottom nav */}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-10">
          <span className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Previous Page
          </span>
          <span className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
            Next Page
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        ↑ Dashed outline marks the <code className="rounded-sm bg-muted px-1 font-mono">gap-10</code>{" "}
        content column. In production, this column sits inside an outer{" "}
        <code className="rounded-sm bg-muted px-1 font-mono">max-w-[1160px]</code> row alongside the TocSidebar (xl+).
        Mock omits the right TOC for clarity — see real pages linked above.
      </p>
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

function RefCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group flex flex-col gap-1 rounded-md border border-border bg-card p-5 transition-colors hover:bg-muted/30"
    >
      <div className="flex items-center justify-between">
        <code className="text-sm font-mono font-medium text-foreground">{title}</code>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  );
}

function AnatomyRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-border pl-4">
      <code className="text-sm font-mono text-foreground">{label}</code>
      <span className="text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

function DecisionCard({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h3 className="mb-1 text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function CrossRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-info hover:underline"
      >
        {children}
      </a>
    </li>
  );
}
