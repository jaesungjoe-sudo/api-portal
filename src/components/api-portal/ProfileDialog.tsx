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

// Mock: 실제로는 세션/유저 컨텍스트에서 가져옴
const CURRENT_USER = {
  email: "jaesung.joe@api.com",
  name: "Jaesung Joe",
  role: "developer",
  team: "default",
  initial: "J",
};

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(CURRENT_USER.name);
  const [errors, setErrors] = useState({ name: false });

  // 다이얼로그가 열릴 때마다 현재 유저 데이터로 pre-fill + 에러 초기화
  useEffect(() => {
    if (open) {
      setName(CURRENT_USER.name);
      setErrors({ name: false });
    }
  }, [open]);

  function handleSave() {
    if (!name.trim()) {
      setErrors({ name: true });
      return;
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[423px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Avatar + Email row */}
          <div className="flex items-end gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fuchsia-600 text-xl font-semibold text-white">
              {CURRENT_USER.initial}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={CURRENT_USER.email}
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="profile-name"
              className={errors.name ? "text-destructive" : ""}
            >
              Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              aria-invalid={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: false }));
              }}
            />
            {errors.name && (
              <p className="text-sm text-muted-foreground">Name is required</p>
            )}
          </div>

          {/* Role — 본인은 자기 role 변경 불가 (Figma: State=disabled) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-role">Role</Label>
            <Select value={CURRENT_USER.role} disabled>
              <SelectTrigger id="profile-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Team — Figma State=disabled */}
          <div className="flex flex-col gap-2">
            <Label>Team</Label>
            <Select value={CURRENT_USER.team} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="api-portal">API Portal</SelectItem>
                <SelectItem value="default">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
