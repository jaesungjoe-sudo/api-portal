"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";
import { DeleteApiKeyDialog } from "@/components/api-portal/DeleteApiKeyDialog";
import { RevokeApiKeyDialog } from "@/components/api-portal/RevokeApiKeyDialog";

/* ── /design-system/patterns/confirm-dialog ───────────────────
 * Live demos for the five confirm-dialog flavors using actual
 * production wrappers (DeleteApiKeyDialog / RevokeApiKeyDialog)
 * plus direct ConfirmDialog usage for the inline cases
 * (Deactivate User / Reject Registration / Delete Team).
 *
 * Spec: design-system/patterns/confirm-dialog.md
 */

export default function ConfirmDialogPage() {
  const [deleteApiKeyOpen, setDeleteApiKeyOpen] = useState(false);
  const [revokeApiKeyOpen, setRevokeApiKeyOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteTeamOpen, setDeleteTeamOpen] = useState(false);

  // No-op handlers — catalog is demo-only, nothing actually deleted
  const noop = () => {};

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Confirm Dialog</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Modal pattern for destructive or irreversible single actions (Figma name:
          &quot;Alert dialog&quot;). All confirm dialogs go through the{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">{`<ConfirmDialog>`}</code>{" "}
          wrapper — no direct Dialog primitive assembly.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/confirm-dialog.md"
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
        description="Each card opens a production confirm dialog. Demo handlers are no-op — nothing is actually deleted."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DemoCard
            title="Delete API Key"
            label="DeleteApiKeyDialog"
            description="Production wrapper — 5-line file using <ConfirmDialog>."
          >
            <Button onClick={() => setDeleteApiKeyOpen(true)}>Open Delete dialog</Button>
          </DemoCard>

          <DemoCard
            title="Revoke API Key"
            label="RevokeApiKeyDialog"
            description="Production wrapper. Triggered on Active keys only."
          >
            <Button onClick={() => setRevokeApiKeyOpen(true)}>Open Revoke dialog</Button>
          </DemoCard>

          <DemoCard
            title="Deactivate User"
            label="<ConfirmDialog> (inline)"
            description="Inline usage in users/page.tsx. Email embedded in description."
          >
            <Button onClick={() => setDeactivateOpen(true)}>Open Deactivate dialog</Button>
          </DemoCard>

          <DemoCard
            title="Reject Registration"
            label="<ConfirmDialog> (inline)"
            description="Inline usage. Email embedded in description."
          >
            <Button onClick={() => setRejectOpen(true)}>Open Reject dialog</Button>
          </DemoCard>

          <DemoCard
            title="Delete Team"
            label="<ConfirmDialog> (inline)"
            description="Inline usage with bolded team name inside description (ReactNode prop)."
          >
            <Button onClick={() => setDeleteTeamOpen(true)}>Open Delete Team dialog</Button>
          </DemoCard>
        </div>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="The fixed vertical stack inside every <ConfirmDialog>.">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow
              label="DialogContent"
              note='sm:max-w-[512px], showCloseButton={false} — no X in the top right.'
            />
            <AnatomyRow
              label="DialogHeader"
              note="DialogTitle (required) + DialogDescription (required, supports ReactNode for inline entity emphasis)"
            />
            <AnatomyRow
              label="DialogFooter"
              note="outline Cancel (left) + destructive Confirm (right). confirmVariant=&quot;default&quot; for rare non-destructive overrides."
            />
          </div>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="Key decisions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DecisionCard
            title="Always go through <ConfirmDialog>"
            note="No direct Dialog primitive assembly. The wrapper guarantees width / showCloseButton / footer policy can't drift."
          />
          <DecisionCard
            title="Width = 512px"
            note="Wider than form-dialog (423px). Confirm copy tends to be longer (entity names embedded)."
          />
          <DecisionCard
            title="showCloseButton={false} — always"
            note="No X button. Forces explicit Cancel / Confirm. Esc / backdrop click still work as fallback dismiss paths."
          />
          <DecisionCard
            title="DialogDescription required"
            note="a11y + Figma alignment. Body copy is always inside DialogDescription, never bare <p>."
          />
          <DecisionCard
            title="destructive Confirm (default)"
            note="Visual signal of an irreversible action. confirmVariant=&quot;default&quot; for non-destructive confirms (rare)."
          />
          <DecisionCard
            title="Entity name highlight"
            note="description prop is ReactNode — embed <strong>{name}</strong> directly. Pattern used in Delete Team / Deactivate / Reject."
          />
        </div>
      </Section>

      {/* form vs confirm comparison */}
      <Section
        title="form-dialog vs confirm-dialog"
        description="The two dialog patterns at a glance."
      >
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground"> </th>
                <th className="px-4 py-3 font-medium text-muted-foreground">form-dialog</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">confirm-dialog</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Purpose" form="Input forms (Create / Edit / Invite / View)" confirm="Single-action confirmation (Delete / Revoke / Deactivate / Reject)" />
              <CompareRow label="Width" form="sm:max-w-[423px]" confirm="sm:max-w-[512px]" />
              <CompareRow label="showCloseButton" form="false (primitive default)" confirm="false (explicit)" />
              <CompareRow label="Body" form="Multiple field groups" confirm="Single DialogDescription" />
              <CompareRow label="DialogDescription" form="Conditional" confirm="Always required" />
              <CompareRow label="Footer CTA variant" form="default (primary)" confirm="destructive (default)" />
              <CompareRow label="autoFocus block" form="sr-only span + autoFocus={false}" confirm="N/A (no inputs)" />
              <CompareRow label="Shared component" form="None (per-dialog files)" confirm="<ConfirmDialog> required" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in confirm-dialog.md §8.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Assembling a confirm with raw Dialog primitives instead of{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<ConfirmDialog>`}</code>.
          </li>
          <li>
            Omitting <code className="rounded-sm bg-muted px-1 font-mono text-xs">showCloseButton={"{false}"}</code> when assembling manually — but assembling manually is itself the anti-pattern.
          </li>
          <li>
            Body in bare <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<p>`}</code> instead of DialogDescription (a11y).
          </li>
          <li>
            Confirm button in <code className="rounded-sm bg-muted px-1 font-mono text-xs">default</code> variant when the action is destructive — must be{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">destructive</code>.
          </li>
          <li>
            Cancel in <code className="rounded-sm bg-muted px-1 font-mono text-xs">secondary</code> — Cancel is always <code className="rounded-sm bg-muted px-1 font-mono text-xs">outline</code> (form-dialog and confirm-dialog both).
          </li>
          <li>
            Arbitrary width (anything other than 512px) — if a form is needed, switch to the form-dialog pattern.
          </li>
          <li>
            Adding input fields to a confirm-dialog — split into two steps or switch patterns.
          </li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/form-dialog.md">
            patterns/form-dialog.md — input-form pattern (contrast)
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/dialog.md">
            components/dialog.md — Dialog primitive spec
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/button.md">
            components/button.md — Button variant definitions
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md §5 — Error 3-tier (Alert + retry / toast / form validation)
          </CrossRef>
        </ul>
      </Section>

      {/* Mounted demo dialogs */}
      <DeleteApiKeyDialog open={deleteApiKeyOpen} onOpenChange={setDeleteApiKeyOpen} onDelete={noop} />
      <RevokeApiKeyDialog open={revokeApiKeyOpen} onOpenChange={setRevokeApiKeyOpen} onRevoke={noop} />
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate User"
        description={<>Are you sure you want to deactivate this user (demo@example.com)?</>}
        confirmLabel="Deactivate"
        onConfirm={noop}
      />
      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject registration request"
        description={<>Are you sure you want to reject this registration (demo@example.com) request?</>}
        confirmLabel="Reject"
        onConfirm={noop}
      />
      <ConfirmDialog
        open={deleteTeamOpen}
        onOpenChange={setDeleteTeamOpen}
        title="Delete Team"
        description={
          <>
            Are you sure you want to delete the{" "}
            <strong className="font-semibold text-foreground">Engineering</strong> team?
          </>
        }
        confirmLabel="Delete"
        onConfirm={noop}
      />
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

function CompareRow({ label, form, confirm }: { label: string; form: string; confirm: string }) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 text-xs font-medium text-muted-foreground">{label}</td>
      <td className="px-4 py-3 text-sm text-foreground">{form}</td>
      <td className="px-4 py-3 text-sm text-foreground">{confirm}</td>
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
