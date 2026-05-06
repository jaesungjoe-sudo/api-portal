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
import { EXPIRY_OPTIONS, type ExpiryOption } from "@/lib/mock-api-keys";

const DEFAULT_EXPIRY: ExpiryOption = "30 days";

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (name: string, expiry: ExpiryOption) => void;
}) {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState<ExpiryOption>(DEFAULT_EXPIRY);
  const [error, setError] = useState(false);

  // Create 다이얼로그: 열릴 때 빈 필드로 초기화
  useEffect(() => {
    if (open) {
      setName("");
      setExpiry(DEFAULT_EXPIRY);
      setError(false);
    }
  }, [open]);

  function handleCreate() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    onCreate?.(name.trim(), expiry);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>Create a new key</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="api-key-name"
            className={error ? "text-destructive" : ""}
          >
            Name
          </Label>
          <Input
            id="api-key-name"
            placeholder="API Key Name"
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
          <Label htmlFor="api-key-expiry">Expiry</Label>
          <Select
            value={expiry}
            onValueChange={(v) => setExpiry(v as ExpiryOption)}
          >
            <SelectTrigger id="api-key-expiry">
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

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
