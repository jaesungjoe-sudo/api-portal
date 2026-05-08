import { Phone, Network, Headset, MessageSquareMore } from "lucide-react";
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";

const TOC = [
  { id: "about", label: "About This Documentation" },
  { id: "what-you-find", label: "What You'll Find Here" },
  { id: "how-to-use", label: "How to Use This Documentation" },
  { id: "quick-links", label: "Quick Links" },
  { id: "need-help", label: "Need Help?" },
];

const FEATURES = [
  {
    icon: Phone,
    title: "Calls",
    desc: "Learn how to handle inbound and outbound calls, configure call routing, and manage call recordings.",
  },
  {
    icon: Network,
    title: "Queues",
    desc: "Understand queue structures, configure queue settings, and set up IVR menus for automated call routing.",
  },
  {
    icon: Headset,
    title: "Agents",
    desc: "Manage agent statuses, handle bulk user operations, and optimize agent workflows.",
  },
  {
    icon: MessageSquareMore,
    title: "Chat",
    desc: "Integrate SMS and chat capabilities into your customer communication channels.",
  },
];

const QUICK_LINKS = [
  { label: "API Reference", desc: "Explore all available API endpoints", href: "#" },
  { label: "Playground", desc: "Test APIs interactively", href: "/" },
  { label: "Calls Guide", desc: "Learn about call management", href: "/documentation/inbound-calls" },
  { label: "Queue Setup", desc: "Configure your queues", href: "/documentation/queues" },
];

export default function QuickStartPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Quick Start" },
      ]}
      title="Quick Start"
      description="Welcome to the UJET Developer Portal! This documentation will guide you through integrating UJET Contact Center capabilities into your applications."
      toc={TOC}
      next={{ label: "Inbound Calls", href: "/documentation/inbound-calls" }}
    >
      <DocsSection id="about" title="About This Documentation">
        <p>
          This documentation provides comprehensive guides on how to use UJET&apos;s Contact Center
          features including call management, queue configuration, agent management, and chat
          functionality.
        </p>
      </DocsSection>

      <DocsSection id="what-you-find" title="What You'll Find Here">
        <div className="flex flex-col gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-info" />
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              </div>
              <p className="text-base text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection id="how-to-use" title="How to Use This Documentation">
        <ol className="list-inside list-decimal space-y-2">
          <li>
            <span className="font-medium text-foreground">Read the Guides</span> — Start with the
            topic relevant to your use case (Calls, Queues, Agents, or Chat)
          </li>
          <li>
            <span className="font-medium text-foreground">Check API Reference</span> — Review the
            technical API specifications and endpoints
          </li>
          <li>
            <span className="font-medium text-foreground">Try the Playground</span> — Test API calls
            interactively without writing code
          </li>
          <li>
            <span className="font-medium text-foreground">Integrate</span> — Implement the APIs into
            your application
          </li>
        </ol>
      </DocsSection>

      <DocsSection id="quick-links" title="Quick Links">
        <ul className="space-y-2">
          {QUICK_LINKS.map(({ label, desc, href }) => (
            <li key={label} className="flex items-baseline gap-3">
              <a
                href={href}
                className="shrink-0 text-foreground underline underline-offset-4 hover:text-brand"
              >
                {label}
              </a>
              <span className="text-muted-foreground">{desc}</span>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection id="need-help" title="Need Help?">
        <ul className="list-inside list-disc space-y-2">
          <li>
            Browse{" "}
            <a href="#" className="text-foreground underline underline-offset-4 hover:text-brand">
              API Reference
            </a>{" "}
            for technical specifications
          </li>
          <li>
            Try the{" "}
            <a href="/" className="text-foreground underline underline-offset-4 hover:text-brand">
              Playground
            </a>{" "}
            for hands-on testing
          </li>
          <li>
            Contact support at{" "}
            <a
              href="mailto:support@ujet.cx"
              className="text-foreground underline underline-offset-4 hover:text-brand"
            >
              support@ujet.cx
            </a>
          </li>
        </ul>
      </DocsSection>
    </DocsPageShell>
  );
}
