import {
  ColorSwatch,
  ForegroundSwatch,
  RadiusSwatch,
  ShadowSwatch,
} from "@/components/design-system/TokenSwatch";

/* ── /design-system/foundations/tokens ────────────────────────
 * Semantic color tokens (surface / foreground / action / status / brand /
 * sidebar / chart / border / overlay), radius scale, shadow scale.
 *
 * Source of truth: design-system/tokens/colors.json + misc.json → synced to
 * src/styles/tokens.generated.css via `npm run sync-tokens`.
 */

export default function TokensPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Tokens</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Semantic color, radius, and shadow tokens. Use these via Tailwind classes —
          raw RGB/hex is forbidden (see CLAUDE.md design principles).
        </p>
      </header>

      {/* Surface */}
      <Section
        title="Surface"
        description="Background fills for the page, cards, popovers, muted regions, and hover/accent states."
      >
        <Grid>
          <ColorSwatch bgClass="bg-background" label="background" tailwindClass="bg-background" ringed />
          <ColorSwatch bgClass="bg-card" label="card" tailwindClass="bg-card" ringed />
          <ColorSwatch bgClass="bg-popover" label="popover" tailwindClass="bg-popover" ringed />
          <ColorSwatch bgClass="bg-muted" label="muted" tailwindClass="bg-muted" />
          <ColorSwatch bgClass="bg-accent" label="accent" tailwindClass="bg-accent" />
        </Grid>
      </Section>

      {/* Foreground */}
      <Section
        title="Foreground"
        description="Text colors for each surface. `foreground` is the default body text."
      >
        <Grid>
          <ForegroundSwatch textClass="text-foreground" label="foreground" tailwindClass="text-foreground" />
          <ForegroundSwatch textClass="text-muted-foreground" label="muted-foreground" tailwindClass="text-muted-foreground" />
          <ForegroundSwatch textClass="text-card-foreground" label="card-foreground" tailwindClass="text-card-foreground" />
          <ForegroundSwatch textClass="text-popover-foreground" label="popover-foreground" tailwindClass="text-popover-foreground" />
          <ForegroundSwatch textClass="text-accent-foreground" label="accent-foreground" tailwindClass="text-accent-foreground" />
        </Grid>
      </Section>

      {/* Action */}
      <Section
        title="Action"
        description="Primary and secondary action colors. `primary` is the default Button background."
      >
        <Grid>
          <ColorSwatch bgClass="bg-primary" label="primary" tailwindClass="bg-primary" />
          <ColorSwatch bgClass="bg-primary-foreground" label="primary-foreground" tailwindClass="bg-primary-foreground" ringed />
          <ColorSwatch bgClass="bg-secondary" label="secondary" tailwindClass="bg-secondary" />
          <ColorSwatch bgClass="bg-secondary-foreground" label="secondary-foreground" tailwindClass="bg-secondary-foreground" />
        </Grid>
      </Section>

      {/* Status — 4-token sets */}
      <Section
        title="Status"
        description="Each status has a 4-token set: solid bg, foreground (white), -subtle (light bg), -border."
      >
        <div className="flex flex-col gap-6">
          <StatusGroup title="success">
            <ColorSwatch bgClass="bg-success" label="success" tailwindClass="bg-success" />
            <ColorSwatch bgClass="bg-success-foreground" label="success-foreground" tailwindClass="bg-success-foreground" ringed />
            <ColorSwatch bgClass="bg-success-subtle" label="success-subtle" tailwindClass="bg-success-subtle" />
            <ColorSwatch bgClass="bg-success-border" label="success-border" tailwindClass="bg-success-border" />
          </StatusGroup>
          <StatusGroup title="warning">
            <ColorSwatch bgClass="bg-warning" label="warning" tailwindClass="bg-warning" />
            <ColorSwatch bgClass="bg-warning-foreground" label="warning-foreground" tailwindClass="bg-warning-foreground" ringed />
            <ColorSwatch bgClass="bg-warning-subtle" label="warning-subtle" tailwindClass="bg-warning-subtle" />
            <ColorSwatch bgClass="bg-warning-border" label="warning-border" tailwindClass="bg-warning-border" />
          </StatusGroup>
          <StatusGroup title="info">
            <ColorSwatch bgClass="bg-info" label="info" tailwindClass="bg-info" />
            <ColorSwatch bgClass="bg-info-foreground" label="info-foreground" tailwindClass="bg-info-foreground" ringed />
            <ColorSwatch bgClass="bg-info-subtle" label="info-subtle" tailwindClass="bg-info-subtle" />
            <ColorSwatch bgClass="bg-info-border" label="info-border" tailwindClass="bg-info-border" />
          </StatusGroup>
          <StatusGroup title="destructive">
            <ColorSwatch bgClass="bg-destructive" label="destructive" tailwindClass="bg-destructive" />
            <ColorSwatch bgClass="bg-destructive-foreground" label="destructive-foreground" tailwindClass="bg-destructive-foreground" ringed />
            <ColorSwatch bgClass="bg-destructive-subtle" label="destructive-subtle" tailwindClass="bg-destructive-subtle" />
            <ColorSwatch bgClass="bg-destructive-border" label="destructive-border" tailwindClass="bg-destructive-border" />
          </StatusGroup>
          <StatusGroup title="highlight">
            <ColorSwatch bgClass="bg-highlight" label="highlight" tailwindClass="bg-highlight" />
            <ColorSwatch bgClass="bg-highlight-foreground" label="highlight-foreground" tailwindClass="bg-highlight-foreground" ringed />
            <ColorSwatch bgClass="bg-highlight-subtle" label="highlight-subtle" tailwindClass="bg-highlight-subtle" />
            <ColorSwatch bgClass="bg-highlight-border" label="highlight-border" tailwindClass="bg-highlight-border" />
          </StatusGroup>
        </div>
      </Section>

      {/* Brand */}
      <Section
        title="Brand"
        description="UJET signature blue (#00A2FF). Restricted to logo, landing, and marketing surfaces — see design-system/rules/color.md."
      >
        <Grid>
          <ColorSwatch bgClass="bg-brand" label="brand" tailwindClass="bg-brand" />
          <ColorSwatch bgClass="bg-brand-foreground" label="brand-foreground" tailwindClass="bg-brand-foreground" />
        </Grid>
      </Section>

      {/* Sidebar */}
      <Section
        title="Sidebar"
        description="Dedicated tokens for the sidebar surface — independent from the main background scale."
      >
        <Grid>
          <ColorSwatch bgClass="bg-sidebar" label="sidebar" tailwindClass="bg-sidebar" ringed />
          <ColorSwatch bgClass="bg-sidebar-primary" label="sidebar-primary" tailwindClass="bg-sidebar-primary" />
          <ColorSwatch bgClass="bg-sidebar-accent" label="sidebar-accent" tailwindClass="bg-sidebar-accent" />
        </Grid>
      </Section>

      {/* Border / Input / Ring */}
      <Section
        title="Border / Input / Ring"
        description="Hairline border, input border, and focus-visible ring tokens."
      >
        <Grid>
          <ColorSwatch bgClass="bg-border" label="border" tailwindClass="border-border" />
          <ColorSwatch bgClass="bg-input" label="input" tailwindClass="border-input" />
          <ColorSwatch bgClass="bg-ring" label="ring" tailwindClass="ring-ring" />
        </Grid>
      </Section>

      {/* Chart palette */}
      <Section
        title="Chart"
        description="Two palettes — sequential (chart-1..5, blue gradient) and method-aligned (success / info / highlight / warning / destructive chart)."
      >
        <h3 className="mb-3 text-sm font-medium text-foreground">Sequential</h3>
        <Grid>
          <ColorSwatch bgClass="bg-chart-1" label="chart-1" tailwindClass="bg-chart-1" />
          <ColorSwatch bgClass="bg-chart-2" label="chart-2" tailwindClass="bg-chart-2" />
          <ColorSwatch bgClass="bg-chart-3" label="chart-3" tailwindClass="bg-chart-3" />
          <ColorSwatch bgClass="bg-chart-4" label="chart-4" tailwindClass="bg-chart-4" />
          <ColorSwatch bgClass="bg-chart-5" label="chart-5" tailwindClass="bg-chart-5" />
        </Grid>
        <h3 className="mb-3 mt-6 text-sm font-medium text-foreground">Method-aligned</h3>
        <Grid>
          <ColorSwatch bgClass="bg-success-chart" label="success-chart" tailwindClass="bg-success-chart" />
          <ColorSwatch bgClass="bg-info-chart" label="info-chart" tailwindClass="bg-info-chart" />
          <ColorSwatch bgClass="bg-highlight-chart" label="highlight-chart" tailwindClass="bg-highlight-chart" />
          <ColorSwatch bgClass="bg-warning-chart" label="warning-chart" tailwindClass="bg-warning-chart" />
          <ColorSwatch bgClass="bg-destructive-chart" label="destructive-chart" tailwindClass="bg-destructive-chart" />
        </Grid>
      </Section>

      {/* Radius scale */}
      <Section
        title="Radius"
        description="From design-system/tokens/misc.json, synced from the Figma library radius scale."
      >
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
          <RadiusSwatch radiusClass="rounded-none" label="none" px={0} />
          <RadiusSwatch radiusClass="rounded-xs" label="xs" px={2} />
          <RadiusSwatch radiusClass="rounded-sm" label="sm" px={6} />
          <RadiusSwatch radiusClass="rounded-md" label="md" px={8} />
          <RadiusSwatch radiusClass="rounded-lg" label="lg" px={10} />
          <RadiusSwatch radiusClass="rounded-xl" label="xl" px={14} />
          <RadiusSwatch radiusClass="rounded-2xl" label="2xl" px={18} />
          <RadiusSwatch radiusClass="rounded-3xl" label="3xl" px={22} />
          <RadiusSwatch radiusClass="rounded-4xl" label="4xl" px={26} />
          <RadiusSwatch radiusClass="rounded-full" label="full" px="9999" />
        </div>
      </Section>

      {/* Shadow scale */}
      <Section
        title="Shadow"
        description="Tailwind shadow scale used by primitives — Button/Input (xs), Card (sm), Dropdown/Tooltip (md), Dialog/Sheet (xl)."
      >
        <div className="grid grid-cols-2 gap-6 rounded-md bg-muted/30 p-6 sm:grid-cols-4">
          <ShadowSwatch shadowClass="shadow-xs" label="xs" />
          <ShadowSwatch shadowClass="shadow-sm" label="sm" />
          <ShadowSwatch shadowClass="shadow-md" label="md" />
          <ShadowSwatch shadowClass="shadow-xl" label="xl" />
        </div>
      </Section>

      {/* Typography note */}
      <Section
        title="Typography"
        description="Semantic typography role → class mapping is tracked under P2-5 on the roadmap. Until then, use Tailwind text-* / font-* utilities (text-xs/sm/base/lg/xl, font-medium/semibold)."
      >
        <p className="text-sm text-muted-foreground">
          The catalog will add a Typography swatch page when P2-5 lands.
        </p>
      </Section>
    </div>
  );
}

/* ── Layout helpers ─────────────────────────────────────────── */

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
      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </div>
  );
}

function StatusGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border p-4">
      <h3 className="mb-3 text-sm font-medium text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{children}</div>
    </div>
  );
}
