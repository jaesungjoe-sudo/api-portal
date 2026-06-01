"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/* ── /design-system/primitives/sonner ─────────────────────────
 * Live demos for the Sonner toast wrapper.
 *
 * Spec: design-system/components/sonner.md
 */

export default function SonnerDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Sonner (Toast)</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Transient notifications for action results. Used after Create/Edit/Delete operations, copy
          actions, and similar one-shot events. Permanent/blocking errors use Alert instead.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/sonner.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Semantic types */}
      <Section
        title="Semantic types"
        description="5 built-in variants. Each maps to a lucide icon + semantic color token via the project's custom wrapper."
      >
        <DemoBox>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button onClick={() => toast.success("Team created")}>success</Button>
            <Button onClick={() => toast.info("Subscription updated")}>info</Button>
            <Button onClick={() => toast.warning("Invitation expires soon")}>warning</Button>
            <Button onClick={() => toast.error("Failed to copy key")}>error</Button>
            <Button onClick={() => toast.loading("Saving...", { duration: 2000 })}>loading</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Click a button to fire the corresponding toast.
          </p>
        </DemoBox>
        <Snippet>{`toast.success("Team created");
toast.info("Subscription updated");
toast.warning("Invitation expires soon");
toast.error("Failed to copy key");
toast.loading("Saving...", { duration: 2000 });`}</Snippet>
      </Section>

      {/* With description */}
      <Section
        title="With description"
        description="Optional second line — use for specific details (email, name, count)."
      >
        <DemoBox>
          <Button
            onClick={() =>
              toast.success("Invitation sent", {
                description: "An invite has been sent to demo@example.com.",
              })
            }
          >
            Send Invite (with description)
          </Button>
        </DemoBox>
        <Snippet>{`toast.success("Invitation sent", {
  description: \`An invite has been sent to \${email}.\`,
});`}</Snippet>
      </Section>

      {/* Promise pattern */}
      <Section
        title="Promise pattern"
        description="Auto-transitions loading → success/error based on promise resolution. Useful when async API arrives in Phase2+."
      >
        <DemoBox>
          <Button
            onClick={() =>
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 1200)),
                {
                  loading: "Saving...",
                  success: "Saved",
                  error: "Failed to save",
                }
              )
            }
          >
            Run async save
          </Button>
        </DemoBox>
        <Snippet>{`toast.promise(saveData(), {
  loading: "Saving...",
  success: "Saved",
  error: "Failed to save",
});`}</Snippet>
      </Section>

      {/* When to use what */}
      <Section title="toast vs Alert" description="Pick the right channel based on the message's lifetime + blocking nature.">
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Situation</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-40">Channel</th>
              </tr>
            </thead>
            <tbody>
              <ChannelRow situation='Action success ("saved", "deleted")' channel="toast.success" />
              <ChannelRow situation="Transient action failure (failed to copy, transient network)" channel="toast.error" />
              <ChannelRow situation="Permanent/blocking error (fetch fail, permission denied)" channel="Alert (states.md §5)" />
              <ChannelRow situation="Form validation error" channel="field inline (form-dialog.md §5)" />
              <ChannelRow situation="Phase1 placeholder ('design pending')" channel="toast.info" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Standard appearance */}
      <Section title="Standard appearance">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="Position" note="top-center — set by the project's custom wrapper." />
            <AnatomyRow label="Container" note="flex items-center gap-1.5 rounded-md border bg-popover p-4 shadow-md (same shadow as Dropdown/Tooltip)." />
            <AnatomyRow label="Title" note="text-sm font-medium text-foreground (typography role: label)." />
            <AnatomyRow label="Description" note="text-sm text-muted-foreground (typography role: body-sm)." />
            <AnatomyRow label="Icon (semantic)" note="success=CircleCheck/text-success, info=Info/text-info, warning=TriangleAlert/text-warning, error=OctagonX/text-destructive, loading=LoaderCircle/spin." />
          </div>
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in sonner.md.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Permanent errors via toast — auto-dismisses, user misses. Use Alert.</li>
          <li>Raw backend error text in <code className="rounded-sm bg-muted px-1 font-mono text-xs">toast.error(err.message)</code> — generalize to user language.</li>
          <li>Putting info that must persist (entity IDs, URLs) in toast — use body content or Dialog.</li>
          <li>Re-mounting <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<Toaster />`}</code> per page — already at root.</li>
          <li>Inline custom colors (<code className="rounded-sm bg-muted px-1 font-mono text-xs">bg-green-100</code>) — breaks light/dark parity. Use semantic types.</li>
          <li><code className="rounded-sm bg-muted px-1 font-mono text-xs">duration: Infinity</code> generalized — defeats the ephemeral purpose.</li>
        </ul>
      </Section>

      {/* Related */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md §5 — Error 3-channel decision (Alert / toast / form validation)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/alert.md">
            components/alert.md — Permanent/blocking error UI
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/color.md">
            rules/color.md — Semantic color tokens used by toast icons
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

function ChannelRow({ situation, channel }: { situation: string; channel: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-sm text-foreground">{situation}</td>
      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{channel}</td>
    </tr>
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
