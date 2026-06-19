import Link from "next/link";
import type { HttpMethod } from "@/lib/mock-analytics-data";
import { MethodBadge } from "@/components/api-portal/MethodBadge";
import { TopNav } from "@/components/api-portal/TopNav";
import { UjetLogo } from "@/components/api-portal/UjetLogo";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LandingHero } from "@/components/landing/LandingHero";
import { FooterCta } from "@/components/landing/FooterCta";

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-32 px-6 py-20">
          <LandingHero />
          <div className="flex flex-col gap-24">
            <Welcome />
            <MakeFirstRequest />
            <WhereToGoNext />
            <PopularApiEndpoints />
          </div>
          <FooterCta />
          <BottomSection />
        </main>
      </div>
    </SidebarProvider>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
      {children}
    </h2>
  );
}

function Welcome() {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <SectionHeading>Welcome to the UJET Developers</SectionHeading>
      <p className="max-w-3xl text-lg text-muted-foreground">
        The Public API gives your applications programmatic access over HTTPS to your UJET
        contact-center configuration — starting with managing your teams — so you can build,
        automate, and integrate it with your own systems. This portal is where you create and
        manage the API keys your integration authenticates with, and where you&apos;ll find the API
        reference and companion guides for the available Public API endpoints.
      </p>
    </section>
  );
}

const STEPS: { n: number; label: React.ReactNode }[] = [
  {
    n: 1,
    label: (
      <>
        <span className="font-medium">Create an API key</span> in the portal.
      </>
    ),
  },
  {
    n: 2,
    label: (
      <>
        <Link href="/documentation" className="font-medium underline underline-offset-2">
          Exchange your API key for a Bearer token
        </Link>
        .
      </>
    ),
  },
  {
    n: 3,
    label: (
      <>
        <Link
          href="/api-reference/introduction"
          className="font-medium underline underline-offset-2"
        >
          Make your first Public API call
        </Link>{" "}
        using that token.
      </>
    ),
  },
];

function MakeFirstRequest() {
  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <SectionHeading>Make your first authenticated request</SectionHeading>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Three steps take you from creating an API key to your first successful response. The{" "}
          <Link href="/documentation" className="underline underline-offset-2">
            Getting Started with the Public API
          </Link>{" "}
          guide owns the full walkthrough — here&apos;s the shape of it:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-info-subtle text-sm font-medium text-info">
              {step.n}
            </span>
            <p className="text-lg leading-7 text-foreground">{step.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const NEXT_LINKS: { title: string; desc: string; href: string }[] = [
  {
    title: "Getting Started with the Public API",
    desc: "Create your first API key, exchange it for a Bearer token, and make a working call. The full walkthrough for the steps above.",
    href: "/documentation",
  },
  {
    title: "Teams",
    desc: "An oriented map of the Teams resource — what it is, how its endpoints fit together, and the how-tos — that links into the reference rather than repeating it.",
    href: "/documentation",
  },
  {
    title: "API Reference",
    desc: "The exact contract for every endpoint: paths, methods, parameters, request and response schemas, and status codes.",
    href: "/api-reference/introduction",
  },
  {
    title: "Best practices",
    desc: "Cross-cutting behavior to design for: rate limits, error handling and retries, and handling API response changes.",
    href: "/documentation",
  },
];

function WhereToGoNext() {
  return (
    <section className="flex flex-col gap-12">
      <SectionHeading>Where to go next</SectionHeading>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {NEXT_LINKS.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/50"
          >
            <h3 className="text-lg font-medium text-foreground">{link.title}</h3>
            <p className="text-sm text-muted-foreground">{link.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const ENDPOINTS: { method: HttpMethod; path: string; desc: string }[] = [
  { method: "GET", path: "/api/v1/agent_activity_logs", desc: "Set up Basic Auth with subdomain + token, manage keys in Developer Settings." },
  { method: "POST", path: "/apps/api/v1/campaigns/{id}/contacts", desc: "Set up Basic Auth with subdomain + token, manage keys in Developer Settings." },
  { method: "GET", path: "/api/v1/calls", desc: "Set up Basic Auth with subdomain + token, manage keys in Developer Settings." },
  { method: "GET", path: "/api/v1/calls", desc: "Set up Basic Auth with subdomain + token, manage keys in Developer Settings." },
  { method: "POST", path: "/apps/api/v1/campaigns/{id}/contacts", desc: "Set up Basic Auth with subdomain + token, manage keys in Developer Settings." },
];

function PopularApiEndpoints() {
  return (
    <section className="flex flex-col items-center gap-10 text-center">
      <SectionHeading>Popular API Endpoints</SectionHeading>
      <div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
        {ENDPOINTS.map((e, i) => (
          <div
            key={`${e.method}-${e.path}-${i}`}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2">
              <MethodBadge method={e.method} />
              <code className="truncate font-mono text-sm text-foreground">{e.path}</code>
            </div>
            <p className="text-sm text-muted-foreground">{e.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomSection() {
  return (
    <section className="-mt-32 flex flex-col gap-6 pt-10">
      <div className="flex items-center justify-between">
        <UjetLogo />
        <div className="flex items-center gap-2">
          <SocialLink href="#" label="X (Twitter)" Icon={XIcon} />
          <SocialLink href="#" label="GitHub" Icon={GithubIcon} />
          <SocialLink href="#" label="Discord" Icon={DiscordIcon} />
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.82 1.3 3.51 1 .11-.78.42-1.3.76-1.6-2.66-.31-5.46-1.33-5.46-5.94 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.55.12-3.23 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.68.25 2.92.12 3.23.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.62-5.47 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .297z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.075.075 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.349-1.22.645-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.42 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.956 2.42-2.157 2.42zm7.974 0c-1.183 0-2.157-1.086-2.157-2.42 0-1.333.956-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.334-.946 2.42-2.157 2.42z" />
    </svg>
  );
}
