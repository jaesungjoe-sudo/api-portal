import { DocsPageShell } from "@/components/api-portal/DocsPageShell";
import { MethodBadge } from "@/components/api-portal/MethodBadge";

export default function GetCallPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/create-call" },
        { label: "Get Call" },
      ]}
      tag={<MethodBadge method="GET" />}
      title="Get Call"
      description="Coming soon."
    >
      <div />
    </DocsPageShell>
  );
}
