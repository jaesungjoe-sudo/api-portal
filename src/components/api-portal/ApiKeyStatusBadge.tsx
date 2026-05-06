import { Badge } from "@/components/ui/badge";
import type { ApiKeyStatus } from "@/lib/mock-api-keys";

const STATUS_STYLES: Record<ApiKeyStatus, string> = {
  Active: "bg-green-100 text-green-700 hover:bg-green-100",
  Expired: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  // Revoked: Figma 디자인 토큰 (destructive-subtle + destructive)
  Revoked: "bg-destructive-subtle text-destructive hover:bg-destructive-subtle",
};

export function ApiKeyStatusBadge({ status }: { status: ApiKeyStatus }) {
  return (
    <Badge className={`${STATUS_STYLES[status]} border-0 font-medium rounded-full px-2.5`}>
      {status}
    </Badge>
  );
}
