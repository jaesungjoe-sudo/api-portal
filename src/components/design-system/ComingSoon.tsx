import { Clock, ExternalLink } from "lucide-react";

/**
 * Placeholder for catalog pages whose visual content hasn't been built yet.
 * Surfaces a link to the underlying .md spec on GitHub when provided.
 */
export function ComingSoon({
  title,
  description,
  doc,
}: {
  title: string;
  description?: string;
  /** Path to the .md spec, relative to repo root. e.g. "design-system/components/button.md" */
  doc?: string;
}) {
  const docUrl = doc
    ? `https://github.com/jaesungjoe-sudo/api-portal/blob/main/${doc}`
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 text-base text-muted-foreground">{description}</p>
        )}
      </header>

      <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-card py-16 text-center">
        <Clock className="h-10 w-10 text-muted-foreground" />
        <p className="text-base font-medium text-foreground">Coming soon</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This page is still being built.
        </p>
        {docUrl && (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-info hover:underline"
          >
            View .md spec on GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
