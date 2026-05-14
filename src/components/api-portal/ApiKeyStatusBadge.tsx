import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { ApiKeyStatus } from "@/lib/mock-api-keys";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_VARIANT: Record<ApiKeyStatus, BadgeVariant> = {
  Active: "success",
  Expired: "muted",
  Revoked: "destructive",
};

export function ApiKeyStatusBadge({ status }: { status: ApiKeyStatus }) {
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className="border-0 font-medium rounded-full px-2.5"
    >
      {status}
    </Badge>
  );
}
