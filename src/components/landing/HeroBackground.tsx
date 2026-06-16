"use client";

import { useId } from "react";

/**
 * HeroBackground — one responsive SVG reproducing the baked Figma hero background
 * (node 2059:57897 "image 42", 1440×760): two grainy orbs hugging the corners,
 * faint orbital lines, and clearly-visible grain. Geometry is locked to the
 * 1440×760 viewBox; `preserveAspectRatio="xMidYMid slice"` scales it to COVER the
 * container, so when rendered full-bleed the orbs grow with the viewport and bleed
 * off the left/right edges. Fully decorative — render full-bleed behind the hero.
 *
 * Grain is composited INSIDE each orb's filter (feTurbulence → desaturate → alpha
 * → feBlend overlay over the gradient, then feComposite "in" to clip back to the
 * circle so the square noise can't leak past the orb). This reliably overlays the
 * gradient instead of blending against the page backdrop. Orb gradient stops and
 * the orbital-line stroke stay as hex (decorative SVG).
 */
export function HeroBackground({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const pGrad = `hero-planet-grad-${uid}`;
  const dGrad = `hero-deep-grad-${uid}`;
  const pGrain = `hero-planet-grain-${uid}`;
  const dGrain = `hero-deep-grain-${uid}`;

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

        {/* planet grain — finer, medium */}
        <filter id={pGrain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="linear" slope="0.7" />
          </feComponentTransfer>
          <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>
        {/* deep grain — coarser, rougher */}
        <filter id={dGrain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feComponentTransfer in="mono" result="grain">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
          <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="blended" />
          <feComposite in="blended" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* orbital lines — behind the orbs */}
      <g fill="none" stroke="#00A2FF" strokeWidth="1.5">
        <ellipse cx="720" cy="380" rx="650" ry="260" transform="rotate(-14 720 380)" opacity="0.13" />
        <ellipse cx="720" cy="380" rx="525" ry="360" transform="rotate(20 720 380)" opacity="0.1" />
      </g>

      {/* top-left planet (grain via filter) */}
      <circle cx="150" cy="-75" r="420" fill={`url(#${pGrad})`} filter={`url(#${pGrain})`} />
      {/* bottom-right deep */}
      <circle cx="1330" cy="825" r="360" fill={`url(#${dGrad})`} filter={`url(#${dGrain})`} />
    </svg>
  );
}
