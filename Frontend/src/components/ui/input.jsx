import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[#1a2c6b]/20 bg-white px-3 py-1 text-base text-[#1a2c6b] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1a2c6b] placeholder:text-[#1a2c6b]/40 focus-visible:outline-none focus-visible:border-[#1a2c6b] focus-visible:ring-2 focus-visible:ring-[#1a2c6b]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-right",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }