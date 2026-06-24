import type { ReactNode } from "react";
import Link from "next/link";
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
import { MethodBadge } from "@/components/api-portal/MethodBadge";
import type { HttpMethod } from "@/lib/mock-analytics-data";

const TOC = [
  { id: "what-you-can-do", label: "What you can do" },
  { id: "resource-model", label: "Resource model" },
  { id: "endpoints", label: "Endpoints" },
  { id: "important-behaviors", label: "Important behaviors and constraints" },
  { id: "related", label: "Related" },
  { id: "create-a-team", label: "Create a team" },
  { id: "team-object", label: "Team object" },
  { id: "team-members", label: "Team members" },
];

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  );
}

type EndpointRow = { method: HttpMethod; path: string; note: ReactNode };

function EndpointTable({ rows }: { rows: EndpointRow[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="w-[88px] text-sm font-semibold text-foreground">Method</TableHead>
            <TableHead className="text-sm font-semibold text-foreground">Endpoint</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.method + row.path} className="align-top">
              <TableCell>
                <MethodBadge method={row.method} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <Code>{row.path}</Code> — {row.note}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const ENDPOINTS: EndpointRow[] = [
  {
    method: "GET",
    path: "/public/api/v1/teams",
    note: (
      <>
        List teams (tree). Optional <Code>?name=</Code> for case-insensitive partial match.
      </>
    ),
  },
  {
    method: "GET",
    path: "/public/api/v1/teams/{id}",
    note: (
      <>
        Get one team. Flat team object (no <Code>children</Code>); <Code>404</Code> if not found.
      </>
    ),
  },
  {
    method: "POST",
    path: "/public/api/v1/teams",
    note: (
      <>
        Create a team. <Code>name</Code> required; returns <Code>201</Code> with a <Code>Location</Code>{" "}
        header.
      </>
    ),
  },
  {
    method: "PATCH",
    path: "/public/api/v1/teams/{id}",
    note: <>Update a team. Partial — only the keys you send change.</>,
  },
  {
    method: "DELETE",
    path: "/public/api/v1/teams/{id}",
    note: (
      <>
        Delete a team. <Code>204</Code>; the team&apos;s memberships are removed (users are not deleted).
      </>
    ),
  },
];

const MEMBER_ENDPOINTS: EndpointRow[] = [
  {
    method: "GET",
    path: "/public/api/v1/teams/{team_id}/members",
    note: (
      <>
        List a team&apos;s members. Optional <Code>?role=</Code> filter. Paginated.
      </>
    ),
  },
  {
    method: "POST",
    path: "/public/api/v1/teams/{team_id}/members",
    note: (
      <>
        Add members. Bulk add by <Code>user_ids</Code>; returns a per-ID result.
      </>
    ),
  },
  {
    method: "DELETE",
    path: "/public/api/v1/teams/{team_id}/members/{user_id}",
    note: (
      <>
        Remove a member. <Code>204</Code> on success.
      </>
    ),
  },
];

const CREATE_CURL = `curl -X POST "https://{subdomain}.{domain}/public/api/v1/teams" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Billing"}'`;

const CREATE_RESPONSE = `{
  "id": 12,
  "name": "Billing",
  "parent_id": null,
  "position": 0,
  "enter_ticket_enabled": false,
  "enter_ticket_required": false,
  "crm_custom_field_key": null,
  "availability_filter_id": null,
  "created_at": "2026-01-15T10:22:00.000Z",
  "updated_at": "2026-01-15T10:22:00.000Z"
}`;

const CHILD_CURL = `curl -X POST "https://{subdomain}.{domain}/public/api/v1/teams" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Tier 2 Support", "parent_id": 12}'`;

const ADD_MEMBERS_CURL = `curl -X POST "https://{subdomain}.{domain}/public/api/v1/teams/12/members" \\
  -H "Authorization: Bearer <access_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"user_ids": [101, 102, 999]}'`;

const ADD_MEMBERS_RESPONSE = `{
  "added": [101, 102],
  "skipped": [{ "user_id": 999, "reason": "user_not_found" }]
}`;

export default function TeamsPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Documentation", href: "/documentation" },
        { label: "Teams" },
      ]}
      title="Teams"
      toc={TOC}
      prev={{ label: "Best Practices", href: "/documentation/best-practices" }}
      next={{ label: "API Reference", href: "/api-reference/introduction" }}
    >
      <p className="text-base text-muted-foreground">
        A team is an organizational unit in your UJET tenant. Teams form a hierarchy — each team may have
        one parent and any number of children — and the Public API exposes full CRUD over them, so you can
        read and provision your team structure programmatically. This page orients you; for exact
        request/response contracts, see the{" "}
        <Link
          href="/api-reference/introduction"
          className="text-foreground underline underline-offset-4 hover:text-brand"
        >
          API reference
        </Link>
        .
      </p>

      <DocsSection id="what-you-can-do" title="What you can do">
        <ul className="list-inside list-disc space-y-2">
          <li>List your tenant&apos;s full team tree.</li>
          <li>Look up a single team by ID.</li>
          <li>Create, update (rename / re-parent / reposition), and delete teams.</li>
          <li>List, add, and remove a team&apos;s members.</li>
        </ul>
      </DocsSection>

      <DocsSection id="resource-model" title="Resource model">
        <ul className="list-inside list-disc space-y-2">
          <li>
            Teams are <strong>tenant-scoped</strong> — you only ever see and manage the authenticated
            tenant&apos;s teams.
          </li>
          <li>
            Teams are <strong>hierarchical</strong>. <Code>parent_id</Code> links a team to its parent; a
            root team has <Code>{"parent_id: null"}</Code>. <Code>GET /public/api/v1/teams</Code> returns
            the tree (roots at the top level, descendants nested under a recursive <Code>children</Code>{" "}
            array), while <Code>{"GET /public/api/v1/teams/{id}"}</Code> returns a single, flat team (no{" "}
            <Code>children</Code>).
          </li>
          <li>
            When you delete a team, its members lose their membership in that team. They are not moved to
            another team, and the user accounts themselves are unaffected.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="endpoints" title="Endpoints">
        <EndpointTable rows={ENDPOINTS} />
        <p>
          For exact parameters, schemas, and examples, see the{" "}
          <Link
            href="/api-reference/introduction"
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            API reference
          </Link>{" "}
          (<Code>/public/api/v1</Code> → Teams).
        </p>
      </DocsSection>

      <DocsSection id="important-behaviors" title="Important behaviors and constraints">
        <p>Keep the following in mind when working with teams:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Team Settings are not managed here.</strong> Settings-related fields are managed
            separately and are silently ignored if sent here.
          </li>
          <li>
            <strong>Names must be unique.</strong> Creating a team or renaming one to a blank or duplicate
            name returns <Code>422</Code>.
          </li>
          <li>
            <strong>Re-parenting on update:</strong> send <Code>{"parent_id: null"}</Code> to detach a team
            to the root; omitting <Code>parent_id</Code> leaves the current parent unchanged. An invalid{" "}
            <Code>parent_id</Code> returns <Code>422</Code>.
          </li>
          <li>
            <strong>Deletion side effects:</strong> members of a deleted team lose their membership in that
            team (user accounts are not deleted and members are not reassigned elsewhere). If a delete
            fails, handle the error response per the API reference and Best practices → Error handling and
            retries.
          </li>
          <li>
            <strong>Concurrency:</strong> if the team hierarchy is being modified by another request, a
            write can return a retryable <Code>503 Service Unavailable</Code> — retry with backoff.
          </li>
          <li>
            <strong>Not found:</strong> <Code>GET</Code> / <Code>PATCH</Code> / <Code>DELETE</Code> on an
            unknown ID return <Code>404</Code>.
          </li>
        </ul>
        <p>
          For how to interpret and handle these status codes across the API, see{" "}
          <Link
            href="/documentation/best-practices#error-handling"
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            Best practices → Error handling and retries
          </Link>
          .
        </p>
      </DocsSection>

      <DocsSection id="related" title="Related">
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Getting Started with the Public API</strong> — get an API key and make your first call.
          </li>
          <li>
            <strong>API reference</strong> — the exact Teams contracts and schemas.
          </li>
          <li>
            <strong>Best practices</strong> — rate limits, error handling and retries.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="create-a-team" title="Create a team">
        <p>
          You&apos;ll need a Bearer token first — see{" "}
          <Link
            href="/documentation"
            className="text-foreground underline underline-offset-4 hover:text-brand"
          >
            Getting Started with the Public API
          </Link>
          .
        </p>
        <p>
          <strong>1. Create the team.</strong> Only <Code>name</Code> is required; the body is a flat JSON
          object (no wrapper):
        </p>
        <CodeBlock title="Request" language="bash" code={CREATE_CURL} />
        <p>
          <strong>2. On success</strong> you get <Code>201 Created</Code>, the new team in the body, and a{" "}
          <Code>Location</Code> header pointing at it:
        </p>
        <CodeBlock title="Response" language="json" code={CREATE_RESPONSE} />
        <p>
          <strong>3. To create a child team,</strong> include <Code>parent_id</Code>:
        </p>
        <CodeBlock title="Request" language="bash" code={CHILD_CURL} />
        <p>
          A blank or duplicate <Code>name</Code>, or an invalid <Code>parent_id</Code>, returns{" "}
          <Code>422</Code>. To rename or move an existing team, <Code>{"PATCH /public/api/v1/teams/{id}"}</Code>{" "}
          with just the fields you want to change.
        </p>
      </DocsSection>

      <DocsSection id="team-object" title="Team object">
        <p>
          The full Team object — every field, type, and example — lives in the generated API reference.
          This section only calls out what the schema alone doesn&apos;t make clear:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <Code>name</Code> — required; unique within the tenant.
          </li>
          <li>
            <Code>parent_id</Code> — the team&apos;s parent; <Code>null</Code> means a root (top-level)
            team.
          </li>
          <li>
            <Code>position</Code> — order among sibling teams.
          </li>
          <li>
            <Code>availability_filter_id</Code> — the availability filter assigned to the team.
          </li>
          <li>
            <Code>id</Code>, <Code>created_at</Code>, <Code>updated_at</Code> — read-only.
          </li>
          <li>
            <Code>children</Code> — present only in the list (tree) response, not when you fetch a single
            team.
          </li>
          <li>
            <Code>enter_ticket_enabled</Code> / <Code>enter_ticket_required</Code> — control the per-team
            &ldquo;enter ticket ID&rdquo; requirement for agents on outbound calls. <Code>enter_ticket_enabled</Code>{" "}
            turns the prompt on; <Code>enter_ticket_required</Code> makes the ticket ID mandatory (only
            meaningful when <Code>enter_ticket_enabled</Code> is <Code>true</Code>). Both default to{" "}
            <Code>false</Code>.
          </li>
        </ul>
        <p>For the complete field list and types, see the Teams schema in the API reference.</p>
      </DocsSection>

      <DocsSection id="team-members" title="Team members">
        <p>
          A team&apos;s members are the users assigned to it. Use these endpoints to list a team&apos;s
          members and to add or remove them. They operate on existing users, referenced by their{" "}
          <Code>user_id</Code> — the IDs you pass must already exist in your tenant.
        </p>
        <EndpointTable rows={MEMBER_ENDPOINTS} />

        <h3 className="text-lg font-semibold text-foreground">List members</h3>
        <p>
          <Code>{"GET /public/api/v1/teams/{team_id}/members"}</Code> returns the team&apos;s members.
          Filter to a single role with <Code>?role=</Code> — one of <Code>agent</Code>, <Code>manager</Code>,{" "}
          <Code>admin</Code>, or <Code>developer</Code>; any other value returns <Code>422</Code>. Results
          are paginated: the total count is in the <Code>X-Total-Count</Code> header and navigation links
          are in the RFC 5988 <Code>Link</Code> header, with <Code>page</Code> and <Code>per_page</Code>{" "}
          controlling the window. An unknown <Code>team_id</Code> returns <Code>404</Code>.
        </p>

        <h3 className="text-lg font-semibold text-foreground">Add members</h3>
        <p>
          Adding members is a <strong>bulk, partial-success</strong> operation — <Code>POST</Code> a flat
          body with a <Code>user_ids</Code> array:
        </p>
        <CodeBlock title="Request" language="bash" code={ADD_MEMBERS_CURL} />
        <p>The call is not all-or-nothing; it reports what happened to each ID:</p>
        <CodeBlock title="Response" language="json" code={ADD_MEMBERS_RESPONSE} />
        <ul className="list-inside list-disc space-y-2">
          <li>
            <Code>added</Code> — IDs newly added to the team.
          </li>
          <li>
            <Code>skipped</Code> — IDs that were not added, each with a <Code>reason</Code>:{" "}
            <Code>already_member</Code> (the user is already on the team) or <Code>user_not_found</Code> (no
            such user in your tenant).
          </li>
        </ul>
        <p>
          The status code reflects whether anything changed: you get <Code>200</Code> if at least one ID
          was added <strong>or</strong> was already a member, and <Code>422</Code> only when{" "}
          <em>every</em> ID was unknown (nothing could be added). An unknown <Code>team_id</Code> returns{" "}
          <Code>404</Code>. <Code>user_ids</Code> is required and must contain at least one ID; non-integer
          values are ignored and duplicates are collapsed.
        </p>

        <h3 className="text-lg font-semibold text-foreground">Remove a member</h3>
        <p>
          <Code>{"DELETE /public/api/v1/teams/{team_id}/members/{user_id}"}</Code> removes one user from the
          team and returns <Code>204 No Content</Code>. If the team or user doesn&apos;t exist, or the user
          isn&apos;t a member of that team, the API returns <Code>404</Code>. Removing a member only
          detaches them from this team — the user account is unaffected. (Deleting the team itself likewise
          just removes its memberships — see <strong>Deletion side effects</strong> above.)
        </p>
      </DocsSection>
    </DocsPageShell>
  );
}
