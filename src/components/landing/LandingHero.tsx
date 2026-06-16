import Link from "next/link";

import { Orb } from "@/components/landing/Orb";
import { Button } from "@/components/ui/button";

/**
 * LandingHero — white base with two responsive grainy orbs bleeding off the
 * corners (top-left "planet", bottom-right "deep / slightly rougher").
 *
 * Orbs are code-native SVG: sized in vw via clamp() and anchored by % offsets,
 * so they scale fluidly with the viewport (no PNG). Decorative: aria-hidden +
 * pointer-events-none, behind the content (-z-10). The clamp()/% values are
 * intentional responsive positioning (the one place arbitrary values are used).
 *
 * Do NOT change the headline / subhead / button copy.
 */
export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* responsive corner orbs (decorative) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[14%] -left-[7%] -z-10 aspect-square w-[clamp(220px,30vw,480px)]"
      >
        <Orb variant="planet" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6%] -bottom-[16%] -z-10 aspect-square w-[clamp(180px,24vw,400px)]"
      >
        <Orb variant="deep" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-balance text-foreground leading-none md:text-6xl">
          Build your contact center with code.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          APIs, SDKs, and webhooks for voice, messaging, and AI agents.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link href="/api-keys">
            <Button>Get Started</Button>
          </Link>
          <Link href="/documentation">
            <Button variant="outline">Documentation</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
