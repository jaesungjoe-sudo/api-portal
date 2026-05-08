"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountDropdown } from "@/components/api-portal/AccountDropdown";
import { UjetLogo } from "@/components/api-portal/UjetLogo";
import { useAuth } from "@/lib/auth-context";

type NavKey = "documentation" | "api-reference" | "dashboard";

const NAV_LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "documentation", label: "Documentation", href: "/documentation" },
  { key: "api-reference", label: "API Reference", href: "#" },
];

/**
 * 현재 경로에서 활성 nav 결정.
 * /documentation/* → documentation
 * /api-keys, /users, /webhooks, /analytics → dashboard
 * 기타 → null
 */
function detectActive(pathname: string): NavKey | null {
  if (pathname.startsWith("/documentation")) return "documentation";
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
 * 로그인 상태에 따라 메뉴와 우측 영역이 달라짐:
 *  - 로그아웃: Documentation / API Reference 만 + "Log in" 버튼
 *  - 로그인: + Dashboard 메뉴 + AccountDropdown(아바타)
 */
export function TopNav() {
  const pathname = usePathname();
  const active = detectActive(pathname);
  const { isLoggedIn, login } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-[69px] w-full shrink-0 items-center border-b border-border bg-background px-6">
      <div className="flex items-center gap-6">
        <UjetLogo />
        <nav className="flex items-center gap-3">
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
                href="/api-keys"
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
        <div className="flex h-9 w-56 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Search...</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" />
          Ask AI
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
