import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/mock-team-data";

const STATUS_STYLES: Record<Status, string> = {
  Active:      "bg-green-100 text-green-700 hover:bg-green-100",
  Verified:    "bg-orange-100 text-orange-700 hover:bg-orange-100",
  Invited:     "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Deactivated: "bg-secondary text-secondary-foreground hover:bg-secondary",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge className={`${STATUS_STYLES[status]} border-0 font-medium rounded-full px-2.5`}>
      {status}
    </Badge>
  );
}
