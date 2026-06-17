/**
 * OrbitalLines — full-bleed decorative SVG of two faint orbital ellipses, locked
 * to the Figma 1440×760 hero geometry. Rendered behind the orbs + content. Stroke
 * stays hex (decorative SVG). Static — no client hooks.
 *
 * `viewBox` + `preserveAspectRatio` are overridable so the hero can switch crop
 * behaviour responsively (see LandingHero):
 *  - >=1512: defaults — `slice` (COVER) on the exact Figma 1440×760 frame.
 *  - <1512: a padded viewBox + `meet` (CONTAIN) so the whole ellipse always
 *    stays in frame (slice would crop an edge as the hero box AR changes).
 */
export function OrbitalLines({
  className,
  viewBox = "0 0 1440 760",
  preserveAspectRatio = "xMidYMid slice",
}: {
  className?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <g fill="none" stroke="#00A2FF" strokeWidth="1.5">
        <ellipse cx="720" cy="380" rx="650" ry="260" transform="rotate(-14 720 380)" opacity="0.13" />
        <ellipse cx="720" cy="380" rx="525" ry="360" transform="rotate(20 720 380)" opacity="0.1" />
      </g>
    </svg>
  );
}
