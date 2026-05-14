import Image from "next/image";
import Link from "next/link";
import { Phone, UserPlus, Layers, Link2, PhoneCall, Play } from "lucide-react";
import { TopNav } from "@/components/api-portal/TopNav";
import { UjetLogo } from "@/components/api-portal/UjetLogo";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeMetricsChart } from "@/components/api-portal/HomeMetricsChart";

const STEP_ITEMS = [
  { icon: Phone, label: "Step 1. Get Phone Number", sub: "Obtain a contact number" },
  { icon: UserPlus, label: "Step 2. Create Agent", sub: "Add your first AI agent" },
  { icon: Layers, label: "Step 3. Create Queue", sub: "Set up call routing" },
  { icon: Link2, label: "Step 4. Assign Agent to Queue", sub: "Connect agent with queue" },
  { icon: PhoneCall, label: "Step 5. Make a Test Call", sub: "Test your contact center" },
];

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <TopNav />
        <main className="mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-32 px-6 py-20">
          <Hero />
          <TutorialSection />
          <CodeSection />
          <MetricsSection />
          <DocumentationSection />
          <FooterCta />
          <BottomSection />
        </main>
      </div>
    </SidebarProvider>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center text-center">
      <HeroDecoration />
      <h1 className="mt-10 max-w-[760px] text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
        The standard for Communication API.
      </h1>
      <p className="mt-6 max-w-[480px] text-base text-muted-foreground">
        UJET provides the most sophisticated and fastest API infrastructure built for developers.
      </p>
      <div className="mt-8 flex items-center gap-2">
        <Link href="/api-keys">
          <Button>Get Started</Button>
        </Link>
        <Link href="/documentation">
          <Button variant="outline">Documentation</Button>
        </Link>
      </div>
    </section>
  );
}

function HeroDecoration() {
  // Figma 1630:29682 — Untitled@1-2528x1275 (1) 1 (RECTANGLE with IMAGE fill, exported @2x).
  return (
    <Image
      src="/hero-isometric.png"
      alt=""
      width={261}
      height={257}
      priority
      className="h-[257px] w-[261px] object-contain"
    />
  );
}

function TutorialSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <h2 className="text-4xl font-semibold leading-tight text-foreground">
          Build your Contact Center in 5 minutes
        </h2>
        <Link href="/documentation/tutorials" className="w-fit">
          <Button>View Tutorials</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <h3 className="text-base font-semibold text-foreground">
          Build Your First AI Contact Center in Minutes
        </h3>
        <div className="flex flex-col gap-2">
          {STEP_ITEMS.map((step, i) => (
            <StepRow
              key={step.label}
              Icon={step.icon}
              label={step.label}
              sub={step.sub}
              highlighted={i === 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepRow({
  Icon,
  label,
  sub,
  highlighted,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${
        highlighted ? "border-info-border" : "border-border"
      }`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
        <Icon className="h-5 w-5 text-foreground" />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </div>
  );
}

function CodeSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        First-class
        <br />
        developer experience
      </h2>
      <p className="mt-6 max-w-[640px] text-base text-muted-foreground">
        We are a team of engineers who love building tools for other engineers. Our goal is to
        create the AI Contact Center platform we&apos;ve always wished we had — one that just
        works.
      </p>
      <div className="mt-12 w-full overflow-hidden rounded-md border border-border bg-card text-left">
        <div className="flex h-12 items-center border-b border-border px-4">
          <span className="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            script.js
          </span>
        </div>
        <div className="px-4 py-8">
          <pre className="m-0 font-mono text-sm text-foreground">
            <code>console.log(&apos;Hello, world!&apos;);</code>
          </pre>
        </div>
        <div className="flex h-12 items-center justify-between border-t border-border px-4">
          <span className="text-xs text-muted-foreground">Line 1, Column 1</span>
          <button
            type="button"
            className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
          >
            Execute
            <Play className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        Real-time Metrics
      </h2>
      <p className="mt-6 max-w-[680px] text-base text-muted-foreground">
        Usage tracking based on monetization models. Precision settlement systems for scalable
        enterprise billing.
      </p>
      <HomeMetricsChart />
    </section>
  );
}

function DocumentationSection() {
  const links = [
    { label: "Documentation", href: "/documentation" },
    { label: "API Reference", href: "/api-reference/create-call" },
    { label: "Dashboard", href: "/analytics" },
  ];
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="text-4xl font-semibold leading-tight text-foreground md:text-5xl">
        Documentation
      </h2>
      <p className="mt-6 max-w-[680px] text-base text-muted-foreground">
        Meet the next generation of documentation. AI-native and built for developers and teams.
      </p>
      <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="group flex flex-col gap-4 rounded-3xl bg-muted/40 p-6 transition-colors hover:bg-muted"
          >
            <div className="h-[280px] rounded-2xl bg-muted/60" aria-hidden />
            <span className="text-base font-medium text-foreground">{l.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FooterCta() {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="max-w-[680px] text-4xl font-semibold leading-tight text-foreground md:text-5xl">
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
    </section>
  );
}

function BottomSection() {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-10">
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
