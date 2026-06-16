/**
 * OrbitalLines — full-bleed decorative SVG of two faint orbital ellipses, locked
 * to the Figma 1440×760 hero geometry. `preserveAspectRatio="xMidYMid slice"` so
 * it always covers the hero box and scales with the viewport. Rendered behind the
 * orbs + content. Stroke stays hex (decorative SVG). Static — no client hooks.
 */
export function OrbitalLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
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
