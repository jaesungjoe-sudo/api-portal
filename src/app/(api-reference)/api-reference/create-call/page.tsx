import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";
import { CodeBlock } from "@/components/api-portal/CodeBlock";
import { MethodBadge, CodeBadge } from "@/components/api-portal/MethodBadge";
import { ArrowUpDown } from "lucide-react";

const TOC = [
  { id: "authentication", label: "Authentication" },
  { id: "body-parameters", label: "Body Parameters" },
  { id: "request", label: "Request" },
  { id: "response", label: "Response" },
  { id: "notes", label: "Notes" },
  { id: "related-api", label: "Related API endpoints" },
  { id: "related-docs", label: "Related Documentation" },
];

const HEADERS = [
  { name: "Authorization", value: "Bearer {API_KEY}", required: true },
  { name: "Content-Type", value: "application/json", required: true },
];

const BODY_PARAMS = [
  {
    name: "identifier",
    type: "string",
    required: true,
    description: "Unique customer identifier (e.g. phone number or external id)",
  },
  {
    name: "phone_number",
    type: "string",
    required: true,
    description: "Customer phone number in E.164 format (e.g. +14155552671)",
  },
  {
    name: "name",
    type: "string",
    required: false,
    description: "Customer display name shown to the agent",
  },
  {
    name: "menu_selection",
    type: "string",
    required: false,
    description: "Initial IVR menu choice (skip IVR navigation step)",
  },
  {
    name: "metadata",
    type: "object",
    required: false,
    description: "Custom key-value metadata attached to the call",
  },
];

const RESPONSE_FIELDS = [
  { name: "id", type: "string", description: "Unique call identifier" },
  { name: "status", type: "string", description: "Current call status (see below)" },
  { name: "identifier", type: "string", description: "Customer identifier echoed back" },
  { name: "phone_number", type: "string", description: "Phone number echoed back" },
  { name: "created_at", type: "string", description: "ISO 8601 creation timestamp" },
  { name: "updated_at", type: "string", description: "ISO 8601 last update timestamp" },
];

const STATUSES = [
  { status: "selecting", description: "Customer is navigating IVR menu" },
  { status: "queued", description: "Call is waiting for an agent" },
  { status: "assigned", description: "Agent is selected to receive the call" },
  { status: "connected", description: "Agent and customer are on the call" },
  { status: "finished", description: "Call ended after connection" },
];

const SUCCESS_RESPONSE = `{
  "id": "call_8f3c9d7e2b1a",
  "status": "selecting",
  "identifier": "customer_42",
  "phone_number": "+14155552671",
  "menu_selection": null,
  "metadata": {
    "source": "mobile_app",
    "region": "us-west"
  },
  "created_at": "2026-05-13T09:24:11Z",
  "updated_at": "2026-05-13T09:24:11Z"
}`;

const POLLING_EXAMPLE = `import { setTimeout as wait } from "node:timers/promises";

async function pollCall(callId: string, apiKey: string) {
  while (true) {
    const res = await fetch(
      \`https://acme.ujet.cx/apps/api/v1/calls/\${callId}\`,
      { headers: { Authorization: \`Bearer \${apiKey}\` } }
    );
    const call = await res.json();
    console.log(call.status);
    if (call.status === "finished") return call;
    await wait(2000);
  }
}

pollCall("call_8f3c9d7e2b1a", process.env.UJET_API_KEY!);`;

