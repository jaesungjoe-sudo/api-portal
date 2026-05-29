"use client";

import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";

/** Thin wrapper over ConfirmDialog — see design-system/patterns/confirm-dialog.md. */
export function DeleteApiKeyDialog({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete API Key"
      description="Are you sure you want to delete this API Key?"
      confirmLabel="Delete"
      onConfirm={() => onDelete?.()}
    />
  );
}
