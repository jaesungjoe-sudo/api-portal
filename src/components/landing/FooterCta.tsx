import Link from "next/link";

import { Orb } from "@/components/landing/Orb";
import { Button } from "@/components/ui/button";

/**
 * FooterCta — closing CTA, the bottom bookend mirroring the hero (Figma 1719:8641).
 * Full-bleed region (overflow-hidden) with centered content on top and decorative
 * layers behind (-z-10, pointer-events-none, aria-hidden). More restrained than the
 * hero: two SMALLER orbs rising from the bottom corners (reusing <Orb>) and ONE faint
 * orbital line (vs the hero's two) centered on the text and sitting a touch high.
 *
 * Heading reuses the hero H1 gradient-text treatment. Copy / subhead / buttons unchanged.
 */
export function FooterCta() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 isolate overflow-hidden bg-background">
      {/* single orbital line — full-bleed, centered on the text (cx=720), raised (cy=200) */}
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        role="presentation"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        <ellipse
          cx="720"
          cy="200"
          rx="600"
          ry="180"
          transform="rotate(6 720 200)"
          fill="none"
          stroke="#00A2FF"
          strokeOpacity="0.12"
          strokeWidth="1.5"
        />
      </svg>

      {/* bottom-left "deep / bright" — smaller, slightly softer grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 -z-10 aspect-square"
        style={{ width: "clamp(150px, 19vw, 340px)", transform: "translate(-44%, 46%)" }}
      >
        <Orb variant="deep" sizes="(max-width: 1824px) 19vw, 340px" />
      </div>

      {/* bottom-right "planet / navy" */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 -z-10 aspect-square"
        style={{ width: "clamp(190px, 24vw, 440px)", transform: "translate(44%, 46%)" }}
      >
        <Orb variant="planet" sizes="(max-width: 1824px) 24vw, 440px" />
      </div>

      <div
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
        style={{ paddingTop: "clamp(96px, 12vw, 140px)", paddingBottom: "clamp(96px, 12vw, 140px)" }}
      >
        <h2
          className="bg-clip-text font-bold leading-tight text-balance text-transparent"
          style={{
            fontSize: "clamp(28px, 5.5vw, 56px)",
            letterSpacing: "-0.03em",
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(251,251,251,0.35) 128.87%), linear-gradient(90deg, #0A0A0A 0%, #0A0A0A 100%)",
          }}
        >
          Ready to build the
          <br />
          future of communication?
        </h2>
        <p className="mt-6 text-base text-muted-foreground">
          Start your first integration in less than 5 minutes
        </p>
        <div className="mt-8 flex items-center gap-2">
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
