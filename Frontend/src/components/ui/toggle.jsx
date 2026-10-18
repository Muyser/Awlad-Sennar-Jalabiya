import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-colors hover:bg-[#1a2c6b]/10 hover:text-[#1a2c6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2c6b] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-[#1a2c6b] data-[state=on]:text-white text-[#1a2c6b] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rtl",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-[#1a2c6b]/20 bg-transparent shadow-sm hover:bg-[#1a2c6b]/10 hover:text-[#1a2c6b]",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-8 px-2.5 min-w-8 text-xs",
        lg: "h-12 px-4 min-w-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props} />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }