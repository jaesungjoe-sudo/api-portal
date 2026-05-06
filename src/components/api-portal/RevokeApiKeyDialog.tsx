"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function RevokeApiKeyDialog({
  open,
  onOpenChange,
  onRevoke,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke?: () => void;
}) {
  function handleRevoke() {
    onRevoke?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Figma "Alert dialog": 512×156, close 버튼 없음 */}
      <DialogContent className="sm:max-w-[512px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Revoke API Key</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to revoke this API Key?
        </p>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRevoke}>
            Revoke
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
