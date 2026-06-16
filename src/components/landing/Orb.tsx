"use client";

import { useId } from "react";

/**
 * Orb — responsive, code-native grainy sphere (SVG; no image asset).
 *
 * Fills its container, so size + position are controlled by the wrapper
 * (e.g. `aspect-square w-[clamp(220px,30vw,480px)]`). Being vector, both the
 * gradient and the feTurbulence grain scale fluidly as the viewport widens —
 * which a PNG can't do.
 *
 * Grain knobs (per variant): baseFrequency = grain size (higher = finer),
 * opacity + blend = intensity (overlay = grittier, soft-light = smoother).
 * planet = subtle; deep = slightly rougher.
 */
type OrbVariant = "planet" | "deep";

const GRADIENTS: Record<
  OrbVariant,
  { cx: string; cy: string; r: string; stops: Array<[number, string]> }
> = {
  planet: { cx: "36%", cy: "30%", r: "78%", stops: [[0, "#cdeaff"], [32, "#26acff"], [66, "#0066cc"], [100, "#000846"]] },
  deep:   { cx: "34%", cy: "28%", r: "76%", stops: [[0, "#9ed8ff"], [28, "#00A2FF"], [62, "#013a86"], [100, "#000528"]] },
};

const GRAIN: Record<
  OrbVariant,
  { baseFrequency: number; octaves: number; opacity: number; blend: "overlay" | "soft-light" }
> = {
  planet: { baseFrequency: 0.9, octaves: 2, opacity: 0.16, blend: "soft-light" }, // subtle
  deep:   { baseFrequency: 0.6, octaves: 3, opacity: 0.32, blend: "overlay" },     // slightly rougher
};

export interface OrbProps {
  variant?: OrbVariant;
  className?: string;
}

export function Orb({ variant = "planet", className }: OrbProps) {
  // strip ":" from useId so the value is a valid SVG id / url() reference
  const uid = useId().replace(/:/g, "");
  const gradId = `orb-grad-${uid}`;
  const grainId = `orb-grain-${uid}`;
  const clipId = `orb-clip-${uid}`;
  const g = GRADIENTS[variant];
  const n = GRAIN[variant];

  return (
    <svg
      viewBox="0 0 600 600"
      width="100%"
      height="100%"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id={gradId} cx={g.cx} cy={g.cy} r={g.r}>
          {g.stops.map(([offset, color]) => (
            <stop key={offset} offset={`${offset}%`} stopColor={color} />
          ))}
        </radialGradient>
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={n.baseFrequency}
            numOctaves={n.octaves}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>
        <clipPath id={clipId}>
          <circle cx="300" cy="300" r="299" />
        </clipPath>
      </defs>

      <circle cx="300" cy="300" r="299" fill={`url(#${gradId})`} />
      <g clipPath={`url(#${clipId})`}>
        <rect width="600" height="600" filter={`url(#${grainId})`} opacity={n.opacity} style={{ mixBlendMode: n.blend }} />
      </g>
    </svg>
  );
}
