import { DocsPageShell } from "@/components/api-portal/DocsPageShell";

export default function GetCallPage() {
  return (
    <DocsPageShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "API Reference", href: "/api-reference/create-call" },
        { label: "Get Call" },
      ]}
      title="Get Call"
      description="Coming soon."
    >
      <div />
    </DocsPageShell>
  );
}
