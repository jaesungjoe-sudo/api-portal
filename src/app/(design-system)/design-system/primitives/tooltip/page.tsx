"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ── /design-system/primitives/tooltip ────────────────────────
 * Live demos for the Tooltip primitive.
 *
 * Spec: design-system/components/tooltip.md
 */

export default function TooltipDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Tooltip</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Brief supportive copy on hover/focus. For help icons, disabled action reasons, and similar
          one-line context. Menu lists go through DropdownMenu instead.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/tooltip.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Info icon */}
      <Section
        title="Help / Info icon"
        description="Most common usage — Info icon next to a label or column header. Hover the icon."
      >
        <DemoBox>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">Last updated</span>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
              </TooltipTrigger>
              <TooltipContent>Last time this record was modified</TooltipContent>
            </Tooltip>
          </div>
        </DemoBox>
        <Snippet>{`<Tooltip>
  <TooltipTrigger className="flex items-center">
    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
  </TooltipTrigger>
  <TooltipContent>Last time this record was modified</TooltipContent>
</Tooltip>`}</Snippet>
      </Section>

      {/* Disabled action reason */}
      <Section
        title="Disabled action reason"
        description="Wrap a disabled Button in a span to receive hover events. Recommended for protected-entity actions."
      >
        <DemoBox>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger
                render={
                  <span tabIndex={0} className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                    <Button disabled>Delete</Button>
                  </span>
                }
              />
              <TooltipContent>Protected entities cannot be deleted</TooltipContent>
            </Tooltip>
            <p className="text-sm text-muted-foreground">Hover or focus the disabled button</p>
          </div>
        </DemoBox>
        <Snippet>{`<Tooltip>
  <TooltipTrigger
    render={
      <span tabIndex={0}>
        <Button disabled>Delete</Button>
      </span>
    }
  />
  <TooltipContent>Protected entities cannot be deleted</TooltipContent>
</Tooltip>`}</Snippet>
      </Section>

      {/* Position variants */}
      <Section
        title="Position variants"
        description='TooltipContent accepts side="top" | "right" | "bottom" | "left".'
      >
        <DemoBox>
          <div className="flex flex-wrap items-center gap-4">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {side}
                    </button>
                  }
                />
                <TooltipContent side={side}>side={side}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="TooltipProvider" note="Mounted at the root layout (src/app/layout.tsx). delay={0} — immediate display. Do not re-wrap per page." />
            <AnatomyRow label="Tooltip" note="State root — controlled or uncontrolled." />
            <AnatomyRow label="TooltipTrigger" note='Receives hover/focus. Default trigger element, or pass `asChild`/`render` to use existing element.' />
            <AnatomyRow label="TooltipContent" note="Floating box. Default side='top', sideOffset=4. bg-popover + shadow-md + rounded-md applied by primitive." />
          </div>
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in tooltip.md.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Tooltip body 2 lines+ / 50 chars+ — keep it short. Long content belongs inline.</li>
          <li>Click actions inside tooltips — use Popover or Dialog.</li>
          <li>Re-mounting <code className="rounded-sm bg-muted px-1 font-mono text-xs">TooltipProvider</code> per page — already at root.</li>
          <li>Disabled Button as direct trigger without <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<span tabIndex={0}>`}</code> — disabled elements don&apos;t fire hover events.</li>
          <li>Info icon without <code className="rounded-sm bg-muted px-1 font-mono text-xs">cursor-default</code> — pointer cursor implies clickable.</li>
          <li>Menu lists in tooltips — use DropdownMenu.</li>
        </ul>
      </Section>

      {/* Related */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/popover.md">
            components/popover.md — non-tooltip floating containers (contrast)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md §6 — Disabled action reason tooltip recommendation
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
