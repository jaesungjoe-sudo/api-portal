import { DocsPageShell } from "@/components/api-portal/DocsPageShell";

export default function UpdateCallPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/create-call" },
        { label: "Update Call" },
      ]}
      title="Update Call"
      description="Coming soon."
    >
      <div />
    </DocsPageShell>
  );
}
