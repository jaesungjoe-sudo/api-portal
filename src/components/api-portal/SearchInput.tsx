import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * List-page toolbar search field — a leading magnifier icon over an Input.
 * Encapsulates the `relative w-60` wrapper + `pl-8 h-8 text-sm` Input + absolute icon.
 * Forwards all Input props (placeholder, value, onChange, …).
 *
 * Spec: design-system/components/search.md · Pattern: patterns/table-list-page.md §5
 */
type SearchInputProps = React.ComponentProps<typeof Input> & {
  /** Override the wrapper (default width `w-60`). */
  wrapperClassName?: string;
};

function SearchInput({ className, wrapperClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative w-60", wrapperClassName)}>
      <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn("h-8 pl-8 text-sm", className)} {...props} />
    </div>
  );
}

export { SearchInput };
