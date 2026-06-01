"use client";

import { useState } from "react";
import { Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ── /design-system/rules/a11y ────────────────────────────────
 * Live a11y reference + manual check guide. Many a11y behaviors
 * (screen reader, keyboard nav) require external tools to verify —
 * this page surfaces the visible side + checklists.
 *
 * Spec: design-system/rules/a11y.md
 */

export default function A11yPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">A11y / Interaction</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Keyboard navigation, focus management, ARIA attributes, and visual feedback baseline.
          Consolidates rules that previously lived scattered across CLAUDE.md, pattern docs, and
          component specs.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/a11y.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View rule spec on GitHub →
          </a>
        </p>
      </header>

      {/* Focus visible demo */}
      <Section
        title="focus-visible ring"
        description="Tab through the buttons below — only keyboard focus shows the ring. Mouse focus shows nothing."
      >
        <DemoBox>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/30"
            >
              Raw button
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Try: click vs. Tab → only Tab shows the ring (focus-visible).
          </p>
        </DemoBox>
        <Snippet>{`className="outline-none focus-visible:ring-2 focus-visible:ring-ring"`}</Snippet>
      </Section>

      {/* aria-label demo */}
      <Section
        title="aria-label on icon-only triggers"
        description="Hover the buttons — title attribute hints at the aria-label that screen readers announce."
      >
        <DemoBox>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Settings"
              title="aria-label: Settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Account menu"
              title="aria-label: Account menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-600 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              J
            </button>
            <p className="text-sm text-muted-foreground">
              Icon-only and avatar triggers need explicit labels.
            </p>
          </div>
        </DemoBox>
      </Section>

      {/* aria-invalid demo */}
      <Section
        title="aria-invalid on form fields"
        description="Submit with the field empty to see the invalid state — visual + ARIA in lockstep."
      >
        <DemoBox>
          <InvalidFieldDemo />
        </DemoBox>
      </Section>

      {/* Cursor demo */}
      <Section
        title="Cursor feedback"
        description='Global cursor pointer rule + cursor-default for hover-only icons.'
      >
        <DemoBox>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Clickable (auto pointer)</Button>
            <Button disabled>Disabled (auto not-allowed)</Button>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
                <span className="text-sm text-muted-foreground">Help icon (cursor-default)</span>
              </TooltipTrigger>
              <TooltipContent>cursor-default signals hover-only — no click action.</TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Pointer for clickable buttons, not-allowed for disabled, default for Info icons.
          </p>
        </DemoBox>
        <Snippet>{`/* globals.css */
button:not(:disabled):not([aria-disabled="true"]),
[role="button"]:not([aria-disabled="true"]) {
  cursor: pointer;
}`}</Snippet>
      </Section>

      {/* hover + focus-within pair */}
      <Section
        title="hover + focus-within pair"
        description="Both selectors give the same visual feedback — keyboard users see what mouse users see."
      >
        <DemoBox>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FocusWithinCard correct title="hover + focus-within" />
            <FocusWithinCard correct={false} title="hover only (anti-pattern)" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Tab into each card to feel the difference. Only the left one highlights on keyboard focus.
          </p>
        </DemoBox>
        <Snippet>{`className="transition-colors hover:bg-muted/30 focus-within:bg-muted/30"`}</Snippet>
      </Section>

      {/* autoFocus block demo */}
      <Section
        title="autoFocus block — form dialogs"
        description="2-layer defense pattern for Edit dialogs. See form-dialog.md §8 for the full rule."
      >
        <DemoBox>
          <pre className="overflow-x-auto text-xs font-mono text-foreground">
            <code>{`<DialogContent>
  {/* Layer 1: sr-only focus absorber */}
  <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />

  <DialogHeader>...</DialogHeader>

  {/* Layer 2: explicit autoFocus={false} on first input */}
  <Input autoFocus={false} ... />

  ...
</DialogContent>`}</code>
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            Try opening any form-dialog (e.g. /api-keys → ⋯ → Edit) — no field is pre-focused on open.
          </p>
        </DemoBox>
      </Section>

      {/* Component checklist */}
      <Section
        title="Component a11y checklist"
        description="Cross-references to per-component rules."
      >
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Component / Pattern</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Key a11y rules</th>
              </tr>
            </thead>
            <tbody>
              <ChecklistRow label="Button" rules="cursor-pointer (global). icon-only requires aria-label." />
              <ChecklistRow label="Dialog" rules="Esc close (primitive). focus return on close. form-dialog: sr-only span + autoFocus={false}." />
              <ChecklistRow label="DropdownMenu" rules='trigger aria-label required. ↑↓ keys (primitive). align="end" on right-anchored triggers.' />
              <ChecklistRow label="Tooltip" rules="TooltipProvider at root. disabled trigger needs span wrap. Info icon uses cursor-default." />
              <ChecklistRow label="Sonner (Toast)" rules="role status/alert auto. Permanent info goes to body/Dialog, not toast." />
              <ChecklistRow label="Breadcrumb" rules="aria-label='breadcrumb' (primitive). Last item is BreadcrumbPage (aria-current='page')." />
              <ChecklistRow label="Input / Select" rules="aria-invalid + Label text-destructive pair. htmlFor ↔ id matching." />
              <ChecklistRow label="Table" rules="Action ⋯ aria-label='Actions for {name}'. Action column header is blank (label is on the trigger)." />
              <ChecklistRow label="form-dialog pattern" rules="sr-only focus absorber + first input autoFocus={false}." />
              <ChecklistRow label="clickable-card-with-menu" rules="overlay Link aria-label, focus-visible:ring, hover+focus-within pair." />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Manual check */}
      <Section
        title="Manual check before shipping"
        description="Quick verification steps for new pages / components."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CheckGroup
            title="Keyboard only"
            items={[
              "Tab reaches every interactive element",
              "Tab order matches visual order",
              "focus-visible ring shows on all focusable items",
              "Esc closes dialogs / menus",
              "Enter / Space activates buttons",
            ]}
          />
          <CheckGroup
            title="Screen reader quick"
            items={[
              "Icon-only buttons read meaningful labels",
              "Form errors are announced",
              "Breadcrumb current page reads as 'current page'",
            ]}
          />
          <CheckGroup
            title="Visual consistency"
            items={[
              "hover ↔ focus-within visual feedback pair",
              "Disabled = not-allowed cursor (global rule)",
              "Tooltip trigger uses cursor-default",
            ]}
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in a11y.md §7.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Icon-only triggers without <code className="rounded-sm bg-muted px-1 font-mono text-xs">aria-label</code>.</li>
          <li><code className="rounded-sm bg-muted px-1 font-mono text-xs">outline-none</code> without paired <code className="rounded-sm bg-muted px-1 font-mono text-xs">focus-visible:ring</code>.</li>
          <li>Forcing <code className="rounded-sm bg-muted px-1 font-mono text-xs">cursor-pointer</code> on hover-only icons (Info / Help).</li>
          <li>Tooltip trigger directly on disabled element — wrap in <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<span tabIndex={0}>`}</code>.</li>
          <li>Visual error (text-destructive) without <code className="rounded-sm bg-muted px-1 font-mono text-xs">aria-invalid</code>.</li>
          <li>Custom keyboard handlers that primitives already provide (Esc, ↑↓).</li>
          <li><code className="rounded-sm bg-muted px-1 font-mono text-xs">hover:</code> alone — pair with <code className="rounded-sm bg-muted px-1 font-mono text-xs">focus-within:</code>.</li>
          <li>Form dialog without sr-only span — autoFocus={"{false}"} alone may not be enough on some browsers.</li>
        </ul>
      </Section>

      {/* Related */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/form-dialog.md">
            patterns/form-dialog.md §8 — autoFocus 2-layer block
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/clickable-card-with-menu.md">
            patterns/clickable-card-with-menu.md §3 — overlay aria-label + focus
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/tooltip.md">
            components/tooltip.md — disabled wrap pattern
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md §6 — disabled action tooltip recommendation
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

/* ── Interactive demos ───────────────────────────────────── */

function InvalidFieldDemo() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = touched && !value.trim();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="a11y-demo-email" className={invalid ? "text-destructive" : ""}>
          Email
        </Label>
        <Input
          id="a11y-demo-email"
          placeholder="demo@example.com"
          value={value}
          aria-invalid={invalid}
          onChange={(e) => {
            setValue(e.target.value);
            if (invalid && e.target.value.trim()) setTouched(false);
          }}
        />
        {invalid && (
          <p className="text-sm text-destructive">Email is required</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            if (!value.trim()) setTouched(true);
          }}
        >
          Submit
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setValue("");
            setTouched(false);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

function FocusWithinCard({ correct, title }: { correct: boolean; title: string }) {
  const cls = correct
    ? "transition-colors hover:bg-muted/30 focus-within:bg-muted/30"
    : "transition-colors hover:bg-muted/30";

  return (
    <div className={`rounded-md border border-border bg-card p-4 ${cls}`}>
      <p className="mb-2 text-sm font-medium text-foreground">{title}</p>
      <button
        type="button"
        className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/20"
      >
        Focusable button inside
      </button>
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

function ChecklistRow({ label, rules }: { label: string; rules: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{label}</td>
      <td className="px-4 py-3 text-sm text-foreground">{rules}</td>
    </tr>
  );
}

function CheckGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h3 className="mb-2 text-sm font-medium text-foreground">{title}</h3>
      <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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
