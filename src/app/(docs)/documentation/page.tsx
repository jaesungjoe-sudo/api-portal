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
  { id: "before-you-begin", label: "Before you begin" },
  { id: "base-urls", label: "Base URLs and environments" },
  { id: "get-api-key", label: "Get an API key" },
  { id: "quickstart", label: "Quickstart: your first authenticated request" },
  { id: "where-to-go-next", label: "Where to go next" },
  { id: "authentication", label: "Authentication and API keys" },
];

const BASE_URL = `https://{subdomain}.{domain}/public/api/v1`;

const TOKEN_REQUEST = `curl -X POST "https://{subdomain}.{domain}/public/api/v1/auth/token" \\
  -H "Ujet-Api-Key: ujet_your_api_key"`;

const TOKEN_RESPONSE = `{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 86400
}`;

const CALL_REQUEST = `curl "https://{subdomain}.{domain}/public/api/v1/teams" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."`;

const TOKEN_ERRORS = [
  {
    status: "401",
    description:
      "The API key is missing, malformed, unknown, expired, or no longer active (e.g., deleted or rotated out).",
  },
  {
    status: "404",
    description:
      "Either the Public API isn't enabled for your tenant (ask your UJET administrator), or your base URL / subdomain didn't resolve to a valid tenant.",
  },
  {
    status: "503",
    description: "The token service was temporarily unable to issue a token; retry with backoff.",
  },
];

/** Inline code token — neutral muted pill (Figma color pills simplified to a single token). */
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  );
}

function SubHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="text-lg font-semibold text-foreground">
      {children}
    </h3>
  );
}

const linkClass = "text-foreground underline underline-offset-4 hover:text-brand";

