import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center rtl", className)}
    {...props}>
    <SliderPrimitive.Track
      className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#1a2c6b]/10">
      <SliderPrimitive.Range className="absolute h-full bg-[#1a2c6b]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-5 w-5 rounded-full border-2 border-[#1a2c6b] bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2c6b] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#1a2c6b]/5" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }