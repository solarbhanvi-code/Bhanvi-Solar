import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink-950 text-white",
        solar: "border-transparent bg-solar-500/15 text-solar-700",
        energy: "border-transparent bg-energy-500/15 text-energy-700",
        outline: "border-border text-ink-950",
        muted: "border-transparent bg-mist-100 text-muted-foreground",
        destructive: "border-transparent bg-red-100 text-red-700",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