export default function CreateCallPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/create-call" },
        { label: "Create Call" },
      ]}
      title="Create Call"
      description="Create an inbound call for testing or integration purposes."
      toc={TOC}
      next={{ label: "Get Call", href: "/api-reference/get-call" }}
    >
      <PostBadge />

      <DocsSection id="authentication" title="Endpoint">
        <EndpointCard method="POST" url="https://{subdomain}.ujet.cx/apps/api/v1/calls" />
        <p className="text-base text-foreground">
          <span className="font-medium">Authentication</span>{" "}
          <span className="text-muted-foreground">Bearer token (Apps API key)</span>
        </p>
      </DocsSection>

      <DocsSection id="request" title="Request Structure">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-foreground">Headers</h3>
            <ParamTable
              columns={["Header", "Value", "Required"]}
              rows={HEADERS.map((h) => [
                <CodeBadge key="n">{h.name}</CodeBadge>,
                <CodeBadge key="v">{h.value}</CodeBadge>,
                h.required ? "Required" : "Optional",
              ])}
            />
          </div>

          <div id="body-parameters" className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-foreground">Body Parameters</h3>
            <ParamTable
              columns={["Parameter", "Type", "Required", "Description"]}
              rows={BODY_PARAMS.map((p) => [
                <CodeBadge key="n">{p.name}</CodeBadge>,
                <span key="t" className="text-sm text-muted-foreground">
                  {p.type}
                </span>,
                p.required ? "Required" : "Optional",
                <span key="d" className="text-sm text-muted-foreground">
                  {p.description}
                </span>,
              ])}
            />
          </div>
        </div>
      </DocsSection>

      <DocsSection id="response" title="Response Structure">
        <CodeBlock title="Success Response" language="TypeScript" code={SUCCESS_RESPONSE}>
          {SUCCESS_RESPONSE}
        </CodeBlock>
      </DocsSection>

      <div id="response-fields" className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-foreground">Response Fields</h2>
        <ParamTable
          columns={["Field", "Type", "Description"]}
          rows={RESPONSE_FIELDS.map((f) => [
            <CodeBadge key="n">{f.name}</CodeBadge>,
            <span key="t" className="text-sm text-muted-foreground">
              {f.type}
            </span>,
            <span key="d" className="text-sm text-muted-foreground">
              {f.description}
            </span>,
          ])}
        />
      </div>

      <DocsSection id="lifecycle" title="Call Lifecycle">
        <p>
          Understanding the call lifecycle is critical for handling asynchronous operations in
          contact center integrations.
        </p>
        <LifecycleDiagram />
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-base font-semibold text-foreground">Status Definitions</h3>
          <ParamTable
            columns={["Status", "Description"]}
            rows={STATUSES.map((s) => [
              <CodeBadge key="s">{s.status}</CodeBadge>,
              <span key="d" className="text-sm text-muted-foreground">
                {s.description}
              </span>,
            ])}
          />
        </div>
      </DocsSection>

      <DocsSection id="monitoring" title="Monitoring State Changes">
        <p>
          To track call progress, poll the{" "}
          <Link
            href="/api-reference/get-call"
            className="underline underline-offset-2 hover:text-foreground"
          >
            GET /apps/api/v1/calls/:id
          </Link>{" "}
          endpoint or use webhooks (if configured):
        </p>
        <CodeBlock title="Polling Example" language="TypeScript" code={POLLING_EXAMPLE}>
          {POLLING_EXAMPLE}
        </CodeBlock>
      </DocsSection>

      <DocsSection id="notes" title="Notes">
        <p>
          This endpoint creates a call object that simulates an inbound call for testing or
          integration purposes. For production inbound calls, customers typically dial your UJET
          phone number directly. The call will be routed through the IVR menu and queue based on
          your configuration. Deflection will occur automatically if no agents are available.
        </p>
      </DocsSection>

      <DocsSection id="related-api" title="Related API endpoints">
        <RelatedEndpoint
          method="GET"
          name="Get Call"
          description="Retrieve call status and details"
          href="/api-reference/get-call"
        />
        <RelatedEndpoint
          method="PATCH"
          name="Update Call"
          description="Update call status or end the call"
          href="/api-reference/update-call"
        />
      </DocsSection>

      <DocsSection id="related-docs" title="Related Documentation">
        <RelatedDoc
          title="Inbound Calls Guide"
          description="Learn about the inbound call flow"
          href="/documentation/inbound-calls"
        />
        <RelatedDoc
          title="IVR Menu Setup"
          description="Configure IVR menus"
          href="/documentation/ivr-menu"
        />
        <RelatedDoc
          title="Authentication"
          description="API authentication guide"
          href="/documentation"
        />
      </DocsSection>
    </DocsPageShell>
  );
}

function PostBadge() {
  return (
    <div className="-mt-6">
      <MethodBadge method="POST" />
    </div>
  );
}

function EndpointCard({ method, url }: { method: "POST" | "GET" | "PATCH" | "PUT" | "DELETE"; url: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
      <MethodBadge method={method} />
      <code className="font-mono text-sm text-foreground">{url}</code>
    </div>
  );
}

function ParamTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>
                <span className="flex items-center gap-1 text-foreground">
                  {col}
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" aria-hidden />
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RelatedEndpoint({
  method,
  name,
  description,
  href,
}: {
  method: "POST" | "GET" | "PATCH" | "PUT" | "DELETE";
  name: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-md border border-border bg-background px-4 py-3 transition-colors hover:bg-accent"
    >
      <MethodBadge method={method} />
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className="text-sm text-muted-foreground">{description}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
    </Link>
  );
}

function RelatedDoc({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-md border border-border bg-background px-4 py-3 transition-colors hover:bg-accent"
    >
      <span className="text-sm font-medium text-foreground underline underline-offset-2">
        {title}
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden />
    </Link>
  );
}

function LifecycleDiagram() {
  // Placeholder lifecycle diagram — visual flow of call statuses
  const steps = [
    { status: "created", subtitle: "Call object created via API", method: "POST" as const },
    { status: "selecting", subtitle: "Customer navigating IVR menu" },
    { status: "queued", subtitle: "Waiting for available agent" },
    { status: "assigned", subtitle: "" },
    { status: "connected", subtitle: "" },
    { status: "finished", subtitle: "Call ended" },
  ];
  return (
    <div className="rounded-md border border-border bg-muted/30 p-6">
      <div className="flex flex-wrap items-start gap-3">
        {steps.map((s, i) => (
          <div key={s.status} className="flex items-start gap-3">
            <div className="flex w-28 flex-col items-center gap-2 rounded-md border border-border bg-background px-3 py-3 text-center">
              <span className="text-xs font-medium text-foreground">{s.status}</span>
              {s.subtitle && (
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {s.subtitle}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="mt-6 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
