"use client";

import { useId } from "react";

/**
 * HeroBackground — one responsive SVG reproducing the baked Figma hero background
 * (node 2059:57897 "image 42", 1440×760): two grainy orbs bleeding off the corners,
 * faint orbital lines, and clearly-visible grain. Geometry is locked to the
 * 1440×760 viewBox; `preserveAspectRatio="xMidYMid slice"` scales it to cover the
 * container while keeping the orbs corner-anchored, so it stays responsive without
 * a PNG. Fully decorative — render it full-bleed behind the hero content.
 *
 * Grain: each orb is a <circle> with a radialGradient fill + a desaturated
 * feTurbulence <rect> clipped to the circle, composited with mix-blend-mode:overlay
 * (each orb isolated so the grain blends over its own gradient). Orb gradient stops
 * and the orbital-line stroke stay as hex (decorative SVG).
 */
export function HeroBackground({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const pGrad = `hero-planet-grad-${uid}`;
  const dGrad = `hero-deep-grad-${uid}`;
  const pGrain = `hero-planet-grain-${uid}`;
  const dGrain = `hero-deep-grain-${uid}`;
  const pClip = `hero-planet-clip-${uid}`;
  const dClip = `hero-deep-clip-${uid}`;

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
      <defs>
        {/* planet — highlight offset to the upper-left */}
        <radialGradient id={pGrad} cx="32%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#cdeaff" />
          <stop offset="32%" stopColor="#26acff" />
          <stop offset="66%" stopColor="#0066cc" />
          <stop offset="100%" stopColor="#000846" />
        </radialGradient>
        {/* deep */}
        <radialGradient id={dGrad} cx="34%" cy="28%" r="76%">
          <stop offset="0%" stopColor="#9ed8ff" />
          <stop offset="28%" stopColor="#00A2FF" />
          <stop offset="62%" stopColor="#013a86" />
          <stop offset="100%" stopColor="#000528" />
        </radialGradient>

        <filter id={pGrain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>
        <filter id={dGrain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>

        <clipPath id={pClip}>
          <circle cx="150" cy="-75" r="380" />
        </clipPath>
        <clipPath id={dClip}>
          <circle cx="1330" cy="825" r="325" />
        </clipPath>
      </defs>

      {/* orbital lines — behind the orbs */}
      <g fill="none" stroke="#00A2FF" strokeWidth="1.5">
        <ellipse cx="720" cy="380" rx="650" ry="260" transform="rotate(-14 720 380)" opacity="0.13" />
        <ellipse cx="720" cy="380" rx="525" ry="360" transform="rotate(20 720 380)" opacity="0.1" />
      </g>

      {/* top-left planet (isolated so grain overlays its own gradient) */}
      <g style={{ isolation: "isolate" }}>
        <circle cx="150" cy="-75" r="380" fill={`url(#${pGrad})`} />
        <g clipPath={`url(#${pClip})`}>
          <rect x="0" y="0" width="1440" height="760" filter={`url(#${pGrain})`} opacity="0.4" style={{ mixBlendMode: "overlay" }} />
        </g>
      </g>

      {/* bottom-right deep (rougher grain) */}
      <g style={{ isolation: "isolate" }}>
        <circle cx="1330" cy="825" r="325" fill={`url(#${dGrad})`} />
        <g clipPath={`url(#${dClip})`}>
          <rect x="0" y="0" width="1440" height="760" filter={`url(#${dGrain})`} opacity="0.48" style={{ mixBlendMode: "overlay" }} />
        </g>
      </g>
    </svg>
  );
}
