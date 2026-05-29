"use client";

import { useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Loader2,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── /design-system/primitives/button ─────────────────────────
 * Button variant × size matrix, state demos, common patterns,
 * and rule cross-refs (button.md / form-dialog.md).
 *
 * Spec: design-system/components/button.md
 */

const VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

type Variant = (typeof VARIANTS)[number];
type Size = (typeof SIZES)[number];

export default function ButtonPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Button</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Primary action affordance. Variant and size must match the Figma{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">componentProperties.Type</code> /{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">Size</code> 1:1 — no arbitrary overrides.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/button.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View .md spec on GitHub →
          </a>
        </p>
      </header>

      {/* Variant × Size Matrix */}
      <Section title="Variant × Size matrix" description="All 6 variants across 4 sizes — 24 Button instances.">
        <DemoBox>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="w-24 px-3 py-2 text-left text-xs font-medium text-muted-foreground" />
                  {VARIANTS.map((v) => (
                    <th key={v} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZES.map((size) => (
                  <tr key={size}>
                    <td className="px-3 py-3 text-xs font-mono text-muted-foreground">{size}</td>
                    {VARIANTS.map((variant) => (
                      <td key={variant} className="px-3 py-3">
                        <Button variant={variant} size={size}>
                          Button
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DemoBox>
      </Section>

      {/* Icon Buttons */}
      <Section
        title="Icon buttons"
        description="Variant + icon-* size for square icon-only buttons. Default usage: variant=ghost, size=icon-sm."
      >
        <DemoBox>
          <div className="flex flex-wrap items-center gap-4">
            {ICON_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Button variant="ghost" size={size} aria-label="Settings">
                  <Settings />
                </Button>
                <code className="text-xs font-mono text-muted-foreground">{size}</code>
              </div>
            ))}
          </div>
        </DemoBox>
        <Snippet>{`<Button variant="ghost" size="icon-sm" aria-label="Settings">
  <Settings />
</Button>`}</Snippet>
      </Section>

      {/* States */}
      <Section
        title="States"
        description="Default / disabled / loading. Hover and focus-visible states are interactive — hover any Button above to preview."
      >
        <DemoBox>
          <div className="flex flex-wrap items-center gap-3">
            <StateColumn label="default">
              <Button>Save</Button>
            </StateColumn>
            <StateColumn label="disabled">
              <Button disabled>Save</Button>
            </StateColumn>
            <StateColumn label="loading">
              <Button disabled>
                <Loader2 className="mr-2 animate-spin" />
                Saving…
              </Button>
            </StateColumn>
          </div>
        </DemoBox>
        <Snippet>{`// Loading state pattern (no spinner primitive — inline Loader2)
<Button disabled>
  <Loader2 className="mr-2 animate-spin" />
  Saving…
</Button>`}</Snippet>
      </Section>

      {/* Interactive Click Counter */}
      <Section title="Interactive demo" description="Click the buttons to verify focus-visible and hover behavior.">
        <InteractiveDemo />
      </Section>

      {/* Common patterns */}
      <Section title="Common patterns" description="Where each variant lives in the app.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PatternCard
            title="Dialog footer (form-dialog)"
            description="Cancel = outline, confirm CTA = default. Cross-ref: patterns/form-dialog.md §7."
          >
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create</Button>
            </div>
          </PatternCard>

          <PatternCard
            title="Dialog footer (confirm-dialog)"
            description="Cancel = outline, destructive action = destructive."
          >
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </PatternCard>

          <PatternCard
            title="Page toolbar primary CTA"
            description="Default variant, default size (h-9). e.g. Invite User / Create Team / Create API Key."
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </PatternCard>

          <PatternCard
            title="Table row inline actions"
            description="Outline + size-sm for row-scoped actions (Approve / Reject / Resend)."
          >
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Reject
              </Button>
              <Button size="sm" variant="outline" className="text-success">
                Approve
              </Button>
            </div>
          </PatternCard>

          <PatternCard
            title="Marketing / landing secondary CTA"
            description='Outline variant — e.g. "Documentation" button next to the primary CTA on the home page.'
          >
            <div className="flex gap-2">
              <Button>Get started</Button>
              <Button variant="outline">
                Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </PatternCard>

          <PatternCard
            title="Alert internal action (Button rule exception)"
            description="size-sm + variant=outline allowed inside Alert. See rules/states.md §5.3."
          >
            <div className="rounded-md border border-destructive-border bg-destructive-subtle p-4 text-sm text-destructive">
              <p className="font-medium">Failed to load API keys</p>
              <p className="mt-1 text-destructive">Something went wrong. Please try again.</p>
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  Retry
                </Button>
              </div>
            </div>
          </PatternCard>
        </div>
      </Section>

      {/* Notes */}
      <Section title="Rules" description="Quick reference — full text in button.md.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            <strong>variant / size are 1:1 with Figma</strong> <code className="rounded-sm bg-muted px-1 font-mono text-xs">componentProperties.Type / Size</code>. Arbitrary overrides forbidden.
          </li>
          <li>
            <strong>Cancel = outline</strong> (form-dialog and confirm-dialog both). See patterns/form-dialog.md §7.
          </li>
          <li>
            <strong>secondary</strong> variant is reserved for toolbar/header auxiliary actions (currently 0 usages, kept for future Webhooks/Analytics export buttons).
          </li>
          <li>
            <strong>ghost / link</strong> have no shadow. All other variants get <code className="rounded-sm bg-muted px-1 font-mono text-xs">shadow-xs</code>.
          </li>
          <li>
            <strong>Loading</strong> uses inline <code className="rounded-sm bg-muted px-1 font-mono text-xs">Loader2</code> spinner — no separate Spinner primitive (library has none).
          </li>
          <li>
            <strong>Approve</strong> uses <code className="rounded-sm bg-muted px-1 font-mono text-xs">variant=&quot;outline&quot; className=&quot;text-success&quot;</code> — not primary (per Figma).
          </li>
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

function StateColumn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <code className="text-xs font-mono text-muted-foreground">{label}</code>
      {children}
    </div>
  );
}

function PatternCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {description && <p className="mt-1 mb-3 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Snippet({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-xs font-mono text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function InteractiveDemo() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <DemoBox>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          {copied ? "State toggled — resets after 1.5s." : "Click to see a transient state change."}
        </p>
      </div>
    </DemoBox>
  );
}

/* Type re-exports — unused type imports trigger eslint warn otherwise */
export type { Variant, Size };
