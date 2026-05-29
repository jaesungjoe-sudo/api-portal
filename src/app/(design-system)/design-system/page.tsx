import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ROADMAP } from "@/lib/design-system-nav";

/* ── /design-system landing ──────────────────────────────────
 * Four section cards + maturity roadmap table + external references.
 * The catalog itself dogfoods the design system.
 */

export default function DesignSystemHome() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">API Portal Design System</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Visual catalog for the UJET API Portal design system — tokens, primitives, patterns, and rules in one place.
        </p>
      </header>

      {/* Section cards */}
      <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SectionCard
          title="Foundations"
          description="Color tokens, typography, spacing, radius, shadow"
          href="/design-system/foundations/tokens"
          status="1 / 2 pages"
        />
        <SectionCard
          title="Primitives"
          description="shadcn/ui components with Figma-aligned variants + sizes"
          href="/design-system/primitives/button"
          status="1 / 24 pages"
        />
        <SectionCard
          title="Patterns"
          description="Composition patterns — form-dialog, confirm-dialog, table-list-page, etc."
          href="/design-system/patterns/form-dialog"
          status="1 / 5 patterns"
        />
        <SectionCard
          title="Rules"
          description="Cross-cutting rules — states, color, Figma reading, instance variant"
          href="/design-system/rules/states"
          status="1 / 6 rules"
        />
      </section>

      {/* Maturity Roadmap */}
      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Design System Maturity Roadmap</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          From the missing-layer audit (2026-05-29). Nine items — P1 (urgent) / P2 (maturity) / P3 (ops).
        </p>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground w-16">#</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Item</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-24">Priority</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-40">Status</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                  <td className="px-4 py-3 text-foreground">
                    {item.label}
                    {item.note && <span className="ml-2 text-xs text-muted-foreground">— {item.note}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityChip priority={item.priority} />
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* External References */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">External References</h2>
        <ul className="flex flex-col gap-2 text-sm">
          <ExternalLinkRow
            href="https://www.figma.com/design/SmO9fsWrxriuCofc7T3b1S"
            label="Figma Library"
          />
          <ExternalLinkRow
            href="https://www.figma.com/design/F2lkYCId2xMqcd9RuXL20B"
            label="Figma Design (Phase1)"
          />
          <ExternalLinkRow
            href="https://github.com/jaesungjoe-sudo/api-portal/tree/main/design-system"
            label="GitHub /design-system (all .md docs)"
          />
          <ExternalLinkRow
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/PROGRESS.md"
            label="PROGRESS.md (full progress log)"
          />
        </ul>
      </section>
    </div>
  );
}

function SectionCard({
  title,
  description,
  href,
  status,
}: {
  title: string;
  description: string;
  href: string;
  status: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-2 rounded-md border border-border bg-card p-5 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="mt-1 text-xs text-muted-foreground">{status}</p>
    </Link>
  );
}

function PriorityChip({ priority }: { priority: "P1" | "P2" | "P3" }) {
  const cls =
    priority === "P1"
      ? "bg-destructive-subtle text-destructive border-destructive-border"
      : priority === "P2"
        ? "bg-warning-subtle text-warning border-warning-border"
        : "bg-success-subtle text-success border-success-border";
  return (
    <span className={`inline-flex h-5 items-center rounded-lg border px-2 text-xs font-medium ${cls}`}>
      {priority}
    </span>
  );
}

function ExternalLinkRow({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-info hover:underline"
      >
        {label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </li>
  );
}
