"use client";

import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";

/** Thin wrapper over ConfirmDialog — see design-system/patterns/confirm-dialog.md. */
export function RevokeApiKeyDialog({
  open,
  onOpenChange,
  onRevoke,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke?: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Revoke API Key"
      description="Are you sure you want to revoke this API Key?"
      confirmLabel="Revoke"
      onConfirm={() => onRevoke?.()}
    />
  );
}
