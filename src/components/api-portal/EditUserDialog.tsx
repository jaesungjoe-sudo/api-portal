"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
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
import { StatusBadge } from "@/components/api-portal/StatusBadge";
import type { User } from "@/lib/mock-team-data";

export type EditUserPatch = {
  name: string;
  email: string;
  role: string; // 내부 토큰: "admin" | "manager" | "developer"
  team: string; // 내부 토큰: "api-portal" | "default"
};

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSave,
  onResendInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave?: (original: User, patch: EditUserPatch) => void;
  onResendInvite?: (user: User) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [errors, setErrors] = useState({ name: false, email: false, role: false, team: false });

  // Edit: 열릴 때 기존 값으로 pre-fill + 에러 초기화
  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role.toLowerCase());
      setTeam(user.team === "API Portal" ? "api-portal" : "default");
      setErrors({ name: false, email: false, role: false, team: false });
    }
  }, [open, user]);

  function handleSave() {
    if (!user) return;
    const newErrors = { name: !name, email: !email, role: !role, team: !team };
    if (newErrors.name || newErrors.email || newErrors.role || newErrors.team) {
      setErrors(newErrors);
      return;
    }
    onSave?.(user, { name, email, role, team });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        {/* Edit 다이얼로그 focus 흡수 — pre-fill 된 필드에 자동 포커스 차단 */}
        <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Send an invitation link to start collaborating.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-user-name" className={errors.name ? "text-destructive" : ""}>Name</Label>
          <Input
            id="edit-user-name"
            value={name}
            autoFocus={false}
            aria-invalid={errors.name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: false })); }}
          />
          {errors.name && <p className="text-sm text-destructive">Name is required</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-user-email" className={errors.email ? "text-destructive" : ""}>Email</Label>
          <Input
            id="edit-user-email"
            value={email}
            aria-invalid={errors.email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: false })); }}
          />
          {errors.email && <p className="text-sm text-destructive">Email is required</p>}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <div className="flex items-center gap-3">
              {user && <StatusBadge status={user.status} />}
              {user?.status === "Invited" && (
                <Button variant="outline" size="sm" onClick={() => user && onResendInvite?.(user)}>
                  Resend invitation
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border bg-warning-subtle px-4 py-3 text-sm font-medium text-warning">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            <span>
              {user?.status === "Invited"
                ? "Invitation sent and waiting for acceptance"
                : "Awaiting administrator approval."}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className={errors.role ? "text-destructive" : ""}>Select Role</Label>
          <Select value={role} onValueChange={(v) => { setRole(v ?? ""); if (errors.role) setErrors((p) => ({ ...p, role: false })); }}>
            <SelectTrigger aria-invalid={errors.role}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-destructive">Role is required</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label className={errors.team ? "text-destructive" : ""}>Team</Label>
          <Select value={team} onValueChange={(v) => { setTeam(v ?? ""); if (errors.team) setErrors((p) => ({ ...p, team: false })); }}>
            <SelectTrigger aria-invalid={errors.team}>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api-portal">API Portal</SelectItem>
              <SelectItem value="default">Default</SelectItem>
            </SelectContent>
          </Select>
          {errors.team && <p className="text-sm text-destructive">Team is required</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
