import { ApiReferenceSidebar } from "@/components/api-portal/ApiReferenceSidebar";
import { TopNav } from "@/components/api-portal/TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ApiReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <TopNav />
        <div className="flex flex-1">
          <ApiReferenceSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
