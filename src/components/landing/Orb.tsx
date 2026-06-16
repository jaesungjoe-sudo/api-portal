import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Orb — decorative landing orb rendered from a PNG (film-grain texture baked in;
 * the previous feTurbulence SVG couldn't match it). Fills its container via
 * next/image `fill` + object-contain, so the wrapper owns size + corner offset
 * (aspect-square + clamp width + translate). The same two images are reused for all
 * orb instances (hero + footer); only the wrapper position differs.
 *
 * Decorative: alt="", aria-hidden, draggable={false}. The wrapper carries
 * pointer-events-none / -z-10.
 */
const SRC: Record<"planet" | "deep", string> = {
  planet: "/orbs/orb-topleft-planet.png", // navy/blue, fine grain
  deep: "/orbs/orb-bottomright-deep.png", // bright blue, rougher grain
};

export interface OrbProps {
  variant?: "planet" | "deep";
  className?: string;
  /** next/image priority — use for the above-the-fold hero orb. */
  priority?: boolean;
  /** next/image sizes hint; should roughly match the wrapper's clamp width. */
  sizes?: string;
}

export function Orb({ variant = "planet", className, priority, sizes = "50vw" }: OrbProps) {
  return (
    <Image
      src={SRC[variant]}
      alt=""
      aria-hidden
      draggable={false}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("h-full w-full select-none object-contain", className)}
    />
  );
}
