import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ── /design-system/primitives/skeleton ───────────────────────
 * Live loading-skeleton demos, focused on the two surfaces we actually
 * build: dashboard (summary cards + chart) and tables (rows, header kept).
 *
 * Skeleton is a variant-less Tier-2 primitive; it gets a catalog page as a
 * deliberate exception because loading *composition* is far easier to judge
 * visually than to read about.
 *
 * Spec: design-system/components/skeleton.md
 * Rule: design-system/rules/states.md §3 (Loading)
 */

export default function SkeletonDemoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-foreground">Skeleton</h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          로딩 자리표시. <code className="rounded bg-muted px-1 py-0.5 text-sm">animate-pulse rounded-md bg-muted</code> —
          크기는 실 콘텐츠에 맞춰 <code className="rounded bg-muted px-1 py-0.5 text-sm">className</code> 으로 지정.
          모든 로딩 placeholder 는 raw <code className="rounded bg-muted px-1 py-0.5 text-sm">animate-pulse bg-muted</code> 대신 이 컴포넌트를 쓴다.
        </p>
        <p className="mt-2 text-sm">
          <a
            href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/skeleton.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-info hover:underline"
          >
            View spec on GitHub →
          </a>
        </p>
      </header>

      {/* Base primitive */}
      <Section
        title="Base primitive"
        description="단일 Skeleton. height / width / radius 를 className 으로 콘텐츠에 맞춘다 (layout shift 최소화)."
      >
        <DemoBox>
          <div className="space-y-3">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </DemoBox>
        <Snippet>{`<Skeleton className="h-4 w-64" />
<Skeleton className="size-10 rounded-full" />  {/* avatar */}`}</Snippet>
      </Section>

      {/* Table loading */}
      <Section
        title="Table — 표 로딩"
        description="헤더는 유지하고 본문만 row skeleton ×N 으로 교체. 셀 skeleton 너비는 실 콘텐츠 폭에 맞춘다. (API Keys 7-컬럼 예시)"
      >
        <DemoBox>
          <div className="overflow-hidden rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Last used</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-5"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DemoBox>
        <Snippet>{`<TableBody>
  {Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>  {/* badge */}
      ...
    </TableRow>
  ))}
</TableBody>`}</Snippet>
        <p className="mt-3 text-sm text-muted-foreground">
          정렬·페이지 전환처럼 데이터 컨텍스트가 유지되는 재요청은 row 를 통째로 교체하지 않는다 — 서버 지연 시 헤더 위 2px indeterminate bar (states.md §3.2).
        </p>
      </Section>

      {/* Dashboard loading */}
      <Section
        title="Dashboard — 대시보드 로딩"
        description="Summary 카드 그리드 + 차트 영역. 카드/차트의 실제 높이·간격을 그대로 유지해 로드 후 점프가 없게 한다."
      >
        <DemoBox>
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-md border border-border bg-card p-4">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="mt-3 h-7 w-20" />
                  <Skeleton className="mt-3 h-3 w-16" />
                </div>
              ))}
            </div>
            {/* Chart area */}
            <div className="rounded-md border border-border bg-card p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-4 h-48 w-full rounded-md" />
            </div>
          </div>
        </DemoBox>
        <Snippet>{`{/* Summary card */}
<div className="rounded-md border border-border bg-card p-4">
  <Skeleton className="h-3.5 w-24" />        {/* label */}
  <Skeleton className="mt-3 h-7 w-20" />     {/* value */}
</div>

{/* Chart area */}
<Skeleton className="h-48 w-full rounded-md" />`}</Snippet>
      </Section>

      {/* Rules quick reference */}
      <Section title="Rules (quick reference)">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-success-border bg-success-subtle/40 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">✓ Do</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>항상 <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;Skeleton /&gt;</code> 사용</li>
              <li>실 콘텐츠와 같은 height·radius·간격</li>
              <li>테이블은 헤더 유지, 본문만 교체</li>
              <li>카드/차트는 실제 박스 크기 유지</li>
            </ul>
          </div>
          <div className="rounded-md border border-destructive-border bg-destructive-subtle/40 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">✗ Don&apos;t</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>raw <code className="rounded bg-muted px-1 py-0.5 text-xs">animate-pulse bg-muted</code> 직접 작성</li>
              <li>정렬·페이지 전환 시 row 통째 교체</li>
              <li>캐시 백그라운드 재검증에 인디케이터 표시</li>
              <li>콘텐츠와 다른 크기 → 로드 후 점프</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Cross-refs */}
      <Section title="Cross-refs">
        <ul className="list-disc space-y-1 pl-6 text-sm">
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/rules/states.md">
            rules/states.md — Loading/Empty/Error 매트릭스 + §3 Loading 상세
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/patterns/table-list-page.md">
            patterns/table-list-page.md — 테이블 페이지 골격
          </CrossRef>
          <CrossRef href="https://github.com/jaesungjoe-sudo/api-portal/blob/main/design-system/components/skeleton.md">
            components/skeleton.md — 스펙
          </CrossRef>
        </ul>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-1 text-xl font-semibold text-foreground">{title}</h2>
      {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
      {children}
    </section>
  );
}

function DemoBox({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-card p-6">{children}</div>;
}

function Snippet({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/30 p-4 text-xs font-mono text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function CrossRef({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
        {children}
      </a>
    </li>
  );
}
