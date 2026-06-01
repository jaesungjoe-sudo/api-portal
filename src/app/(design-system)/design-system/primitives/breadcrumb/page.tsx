import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ── /design-system/primitives/breadcrumb ─────────────────────
 * Live demos of the Breadcrumb primitive across the 3 patterns we use.
 *
 * Spec: design-system/components/breadcrumb.md
 */

export default function BreadcrumbDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Breadcrumb</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Page hierarchy navigation. Shown at the top of every dashboard / docs / api-reference page.
          Last item is always the current page (no link).
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/breadcrumb.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Standard 3-level */}
      <Section
        title="Standard 3-level breadcrumb"
        description="Every dashboard / docs page uses the same Home → Dashboard → Current pattern."
      >
        <DemoBox>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>API Keys</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DemoBox>
        <Snippet>{`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>API Keys</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}</Snippet>
      </Section>

      {/* Detail page (dynamic last) */}
      <Section
        title="Detail page (dynamic last segment)"
        description="Parent link points back to the tab the user came from (?tab=team)."
      >
        <DemoBox>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/users?tab=team">Users</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>API Portal</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DemoBox>
        <Snippet>{`<BreadcrumbItem>
  <BreadcrumbLink href="/users?tab=team">Users</BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator />
<BreadcrumbItem>
  <BreadcrumbPage>{decodeURIComponent(teamName)}</BreadcrumbPage>
</BreadcrumbItem>`}</Snippet>
      </Section>

      {/* DocsPageShell prop API */}
      <Section
        title="Via DocsPageShell"
        description="docs-page-shell + api-reference pages use a typed prop instead of raw JSX."
      >
        <DemoBox>
          <pre className="overflow-x-auto text-xs font-mono text-foreground">
            <code>{`<DocsPageShell
  breadcrumb={[
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/documentation" },
    { label: "Inbound Calls" },  // no href → renders as BreadcrumbPage
  ]}
  ...
/>`}</code>
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Internally maps to the same Breadcrumb primitive. See{" "}
            <code className="rounded-sm bg-muted px-1 font-mono">patterns/docs-page-shell.md</code>.
          </p>
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="Breadcrumb (nav)" note='Wrapper with aria-label="breadcrumb" applied automatically.' />
            <AnatomyRow label="BreadcrumbList (ol)" note="flex flex-wrap gap-1.5 sm:gap-2.5 text-sm text-muted-foreground." />
            <AnatomyRow label="BreadcrumbItem (li)" note="Each link / separator pair wrapped atomically." />
            <AnatomyRow label="BreadcrumbLink (a)" note="Hover transitions to text-foreground." />
            <AnatomyRow label="BreadcrumbPage (span)" note='Current page — aria-current="page" auto-applied. Uses text-foreground (not muted).' />
            <AnatomyRow label="BreadcrumbSeparator" note="ChevronRight (h-3.5 w-3.5), aria-hidden, decorative." />
          </div>
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in breadcrumb.md.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Rendering the last item as <code className="rounded-sm bg-muted px-1 font-mono text-xs">BreadcrumbLink</code> to itself — use <code className="rounded-sm bg-muted px-1 font-mono text-xs">BreadcrumbPage</code>.</li>
          <li>Custom <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<nav>`}</code> + <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<ol>`}</code> instead of the primitive — skips a11y wiring.</li>
          <li>Literal &quot;/&quot; or &quot;&gt;&quot; characters as separators — use <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<BreadcrumbSeparator />`}</code>.</li>
          <li>Detail page parent link pointing to wrong tab (e.g. /users instead of /users?tab=team).</li>
          <li>4+ levels deep — Phase1 keeps to 3 levels max.</li>
        </ul>
      </Section>

      {/* Related */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md">
            patterns/table-list-page.md — used in dashboard pages
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/docs-page-shell.md">
            patterns/docs-page-shell.md — used via the breadcrumb prop on DocsPageShell
          </CrossRef>
        </ul>
      </Section>
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

function Snippet({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-xs font-mono text-foreground">
      <code>{children}</code>
    </pre>
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
