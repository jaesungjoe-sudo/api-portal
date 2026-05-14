"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head";
import { TablePagination } from "@/components/api-portal/table-pagination";
import { CreateTeamDialog } from "@/components/api-portal/CreateTeamDialog";
import { EditTeamDialog } from "@/components/api-portal/EditTeamDialog";
import { StatusBadge } from "@/components/api-portal/StatusBadge";
import {
  INITIAL_USERS,
  addTeam,
  deleteTeam as deleteTeamFromStore,
  getTeams,
  updateTeam as updateTeamInStore,
  type Status,
  type Team,
  type User,
} from "@/lib/mock-team-data";
import { Info, MoreHorizontal, Search, TriangleAlert, User as UserIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "name" | "email" | "team" | "role" | "status" | "updatedAtMs";

const PAGE_SIZE = 10;

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionMenu({ user, onEdit, onDeactivate, onResend }: { user: User; onEdit: (u: User) => void; onDeactivate: (u: User) => void; onResend: (u: User) => void }) {
  const isInvited = user.status === "Invited";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${user.name}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="px-2 py-1.5" onClick={() => onEdit(user)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1.5" onClick={() => onDeactivate(user)}>
          Deactivate
        </DropdownMenuItem>
        {isInvited && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-2 py-1.5" onClick={() => onResend(user)}>
              Resend invite mail
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TeamCard({
  team,
  memberCount,
  onEdit,
  onDelete,
}: {
  team: Team;
  memberCount: number;
  onEdit: (t: Team) => void;
  onDelete: (t: Team) => void;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/30 focus-within:bg-muted/30">
      {/* 카드 전체 클릭 → 팀 상세로 이동. absolute overlay로 처리해 키보드 포커스도 지원 */}
      <Link
        href={`/users/team/${encodeURIComponent(team.name)}`}
        aria-label={`View ${team.name} team`}
        className="absolute inset-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="relative flex items-start justify-between gap-2 pb-3 pointer-events-none">
        <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
        {/* DropdownMenu wrapper에 pointer-events-auto로 클릭 활성화 (Link overlay 위로 띄움) */}
        <div className="pointer-events-auto">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for ${team.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="px-2 py-1.5" onClick={() => onEdit(team)}>
                Edit
              </DropdownMenuItem>
              {/* Default 같은 시스템 팀은 삭제 불가 */}
              {!team.protected && (
                <DropdownMenuItem className="px-2 py-1.5" onClick={() => onDelete(team)}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="relative pointer-events-none line-clamp-2 text-sm text-muted-foreground">{team.description}</p>
      <div className="relative pointer-events-none mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <UserIcon className="h-4 w-4" />
        <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  // useSearchParams 사용 → CSR bailout. Suspense 경계 필수 (Next.js 16+)
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  );
}

function UsersPageContent() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  // 모듈 레벨 store 스냅샷으로 init → list 페이지를 다시 mount 했을 때 새 팀 반영됨
  const [teams, setTeams] = useState<Team[]>(() => getTeams());
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [editTeamTarget, setEditTeamTarget] = useState<Team | null>(null);

  function handleCreateTeam(team: { name: string; description: string }) {
    const newTeam: Team = { name: team.name, description: team.description };
    addTeam(newTeam);
    setTeams(getTeams());
    toast.success("Team created");
  }

  function handleDeleteTeam(team: Team) {
    deleteTeamFromStore(team.name);
    setTeams(getTeams());
    toast.success(`Team "${team.name}" deleted`);
  }

  function handleUpdateTeam(originalName: string, patch: { name: string; description: string }) {
    updateTeamInStore(originalName, patch);
    setTeams(getTeams());
    toast.success(`Team "${patch.name}" updated`);
  }
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [errors, setErrors] = useState({ email: false, role: false, team: false });
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  // 초기 탭은 URL 쿼리(?tab=team|pending)에서 가져옴 → 팀 상세에서 breadcrumb로 돌아왔을 때 Team 탭 유지
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"user" | "team" | "pending">(() => {
    const t = searchParams.get("tab");
    return t === "team" || t === "pending" ? t : "user";
  });
  const [pendingPage, setPendingPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const [editErrors, setEditErrors] = useState({ name: false, email: false, role: false, team: false });
  const [rejectTarget, setRejectTarget] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return users;
    return [...users].sort((a, b) => {
      const av = a[sortKey as keyof User] as string | number;
      const bv = b[sortKey as keyof User] as string | number;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSendInvite() {
    const newErrors = { email: !email, role: !role, team: !team };
    if (newErrors.email || newErrors.role || newErrors.team) {
      setErrors(newErrors);
      return;
    }
    const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    setUsers((prev) => [
      {
        name: email.split("@")[0],
        email,
        team: team === "api-portal" ? "API Portal" : "Default",
        role: role.charAt(0).toUpperCase() + role.slice(1),
        status: "Invited",
        updatedAt: today,
        updatedAtMs: Date.now(),
      },
      ...prev,
    ]);
    setPage(1);
    toast.success("Invitation sent", {
      description: `An invite has been sent to ${email}.`,
    });
    setEmail(""); setRole(""); setTeam("");
    setErrors({ email: false, role: false, team: false });
    setOpen(false);
  }

  function handleDialogClose() {
    setOpen(false);
    setEmail(""); setRole(""); setTeam("");
    setErrors({ email: false, role: false, team: false });
  }

  function handleEditOpen(user: User) {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role.toLowerCase());
    setEditTeam(user.team === "API Portal" ? "api-portal" : "default");
    setEditOpen(true);
  }

  function handleEditClose() {
    setEditOpen(false);
    setEditUser(null);
    setEditErrors({ name: false, email: false, role: false, team: false });
  }

  function handleEditSave() {
    if (!editUser) return;
    const newErrors = { name: !editName, email: !editEmail, role: !editRole, team: !editTeam };
    if (newErrors.name || newErrors.email || newErrors.role || newErrors.team) {
      setEditErrors(newErrors);
      return;
    }
    const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    setUsers((prev) =>
      prev.map((u) =>
        u === editUser
          ? {
              ...u,
              name: editName,
              email: editEmail,
              role: editRole.charAt(0).toUpperCase() + editRole.slice(1),
              team: editTeam === "api-portal" ? "API Portal" : "Default",
              updatedAt: today,
              updatedAtMs: Date.now(),
            }
          : u
      )
    );
    toast.success("User updated");
    handleEditClose();
  }

  const pendingUsers = useMemo(() => users.filter(u => u.status === "Verified"), [users]);
  const pendingTotalPages = Math.max(1, Math.ceil(pendingUsers.length / PAGE_SIZE));
  const pendingPaged = pendingUsers.slice((pendingPage - 1) * PAGE_SIZE, pendingPage * PAGE_SIZE);

  function handleApprove(user: User) {
    setUsers(prev => prev.map(u => u === user ? { ...u, status: "Active" as Status } : u));
    toast.success(`${user.name || user.email} approved`);
  }

  function handleResendInvite() {
    if (!editUser) return;
    toast.success(`Invitation resent to ${editUser.email}`);
  }

  function handleDeactivateConfirm() {
    if (!deactivateTarget) return;
    setUsers(prev => prev.map(u => u === deactivateTarget ? { ...u, status: "Deactivated" as Status } : u));
    toast.success(`${deactivateTarget.name || deactivateTarget.email} deactivated`);
    setDeactivateTarget(null);
  }

  function handleRejectConfirm() {
    if (!rejectTarget) return;
    setUsers(prev => prev.map(u => u === rejectTarget ? { ...u, status: "Deactivated" as Status } : u));
    toast.success(`${rejectTarget.name || rejectTarget.email} rejected`);
    setRejectTarget(null);
  }

  const sp = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="flex flex-col gap-10">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/analytics">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>User &amp; Team management</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-foreground">User &amp; Team management</h1>



      {/* Tabs */}
      <div className="flex gap-1 -mt-2">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "user" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          User
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "team" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Team
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium ${activeTab === "pending" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Pending Approvals
          {pendingUsers.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-xs font-medium min-w-[18px] h-[18px] px-1">
              {pendingUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder={activeTab === "team" ? "Search Team" : "Search User"}
          />
        </div>
        {activeTab === "user" && (
          <Button onClick={() => setOpen(true)}>
            Invite User
          </Button>
        )}
        {activeTab === "team" && (
          <Button onClick={() => setCreateTeamOpen(true)}>
            Create Team
          </Button>
        )}
      </div>

      {/* Table */}
      {activeTab === "user" ? (
        <>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px] pl-5">
                    <SortableHead col="name" {...sp}>Name</SortableHead>
                  </TableHead>
                  <TableHead className="min-w-[220px]">
                    <SortableHead col="email" {...sp}>Email</SortableHead>
                  </TableHead>
                  <TableHead className="min-w-[130px]">
                    <SortableHead col="team" {...sp}>Team</SortableHead>
                  </TableHead>
                  <TableHead className="min-w-[100px]">
                    <SortableHead col="role" {...sp}>Role</SortableHead>
                  </TableHead>
                  <TableHead className="min-w-[110px]">
                    <SortableHead col="status" {...sp}>Status</SortableHead>
                  </TableHead>
                  <TableHead className="min-w-[140px]">
                    <div className="flex items-center gap-1.5">
                      <SortableHead col="updatedAtMs" {...sp}>Updated</SortableHead>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Last time this user&apos;s record was modified
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((user, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-5 text-sm font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-sm text-foreground">{user.email}</TableCell>
                    <TableCell className="text-sm text-foreground">{user.team}</TableCell>
                    <TableCell className="text-sm text-foreground">{user.role}</TableCell>
                    <TableCell><StatusBadge status={user.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.updatedAt}</TableCell>
                    <TableCell>
                      <ActionMenu user={user} onEdit={handleEditOpen} onDeactivate={setDeactivateTarget} onResend={(u) => toast.success(`Invitation resent to ${u.email}`)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : activeTab === "team" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((t) => (
            <TeamCard
              key={t.name}
              team={t}
              memberCount={users.filter((u) => u.team === t.name).length}
              onEdit={(team) => setEditTeamTarget(team)}
              onDelete={handleDeleteTeam}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px] pl-5">Name</TableHead>
                  <TableHead className="min-w-[220px]">Email</TableHead>
                  <TableHead className="min-w-[130px]">Team</TableHead>
                  <TableHead className="min-w-[100px]">Role</TableHead>
                  <TableHead className="min-w-[110px]">Status</TableHead>
                  <TableHead className="min-w-[130px]">Updated</TableHead>
                  <TableHead className="min-w-[180px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPaged.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                      No pending approvals
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingPaged.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-5 text-sm font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-sm text-foreground">{user.email}</TableCell>
                      <TableCell className="text-sm text-foreground">{user.team}</TableCell>
                      <TableCell className="text-sm text-foreground">{user.role}</TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => setRejectTarget(user)}>Reject</Button>
                          <Button size="sm" variant="outline" className="text-success" onClick={() => handleApprove(user)}>Approve</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination page={pendingPage} totalPages={pendingTotalPages} onPageChange={setPendingPage} />
        </>
      )}

      {/* Invite User Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[423px]">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation link to start collaborating.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                Email
              </Label>
              <Input
                id="email"
                placeholder="Email"
                value={email}
                aria-invalid={errors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: false }));
                }}
              />
              {errors.email && (
                <p className="text-sm text-muted-foreground">Email is required</p>
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
                <p className="text-sm text-muted-foreground">Role is required</p>
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
                <p className="text-sm text-muted-foreground">Team is required</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSendInvite}>Send Invite</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Deactivate Confirm Dialog */}
      <Dialog open={!!deactivateTarget} onOpenChange={(open) => { if (!open) setDeactivateTarget(null); }}>
        <DialogContent className="sm:max-w-[512px]">
          <DialogHeader>
            <DialogTitle >Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this user ({deactivateTarget?.email})?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeactivateTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeactivateConfirm}>Deactivate</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Reject Confirm Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => { if (!open) setRejectTarget(null); }}>
        <DialogContent className="sm:max-w-[512px]">
          <DialogHeader>
            <DialogTitle >Reject registration request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this registration ({rejectTarget?.email}) request?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>Reject</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={handleEditClose}>
        <DialogContent className="sm:max-w-[423px]">
          {/* Absorbs initial focus so no input is active on open */}
          <span tabIndex={0} className="sr-only outline-none" aria-hidden="true" />
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Send an invitation link to start collaborating.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name" className={editErrors.name ? "text-destructive" : ""}>Name</Label>
              <Input
                id="edit-name"
                value={editName}
                aria-invalid={editErrors.name}
                onChange={(e) => { setEditName(e.target.value); if (editErrors.name) setEditErrors((p) => ({ ...p, name: false })); }}
              />
              {editErrors.name && <p className="text-sm text-muted-foreground">Name is required</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-email" className={editErrors.email ? "text-destructive" : ""}>Email</Label>
              <Input
                id="edit-email"
                value={editEmail}
                aria-invalid={editErrors.email}
                onChange={(e) => { setEditEmail(e.target.value); if (editErrors.email) setEditErrors((p) => ({ ...p, email: false })); }}
              />
              {editErrors.email && <p className="text-sm text-muted-foreground">Email is required</p>}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Status</Label>
                <div className="flex items-center gap-3">
                  {editUser && <StatusBadge status={editUser.status} />}
                  {editUser?.status === "Invited" && (
                    <Button variant="outline" size="sm" onClick={handleResendInvite}>
                      Resend invitation
                    </Button>
                  )}
                </div>
              </div>
              {editUser?.status === "Invited" ? (
                <div className="flex items-center gap-3 rounded-md border border-border bg-warning-subtle px-4 py-3 text-sm font-medium text-warning">
                  <TriangleAlert className="h-4 w-4 shrink-0" />
                  <span>Invitation sent and waiting for acceptance</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-md border border-border bg-warning-subtle px-4 py-3 text-sm font-medium text-warning">
                  <TriangleAlert className="h-4 w-4 shrink-0" />
                  <span>Awaiting administrator approval.</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={editErrors.role ? "text-destructive" : ""}>Select Role</Label>
              <Select value={editRole} onValueChange={(v) => { setEditRole(v ?? ""); if (editErrors.role) setEditErrors((p) => ({ ...p, role: false })); }}>
                <SelectTrigger aria-invalid={editErrors.role}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>
              {editErrors.role && <p className="text-sm text-muted-foreground">Role is required</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className={editErrors.team ? "text-destructive" : ""}>Team</Label>
              <Select value={editTeam} onValueChange={(v) => { setEditTeam(v ?? ""); if (editErrors.team) setEditErrors((p) => ({ ...p, team: false })); }}>
                <SelectTrigger aria-invalid={editErrors.team}>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api-portal">API Portal</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
              {editErrors.team && <p className="text-sm text-muted-foreground">Team is required</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
        onCreate={handleCreateTeam}
      />

      <EditTeamDialog
        open={editTeamTarget !== null}
        onOpenChange={(o) => {
          if (!o) setEditTeamTarget(null);
        }}
        team={editTeamTarget}
        onSave={handleUpdateTeam}
      />
    </div>
  );
}
