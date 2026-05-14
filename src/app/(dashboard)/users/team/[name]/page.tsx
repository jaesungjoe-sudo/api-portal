"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
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
import { SortableHead, type SortDir } from "@/components/api-portal/sortable-head";
import { TablePagination } from "@/components/api-portal/table-pagination";
import { StatusBadge } from "@/components/api-portal/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import { EditTeamDialog } from "@/components/api-portal/EditTeamDialog";
import { INITIAL_USERS, findTeam, updateTeam, type Team, type User } from "@/lib/mock-team-data";

type SortKey = "name" | "email" | "status" | "role" | "updatedAtMs";
const PAGE_SIZE = 10;

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: rawName } = use(params);
  const teamName = decodeURIComponent(rawName);
  const router = useRouter();
  // 모듈 store에서 검색 → list 페이지에서 만든 팀의 description도 가져옴
  // Edit 후 description 갱신 / rename 후 URL 동기화를 위해 state로 유지
  const [team, setTeam] = useState<Team>(
    () => findTeam(teamName) ?? { name: teamName, description: "" }
  );
  useEffect(() => {
    setTeam(findTeam(teamName) ?? { name: teamName, description: "" });
  }, [teamName]);

  const [editOpen, setEditOpen] = useState(false);

  function handleUpdateTeam(
    originalName: string,
    patch: { name: string; description: string }
  ) {
    updateTeam(originalName, patch);
    toast.success(`Team "${patch.name}" updated`);
    if (patch.name !== originalName) {
      // rename: URL 자체를 새 이름으로 교체 → 재-mount 시 useState init으로 새 team 로드
      router.replace(`/users/team/${encodeURIComponent(patch.name)}`);
    } else {
      setTeam((prev) => ({ ...prev, description: patch.description }));
    }
  }

  const members = useMemo(
    () => INITIAL_USERS.filter((u) => u.team === teamName),
    [teamName]
  );

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return members;
    return [...members].sort((a, b) => {
      const av = a[sortKey as keyof User] as string | number;
      const bv = b[sortKey as keyof User] as string | number;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [members, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          <BreadcrumbItem><BreadcrumbLink href="/users?tab=team">User &amp; Team management</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{team.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header — Figma: VERTICAL gap=6
            Row 1 (HORIZONTAL, SPACE_BETWEEN): title 좌 / 3-dot 우
            Row 2: description */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-1.5">
          <h1 className="text-3xl font-semibold text-foreground">{team.name}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Actions for ${team.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="px-2 py-1.5"
                onClick={() => setEditOpen(true)}
              >
                Edit
              </DropdownMenuItem>
              {/* Default 같은 시스템 팀은 삭제 불가 (team.protected = true) */}
              {!team.protected && (
                <DropdownMenuItem
                  className="px-2 py-1.5"
                  onClick={() => toast.info(`Delete team "${team.name}" — Phase1 design pending`)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground">{team.description}</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-8 text-sm" placeholder="Search User" />
        </div>
        <Button
          onClick={() =>
            toast.info(`Invite User to ${team.name} — Phase1 design pending`)
          }
        >
          Invite User
        </Button>
      </div>

      {/* Members Table */}
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
              <TableHead className="min-w-[110px]">
                <SortableHead col="status" {...sp}>Status</SortableHead>
              </TableHead>
              <TableHead className="min-w-[100px]">
                <SortableHead col="role" {...sp}>Role</SortableHead>
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortableHead col="updatedAtMs" {...sp}>Updated</SortableHead>
              </TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                  No list
                </TableCell>
              </TableRow>
            ) : (
              paged.map((user, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-5 text-sm font-medium text-foreground">{user.name}</TableCell>
                  <TableCell className="text-sm text-foreground">{user.email}</TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell className="text-sm text-foreground">{user.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.updatedAt}</TableCell>
                  <TableCell />
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <EditTeamDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        team={team}
        onSave={handleUpdateTeam}
      />
    </div>
  );
}
