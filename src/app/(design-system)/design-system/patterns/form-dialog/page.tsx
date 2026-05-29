"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateApiKeyDialog } from "@/components/api-portal/CreateApiKeyDialog";
import { EditApiKeyDialog } from "@/components/api-portal/EditApiKeyDialog";
import { ViewApiKeyDialog } from "@/components/api-portal/ViewApiKeyDialog";
import { InviteUserDialog } from "@/components/api-portal/InviteUserDialog";
import type { ApiKey } from "@/lib/mock-api-keys";

/* ── /design-system/patterns/form-dialog ──────────────────────
 * Live demo of the four form-dialog flavors using actual production
 * components (CreateApiKeyDialog, EditApiKeyDialog, ViewApiKeyDialog,
 * InviteUserDialog). Cross-refs design-system/patterns/form-dialog.md.
 */

const MOCK_KEY: ApiKey = {
  id: "demo-1",
  name: "Demo Key",
  token: "ujet_demo_...",
  fullToken: "ujet_demo_1234567890abcdef0123456789",
  status: "Active",
  owner: "demo@example.com",
  expiresMs: Date.now() + 365 * 86_400_000,
  expiresLabel: "12/31/2026 - in 215d",
  lastUsedMs: Date.now() - 3_600_000,
  lastUsedLabel: "1h ago",
  createdMs: Date.now() - 86_400_000,
  createdLabel: "1d ago",
  expiry: "365 days",
};

export default function FormDialogPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Form Dialog</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Modal pattern for creating, editing, and inviting. Built on top of the Dialog primitive
          with consistent rules for width, validation, footer, and focus management.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/form-dialog.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View pattern spec on GitHub →
          </a>
        </p>
      </header>

      {/* Live Demos */}
      <Section
        title="Live demos"
        description="Each card opens an actual production dialog. The components here are the same ones used in /api-keys and /users — this catalog dogfoods the pattern."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DemoCard
            title="Create"
            label="CreateApiKeyDialog"
            description="Empty fields with placeholders. CTA: Create."
          >
            <Button onClick={() => setCreateOpen(true)}>Open Create dialog</Button>
          </DemoCard>

          <DemoCard
            title="Edit"
            label="EditApiKeyDialog"
            description="Pre-filled fields + sr-only focus absorber. CTA: Save."
          >
            <Button onClick={() => setEditOpen(true)}>Open Edit dialog</Button>
          </DemoCard>

          <DemoCard
            title="Invite"
            label="InviteUserDialog"
            description="Empty fields + DialogDescription (multi-user impact). CTA: Send Invite."
          >
            <Button onClick={() => setInviteOpen(true)}>Open Invite dialog</Button>
          </DemoCard>

          <DemoCard
            title="View (no Cancel)"
            label="ViewApiKeyDialog"
            description="Read-only post-creation view. Single CTA: Done."
          >
            <Button onClick={() => setViewOpen(true)}>Open View dialog</Button>
          </DemoCard>
        </div>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="The vertical stack inside every form-dialog DialogContent."
      >
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="DialogHeader" note="DialogTitle (required) + DialogDescription (conditional — §3)" />
            <AnatomyRow label="Field group" note="flex flex-col gap-2 — Label + Input/Select + optional error message" />
            <AnatomyRow label="…more field groups" note="DialogContent provides gap-4 between groups automatically" />
            <AnatomyRow label="DialogFooter" note="outline Cancel (left) + default CTA (right). No mt-* — Figma-aligned plain footer." />
          </div>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="Key decisions" description="Why this pattern looks the way it does.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DecisionCard title="Cancel = outline" note="Unified across form-dialog and confirm-dialog. secondary variant was repurposed for toolbar/header auxiliary actions." />
          <DecisionCard title="Footer is plain" note="DialogFooter primitive modified to drop border-t / bg-muted / -mx -mb / rounded-b-xl — aligned with Figma inspection of both Form and Confirm dialogs." />
          <DecisionCard title="Field gap = gap-2" note="Inside each field group: Label → Input → error message. Between groups: DialogContent's own gap-4 (Figma itemSpacing: 16)." />
          <DecisionCard title="Error message = text-destructive" note="Matches the Label's destructive color. Previously was text-muted-foreground — visually inconsistent." />
          <DecisionCard title="autoFocus blocked (2-layer)" note="sr-only focus-absorbing span at the top of DialogContent + autoFocus={false} on the first input. Prevents accidental field activation." />
          <DecisionCard title="Width = 423px" note="sm:max-w-[423px] for all form-dialogs. Confirm dialogs use 512px (different pattern)." />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Common mistakes — full list in form-dialog.md §11.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Raw <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<div className="mt-2 flex justify-end gap-2">`}</code> footer — use <code className="rounded-sm bg-muted px-1 font-mono text-xs">DialogFooter</code> instead.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">mt-2</code> margin above the footer — redundant with DialogContent&apos;s built-in <code className="rounded-sm bg-muted px-1 font-mono text-xs">gap-4</code>.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-muted-foreground</code> error message — must be <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-destructive</code>.
          </li>
          <li>
            Explicit <code className="rounded-sm bg-muted px-1 font-mono text-xs">autoFocus</code> on the first Input — Edit dialogs would jump into edit mode on open.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">variant=&quot;secondary&quot;</code> Cancel — Cancel is always <code className="rounded-sm bg-muted px-1 font-mono text-xs">outline</code>.
          </li>
          <li>
            Arbitrary width (anything other than 423px) — for confirm dialogs at 512px, use the confirm-dialog pattern instead.
          </li>
          <li>
            Description copy that adds no value (e.g. Title &quot;Profile&quot; with description &quot;Edit your profile&quot;).
          </li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Related" description="See also.">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/dialog.md">
            components/dialog.md — Dialog primitive (width / title typography / focus rules)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/button.md">
            components/button.md — Button variant definitions (incl. secondary repurpose)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/instance-variant.md">
            rules/instance-variant.md — Disabled state detection
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md — Form validation (§5) and Alert internal action exception (§5.3)
          </CrossRef>
        </ul>
      </Section>

      {/* Mounted dialogs — these render production components */}
      <CreateApiKeyDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditApiKeyDialog open={editOpen} onOpenChange={setEditOpen} initialKey={MOCK_KEY} />
      <ViewApiKeyDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        keyName={MOCK_KEY.name}
        keyValue={MOCK_KEY.fullToken}
        expiry={MOCK_KEY.expiry}
      />
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
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

function DemoCard({
  title,
  label,
  description,
  children,
}: {
  title: string;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <code className="text-xs font-mono text-muted-foreground">{label}</code>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      {children}
    </div>
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
