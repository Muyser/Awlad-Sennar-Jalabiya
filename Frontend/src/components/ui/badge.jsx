import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a2c6b] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#1a2c6b] text-white shadow hover:bg-[#1a2c6b]/90",
        secondary:
          "border-transparent bg-[#f28c28] text-white hover:bg-[#e07b1e]",
        success:
          "border-green-200 bg-green-50 text-green-700",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700",
        destructive:
          "border-red-200 bg-red-50 text-red-700 shadow-sm",
        outline: 
          "border-[#1a2c6b]/20 text-[#1a2c6b] bg-transparent hover:bg-[#1a2c6b]/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }