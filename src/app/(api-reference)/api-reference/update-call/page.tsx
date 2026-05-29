import { DocsPageShell } from "@/components/api-portal/DocsPageShell";
import { MethodBadge } from "@/components/api-portal/MethodBadge";

export default function UpdateCallPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/create-call" },
        { label: "Update Call" },
      ]}
      tag={<MethodBadge method="PATCH" />}
      title="Update Call"
      description="Coming soon."
    >
      <div />
    </DocsPageShell>
  );
}
