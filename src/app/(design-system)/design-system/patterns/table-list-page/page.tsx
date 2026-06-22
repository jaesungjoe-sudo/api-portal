"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Inbox, MoreHorizontal, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/api-portal/EmptyState";
import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head";
import { TablePagination } from "@/components/api-portal/table-pagination";

/* ── /design-system/patterns/table-list-page ──────────────────
 * Live demo of the table-list-page skeleton: Breadcrumb → Header →
 * Toolbar (Search + CTA) → Table → Pagination, plus an empty-state toggle.
 *
 * Spec: design-system/patterns/table-list-page.md
 */

type DemoRow = { id: string; name: string; owner: string; createdLabel: string };
type SortKey = "name" | "owner";

const MOCK_ROWS: DemoRow[] = [
  { id: "1", name: "Production", owner: "alice@example.com", createdLabel: "1d ago" },
  { id: "2", name: "Staging", owner: "bob@example.com", createdLabel: "3d ago" },
  { id: "3", name: "Development", owner: "carol@example.com", createdLabel: "5d ago" },
  { id: "4", name: "QA", owner: "dave@example.com", createdLabel: "1w ago" },
  { id: "5", name: "Sandbox", owner: "erin@example.com", createdLabel: "2w ago" },
  { id: "6", name: "Mobile demo", owner: "frank@example.com", createdLabel: "3w ago" },
  { id: "7", name: "Edge", owner: "grace@example.com", createdLabel: "1m ago" },
];

const DEMO_PAGE_SIZE = 3;

export default function TableListPagePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Table List Page</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Standard skeleton for entity-list dashboard pages — Breadcrumb → Title →
          (Tabs?) → Toolbar → Table → Pagination. Used by{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">/api-keys</code>,{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">/users</code>,{" "}
          <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">/users/team/[name]</code>.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md"
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
        description="Working skeleton with mock data. Toggle the empty state to see the EmptyState integration."
      >
        <DemoBox>
          <LiveTable />
        </DemoBox>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy" description="The vertical stack inside every table-list-page.">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="space-y-4">
            <AnatomyRow label="<div className=&quot;flex flex-col gap-10&quot;>" note="Page wrapper — 40px gap between every block (Breadcrumb / Header / Tabs / Toolbar / Table / Pagination)." />
            <AnatomyRow label="Breadcrumb" note="Required. Last item is BreadcrumbPage (no link)." />
            <AnatomyRow label="<h1> Title (+ optional subtitle)" note="text-3xl font-semibold. Subtitle is text-sm text-muted-foreground." />
            <AnatomyRow label="<Tabs> (optional)" note="Only when a page hosts multiple lists. /users uses User / Team / Pending Approvals. URL ?tab= sync." />
            <AnatomyRow label="Toolbar — flex items-center justify-between" note="Search (w-60 h-8 + Search icon) on the left, primary CTA (default size) on the right." />
            <AnatomyRow label="<div className=&quot;rounded-md border&quot;>" note="Table wrapper — bordered card frame. The Table primitive's own container handles horizontal scroll." />
            <AnatomyRow label="<Table>" note="First column pl-5 (20px), last column w-14 (action ⋯). SortableHead on sortable columns." />
            <AnatomyRow label="<TablePagination>" note="Required even at 1 page. PAGE_SIZE = 10 standard." />
          </div>
        </div>
      </Section>

      {/* Key decisions */}
      <Section title="Key decisions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DecisionCard
            title="Page wrapper gap = gap-10"
            note="40px consistent gap between every header block. Set in CLAUDE.md (2026-05-14)."
          />
          <DecisionCard
            title="First column pl-5"
            note="20px left padding on the first TableHead AND TableCell. Aligns with page wrapper."
          />
          <DecisionCard
            title="Action column — two cases"
            note="⋯ menu (Edit/Delete): w-14, empty header — label lives on the trigger's aria-label. Button group (e.g. Reject + Approve on Pending Approvals): min-w-[180px], an 'Action' header label is allowed."
          />
          <DecisionCard
            title="Search w-60 h-8 + leading icon"
            note="Fixed 240×32 with absolute-positioned Search icon (h-4 w-4) at left-2.5. pl-8 on input."
          />
          <DecisionCard
            title='Placeholder = "Search {Entity}"'
            note='Singular entity name in the placeholder — "Search User", "Search API Key". Bare "Search" is forbidden.'
          />
          <DecisionCard
            title="Empty state → EmptyState"
            note="No bare <p>No data</p> in TableBody. Use <EmptyState> inside a single TableCell with colSpan={total} and py-16 wrapper."
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in table-list-page.md §10.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>Page wrapper gap other than <code className="rounded-sm bg-muted px-1 font-mono text-xs">gap-10</code>.</li>
          <li>First column missing <code className="rounded-sm bg-muted px-1 font-mono text-xs">pl-5</code>.</li>
          <li>Action column header showing the text &quot;Action&quot; (when using w-14 ⋯ menu style).</li>
          <li>Search placeholder = bare <code className="rounded-sm bg-muted px-1 font-mono text-xs">&quot;Search&quot;</code>.</li>
          <li>Primary CTA with <code className="rounded-sm bg-muted px-1 font-mono text-xs">size=&quot;sm&quot;</code> override.</li>
          <li>Bare <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<p>No data</p>`}</code> in an empty table.</li>
          <li>Using <code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<Popover>`}</code> for the action menu (must be DropdownMenu).</li>
        </ul>
      </Section>

      {/* Cross-refs */}
      <Section title="Related">
        <ul className="flex flex-col gap-2 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/table.md">
            components/table.md — Table primitive
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/empty-state.md">
            components/empty-state.md — EmptyState component
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md — Loading / Empty / Error baseline
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/form-dialog.md">
            patterns/form-dialog.md — Toolbar CTA opens form-dialog
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/confirm-dialog.md">
            patterns/confirm-dialog.md — Action menu opens confirm-dialog
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

