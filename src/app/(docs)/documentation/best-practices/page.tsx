import type { ReactNode } from "react";
import Link from "next/link";
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
  { id: "rate-limits", label: "Rate limits" },
  { id: "error-handling", label: "Error handling and retries" },
  { id: "response-changes", label: "Handling API response changes" },
  { id: "pagination", label: "Pagination and filtering" },
];

/** Inline code chip — typography.md `code-inline` role. */
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  );
}

const RATE_LIMIT_429 = `HTTP/1.1 429 Too Many Requests
Content-Type: application/json
x-ratelimit-limit: 10, 10;w=1
x-ratelimit-remaining: 0
x-ratelimit-reset: 1`;

const ERROR_BODY = `{ "message": "Name has already been taken" }`;

const STATUS_ROWS: { code: string; meaning: string; retry: ReactNode }[] = [
  {
    code: "401",
    meaning: "The Bearer token is missing, invalid, or expired.",
    retry: <>No — get a fresh token (exchange your API key again), then retry.</>,
  },
  {
    code: "404",
    meaning:
      "The resource doesn't exist, or the Public API isn't enabled / the host didn't resolve to your tenant.",
    retry: <>No — fix the request or the base URL.</>,
  },
  {
    code: "409",
    meaning: "The request conflicts with the resource's current state (e.g., deleting a protected team).",
    retry: <>No — resolve the conflict first.</>,
  },
  {
    code: "422",
    meaning: "Validation failed (missing, duplicate, or invalid fields).",
    retry: <>No — fix the request body.</>,
  },
  {
    code: "429",
    meaning: "Per-tenant rate limit exceeded.",
    retry: (
      <>
        Yes — after <Code>x-ratelimit-reset</Code>.
      </>
    ),
  },
  {
    code: "503",
    meaning:
      "A temporary, transient condition — for example, a briefly unavailable backend or a resource momentarily locked by another in-flight change.",
    retry: <>Yes — with backoff.</>,
  },
  {
    code: "5xx",
    meaning: "Unexpected server error.",
    retry: <>Yes — with backoff, for idempotent requests.</>,
  },
];

export default function BestPracticesPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Best Practices" },
      ]}
      title="Best Practices"
      toc={TOC}
      prev={{ label: "Getting Started", href: "/documentation" }}
      next={{ label: "API Reference", href: "/api-reference/introduction" }}
    >
      <p className="text-base text-muted-foreground">
        This page covers cross-cutting guidance for building a robust integration: staying within rate
        limits, handling errors and retries, and tolerating additive API changes. For per-endpoint
        contracts, see the{" "}
        <Link
          href="/api-reference/introduction"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          API reference
        </Link>
        ; to get your first call working, see{" "}
        <Link
          href="/documentation"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          Getting Started with the Public API
        </Link>
        .
      </p>

      <DocsSection id="rate-limits" title="Rate limits">
        <p>
          The Public API applies a per-tenant rate limit of <strong>10 requests per second</strong>. The
          limit is shared across all of your tenant&apos;s API keys — it&apos;s per tenant, not per key.
        </p>
        <p>
          Every response carries rate-limit headers, so you can track your remaining quota without waiting
          for a rejection:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <Code>x-ratelimit-limit</Code> — the per-second quota. It also carries the quota-policy form{" "}
            <Code>{"<limit>, <limit>;w=<window>"}</Code> — for example, <Code>10, 10;w=1</Code> means 10
            requests per 1-second window.
          </li>
          <li>
            <Code>x-ratelimit-remaining</Code> — requests left in the current window.
          </li>
          <li>
            <Code>x-ratelimit-reset</Code> — seconds until the current window resets (a countdown in
            seconds, <strong>not</strong> a timestamp).
          </li>
        </ul>
        <p>
          When you exceed the limit, the API responds with <Code>429 Too Many Requests</Code>:
        </p>
        <CodeBlock title="Response" language="http" code={RATE_LIMIT_429} />
        <p>
          <strong>Throttle proactively:</strong> if your integration does bulk provisioning or
          synchronization, pace requests client-side rather than relying on <Code>429</Code> responses as
          flow control.
        </p>
        <p>
          <strong>To stay within the limit:</strong>
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Keep your request rate at or below 10 RPS for the tenant.</li>
          <li>
            Watch <Code>x-ratelimit-remaining</Code> on every response and ease off before it reaches zero.
          </li>
          <li>
            On a <Code>429</Code>, wait <Code>x-ratelimit-reset</Code> seconds before retrying, and use
            exponential backoff with jitter if it persists.
          </li>
          <li>Spread bulk work (for example, provisioning many teams) over time instead of bursting.</li>
        </ul>
      </DocsSection>

      <DocsSection id="error-handling" title="Error handling and retries">
        <p>
          Most error responses return a JSON body with a <Code>message</Code>:
        </p>
        <CodeBlock title="Response" language="json" code={ERROR_BODY} />
        <p>Common status codes and how to handle them:</p>
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-[88px] text-sm font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-sm font-semibold text-foreground">Meaning</TableHead>
                <TableHead className="w-[260px] text-sm font-semibold text-foreground">Retry?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STATUS_ROWS.map((row) => (
                <TableRow key={row.code} className="align-top">
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {row.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.meaning}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.retry}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p>
          <strong>Retry strategy:</strong>
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            Retry only transient failures: <Code>429</Code>, <Code>503</Code>, other <Code>5xx</Code>, and
            network errors.
          </li>
          <li>
            Use exponential backoff with jitter; on a <Code>429</Code>, wait <Code>x-ratelimit-reset</Code>{" "}
            seconds before retrying, and cap the number of attempts.
          </li>
          <li>
            Don&apos;t retry <Code>4xx</Code> errors other than <Code>429</Code> — they won&apos;t succeed
            until you change the request.
          </li>
          <li>
            Be cautious retrying a create (<Code>POST</Code>) after a timeout — it may have already
            succeeded, and there&apos;s no idempotency-key mechanism today. Before retrying, check whether
            the resource was created (for example, <Code>GET /public/api/v1/teams</Code> and match by
            name). Re-creating a team with a duplicate name returns <Code>422</Code>, which also helps you
            detect a prior success.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="response-changes" title="Handling API response changes">
        <p>
          The Public API evolves in a <strong>backwards-compatible</strong> way: new JSON fields may be
          added to existing responses at any time. To keep your integration resilient:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Ignore unrecognized fields</strong> rather than failing on them.
          </li>
          <li>Don&apos;t depend on field order or on a fixed set of keys.</li>
          <li>
            Deserialize into tolerant models (allow unknown properties) so additive changes don&apos;t
            break your client.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="pagination" title="Pagination and filtering">
        <p>
          List endpoints currently return their <strong>complete result set</strong> — for example,{" "}
          <Code>GET /public/api/v1/teams</Code> returns your full team tree in one response, with no
          pagination parameters. Filtering is resource-specific where available (for example, Teams
          supports <Code>?name=</Code> for a case-insensitive partial match). Portal-wide conventions for
          pagination, filtering, and sorting will be documented here as they&apos;re introduced. As a best
          practice, design your client defensively: don&apos;t assume a list response will always return
          every record in a single payload, and be ready to adopt pagination when it&apos;s introduced.
        </p>
      </DocsSection>
    </DocsPageShell>
  );
}
