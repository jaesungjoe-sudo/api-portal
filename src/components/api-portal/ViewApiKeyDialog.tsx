"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CircleCheck, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ViewApiKeyDialog({
  open,
  onOpenChange,
  keyName,
  keyValue,
  expiry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyName: string;
  keyValue: string;
  expiry: string;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (open) setRevealed(false);
  }, [open]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(keyValue);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Failed to copy key");
    }
  }

  const displayValue = revealed ? keyValue : "*".repeat(Math.min(keyValue.length, 32));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
        </DialogHeader>

        {/* Success Alert — lucide/circle-check */}
        <div className="flex items-start gap-3 rounded-md border border-success-border bg-success-subtle px-4 py-3 text-sm text-success">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Your API Key is ready. You can only see this key once. Store it safely.
          </span>
        </div>

        {/* Name (readonly) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="view-key-name">Name</Label>
          <Input id="view-key-name" value={keyName} readOnly />
        </div>

        {/* Expiry (disabled — Figma `State=disabled`) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="view-key-expiry">Expiry</Label>
          <Select value={expiry} disabled>
            <SelectTrigger id="view-key-expiry">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={expiry}>{expiry}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Token (masked + copy + reveal) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="view-key-value">Token</Label>
          <div className="relative">
            <Input
              id="view-key-value"
              value={displayValue}
              readOnly
              className="pr-16 font-mono"
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy API key"
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                aria-label={revealed ? "Hide API key" : "Reveal API key"}
                className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
