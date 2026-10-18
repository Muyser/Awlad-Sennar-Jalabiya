import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-[#1a2c6b]/20 bg-white px-4 py-3 text-base text-[#1a2c6b] shadow-sm placeholder:text-[#1a2c6b]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2c6b] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rtl text-right",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Textarea.displayName = "Textarea"

export { Textarea }