import { Badge, badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import type { Status } from "@/lib/mock-team-data";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_VARIANT: Record<Status, BadgeVariant> = {
  Active: "success",
  Verified: "warning",
  Invited: "info",
  Deactivated: "muted",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant={STATUS_VARIANT[status]}
      className="border-0 font-medium rounded-full px-2.5"
    >
      {status}
    </Badge>
  );
}