/* ── Live demo table ──────────────────────────────────────── */

function LiveTable() {
  const [showEmpty, setShowEmpty] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const base = showEmpty ? [] : MOCK_ROWS;
    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter((r) => r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q));
  }, [showEmpty, query]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / DEMO_PAGE_SIZE));
  const paged = sorted.slice((page - 1) * DEMO_PAGE_SIZE, page * DEMO_PAGE_SIZE);
  const sp = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle */}
      <div className="flex items-center justify-between gap-3 rounded-md bg-muted/40 p-3 text-sm">
        <span className="text-muted-foreground">
          {showEmpty ? "Empty state on — table body uses <EmptyState>" : "Mock data on — 7 rows, paginated 3 / page"}
        </span>
        <Button variant="outline" size="sm" onClick={() => setShowEmpty((v) => !v)}>
          Toggle empty state
        </Button>
      </div>

      {/* Pattern starts — gap-10 wrapper */}
      <div className="flex flex-col gap-10 rounded-md border border-dashed border-info-border bg-info-subtle/30 p-6">
        {/* Breadcrumb (mock) */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Demo Entities</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <h1 className="text-3xl font-semibold text-foreground">Demo Entities</h1>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 h-8 text-sm"
              placeholder="Search Entity"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>
          <Button>Create Entity</Button>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px] pl-5">
                  <SortableHead col="name" {...sp}>Name</SortableHead>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <SortableHead col="owner" {...sp}>Owner</SortableHead>
                </TableHead>
                <TableHead className="min-w-[120px]">Created</TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-16">
                    <EmptyState
                      variant={query ? "no-results" : "no-data"}
                      icon={query ? <Search /> : <Inbox />}
                      title={query ? "No results found" : "No entities yet"}
                      description={
                        query
                          ? "Try adjusting your search query."
                          : "Create your first entity to start tracking it."
                      }
                      action={
                        query
                          ? { label: "Clear search", onClick: () => setQuery(""), variant: "ghost" }
                          : { label: "Create Entity", onClick: () => {} }
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-5 text-sm font-medium text-foreground">{row.name}</TableCell>
                    <TableCell className="text-sm text-foreground">{row.owner}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.createdLabel}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${row.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem className="px-2 py-1.5">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="px-2 py-1.5">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <p className="text-xs text-muted-foreground">
        ↑ Dashed outline marks the <code className="rounded-sm bg-muted px-1 font-mono">flex flex-col gap-10</code>{" "}
        page wrapper. In production pages, this wrapper has no visible border.
      </p>

      {/* Inline reference link */}
      <p className="text-sm">
        Compare with the real implementations:{" "}
        <Link href="/api-keys" className="text-info hover:underline">/api-keys</Link>{" "}·{" "}
        <Link href="/users" className="text-info hover:underline">/users</Link>{" "}·{" "}
        <Link href="/users?tab=pending" className="text-info hover:underline">/users?tab=pending</Link>
      </p>
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