export default function GettingStartedPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Getting Started" },
      ]}
      title="Getting Started with the Public API"
      description="This guide takes you from zero to your first authenticated request to the UJET Public API: get an API key, exchange it for a token, and make one working call. For exact endpoint contracts, see the API reference; for cross-cutting behavior (rate limits, errors, retries), see Best practices."
      toc={TOC}
    >
      <DocsSection id="before-you-begin" title="Before you begin">
        <ul className="list-inside list-disc space-y-2">
          <li>A UJET tenant with the Public API enabled.</li>
          <li>
            Access to your tenant&apos;s Dev Portal (ask your UJET administrator if you don&apos;t
            have an account).
          </li>
          <li>
            An API key — see{" "}
            <a href="#get-api-key" className={linkClass}>
              Get an API key
            </a>{" "}
            below.
          </li>
          <li>
            Your tenant&apos;s base URL — see{" "}
            <a href="#base-urls" className={linkClass}>
              Base URLs and environments
            </a>{" "}
            below.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="base-urls" title="Base URLs and environments">
        <p>
          The Public API is served per tenant under <Code>/public/api/v1</Code>.
        </p>
        <CodeBlock language="" code={BASE_URL} />
        <p>
          Replace <Code>{"{subdomain}"}</Code> with your tenant subdomain and{" "}
          <Code>{"{domain}"}</Code> with your UJET environment domain.
        </p>
      </DocsSection>

      <DocsSection id="get-api-key" title="Get an API key">
        <p>
          Create an API key from the{" "}
          <Link href="/api-keys" className={linkClass}>
            API Keys
          </Link>{" "}
          page in the Dev Portal. You can have up to 3 active keys. When you create a key you choose
          its lifetime — 30, 90, or 365 days, or no expiry. The key (format <Code>ujet_...</Code>) is
          shown once, at creation: copy it and store it securely, because only a hashed form is kept
          and the key cannot be retrieved again.
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            You use the raw key only to obtain a Bearer token (next step) — see{" "}
            <a href="#authentication" className={linkClass}>
              Authentication and API keys
            </a>
            .
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="quickstart" title="Quickstart: your first authenticated request">
        <SubHeading>Exchange your API key for a Bearer token</SubHeading>
        <p>
          Send your raw API key in the <Code>Ujet-Api-Key</Code> header to the token endpoint. There
          is no request body.
        </p>
        <CodeBlock title="Request" language="bash" code={TOKEN_REQUEST} />
        <p>A successful exchange returns a short-lived access token:</p>
        <CodeBlock title="Response" language="json" code={TOKEN_RESPONSE} />
        <p>
          The <Code>access_token</Code> is a short-lived JWT used as a Bearer token.{" "}
          <Code>expires_in</Code> is its lifetime in seconds; exchange your API key again for a new
          token when the current one expires.
        </p>

        <SubHeading>Make your first call</SubHeading>
        <p>
          Send the token in the <Code>Authorization</Code> header. Listing your teams is a simple
          first call:
        </p>
        <CodeBlock title="Request" language="bash" code={CALL_REQUEST} />
        <p>
          A <Code>200 OK</Code> returns the teams for your tenant — that&apos;s your first
          authenticated Public API call. 🎉
        </p>
      </DocsSection>

      <DocsSection id="where-to-go-next" title="Where to go next">
        <ul className="list-inside list-disc space-y-2">
          <li>
            <Link href="/api-reference/introduction" className={linkClass}>
              API reference
            </Link>{" "}
            — the full contract for every <Code>/public/api/v1</Code> endpoint.
          </li>
          <li>
            <span className="font-medium text-foreground">Teams</span> — the Teams resource overview
            and how-tos.
          </li>
          <li>
            <span className="font-medium text-foreground">Best practices</span> — rate limits, error
            handling and retries, and handling response changes.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="authentication" title="Authentication and API keys">
        <SubHeading>How authentication works</SubHeading>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            Create an API key from the{" "}
            <Link href="/api-keys" className={linkClass}>
              API Keys
            </Link>{" "}
            page in the Dev Portal.
          </li>
          <li>
            Exchange it for a Bearer token via <Code>POST /public/api/v1/auth/token</Code>, with the
            raw key in the <Code>Ujet-Api-Key</Code> header.
          </li>
          <li>
            Send the token as <Code>Authorization: Bearer &lt;access_token&gt;</Code> on every Public
            API request.
          </li>
        </ol>
        <ul className="list-inside list-disc space-y-2">
          <li>
            The raw API key is sent only to the token endpoint; it is never used as the Bearer
            credential on resource calls.
          </li>
        </ul>

        <SubHeading>Token type and lifetime</SubHeading>
        <p>
          The token endpoint returns <Code>token_type: &quot;Bearer&quot;</Code> and an{" "}
          <Code>access_token</Code> (a JWT), with <Code>expires_in</Code> giving its lifetime in
          seconds. Exchange your API key again for a new token when the current one expires.
        </p>

        <SubHeading>Errors during token exchange</SubHeading>
        <div className="overflow-hidden rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-sm font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-sm font-semibold text-foreground">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOKEN_ERRORS.map(({ status, description }) => (
                <TableRow key={status}>
                  <TableCell className="align-top">
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
        <p>
          For full status-code handling and retry guidance, see{" "}
          <span className="font-medium text-foreground">Best practices → Error handling and retries</span>.
        </p>

        <SubHeading>Managing your keys</SubHeading>
        <p>
          Manage your keys from the{" "}
          <Link href="/api-keys" className={linkClass}>
            API Keys
          </Link>{" "}
          page in the Dev Portal:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <span className="font-medium text-foreground">Rotate</span> — issues a new key (shown
            once) and invalidates the old one immediately, with no grace period. Use rotation to
            replace a key or retire one that may be exposed.
          </li>
          <li>
            <span className="font-medium text-foreground">Change expiry</span> — adjust a key&apos;s
            lifetime (30, 90, or 365 days, or no expiry).
          </li>
          <li>
            <span className="font-medium text-foreground">Delete</span> — remove a key you no longer
            need; afterwards, a token exchange with it returns <Code>401</Code>.
          </li>
        </ul>

        <SubHeading>Keep your keys secure</SubHeading>
        <ul className="list-inside list-disc space-y-2">
          <li>
            The key is shown once — store it in a secrets manager, not in source control.
          </li>
          <li>
            Exchange the key for a token server-side; never embed the raw key in client-side code.
          </li>
          <li>
            Treat the Bearer token as a short-lived credential and request a fresh one on expiry.
          </li>
          <li>
            Revoking isn&apos;t an instant cut-off: rotating or deleting a key stops it from issuing
            new tokens, but a Bearer token already issued from it keeps working until it expires.
            Rotate or delete a key as soon as you suspect it&apos;s compromised.
          </li>
        </ul>
      </DocsSection>
    </DocsPageShell>
  );
}
