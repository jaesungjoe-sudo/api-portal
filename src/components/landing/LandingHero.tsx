import Link from "next/link";

import { HeroBackground } from "@/components/landing/HeroBackground";
import { Button } from "@/components/ui/button";

/**
 * LandingHero — white hero matching Figma node 1719:8471. A single responsive
 * <HeroBackground> SVG (orbs + orbital lines + grain) sits full-bleed behind the
 * content (absolute inset-0, -z-10, pointer-events-none, aria-hidden); the orbs
 * bleed into the corners and leave the center white for the headline.
 *
 * Heading is gradient-filled text (background-clip:text), matching Figma exactly.
 * Do NOT change the headline / subhead / button copy.
 */
export function LandingHero() {
  return (
    <section className="relative left-1/2 -mt-20 w-screen -translate-x-1/2 isolate overflow-hidden bg-background">
      <HeroBackground className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-32 text-center">
        <h1
          className="bg-clip-text text-5xl leading-tight font-bold tracking-tight text-balance text-transparent md:text-6xl lg:text-7xl"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(251,251,251,0.35) 128.87%), linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 100%)",
          }}
        >
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
