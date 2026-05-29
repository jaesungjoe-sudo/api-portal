"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export type InviteUserInput = {
  email: string;
  role: string; // 내부 토큰: "admin" | "manager" | "developer"
  team: string; // 내부 토큰: "api-portal" | "default"
};

export function InviteUserDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite?: (input: InviteUserInput) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [errors, setErrors] = useState({ email: false, role: false, team: false });

  // Create/Invite: 열릴 때 빈 필드 + 에러 초기화
  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("");
      setTeam("");
      setErrors({ email: false, role: false, team: false });
    }
  }, [open]);

  function handleSendInvite() {
    const newErrors = { email: !email, role: !role, team: !team };
    if (newErrors.email || newErrors.role || newErrors.team) {
      setErrors(newErrors);
      return;
    }
    onInvite?.({ email, role, team });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>Send an invitation link to start collaborating.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="invite-email" className={errors.email ? "text-destructive" : ""}>
            Email
          </Label>
          <Input
            id="invite-email"
            placeholder="Email"
            value={email}
            autoFocus={false}
            aria-invalid={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: false }));
            }}
          />
          {errors.email && (
            <p className="text-sm text-destructive">Email is required</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className={errors.role ? "text-destructive" : ""}>Select Role</Label>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v ?? "");
              if (errors.role) setErrors((p) => ({ ...p, role: false }));
            }}
          >
            <SelectTrigger aria-invalid={errors.role}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">Role is required</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label className={errors.team ? "text-destructive" : ""}>Team</Label>
          <Select
            value={team}
            onValueChange={(v) => {
              setTeam(v ?? "");
              if (errors.team) setErrors((p) => ({ ...p, team: false }));
            }}
          >
            <SelectTrigger aria-invalid={errors.team}>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api-portal">API Portal</SelectItem>
              <SelectItem value="default">Default</SelectItem>
            </SelectContent>
          </Select>
          {errors.team && (
            <p className="text-sm text-destructive">Team is required</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSendInvite}>Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
