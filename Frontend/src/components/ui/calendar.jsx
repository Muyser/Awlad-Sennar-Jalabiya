import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white text-[#1a2c6b]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 sm:space-x-reverse",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-sm font-heading font-bold text-[#1a2c6b]",
        nav: "space-x-1 flex items-center space-x-reverse",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 border-[#1a2c6b]/20 text-[#1a2c6b] hover:bg-[#1a2c6b]/5 hover:text-[#1a2c6b] opacity-70 hover:opacity-100 transition-colors"
        ),
        nav_button_previous: "absolute right-1",
        nav_button_next: "absolute left-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[#1a2c6b]/60 rounded-md w-9 font-medium text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#1a2c6b]/10 [&:has([aria-selected].day-outside)]:bg-[#1a2c6b]/5 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-[#1a2c6b] hover:bg-[#1a2c6b]/10 hover:text-[#1a2c6b] aria-selected:opacity-100 rounded-sm"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#f28c28] text-white hover:bg-[#e07b1e] hover:text-white focus:bg-[#f28c28] focus:text-white shadow-sm",
        day_today: "bg-[#1a2c6b]/10 font-bold text-[#1a2c6b]",
        day_outside:
          "day-outside text-[#1a2c6b]/30 aria-selected:bg-[#1a2c6b]/5 aria-selected:text-[#1a2c6b]/50",
        day_disabled: "text-[#1a2c6b]/20 opacity-50",
        day_range_middle:
          "aria-selected:bg-[#1a2c6b]/10 aria-selected:text-[#1a2c6b]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }