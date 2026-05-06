"use client";

import { useEffect, useState } from "react";
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
import {
  EXPIRY_OPTIONS,
  formatDate,
  type ApiKey,
  type ExpiryOption,
} from "@/lib/mock-api-keys";

export function EditApiKeyDialog({
  open,
  onOpenChange,
  initialKey,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialKey: ApiKey | null;
  onSave?: (name: string, expiry: ExpiryOption) => void;
}) {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState<ExpiryOption>("30 days");
  const [error, setError] = useState(false);

  // Edit 다이얼로그: 열릴 때 기존 값으로 pre-fill + 에러 초기화
  useEffect(() => {
    if (open && initialKey) {
      setName(initialKey.name);
      setExpiry(initialKey.expiry);
      setError(false);
    }
  }, [open, initialKey]);

  function handleSave() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    onSave?.(name.trim(), expiry);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>Edit API key</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="edit-api-key-name"
            className={error ? "text-destructive" : ""}
          >
            Name
          </Label>
          <Input
            id="edit-api-key-name"
            value={name}
            aria-invalid={error}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(false);
            }}
          />
          {error && (
            <p className="text-sm text-muted-foreground">Name is required</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="edit-api-key-expiry">Expiry</Label>
          <Select
            value={expiry}
            onValueChange={(v) => setExpiry(v as ExpiryOption)}
          >
            <SelectTrigger id="edit-api-key-expiry">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPIRY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Created</Label>
          <p className="text-sm text-muted-foreground">
            {initialKey ? formatDate(initialKey.createdMs) : ""}
          </p>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
