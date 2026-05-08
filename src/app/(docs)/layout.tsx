import { DocsSidebar } from "@/components/api-portal/DocsSidebar";
import { TopNav } from "@/components/api-portal/TopNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <DocsSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
