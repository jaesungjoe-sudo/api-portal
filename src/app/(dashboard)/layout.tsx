import { AppSidebar } from "@/components/api-portal/AppSidebar";
import { TopNav } from "@/components/api-portal/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 px-10 pb-20 pt-10">{children}</main>
      </div>
    </div>
  );
}
