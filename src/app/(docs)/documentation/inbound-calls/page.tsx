import { Badge } from "@/components/ui/badge";
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

const TOC = [
  { id: "when-to-use", label: "When to use Inbound calls" },
  { id: "how-it-works", label: "How it works" },
  { id: "call-flow", label: "Call flow" },
  { id: "call-statuses", label: "Call statuses" },
  { id: "related-api", label: "Related API endpoints" },
];

const CALL_STATUSES = [
  { status: "selecting", description: "Customer is navigating IVR menu" },
  { status: "queued", description: "Call is waiting for an agent" },
  { status: "assigned", description: "Agent is selected to receive the call" },
  { status: "connected", description: "Agent and customer are on the call" },
  { status: "finished", description: "Call ended after connection" },
];

const CODE_SAMPLE = `console.log "oO08 iIlL1 g9qCGQ ~-+=>";

function updateGutters(cm) {
    var gutters = cm.display.gutters,
        __specs = cm.options.gutters;

    removeChildren(gutters);

    for (var i = 0; i < __specs.length; ++i) {
        var gutterClass = __specs[i];
        var gElt = gutters.appendChild(
            elt(
                "div",
                null,
                "CodeMirror-gutter " + gutterClass
            )
        );
        if (gutterClass == "CodeMirror-linenumbers") {
            cm.display.lineGutter = gElt;
            gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
        }
    }
}`;

export default function InboundCallsPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Inbound Calls" },
      ]}
      title="Inbound Calls"
      description="Handle inbound calls from customers through IVR menus and queues."
      toc={TOC}
      prev={{ label: "Quick Start", href: "/documentation" }}
      next={{ label: "Outbound Calls", href: "/documentation/outbound-calls" }}
    >
      <p className="text-base text-muted-foreground">
        Inbound calls allow your contact center to accept phone calls from customers. Each call is
        automatically routed through IVR menus to the appropriate queue where agents can answer.
      </p>

      <DocsSection id="when-to-use" title="When to use Inbound calls">
        <p>Use Inbound calls when you need to:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>Accept customer calls to your support or sales lines</li>
          <li>Route callers through IVR menus to the right department</li>
          <li>Automatically handle overflow with deflection options (voicemail, callback, etc.)</li>
        </ul>
      </DocsSection>

      <DocsSection id="how-it-works" title="How it works">
        <p>When a customer calls your UJET phone number:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>IVR Menu — Customer hears options: &ldquo;Press 1 for Sales, Press 2 for Support…&rdquo;</li>
          <li>Queue Routing — Based on selection, call is routed to the appropriate queue</li>
          <li>Agent Assignment — Available agents receive the call</li>
          <li>Deflection — If no agents are available, deflection options are triggered automatically</li>
        </ol>
      </DocsSection>

      <DocsSection id="call-flow" title="Call flow">
        <CodeBlock title="Create Queue" language="TypeScript" code={CODE_SAMPLE} />
      </DocsSection>

      <DocsSection id="call-statuses" title="Call statuses">
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-sm font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-sm font-semibold text-foreground">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CALL_STATUSES.map(({ status, description }) => (
                <TableRow key={status}>
                  <TableCell>
                    <Badge className="rounded-full border-0 bg-destructive-subtle px-2.5 font-normal text-destructive hover:bg-destructive-subtle">
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DocsSection>

      <DocsSection id="related-api" title="Related API endpoints">
        <ul className="space-y-3">
          <li className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-foreground">GET /apps/api/v1/calls</span>
            <span className="text-muted-foreground">—</span>
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              List all calls
            </a>
          </li>
          <li className="flex items-baseline gap-2">
            <span className="font-mono text-sm text-foreground">GET /apps/api/v1/calls/:id</span>
            <span className="text-muted-foreground">—</span>
            <a href="#" className="text-foreground underline-offset-4 hover:underline">
              Get call details
            </a>
          </li>
        </ul>
      </DocsSection>
    </DocsPageShell>
  );
}
