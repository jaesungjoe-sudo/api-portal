import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/* ── /design-system/primitives/search ─────────────────────────
 * The list-page search field: a leading magnifier icon over an Input.
 * Figma: the library `Search` component. Code: Input + absolute-icon composition.
 *
 * Spec: design-system/components/search.md
 * Pattern: design-system/patterns/table-list-page.md §5
 */

export default function SearchDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Search</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          The list-page toolbar search field — a leading <code className="rounded bg-muted px-1 py-0.5 text-sm">Search</code> icon over an{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-sm">Input</code>. In Figma this is the library <strong>Search</strong> component;
          in code it&apos;s an Input + absolute-icon composition.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/search.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Default */}
      <Section
        title="Default"
        description="Width w-60 (240), height h-8 (32). Placeholder names the entity in singular."
      >
        <DemoBox>
          <div className="relative w-60">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-8 pl-8 text-sm" placeholder="Search API Key" />
          </div>
        </DemoBox>
        <Snippet>{`<div className="relative w-60">
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-8 h-8 text-sm" placeholder="Search API Key" />
</div>`}</Snippet>
      </Section>

      {/* Entity placeholders */}
      <Section
        title="Placeholder per entity"
        description="Always Search {Entity} in singular — never a bare “Search”."
      >
        <DemoBox>
          <div className="flex flex-col gap-3">
            {["Search API Key", "Search User", "Search Team"].map((ph) => (
              <div key={ph} className="relative w-60">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="h-8 pl-8 text-sm" placeholder={ph} />
              </div>
            ))}
          </div>
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="flex flex-col gap-3">
          <AnatomyRow label="div.relative.w-60" note="Wrapper — positioning context + field width." />
          <AnatomyRow label="Search (lucide)" note="absolute left-2.5 top-1/2 -translate-y-1/2, h-4 w-4, text-muted-foreground." />
          <AnatomyRow label="Input.pl-8.h-8.text-sm" note="pl-8 reserves room for the icon; h-8 (32) compact toolbar height." />
        </div>
      </Section>

      {/* Rules */}
      <Section title="Rules">
        <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
          <li>Placeholder = <code className="rounded bg-muted px-1 py-0.5 text-xs">Search {"{Entity}"}</code> in singular (Search API Key / Search User / Search Team). Never a bare “Search”.</li>
          <li>Icon lives in the Input&apos;s left padding (<code className="rounded bg-muted px-1 py-0.5 text-xs">pl-8</code>) — never overlapping typed text.</li>
          <li>Use the shared <code className="rounded bg-muted px-1 py-0.5 text-xs">Input</code> primitive — don&apos;t rebuild the field.</li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Cross-refs">
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/search.md">
            components/search.md — spec
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md">
            patterns/table-list-page.md §5 — Toolbar (Search + CTA)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/input.md">
            components/input.md — underlying Input primitive
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

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
    <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/30 p-4 font-mono text-xs text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function AnatomyRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-border pl-4">
      <code className="font-mono text-sm text-foreground">{label}</code>
      <span className="text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

function CrossRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
        {children}
      </a>
    </li>
  );
}
