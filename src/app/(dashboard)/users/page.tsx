"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head";
import { TablePagination } from "@/components/api-portal/table-pagination";
import { CreateTeamDialog } from "@/components/api-portal/CreateTeamDialog";
import { EditTeamDialog } from "@/components/api-portal/EditTeamDialog";
import { InviteUserDialog, type InviteUserInput } from "@/components/api-portal/InviteUserDialog";
import { EditUserDialog, type EditUserPatch } from "@/components/api-portal/EditUserDialog";
import { ConfirmDialog } from "@/components/api-portal/ConfirmDialog";
import { EmptyState } from "@/components/api-portal/EmptyState";
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
import { Info, MoreHorizontal, Search, User as UserIcon, UserCheck } from "lucide-react";

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
  // Delete Team confirm — TeamCard 의 onDelete 가 즉시 삭제하던 것을 ConfirmDialog 단계 추가
  const [deleteTeamTarget, setDeleteTeamTarget] = useState<Team | null>(null);

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
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  // 초기 탭은 URL 쿼리(?tab=team|pending)에서 가져옴 → 팀 상세에서 breadcrumb로 돌아왔을 때 Team 탭 유지
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"user" | "team" | "pending">(() => {
    const t = searchParams.get("tab");
    return t === "team" || t === "pending" ? t : "user";
  });

  function handleTabChange(next: "user" | "team" | "pending") {
    setActiveTab(next);
    const url = next === "user" ? pathname : `${pathname}?tab=${next}`;
    router.replace(url, { scroll: false });
  }
  const [pendingPage, setPendingPage] = useState(1);
  // editUser !== null 이면 Edit User dialog 가 열림 (EditUserDialog props open 으로 파생)
  const [editUser, setEditUser] = useState<User | null>(null);
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

  function handleInvite(input: InviteUserInput) {
    const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    setUsers((prev) => [
      {
        name: input.email.split("@")[0],
        email: input.email,
        team: input.team === "api-portal" ? "API Portal" : "Default",
        role: input.role.charAt(0).toUpperCase() + input.role.slice(1),
        status: "Invited",
        updatedAt: today,
        updatedAtMs: Date.now(),
      },
      ...prev,
    ]);
    setPage(1);
    toast.success("Invitation sent", {
      description: `An invite has been sent to ${input.email}.`,
    });
  }

  function handleEditUserSave(original: User, patch: EditUserPatch) {
    const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    setUsers((prev) =>
      prev.map((u) =>
        u === original
          ? {
              ...u,
              name: patch.name,
              email: patch.email,
              role: patch.role.charAt(0).toUpperCase() + patch.role.slice(1),
              team: patch.team === "api-portal" ? "API Portal" : "Default",
              updatedAt: today,
              updatedAtMs: Date.now(),
            }
          : u
      )
    );
    toast.success("User updated");
  }

  const pendingUsers = useMemo(() => users.filter(u => u.status === "Verified"), [users]);
  const pendingTotalPages = Math.max(1, Math.ceil(pendingUsers.length / PAGE_SIZE));
  const pendingPaged = pendingUsers.slice((pendingPage - 1) * PAGE_SIZE, pendingPage * PAGE_SIZE);

  function handleApprove(user: User) {
    setUsers(prev => prev.map(u => u === user ? { ...u, status: "Active" as Status } : u));
    toast.success(`${user.name || user.email} approved`);
  }

  function handleResendInvite(user: User) {
    toast.success(`Invitation resent to ${user.email}`);
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
      <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as "user" | "team" | "pending")} className="-mt-2">
        <TabsList>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approvals
            {pendingUsers.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-xs font-medium min-w-[18px] h-[18px] px-1">
                {pendingUsers.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
                      <ActionMenu user={user} onEdit={setEditUser} onDeactivate={setDeactivateTarget} onResend={handleResendInvite} />
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
              onDelete={setDeleteTeamTarget}
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
                    {/* colSpan = 7 (Name/Email/Team/Role/Status/Updated/Action) */}
                    <TableCell colSpan={7} className="py-16">
                      <EmptyState
                        variant="no-data"
                        // TODO: Figma 디자인 확정 시 인스펙트 결과 아이콘으로 교체 (icons.md 워크플로우)
                        icon={<UserCheck />}
                        title="No pending approvals"
                        description="New registrations awaiting review will appear here."
                      />
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

      {/* Invite User — form-dialog 패턴 (patterns/form-dialog.md) */}
      <InviteUserDialog open={open} onOpenChange={setOpen} onInvite={handleInvite} />

      {/* Deactivate / Reject / Delete Team — confirm-dialog 패턴 (patterns/confirm-dialog.md) */}
      <ConfirmDialog
        open={deactivateTarget !== null}
        onOpenChange={(o) => { if (!o) setDeactivateTarget(null); }}
        title="Deactivate User"
        description={
          <>Are you sure you want to deactivate this user ({deactivateTarget?.email})?</>
        }
        confirmLabel="Deactivate"
        onConfirm={handleDeactivateConfirm}
      />
      <ConfirmDialog
        open={rejectTarget !== null}
        onOpenChange={(o) => { if (!o) setRejectTarget(null); }}
        title="Reject registration request"
        description={
          <>Are you sure you want to reject this registration ({rejectTarget?.email}) request?</>
        }
        confirmLabel="Reject"
        onConfirm={handleRejectConfirm}
      />
      <ConfirmDialog
        open={deleteTeamTarget !== null}
        onOpenChange={(o) => { if (!o) setDeleteTeamTarget(null); }}
        title="Delete Team"
        description={
          <>Are you sure you want to delete the <strong className="font-semibold text-foreground">{deleteTeamTarget?.name}</strong> team?</>
        }
        confirmLabel="Delete"
        onConfirm={() => deleteTeamTarget && handleDeleteTeam(deleteTeamTarget)}
      />

      {/* Edit User — form-dialog 패턴 (patterns/form-dialog.md) */}
      <EditUserDialog
        open={editUser !== null}
        onOpenChange={(o) => { if (!o) setEditUser(null); }}
        user={editUser}
        onSave={handleEditUserSave}
        onResendInvite={handleResendInvite}
      />

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
