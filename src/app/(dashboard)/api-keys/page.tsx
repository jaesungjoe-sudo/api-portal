"use client";

import { useMemo, useState } from "react";
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
import { ApiKeyStatusBadge } from "@/components/api-portal/ApiKeyStatusBadge";
import { CreateApiKeyDialog } from "@/components/api-portal/CreateApiKeyDialog";
import { ViewApiKeyDialog } from "@/components/api-portal/ViewApiKeyDialog";
import { EditApiKeyDialog } from "@/components/api-portal/EditApiKeyDialog";
import { DeleteApiKeyDialog } from "@/components/api-portal/DeleteApiKeyDialog";
import { RevokeApiKeyDialog } from "@/components/api-portal/RevokeApiKeyDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search } from "lucide-react";
import {
  INITIAL_API_KEYS,
  computeExpiry,
  expiresSortKey,
  formatDate,
  generateApiKeyValue,
  type ApiKey,
  type ExpiryOption,
} from "@/lib/mock-api-keys";

type SortKey = "name" | "expiresMs" | "lastUsedMs" | "createdMs";

const PAGE_SIZE = 10;

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_API_KEYS);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<{ name: string; value: string; expiry: ExpiryOption } | null>(null);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  function handleCreateKey(name: string, expiry: ExpiryOption) {
    const ts = Date.now();
    const value = generateApiKeyValue();
    const { expiresMs, expiresLabel } = computeExpiry(expiry);
    const newKey: ApiKey = {
      id: `k-${ts}`,
      name,
      token: value.slice(0, 8) + "...",
      fullToken: value,
      status: "Active",
      owner: "Jaesung Min",
      expiresMs,
      expiresLabel,
      lastUsedMs: 0,
      lastUsedLabel: "-",
      createdMs: ts,
      createdLabel: formatDate(ts),
      expiry,
    };
    setKeys((prev) => [newKey, ...prev]);
    setCreatedKey({ name, value, expiry });
  }

  function handleEditKey(newName: string, newExpiry: ExpiryOption) {
    if (!editingKey) return;
    const original = editingKey;
    const expiryChanged = newExpiry !== original.expiry;
    const { expiresMs, expiresLabel } = expiryChanged
      ? computeExpiry(newExpiry)
      : { expiresMs: original.expiresMs, expiresLabel: original.expiresLabel };
    // Revoked 상태는 Edit으로 부활 못 함 (의도된 무효화 보존). 그 외엔 expiresMs로 재판정.
    const status: ApiKey["status"] =
      original.status === "Revoked"
        ? "Revoked"
        : expiresMs !== null && expiresMs < Date.now()
          ? "Expired"
          : "Active";
    setKeys((prev) =>
      prev.map((k) =>
        k.id === original.id
          ? { ...k, name: newName, expiry: newExpiry, expiresMs, expiresLabel, status }
          : k
      )
    );
    if (newName !== original.name) {
      toast.success(`API key renamed to "${newName}"`);
    } else if (expiryChanged) {
      toast.success(`API key "${newName}" updated`);
    }
  }

  function handleDeleteKey() {
    if (!deletingId) return;
    const target = keys.find((k) => k.id === deletingId);
    setKeys((prev) => prev.filter((k) => k.id !== deletingId));
    if (target) toast.success(`API key "${target.name}" deleted`);
  }

  function handleRevokeKey() {
    if (!revokingId) return;
    const target = keys.find((k) => k.id === revokingId);
    // Revoke = 명시적 무효화. status만 "Revoked"로 변경, expiresMs/Label은 원래 값 유지.
    setKeys((prev) =>
      prev.map((k) => (k.id === revokingId ? { ...k, status: "Revoked" } : k))
    );
    if (target) toast.success(`API key "${target.name}" revoked`);
  }

  function handleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return keys;
    return [...keys].sort((a, b) => {
      const av = sortKey === "expiresMs" ? expiresSortKey(a.expiresMs) : a[sortKey];
      const bv = sortKey === "expiresMs" ? expiresSortKey(b.expiresMs) : b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [keys, sortKey, sortDir]);

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
          <BreadcrumbItem><BreadcrumbPage>API Keys</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title + subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-foreground">API Keys</h1>
        <p className="text-sm text-muted-foreground">Production expires in 5 days</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-8 text-sm" placeholder="Search" />
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create API Key</Button>
      </div>

      {/* Table — 컬럼 순서: Name | Owner | Key | Status | Expires | Last used | Created | Action */}
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px] pl-5">
                <SortableHead col="name" {...sp}>Name</SortableHead>
              </TableHead>
              <TableHead className="min-w-[160px]">Owner</TableHead>
              <TableHead className="min-w-[140px]">Key</TableHead>
              <TableHead className="w-[110px]">Status</TableHead>
              <TableHead className="min-w-[200px]">
                <SortableHead col="expiresMs" {...sp}>Expires</SortableHead>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortableHead col="lastUsedMs" {...sp}>Last used</SortableHead>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortableHead col="createdMs" {...sp}>Created</SortableHead>
              </TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((k) => (
              <TableRow key={k.id}>
                <TableCell className="pl-5 text-sm font-medium text-foreground">{k.name}</TableCell>
                <TableCell className="text-sm text-foreground">{k.owner}</TableCell>
                <TableCell className="text-sm text-foreground font-mono">{k.token}</TableCell>
                <TableCell>
                  <ApiKeyStatusBadge status={k.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{k.expiresLabel}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{k.lastUsedLabel}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{k.createdLabel}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Actions for ${k.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem
                        className="px-2 py-1.5"
                        onClick={() => setEditingKey(k)}
                      >
                        Edit API Key
                      </DropdownMenuItem>
                      {k.status === "Active" && (
                        <DropdownMenuItem
                          className="px-2 py-1.5"
                          onClick={() => setRevokingId(k.id)}
                        >
                          Revoke API Key
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="px-2 py-1.5"
                        onClick={() => setDeletingId(k.id)}
                      >
                        Delete API Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateApiKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreateKey}
      />

      <ViewApiKeyDialog
        open={createdKey !== null}
        onOpenChange={(o) => { if (!o) setCreatedKey(null); }}
        keyName={createdKey?.name ?? ""}
        keyValue={createdKey?.value ?? ""}
        expiry={createdKey?.expiry ?? ""}
      />

      <EditApiKeyDialog
        open={editingKey !== null}
        onOpenChange={(o) => { if (!o) setEditingKey(null); }}
        initialKey={editingKey}
        onSave={handleEditKey}
      />

      <DeleteApiKeyDialog
        open={deletingId !== null}
        onOpenChange={(o) => { if (!o) setDeletingId(null); }}
        onDelete={handleDeleteKey}
      />

      <RevokeApiKeyDialog
        open={revokingId !== null}
        onOpenChange={(o) => { if (!o) setRevokingId(null); }}
        onRevoke={handleRevokeKey}
      />
    </div>
  );
}
