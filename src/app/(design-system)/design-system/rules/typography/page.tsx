/* ── /design-system/rules/typography ──────────────────────────
 * Visual lookup for the typography role table. Each role renders
 * a live sample so designers/devs can preview what each role looks like.
 *
 * Spec: design-system/rules/typography.md
 */

export default function TypographyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Typography</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Documentation-only role table — Tailwind utility classes stay in code, this page is the
          lookup reference. Designed to coexist with shadcn primitives (which carry their own
          internal typography).
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/typography.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View rule spec on GitHub →
          </a>
        </p>
      </header>

      {/* Scope note */}
      <Section
        title="Scope"
        description="What this table covers vs what it doesn't."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ScopeCard
            title="Covered"
            items={[
              "Page-level headings (h1 / h2 / h3)",
              "Body / description text",
              "Domain components (EmptyState, TeamCard, DocsSection, ...)",
              "Catalog pages",
            ]}
            tone="success"
          />
          <ScopeCard
            title="Out of scope"
            items={[
              "shadcn primitive internal typography (DialogTitle, Label, Button, ...)",
              "Marketing-only typography (landing hero variations beyond display)",
              "Anything inside src/components/ui/*",
            ]}
            tone="muted"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          shadcn primitives ship with hardcoded sizes (DialogTitle = text-lg font-semibold, Label =
          text-sm font-medium, etc.). They&apos;re left alone — this table covers what we author on
          top of them.
        </p>
      </Section>

      {/* Heading roles */}
      <Section
        title="Heading roles"
        description="From hero down through card titles. Two roles (page-title, section-title) have variants based on the page pattern."
      >
        <div className="rounded-md border border-border bg-card">
          <RoleRow
            role="display"
            className="text-5xl font-semibold tracking-tight text-foreground"
            sample="Display"
            note="Landing hero only. text-5xl md:text-6xl font-semibold tracking-tight"
          />
          <RoleRow
            role="page-title (dashboard)"
            className="text-3xl font-semibold text-foreground"
            sample="Page Title"
            note="h1 on table-list-page (/users, /api-keys, /analytics). text-3xl font-semibold"
          />
          <RoleRow
            role="page-title (docs)"
            className="text-4xl font-semibold text-foreground"
            sample="Page Title"
            note="h1 on docs-page-shell (/documentation/*, /api-reference/*). text-4xl font-semibold"
          />
          <RoleRow
            role="section-title (docs body)"
            className="text-2xl font-semibold text-foreground"
            sample="Section Title"
            note="h2 inside DocsSection. text-2xl font-semibold"
          />
          <RoleRow
            role="section-title (catalog)"
            className="text-xl font-semibold text-foreground"
            sample="Section Title"
            note="h2 on catalog pages (this one!). text-xl font-semibold"
          />
          <RoleRow
            role="card-title-lg"
            className="text-lg font-semibold text-foreground"
            sample="Card Title (large)"
            note="TeamCard etc. text-lg font-semibold"
          />
          <RoleRow
            role="card-title"
            className="text-base font-medium text-foreground"
            sample="Card Title"
            note="EmptyState title, DemoCard, standard card heads. text-base font-medium"
            isLast
          />
        </div>
      </Section>

      {/* Body roles */}
      <Section
        title="Body / supportive roles"
        description="Descriptive text under headings. All use text-muted-foreground unless emphasis is needed."
      >
        <div className="rounded-md border border-border bg-card">
          <RoleRow
            role="label"
            className="text-sm font-medium text-foreground"
            sample="Form Label"
            note="Form Label, dense sub-heading. text-sm font-medium"
          />
          <RoleRow
            role="body"
            className="text-base text-muted-foreground"
            sample="Body — Page description under h1. Used on docs-page-shell description prop and similar large body."
            note="text-base text-muted-foreground"
          />
          <RoleRow
            role="body-sm"
            className="text-sm text-muted-foreground"
            sample="Body-sm — Card descriptions, table secondary cells, general supportive text. Most common body usage in the app."
            note="text-sm text-muted-foreground"
          />
          <RoleRow
            role="caption"
            className="text-xs text-muted-foreground"
            sample="Caption — metadata, footer notes, helper text"
            note="text-xs text-muted-foreground"
          />
          <RoleRow
            role="error"
            className="text-sm text-destructive"
            sample="Error — Email is required"
            note="Form validation error message. text-sm text-destructive"
            isLast
          />
        </div>
      </Section>

      {/* Code / link roles */}
      <Section title="Code / link roles">
        <div className="rounded-md border border-border bg-card p-6">
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                <code className="font-mono">code-inline</code> — inline code chip
              </p>
              <p className="text-foreground">
                Inline reference like{" "}
                <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">team.protected</code>{" "}
                appears in body text.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                <code className="font-mono">code-block</code> — code snippet block
              </p>
              <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-xs font-mono text-foreground">
                <code>{`<DocsPageShell tag={<MethodBadge method="POST" />} ... />`}</code>
              </pre>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                <code className="font-mono">link</code> — cross-ref / external link
              </p>
              <p className="text-foreground">
                See <a className="text-info hover:underline" href="#">patterns/form-dialog.md</a> for
                more.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Variant note */}
      <Section
        title="Same role, two variants"
        description="Two roles intentionally split by page pattern."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <VariantCard
            role="page-title"
            variantA={{ label: "dashboard", class: "text-3xl", usedOn: "table-list-page" }}
            variantB={{ label: "docs", class: "text-4xl", usedOn: "docs-page-shell" }}
            reason="Dashboard pages have data-dense content — a smaller h1 keeps hierarchy balanced. Docs pages have long-form content — a larger h1 anchors the read."
          />
          <VariantCard
            role="section-title"
            variantA={{ label: "docs body", class: "text-2xl", usedOn: "DocsSection" }}
            variantB={{ label: "catalog", class: "text-xl", usedOn: "catalog pages" }}
            reason="h2 scales down with its parent h1 — text-2xl pairs with text-4xl, text-xl pairs with text-3xl."
          />
        </div>
      </Section>

      {/* Anti-patterns */}
      <Section title="Anti-patterns" description="Full list in typography.md §6.">
        <ul className="ml-4 list-disc space-y-2 text-sm text-foreground">
          <li>
            Magic-number sizes — <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-[22px]</code> /{" "}
            <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-[15px]</code>. Pick from the table.
          </li>
          <li>
            Overriding shadcn primitive typography (<code className="rounded-sm bg-muted px-1 font-mono text-xs">{`<DialogTitle className="text-2xl">`}</code>) — primitive is out of scope.
          </li>
          <li>
            Mixing page-title variants on the same page (table-list-page using text-4xl).
          </li>
          <li>
            Using <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-sm font-medium</code> for body — that&apos;s label role. Body is <code className="rounded-sm bg-muted px-1 font-mono text-xs">text-sm text-muted-foreground</code>.
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

