import { DocsSidebar } from "@/components/api-portal/DocsSidebar";
import { TopNav } from "@/components/api-portal/TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <TopNav />
        <div className="flex flex-1">
          <DocsSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
