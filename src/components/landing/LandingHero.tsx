import Link from "next/link";

import { Orb } from "@/components/landing/Orb";
import { OrbitalLines } from "@/components/landing/OrbitalLines";
import { Button } from "@/components/ui/button";

/**
 * LandingHero — white hero matching Figma node 1719:8471. The hero-background
 * region sits flush directly below the nav (no orb behind the header) and is
 * full-bleed (full viewport width) with overflow-hidden so the orbs bleed off the
 * screen edges. Two code-native <Orb> SVGs are offset into the corners (asymmetric:
 * top-left larger / shows more) over faint <OrbitalLines>. All decorative:
 * aria-hidden + pointer-events-none + -z-10, behind the centered content.
 *
 * Heading is gradient-filled text (background-clip:text) with a forced line break.
 * Do NOT change the headline / subhead / button copy.
 */
export function LandingHero() {
  return (
    <section className="relative left-1/2 -mt-20 w-screen -translate-x-1/2 isolate overflow-hidden bg-background">
      {/* orbital lines (behind orbs + content). Toggled at the 1512 breakpoint
          (zero-JS) instead of a client resize hook:
          - >=1512: defaults (slice / COVER on the 1440×760 Figma frame) —
            identical to today, Figma-exact.
          - <1512: a padded viewBox + meet (CONTAIN) so the whole ellipse always
            stays in frame. slice can't work here — as text wraps the hero box
            grows taller and COVER would crop the sides (a Y anchor can't help). */}
      <OrbitalLines
        viewBox="-40 -40 1520 840"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full min-[1512px]:hidden"
      />
      <OrbitalLines className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full min-[1512px]:block" />

      {/* top-left "planet" — larger, shows a bit more than a quarter */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -z-10 aspect-square"
        style={{ width: "clamp(230px, 34vw, 620px)", transform: "translate(-40%, -44%)" }}
      >
        <Orb variant="planet" priority sizes="(max-width: 1824px) 34vw, 620px" />
      </div>

      {/* bottom-right "deep" — smaller (80%) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 -z-10 aspect-square"
        style={{ width: "clamp(160px, 23vw, 420px)", transform: "translate(42%, 46%)" }}
      >
        <Orb variant="deep" sizes="(max-width: 1824px) 23vw, 420px" />
      </div>

      <div
        className="relative z-10 mx-auto max-w-3xl px-6 pb-32 text-center"
        style={{ paddingTop: "clamp(120px, 15vw, 140px)" }}
      >
        <h1
          className="bg-clip-text font-bold leading-tight text-balance text-transparent"
          style={{
            fontSize: "clamp(30px, 6vw, 64px)",
            letterSpacing: "-0.03em",
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(251,251,251,0.35) 128.87%), linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 100%)",
          }}
        >
          Build your contact center
          <br />
          with code.
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
