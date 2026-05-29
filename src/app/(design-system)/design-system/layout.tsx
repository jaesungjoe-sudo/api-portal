import { CatalogSidebar } from "@/components/design-system/CatalogSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * Dedicated layout for the Design System catalog.
 *
 * This layout intentionally omits the app TopNav — the catalog is a reference tool
 * for designers/developers comparing tokens, components, and patterns, which is a
 * different context from the app's primary navigation (login, dashboard, etc.).
 * The catalog's own header (logo + dark toggle) lives at the top of CatalogSidebar.
 */
export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-1">
        <CatalogSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