function RoleRow({
  role,
  className,
  sample,
  note,
  isLast,
}: {
  role: string;
  className: string;
  sample: string;
  note: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 p-5 md:flex-row md:items-baseline md:gap-6 ${
        isLast ? "" : "border-b border-border"
      }`}
    >
      <div className="md:w-40 md:shrink-0">
        <code className="text-xs font-mono font-medium text-foreground">{role}</code>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </div>
      <div className={`flex-1 ${className}`}>{sample}</div>
    </div>
  );
}

function ScopeCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "muted";
}) {
  const headerCls =
    tone === "success" ? "text-success" : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <h3 className={`mb-2 text-sm font-medium ${headerCls}`}>{title}</h3>
      <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function VariantCard({
  role,
  variantA,
  variantB,
  reason,
}: {
  role: string;
  variantA: { label: string; class: string; usedOn: string };
  variantB: { label: string; class: string; usedOn: string };
  reason: string;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <code className="text-sm font-mono font-medium text-foreground">{role}</code>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <VariantPill {...variantA} />
        <VariantPill {...variantB} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{reason}</p>
    </div>
  );
}

function VariantPill({
  label,
  class: cls,
  usedOn,
}: {
  label: string;
  class: string;
  usedOn: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-sm bg-muted/40 p-2">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <code className="font-mono text-[11px] text-muted-foreground">{cls}</code>
      <span className="text-[11px] text-muted-foreground">on {usedOn}</span>
    </div>
  );
}
