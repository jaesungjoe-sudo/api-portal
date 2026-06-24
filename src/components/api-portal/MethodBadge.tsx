import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { HttpMethod } from "@/lib/mock-analytics-data";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/** Method → Badge variant — Figma 정합 (사이드바·본문 공통 단일 소스). */
export const METHOD_VARIANT: Record<HttpMethod, BadgeVariant> = {
  GET: "success",
  POST: "info",
  PATCH: "warning",
  PUT: "warning",
  DELETE: "destructive",
};

export function MethodBadge({
  method,
  className,
}: {
  method: HttpMethod;
  className?: string;
}) {
  return (
    <Badge variant={METHOD_VARIANT[method]} className={className}>
      {method}
    </Badge>
  );
}

export function CodeBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="destructive" className="font-mono">
      {children}
    </Badge>
  );
}
