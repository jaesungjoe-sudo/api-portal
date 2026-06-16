"use client";

import { useId } from "react";

/**
 * Orb — responsive, code-native grainy sphere (SVG; no image asset).
 *
 * Fills its container, so size + corner offset are controlled by the wrapper
 * (e.g. `aspect-square` + a clamp() width + a translate to push it off-corner).
 * Being vector, the gradient + grain scale fluidly with the viewport.
 *
 * Grain is composited INSIDE the filter (feTurbulence → desaturate → alpha →
 * feBlend overlay over the gradient → feComposite "in" to clip back to the
 * circle). A plain sibling mix-blend-mode does NOT show over the gradient, hence
 * the in-filter blend. planet = finer/medium; deep = coarser/rougher.
 */
type OrbVariant = "planet" | "deep";

const GRADIENTS: Record<
  OrbVariant,
  { cx: string; cy: string; r: string; stops: Array<[number, string]> }
> = {
  planet: { cx: "36%", cy: "30%", r: "78%", stops: [[0, "#cdeaff"], [32, "#26acff"], [66, "#0066cc"], [100, "#000846"]] },
  deep:   { cx: "34%", cy: "28%", r: "76%", stops: [[0, "#9ed8ff"], [28, "#00A2FF"], [62, "#013a86"], [100, "#000528"]] },
};

const GRAIN: Record<OrbVariant, { baseFrequency: number; octaves: number; slope: number }> = {
  planet: { baseFrequency: 0.6, octaves: 3, slope: 1 },     // finer, medium
  deep:   { baseFrequency: 0.5, octaves: 3, slope: 1.35 },  // coarser, rougher
};

export interface OrbProps {
  variant?: OrbVariant;
  className?: string;
  /** Override the variant's grain strength (feFuncA slope). Lower = more restrained. */
  grainSlope?: number;
}

export function Orb({ variant = "planet", className, grainSlope }: OrbProps) {
  // strip ":" so the value is a valid SVG id / url() reference
  const uid = useId().replace(/:/g, "");
  const gradId = `orb-grad-${uid}`;
  const grainId = `orb-grain-${uid}`;
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
          <feTurbulence type="fractalNoise" baseFrequency={n.baseFrequency} numOctaves={n.octaves} stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="m" />
          <feComponentTransfer in="m" result="g">
            <feFuncA type="linear" slope={grainSlope ?? n.slope} />
          </feComponentTransfer>
          <feBlend in="g" in2="SourceGraphic" mode="overlay" result="b" />
          <feComposite in="b" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <circle cx="300" cy="300" r="299" fill={`url(#${gradId})`} filter={`url(#${grainId})`} />
    </svg>
  );
}
