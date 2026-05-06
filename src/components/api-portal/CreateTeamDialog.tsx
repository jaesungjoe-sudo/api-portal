"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_DESC = 120;

export function CreateTeamDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (team: { name: string; description: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);

  // Create 다이얼로그: 열릴 때 빈 필드로 초기화
  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError(false);
    }
  }, [open]);

  function handleCreate() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    onCreate?.({ name: name.trim(), description: description.trim() });
    onOpenChange(false);
  }

  const remaining = MAX_DESC - description.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a team to organize members and manage access.
          </DialogDescription>
        </DialogHeader>

        {/* Team Name */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="create-team-name"
            className={error ? "text-destructive" : ""}
          >
            Team Name
          </Label>
          <Input
            id="create-team-name"
            placeholder="Enter Team name"
            value={name}
            aria-invalid={error}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(false);
            }}
          />
          {error && (
            <p className="text-sm text-muted-foreground">Team name is required</p>
          )}
        </div>

        {/* Description (textarea + 120자 카운터) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="create-team-description">Description</Label>
          <textarea
            id="create-team-description"
            placeholder="Enter team description"
            value={description}
            maxLength={MAX_DESC}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[70px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 resize-none"
          />
          <p className="text-xs text-muted-foreground">{remaining} characters left</p>
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
