"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DurationDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setOn((v) => !v)}>
        Toggle ({on ? "visible" : "hidden"})
      </Button>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "fast (100ms)", cls: "duration-100" },
          { label: "base (200ms)", cls: "duration-200" },
          { label: "slow (300ms)", cls: "duration-300" },
        ].map(({ label, cls }) => (
          <div
            key={label}
            className={`flex h-24 items-center justify-center rounded-lg bg-secondary text-sm transition-opacity ${cls} ${on ? "opacity-100" : "opacity-0"}`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EasingDemo() {
  const [on, setOn] = useState(false);
  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={() => setOn((v) => !v)}>
        Toggle position
      </Button>
      <div className="space-y-3">
        <div className="relative h-12 rounded-lg bg-muted">
          <div
            className={`absolute top-1 size-10 rounded-md bg-secondary transition-all duration-300 ease-linear ${on ? "left-[calc(100%-44px)]" : "left-1"}`}
          />
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
            ease-linear
          </span>
        </div>
        <div className="relative h-12 rounded-lg bg-muted">
          <div
            className={`absolute top-1 size-10 rounded-md bg-secondary transition-all duration-300 ease-emphasized ${on ? "left-[calc(100%-44px)]" : "left-1"}`}
          />
          <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
            ease-emphasized
          </span>
        </div>
      </div>
    </div>
  );
}
