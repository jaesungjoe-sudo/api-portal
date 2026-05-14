import { Phone, UserPlus, Layers, Link2, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";
import { CodeBlock } from "@/components/api-portal/CodeBlock";

const TOC = [
  { id: "what-youll-build", label: "What you'll build" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "step-1", label: "Step 1. Get Phone Number" },
  { id: "step-2", label: "Step 2. Create Agent" },
  { id: "step-3", label: "Step 3. Create Queue" },
  { id: "step-4", label: "Step 4. Assign Agent to Queue" },
  { id: "step-5", label: "Step 5. Make a Test Call" },
  { id: "view-call-data", label: "View your call data" },
  { id: "accomplished", label: "What you accomplished" },
  { id: "continue-learning", label: "Continue learning" },
  { id: "need-help", label: "Need Help?" },
];

const STEP1_REQUEST = `await fetch("https://acme.ujet.cx/apps/api/v1/phone-numbers", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.UJET_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ country_code: "US", type: "test" }),
});`;

const STEP1_RESPONSE = `{
  "phone_number": "+14152223333",
  "formatted": "+1 (415) 222-3333",
  "country_code": "US",
  "expires_at": "2026-05-28T10:00:00Z",
  "status": "active"
}`;

const STEP2_REQUEST = `await fetch("https://acme.ujet.cx/apps/api/v1/agents", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.UJET_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Sales Agent",
    email: "agent@yourcompany.com",
    initial_status: "available",
  }),
});`;

const STEP2_RESPONSE = `{
  "agent_id": "agt_3b8a4e2f",
  "name": "Sales Agent",
  "email": "agent@yourcompany.com",
  "status": "available",
  "created_at": "2026-05-14T10:00:00Z"
}`;

const STEP3_REQUEST = `await fetch("https://acme.ujet.cx/apps/api/v1/queues", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.UJET_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    queues: [
      { name: "Sales",   ivr_key: "1", priority: "high"   },
      { name: "Support", ivr_key: "2", priority: "normal" },
    ],
  }),
});`;

const STEP3_RESPONSE = `{
  "queues": [
    {
      "queue_id": "que_8a3b5c7d",
      "name": "Sales",
      "ivr_key": "1",
      "priority": "high",
      "status": "active"
    },
    {
      "queue_id": "que_9e4f6g8h",
      "name": "Support",
      "ivr_key": "2",
      "priority": "normal",
      "status": "active"
    }
  ]
}`;

const STEP4_REQUEST = `await fetch(
  "https://acme.ujet.cx/apps/api/v1/agents/agt_3b8a4e2f/queues",
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${process.env.UJET_API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      queue_ids: ["que_8a3b5c7d", "que_9e4f6g8h"],
    }),
  }
);`;

const STEP4_RESPONSE = `{
  "agent_id": "agt_3b8a4e2f",
  "assigned_queues": [
    { "queue_id": "que_8a3b5c7d", "name": "Sales",   "ivr_key": "1" },
    { "queue_id": "que_9e4f6g8h", "name": "Support", "ivr_key": "2" }
  ],
  "status": "active"
}`;

export default function TutorialsPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Tutorials" },
      ]}
      title="Tutorials"
      description="Learn how to build a working contact center using UJET APIs. This guide walks you through setting up phone numbers, agents, queues, and making your first inbound call—all in under 5 minutes."
      toc={TOC}
      prev={{ label: "Quick Start", href: "/documentation" }}
      next={{ label: "Inbound Calls", href: "/documentation/inbound-calls" }}
    >
      <DocsSection id="what-youll-build" title="What You'll Build">
        <BuildOverviewCard />
      </DocsSection>

      <DocsSection id="prerequisites" title="Prerequisites">
        <p>Before you begin, make sure you have:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            A UJET account:{" "}
            <a className="underline underline-offset-2 hover:text-foreground" href="#">
              Sign up here
            </a>
          </li>
          <li>
            Your API key:{" "}
            <a className="underline underline-offset-2 hover:text-foreground" href="#">
              Get your API key
            </a>
          </li>
          <li>A phone to test with</li>
          <li>5 minutes</li>
        </ul>
      </DocsSection>

      <NumberedStep id="step-1" number={1} title="Get your phone number">
        <p>
          Every contact center needs a phone number. This endpoint provisions a virtual phone
          number that customers can call to reach your agents.
        </p>
        <CodeBlock title="Request" language="TypeScript" code={STEP1_REQUEST}>
          {STEP1_REQUEST}
        </CodeBlock>
        <CodeBlock title="Response" language="JSON" code={STEP1_RESPONSE}>
          {STEP1_RESPONSE}
        </CodeBlock>
        <WhatYouGet>
          <p>
            Your test phone number is ready to receive calls. The number is valid for 14 days and
            can receive unlimited inbound calls during that period.
          </p>
          <TestPhoneField />
        </WhatYouGet>
      </NumberedStep>

      <NumberedStep id="step-2" number={2} title="Create Agent">
        <p>
          Agents are the people who answer calls in your contact center. This step creates an agent
          account that will be available to handle incoming calls.
        </p>
        <p>
          For this tutorial, the agent will be automatically set to &ldquo;Available&rdquo; status,
          meaning they&apos;re ready to receive calls immediately.
        </p>
        <CodeBlock title="Request" language="TypeScript" code={STEP2_REQUEST}>
          {STEP2_REQUEST}
        </CodeBlock>
        <CodeBlock title="Response" language="JSON" code={STEP2_RESPONSE}>
          {STEP2_RESPONSE}
        </CodeBlock>
        <WhatYouGet>
          <p>Your agent is now created and ready to handle calls:</p>
          <AgentCard
            name="Agent: Sales Agent"
            description="Email: agent@yourcompany.com"
          />
        </WhatYouGet>
      </NumberedStep>

      <NumberedStep id="step-3" number={3} title="Create Queue">
        <p>
          Queues organize incoming calls and route them to the right agents. When callers dial
          your number, they&apos;ll hear an IVR menu asking them to press a number (e.g.,
          &ldquo;Press 1 for Sales, Press 2 for Support&rdquo;).
        </p>
        <p>
          Each queue corresponds to one menu option. You can create up to 9 queues (one for each
          digit 1-9).
        </p>
        <CodeBlock title="Request" language="TypeScript" code={STEP3_REQUEST}>
          {STEP3_REQUEST}
        </CodeBlock>
        <CodeBlock title="Response" language="JSON" code={STEP3_RESPONSE}>
          {STEP3_RESPONSE}
        </CodeBlock>
        <WhatYouGet>
          <p>Your IVR menu is now configured. When callers dial your number, they&apos;ll hear:</p>
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
            <p>&ldquo;Press 1 for Sales&rdquo;</p>
            <p>&ldquo;Press 2 for Support&rdquo;</p>
          </div>
          <p className="text-sm">
            The <code className="font-mono text-xs">ivr_key</code> determines which number callers
            press to reach each queue.
          </p>
        </WhatYouGet>
      </NumberedStep>

      <NumberedStep id="step-4" number={4} title="Assign agent to queue">
        <p>
          Now that you have an agent and queues, you need to connect them. This step assigns your
          agent to one or more queues, allowing them to receive calls from those queues.
        </p>
        <p>
          An agent can be assigned to multiple queues and will receive calls from all assigned
          queues based on availability and priority.
        </p>
        <CodeBlock title="Request" language="TypeScript" code={STEP4_REQUEST}>
          {STEP4_REQUEST}
        </CodeBlock>
        <CodeBlock title="Response" language="JSON" code={STEP4_RESPONSE}>
          {STEP4_RESPONSE}
        </CodeBlock>
        <WhatYouGet>
          <p>Your agent is now assigned to handle calls from both queues:</p>
          <AgentCard
            name="Agent: Sales Agent"
            description={
              <>
                Assigned to:
                <br />
                Sales (Press 1)
                <br />
                Support (Press 2)
              </>
            }
          />
          <p className="text-sm">
            When a caller presses 1 or 2, the call will be routed to this agent.
          </p>
        </WhatYouGet>
      </NumberedStep>

      <NumberedStep id="step-5" number={5} title="Make a test call">
        <p>
          Your contact center is now fully configured! Time to test it with a real phone call.
        </p>
        <div className="flex flex-col gap-4 rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              1. Call your number. Your Contact Center is Live.
            </h4>
            <Badge variant="success">Ready</Badge>
          </div>
          <TestPhoneField />
          <Divider />
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              2. You&apos;ll hear the greeting:
            </h4>
            <p className="text-sm text-muted-foreground">
              &ldquo;Welcome to [Your Project Name]. Press 1 for Sales. Press 2 for Support.&rdquo;
            </p>
          </div>
          <Divider />
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              3. You&apos;ll hear a deflection message:
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              &ldquo;Thank you for calling Sales. All agents are currently busy. Please try again
              later. Goodbye.&rdquo;
            </p>
            <Callout title="Why deflection?">
              In this tutorial, we&apos;re demonstrating call deflection — a common pattern where
              calls are handled by an automated message instead of connecting to a live agent.
            </Callout>
          </div>
          <Divider />
          <h4 className="text-sm font-semibold text-foreground">
            4. The call ends automatically
          </h4>
        </div>
      </NumberedStep>

      <DocsSection id="view-call-data" title="View your call data">
        <p>After completing the test call, you can view the call details in your Dashboard:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Call duration</li>
          <li>Queue selected</li>
          <li>Timestamp</li>
          <li>Estimated cost</li>
        </ul>
      </DocsSection>

      <DocsSection id="accomplished" title="What you accomplished">
        <p>You&apos;ve successfully built a working contact center! Here&apos;s what you did:</p>
        <ul className="ml-1 space-y-1 text-foreground">
          <li>✓ Provisioned a phone number</li>
          <li>✓ Created an agent</li>
          <li>✓ Set up IVR queues</li>
          <li>✓ Assigned agents to queues</li>
          <li>✓ Tested with a live call</li>
        </ul>
      </DocsSection>

      <DocsSection id="continue-learning" title="Continue learning">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <span className="font-medium text-foreground">Connect calls to live agents</span> —
            Route calls to human agents instead of deflection
          </li>
          <li>
            <span className="font-medium text-foreground">Customize IVR messages</span> — Change
            greeting and menu prompts
          </li>
          <li>
            <span className="font-medium text-foreground">Add SMS support</span> — Handle text
            messages in addition to calls
          </li>
          <li>
            <span className="font-medium text-foreground">View API Reference</span> — Explore all
            available endpoints
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="need-help" title="Need Help?">
        <ul className="ml-5 list-disc space-y-1">
          <li>
            <a className="underline underline-offset-2 hover:text-foreground" href="#">
              Join our community
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-foreground" href="#">
              Contact support
            </a>
          </li>
          <li>
            <a className="underline underline-offset-2 hover:text-foreground" href="#">
              Browse documentation
            </a>
          </li>
        </ul>
      </DocsSection>
    </DocsPageShell>
  );
}

