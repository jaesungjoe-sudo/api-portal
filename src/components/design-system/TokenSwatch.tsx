/**
 * Token swatch primitives for the design system catalog.
 *
 * Tailwind class names must be literal strings (no `bg-${var}` interpolation)
 * for the JIT scanner to pick them up. Hence the verbose explicit-class usage
 * across the page.
 */

/** Single color swatch — block of color + label + Tailwind class. */
export function ColorSwatch({
  bgClass,
  label,
  tailwindClass,
  ringed = false,
}: {
  /** Tailwind background class — e.g. "bg-primary". Must be a literal string. */
  bgClass: string;
  /** Display label (token name). */
  label: string;
  /** Class to show in the code label. Usually same as `bgClass`. */
  tailwindClass: string;
  /** Add a hairline border ring — useful for light/white tokens. */
  ringed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-16 w-full rounded-md ${bgClass} ${ringed ? "ring-1 ring-border ring-inset" : ""}`}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <code className="text-xs font-mono text-muted-foreground">{tailwindClass}</code>
      </div>
    </div>
  );
}

/** Foreground swatch — circle of color on neutral bg, showing text token visually. */
export function ForegroundSwatch({
  textClass,
  label,
  tailwindClass,
}: {
  textClass: string;
  label: string;
  tailwindClass: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-16 w-full items-center justify-center rounded-md bg-card ring-1 ring-border ring-inset">
        <span className={`text-2xl font-semibold ${textClass}`}>Aa</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <code className="text-xs font-mono text-muted-foreground">{tailwindClass}</code>
      </div>
    </div>
  );
}

/** Radius swatch — square block with the given radius applied. */
export function RadiusSwatch({
  radiusClass,
  label,
  px,
}: {
  radiusClass: string;
  label: string;
  px: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`size-16 bg-primary ${radiusClass}`} />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <code className="text-xs font-mono text-muted-foreground">{px}px</code>
      </div>
    </div>
  );
}

/** Shadow swatch — card with elevation visible against background. */
export function ShadowSwatch({
  shadowClass,
  label,
}: {
  shadowClass: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-2">
      <div className={`size-16 rounded-md bg-card ${shadowClass}`} />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <code className="text-xs font-mono text-muted-foreground">{shadowClass}</code>
      </div>
    </div>
  );
}
