import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TocSidebar, type TocItem } from "@/components/api-portal/TocSidebar";

export type DocsNavLink = { label: string; href: string };

export function DocsPageShell({
  breadcrumb,
  title,
  description,
  toc,
  prev,
  next,
  children,
}: {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  description?: string;
  toc?: TocItem[];
  prev?: DocsNavLink;
  next?: DocsNavLink;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center px-10 pb-20 pt-10">
      <div className="flex w-full max-w-[1160px] gap-10">
        {/* Center content */}
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              {breadcrumb.map((item, i) => {
                const isLast = i === breadcrumb.length - 1;
                return (
                  <span key={i} className="contents">
                    <BreadcrumbItem>
                      {isLast || !item.href ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="mb-10 text-base text-muted-foreground">{description}</p>
          )}

          {/* Sections */}
          <div className="flex flex-col gap-10">{children}</div>

          {/* Bottom nav */}
          {(prev || next) && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-10">
              <div>
                {prev && (
                  <Link
                    href={prev.href}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {prev.label}
                  </Link>
                )}
              </div>
              <div>
                {next && (
                  <Link
                    href={next.href}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {next.label}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right TOC */}
        {toc && toc.length > 0 && <TocSidebar items={toc} />}
      </div>
    </div>
  );
}

/** 섹션 헤더 + 내용. id는 TOC 매칭용. */
export function DocsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="mb-4 text-2xl font-semibold text-foreground">{title}</h2>
      <div className="flex flex-col gap-3 text-base leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}
