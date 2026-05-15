"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type ToggleGroupContextValue = VariantProps<typeof toggleGroupItemVariants>;

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: "outlined",
  size: "default",
});

const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      outlined: "h-9",
      pill: "rounded-md border border-border bg-background p-0.5",
    },
  },
  defaultVariants: {
    variant: "outlined",
  },
});

const toggleGroupItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-foreground transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outlined:
          "h-9 border border-border bg-background px-4 hover:bg-accent data-[pressed]:bg-accent first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:-ml-px",
        pill:
          "rounded-sm px-3 text-xs text-muted-foreground hover:text-foreground data-[pressed]:bg-accent data-[pressed]:text-foreground",
      },
      size: {
        default: "",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "outlined",
      size: "default",
    },
  },
);

type ToggleGroupProps = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive>,
  "value" | "defaultValue" | "onValueChange" | "multiple"
> &
  VariantProps<typeof toggleGroupVariants> &
  VariantProps<typeof toggleGroupItemVariants> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  };

function ToggleGroup({
  className,
  variant = "outlined",
  size = "default",
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      value={value !== undefined ? [value] : undefined}
      defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
      onValueChange={(next) => onValueChange?.(next[0] ?? "")}
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

type ToggleGroupItemProps = React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleGroupItemVariants>;

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: ToggleGroupItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(
        toggleGroupItemVariants({
          variant: variant ?? ctx.variant,
          size: size ?? ctx.size,
        }),
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants };
