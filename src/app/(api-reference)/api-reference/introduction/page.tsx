import Link from "next/link";
import { DocsPageShell, DocsSection } from "@/components/api-portal/DocsPageShell";

const linkClass = "text-foreground underline underline-offset-4 hover:text-brand";

const TOC = [
  { id: "what-it-covers", label: "What the reference covers" },
  { id: "using-the-reference", label: "Using the reference" },
  { id: "where-to-go-next", label: "Where to go next" },
];

export default function IntroductionPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/introduction" },
        { label: "Introduction" },
      ]}
      title="Introduction"
      description="The API reference is the complete, authoritative contract for the UJET Public API. It documents every endpoint currently available under /public/api/v1 — paths, methods, parameters, request and response schemas, status codes, and example payloads. Reach for it whenever you need exact, endpoint-level detail; the companion pages in this portal explain the behavior a contract alone can't (see Where to go next)."
      toc={TOC}
      next={{ label: "Create Call", href: "/api-reference/create-call" }}
    >
      <DocsSection id="what-it-covers" title="What the reference covers">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Every endpoint, grouped by resource.</span>{" "}
            Operations are organized by the resource they act on — for example, Authentication and
            Teams — with more added as new resources ship.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Parameters, request bodies, and response schemas
            </span>{" "}
            for each operation, with example payloads you can copy.
          </li>
          <li>
            <span className="font-medium text-foreground">All status codes per operation,</span>{" "}
            including the error responses your integration should handle.
          </li>
          <li>
            <span className="font-medium text-foreground">Authentication and base URL,</span>{" "}
            described once and applied across every endpoint.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="using-the-reference" title="Using the reference">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Authentication is global.</span> Every
            endpoint expects a short-lived Bearer token (a JWT) in the Authorization header — the one
            exception is the token-exchange endpoint that issues it. The full flow lives in Getting
            Started with the Public API.
          </li>
          <li>
            <span className="font-medium text-foreground">Base URL.</span> Requests go to your
            tenant&apos;s base URL followed by /public/api/v1; see the base-URL guidance in Getting
            Started.
          </li>
          <li>
            <span className="font-medium text-foreground">Standards-based.</span> The reference
            follows the OpenAPI 3.0 specification, the standard format for describing REST APIs.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="where-to-go-next" title="Where to go next">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <Link href="/documentation" className={`font-medium ${linkClass}`}>
              Getting Started with the Public API
            </Link>{" "}
            — Create an API key, exchange it for a Bearer token, and make your first call.
          </li>
          <li>
            <span className="font-medium text-foreground">Teams</span> — An oriented map of the
            Teams resource — what it is, how its endpoints fit together, and the how-tos — that links
            into the reference rather than repeating it.
          </li>
          <li>
            <span className="font-medium text-foreground">Best practices</span> — Cross-cutting
            behavior to design for: rate limits, error handling and retries, and handling API
            response changes.
          </li>
        </ul>
      </DocsSection>
    </DocsPageShell>
  );
}
