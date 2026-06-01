"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, ShieldCheck, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── /design-system/patterns/clickable-card-with-menu ─────────
 * Live demo for the absolute overlay + pointer-events pattern.
 * Production usage: TeamCard in users/page.tsx.
 *
 * Spec: design-system/patterns/clickable-card-with-menu.md
 */

type DemoCard = {
  name: string;
  description: string;
  memberCount: number;
  protected?: boolean;
};

const DEMO_CARDS: DemoCard[] = [
  {
    name: "Default",
    description: "System team. Cannot be deleted — Delete menu item is hidden.",
    memberCount: 12,
    protected: true,
  },
  {
    name: "API Portal",
    description: "Engineering team owning the API portal product.",
    memberCount: 8,
  },
  {
    name: "Customer Success",
    description: "Customer-facing team managing onboarding and renewals.",
    memberCount: 5,
  },
];

export default function ClickableCardWithMenuPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Clickable Card with Menu</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Card-wide link target + interactive menu inside the card. Solved with an{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">absolute inset-0</code>{" "}
          overlay Link plus{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">pointer-events</code>{" "}
          toggling.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/clickable-card-with-menu.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View pattern spec on GitHub →
          </a>
        </p>
      </header>

      {/* Live demo */}
      <Section
        title="Live demo"
        description="Try clicking anywhere on a card (it toasts the destination), or click the ⋯ menu (it toasts the action). Notice how the two click targets stay independent."
      >
        <DemoBox>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {DEMO_CARDS.map((card) => (
              <DemoTeamCard key={card.name} card={card} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Default team has <code className="rounded-sm bg-muted px-1 font-mono">protected: true</code> — its menu
            hides the Delete item. Try the menu on each card to see the difference.
          </p>
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="The 3-layer structure inside each card.">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow
              label="Outer <div> (relative)"
              note="Positioning context for the absolute overlay. Holds card chrome (border, padding, radius, hover state)."
            />
            <AnatomyRow
              label="<Link className='absolute inset-0'>"
              note="Invisible click target covering the whole card. aria-label required for screen readers."
            />
            <AnatomyRow
              label="Content <div> (relative, pointer-events-none)"
              note="Visible content stacked above the overlay, but click passes through to the Link."
            />
            <AnatomyRow
              label="Interactive <div> (pointer-events-auto)"
              note="Re-activates clicks for nested DropdownMenu / Button / etc. — opt-in islands inside the no-click body."
            />
          </div>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="Key decisions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DecisionCard
            title="Absolute overlay over event.stopPropagation"
            note="Structural separation of click targets. No stop-propagation needed when adding new inner buttons."
          />
          <DecisionCard
            title="aria-label on the overlay Link"
            note='Card has no visible link text — screen readers need an explicit label. Pattern: aria-label={`View ${name}`}.'
          />
          <DecisionCard
            title="focus-visible:ring on the overlay"
            note="Keyboard users see the focus ring on the whole card. The card itself doesn't get focus — the Link does."
          />
          <DecisionCard
            title="focus-within sibling to hover"
            note="hover:bg-muted/30 + focus-within:bg-muted/30. Keyboard parity with mouse hover feedback."
          />
          <DecisionCard
            title="protected flag on the data model"
            note='Boolean prop, not name comparison. {!team.protected && <DeleteItem />} — magic strings forbidden.'
          />
          <DecisionCard
            title="Edit always visible, Delete conditional"
            note="Non-destructive actions don't need protection. Only destructive items respect the protected flag."
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in clickable-card-with-menu.md §8.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Wrapping the whole card in <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<Link>`}</code> — inner
            menu clicks trigger navigation.
          </li>
          <li>
            Overlay Link without <code className="rounded-sm bg-muted px-1 font-mono text-xs">aria-label</code> — invisible
            to screen readers.
          </li>
          <li>
            Content wrapper missing <code className="rounded-sm bg-muted px-1 font-mono text-xs">pointer-events-none</code>{" "}
            — overlay gets covered, card click fails.
          </li>
          <li>
            Menu wrapper missing <code className="rounded-sm bg-muted px-1 font-mono text-xs">pointer-events-auto</code> —
            trigger can&apos;t receive clicks.
          </li>
          <li>
            Missing <code className="rounded-sm bg-muted px-1 font-mono text-xs">focus-visible:ring</code> on overlay —
            keyboard users get no focus indicator.
          </li>
          <li>
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">hover:</code> without paired{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">focus-within:</code> — keyboard users miss the
            visual feedback.
          </li>
          <li>
            Showing Delete on protected entities with a toast warning — UI says it works, behavior says no. Hide the item.
          </li>
          <li>
            Detecting protected by name (e.g. <code className="rounded-sm bg-muted px-1 font-mono text-xs">team.name === &quot;Default&quot;</code>) — use a typed flag on the model.
          </li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="/users?tab=team">/users (Team tab) — production usage (TeamCard)</CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/confirm-dialog.md">
            patterns/confirm-dialog.md — Delete menu item opens the confirm dialog
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md §6 — Tooltip rationale for disabled actions (protected entities)
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

/* ── Demo card — mirrors TeamCard structure exactly ───────── */

function DemoTeamCard({ card }: { card: DemoCard }) {
  const href = `#${encodeURIComponent(card.name)}`; // demo link — hash only, never navigates

  return (
    <div className="relative rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 focus-within:bg-muted/30">
      {/* 1. Absolute overlay Link */}
      <Link
        href={href}
        aria-label={`View ${card.name} team`}
        onClick={(e) => {
          e.preventDefault();
          toast.success(`Card clicked — would navigate to ${card.name}`);
        }}
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {/* 2. Content — pointer-events-none, click passes to overlay */}
      <div className="relative flex items-start justify-between gap-2 pb-3 pointer-events-none">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
          {card.protected && (
            <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-label="Protected team" />
          )}
        </div>

        {/* 3. Interactive island — pointer-events-auto */}
        <div className="pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for ${card.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="px-2 py-1.5"
                onClick={() => toast.success(`Edit ${card.name}`)}
              >
                Edit
              </DropdownMenuItem>
              {!card.protected && (
                <DropdownMenuItem
                  className="px-2 py-1.5"
                  onClick={() => toast.success(`Delete ${card.name}`)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="relative pointer-events-none line-clamp-2 text-sm text-muted-foreground">
        {card.description}
      </p>
      <div className="relative pointer-events-none mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <UserIcon className="h-4 w-4" />
        <span>
          {card.memberCount} {card.memberCount === 1 ? "member" : "members"}
        </span>
      </div>
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
  const isExternal = href.startsWith("http");
  return (
    <li>
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-info hover:underline"
      >
        {children}
      </a>
    </li>
  );
}