/* ─── Inline page components ─────────────────────────────────────────── */

function BuildOverviewCard() {
  const setupSteps = [
    { icon: Phone, label: "Step 1. Get Phone Number", sub: "Obtain a contact number" },
    { icon: UserPlus, label: "Step 2. Create Agent", sub: "Add your first AI agent" },
    { icon: Layers, label: "Step 3. Create Queue", sub: "Set up call routing" },
    { icon: Link2, label: "Step 4. Assign Agent to Queue", sub: "Connect agent with queue" },
  ];
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-background p-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-foreground">
          Build Your First AI Contact Center in Minutes
        </h3>
        <p className="text-sm text-muted-foreground">
          By the end of this tutorial, you&apos;ll have:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          <li>A working phone number that can receive calls</li>
          <li>An agent configured to handle calls</li>
          <li>Call queues with IVR menu routing</li>
          <li>A live test call flowing through your system</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Setup
        </span>
        <div className="flex flex-col gap-2">
          {setupSteps.map((s) => (
            <StepRow
              key={s.label}
              Icon={s.icon}
              label={s.label}
              sub={s.sub}
              tone="highlight"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live demo
        </span>
        <StepRow
          Icon={PhoneCall}
          label="Step 5. Make a Test Call"
          sub="Test your contact center"
          tone="success"
        />
      </div>
    </div>
  );
}

function StepRow({
  Icon,
  label,
  sub,
  tone,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  tone: "highlight" | "success";
}) {
  const rowClass =
    tone === "highlight"
      ? "border-highlight-border bg-highlight-subtle"
      : "border-success-border bg-success-subtle";
  return (
    <div className={`flex items-center gap-3 rounded-lg border ${rowClass} px-3 py-3`}>
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

function NumberedStep({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-highlight-subtle text-sm font-semibold text-highlight">
          {number}
        </span>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex flex-col gap-4 text-base leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function WhatYouGet({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-4">
      <h4 className="text-sm font-semibold text-foreground">What you get</h4>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function TestPhoneField() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">Test Phone Number</label>
      <div className="flex h-9 items-center rounded-md border border-input bg-background px-3 font-mono text-sm text-foreground">
        +1 (415) 222-3333
      </div>
    </div>
  );
}

function AgentCard({
  name,
  description,
}: {
  name: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border bg-background p-3">
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-info-border bg-info-subtle p-3">
      <p className="mb-1 text-sm font-semibold text-info">{title}</p>
      <p className="text-sm text-info">{children}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border" />;
}
