"use client";

import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── /design-system/primitives/dropdown-menu ──────────────────
 * Live demos for the standard menu trigger patterns.
 *
 * Spec: design-system/components/dropdown-menu.md
 */

export default function DropdownMenuDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">DropdownMenu</h1>
        <p className="mt-2 text-base text-muted-foreground">
          The standard action menu for table row ⋯, TeamCard ⋯, AccountDropdown, etc. CLAUDE.md rule 6: menu lists
          use DropdownMenu, not Popover.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/dropdown-menu.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Standard ⋯ trigger */}
      <Section
        title="Standard ⋯ trigger (table row)"
        description="h-8 w-8 ghost button. aria-label required. Used by all table action columns."
      >
        <DemoBox>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Actions for Demo Item"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Edit clicked")}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Delete clicked")}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-sm text-muted-foreground">Click ⋯ to open the menu</p>
          </div>
        </DemoBox>
        <Snippet>{`<DropdownMenu>
  <DropdownMenuTrigger
    aria-label={\`Actions for \${name}\`}
    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
  >
    <MoreHorizontal className="h-4 w-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuItem className="px-2 py-1.5">Edit</DropdownMenuItem>
    <DropdownMenuItem className="px-2 py-1.5">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}</Snippet>
      </Section>

      {/* Conditional item (protected) */}
      <Section
        title="Conditional item — protected entity"
        description="Hide destructive items instead of disabling them. Pattern from TeamCard (Default team)."
      >
        <DemoBox>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Actions for Default team (protected)"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Edit Default")}>
                    Edit
                  </DropdownMenuItem>
                  {/* Delete hidden — protected */}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-muted-foreground">Protected (Edit only)</span>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Actions for normal item"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Edit normal")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Delete normal")}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-muted-foreground">Normal (Edit + Delete)</span>
            </div>
          </div>
        </DemoBox>
        <Snippet>{`<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
{!entity.protected && (
  <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
)}`}</Snippet>
      </Section>

      {/* Separator group */}
      <Section
        title="Separator — action groups"
        description="DropdownMenuSeparator splits action groups (e.g. invited-only actions)."
      >
        <DemoBox>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Actions for Invited user"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Edit")}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Deactivate")}>
                  Deactivate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => toast.success("Resend invite")}>
                  Resend invite mail
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-sm text-muted-foreground">Invited user menu — Resend is grouped separately</p>
          </div>
        </DemoBox>
      </Section>

      {/* Avatar / button trigger */}
      <Section
        title="Avatar / button trigger"
        description="For Account dropdowns or non-row triggers. h-9 w-9 or custom shape."
      >
        <DemoBox>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-600 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                J
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="px-2 py-1.5">Profile</DropdownMenuItem>
                <DropdownMenuItem className="px-2 py-1.5">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-sm text-muted-foreground">Account dropdown — avatar trigger (TopNav pattern)</p>
          </div>
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="DropdownMenuTrigger" note="h-8 w-8 ⋯ (table) or h-9 w-9 avatar. aria-label required. focus-visible:ring." />
            <AnatomyRow label="DropdownMenuContent" note='align="end" for right-anchored triggers. w-56 standard width. shadow-md + border + bg-popover applied by primitive.' />
            <AnatomyRow label="DropdownMenuItem" note="px-2 py-1.5 padding. Default text-popover-foreground. Click auto-closes menu." />
            <AnatomyRow label="DropdownMenuSeparator" note="1px border-border. Groups visually distinct action sets." />
          </div>
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in dropdown-menu.md.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Using <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<Popover>`}</code> for menu lists — CLAUDE.md rule 6. Menus go through DropdownMenu.</li>
          <li>Missing <code className="rounded-sm bg-muted px-1 font-mono text-xs">aria-label</code> on trigger — screen reader has no name.</li>
          <li>Arbitrary <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-destructive</code> on menu items — Figma alignment required. Most Delete/Revoke items use default color.</li>
          <li>Default <code className="rounded-sm bg-muted px-1 font-mono text-xs">align</code> on right-anchored triggers — menu spills off-screen. Use <code className="rounded-sm bg-muted px-1 font-mono text-xs">align=&quot;end&quot;</code>.</li>
          <li>Showing keyboard shortcuts (⌘K) when Figma doesn&apos;t — alignment check first.</li>
          <li>5+ items without separators — UX degrades. Group with DropdownMenuSeparator.</li>
        </ul>
      </Section>

      {/* Related */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md">
            patterns/table-list-page.md — table row ⋯ action menu
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/clickable-card-with-menu.md">
            patterns/clickable-card-with-menu.md — TeamCard ⋯ + protected pattern
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/popover.md">
            components/popover.md — non-menu container (contrast)
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
