"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AccountDropdown } from "@/components/api-portal/AccountDropdown";
import { UjetLogo } from "@/components/api-portal/UjetLogo";
import { useAuth } from "@/lib/auth-context";

type NavKey = "documentation" | "api-reference" | "dashboard";

const NAV_LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "documentation", label: "Documentation", href: "/documentation" },
  { key: "api-reference", label: "API Reference", href: "/api-reference/create-call" },
];

function detectActive(pathname: string): NavKey | null {
  if (pathname.startsWith("/documentation")) return "documentation";
  if (pathname.startsWith("/api-reference")) return "api-reference";
  if (
    pathname.startsWith("/api-keys") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/webhooks") ||
    pathname.startsWith("/analytics")
  ) {
    return "dashboard";
  }
  return null;
}

/**
 * Global TopNav.
 *  - 로그아웃: Documentation / API Reference + "Log in" 버튼
 *  - 로그인: + Dashboard 메뉴 + AccountDropdown (아바타)
 *  - 모바일(<md): 좌측 SidebarTrigger (햄버거), 검색·Ask AI 축소
 */
export function TopNav() {
  const pathname = usePathname();
  const active = detectActive(pathname);
  const { isLoggedIn, login } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-[69px] w-full shrink-0 items-center border-b border-border bg-background px-4 md:px-6">
      {/* Mobile: 햄버거 (사이드바 toggle) */}
      <SidebarTrigger className="mr-2 md:hidden" />

      <div className="flex items-center gap-6">
        <Link href="/" aria-label="Home">
          <UjetLogo />
        </Link>
        {/* Desktop nav — md 이상에서만 표시 */}
        <nav className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.key === active;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors ${
                    isActive ? "bg-accent" : "hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {isLoggedIn && (
            <>
              <div className="h-5 w-px bg-sidebar-border" />
              <Link
                href="/analytics"
                className={`rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors ${
                  active === "dashboard" ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search input — lg 이상만 풀폼 */}
        <div className="hidden h-9 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground lg:flex">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search...</span>
        </div>
        {/* Search 아이콘 fallback — lg 미만 */}
        <button
          type="button"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          <Search className="h-4 w-4" />
        </button>
        {/* Ask AI — sm 이상에서만 텍스트, 그 이하 아이콘만 */}
        <button
          type="button"
          aria-label="Ask AI"
          className="flex h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
        {isLoggedIn ? (
          <AccountDropdown />
        ) : (
          <Button onClick={login}>Log in</Button>
        )}
      </div>
    </header>
  );
}
