import { Button } from "@/components/ui/button";

/**
 * EmptyState — baseline component for empty surfaces (tables, card grids,
 * widgets, etc.). Implements design-system/components/empty-state.md.
 *
 * Container padding is the parent's responsibility (rules/states.md §4.2):
 *   table body py-16, chart py-10, form py-8, widget py-6
 *
 * Anti-patterns:
 *   - Plain <p>No data</p> instead of <EmptyState> (states.md §4.1)
 *   - Setting padding on EmptyState itself (parent should)
 *   - no-data variant without icon
 *   - no-results variant with primary CTA
 */
export type EmptyStateAction = {
  label: string;
  onClick: () => void;
  /**
   * Defaults to "default" for no-data variant and "ghost" for no-results.
   * Override when you need a specific weight.
   */
  variant?: "default" | "ghost" | "outline" | "secondary";
};

export function EmptyState({
  variant,
  icon,
  title,
  description,
  action,
}: {
  variant: "no-data" | "no-results";
  /** Required for no-data, optional for no-results. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}) {
  // Default CTA variant by EmptyState variant — overridable via action.variant
  const ctaVariant = action?.variant ?? (variant === "no-data" ? "default" : "ghost");

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {icon && (
        <span className="flex size-10 items-center justify-center text-muted-foreground [&_svg]:size-10">
          {icon}
        </span>
      )}
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <div className="mt-2">
          <Button variant={ctaVariant} onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
