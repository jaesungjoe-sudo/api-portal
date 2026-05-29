"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dark mode toggle for the Design System catalog.
 * Toggles the `html.dark` class — aligns with the `@custom-variant dark (&:is(.dark *))`
 * rule in globals.css. The catalog mounts this only within its own layout, but the
 * class change is global to <html>, so the rest of the app inherits the chosen mode
 * after passing through the catalog (intentional).
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Sync local state with the current class on mount (SSR/navigation consistency).
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-sidebar-foreground"
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
