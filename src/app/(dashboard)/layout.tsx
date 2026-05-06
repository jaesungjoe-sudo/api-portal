"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/api-portal/AppSidebar";
import { AccountDropdown } from "@/components/api-portal/AccountDropdown";

function TopNav() {
  return (
    <header className="sticky top-0 z-50 flex h-[69px] w-full shrink-0 items-center border-b border-border bg-background px-6">
      <div className="flex items-center gap-6">
        <Image src="/ujet-logo.svg" alt="Developers ujet" width={161} height={43} priority />
        <nav className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Link
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              API Reference
            </Link>
          </div>
          <div className="h-5 w-px bg-sidebar-border" />
          <span className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
            Dashboard
          </span>
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex h-9 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search...</span>
        </div>
        <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <Sparkles className="h-4 w-4" />
          Ask AI
        </button>
        <AccountDropdown />
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <SidebarProvider className="min-h-0 flex-1" style={{ minHeight: 0 }}>
        <AppSidebar />
        <main className="min-h-0 flex-1 overflow-auto px-10 pb-20 pt-10">{children}</main>
      </SidebarProvider>
    </div>
  );
}
