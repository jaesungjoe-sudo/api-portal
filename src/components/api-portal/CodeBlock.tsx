"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Phase1 단순 CodeBlock — 직접 색 매핑 (syntax highlighter 미사용).
 * children에 styled span으로 코드 작성, 또는 plain string으로 단색 표시.
 */
export function CodeBlock({
  title,
  language = "TypeScript",
  code,
  children,
}: {
  title?: string;
  language?: string;
  code: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {(title || language) && (
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-3">
          {title && <p className="text-sm font-medium text-foreground">{title}</p>}
          <div className="flex items-center gap-2">
            {language && (
              <span className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
                {language}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCopy}
              aria-label="Copy code"
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="text-success" /> : <Copy />}
            </Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto bg-background p-4">
        <pre className="m-0 font-mono text-sm leading-5">
          <code>{children ?? code}</code>
        </pre>
      </div>
    </div>
  );
}

/* Syntax tokens — styled spans for use in CodeBlock children.
   개별 named export — RSC 경계 호환. */

export function TokKeyword({ children }: { children: ReactNode }) {
  return <span className="text-amber-600">{children}</span>;
}
export function TokString({ children }: { children: ReactNode }) {
  return <span className="text-blue-700">{children}</span>;
}
export function TokNumber({ children }: { children: ReactNode }) {
  return <span className="text-blue-700">{children}</span>;
}
export function TokFn({ children }: { children: ReactNode }) {
  return <span className="text-amber-600">{children}</span>;
}
export function TokIdent({ children }: { children: ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}
export function TokPunct({ children }: { children: ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}
export function TokComment({ children }: { children: ReactNode }) {
  return <span className="italic text-muted-foreground">{children}</span>;
}
