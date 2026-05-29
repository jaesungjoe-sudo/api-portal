"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Reusable confirm dialog (a.k.a. "Alert dialog" in Figma) for destructive or
 * irreversible actions. Built on top of the Dialog primitive — see the pattern
 * spec at design-system/patterns/confirm-dialog.md.
 *
 * Defaults match the 4 production confirm dialogs (Delete API Key / Revoke /
 * Deactivate User / Reject User):
 *   - width 512
 *   - showCloseButton={false} (no X — explicit Cancel / Confirm only)
 *   - DialogDescription required (a11y + Figma 정합)
 *   - outline Cancel + destructive Confirm
 *
 * For non-destructive confirms (rare), pass confirmVariant="default".
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** ReactNode — allows inline entity names: `<>Delete the <strong>{name}</strong> team?</>`. */
  description: React.ReactNode;
  confirmLabel: string;
  /** "destructive" (default) | "default" — visual weight of the confirm button. */
  confirmVariant?: "destructive" | "default";
  onConfirm: () => void;
}) {
  function handleConfirm() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[512px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
