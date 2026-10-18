import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#1a2c6b]/10", className)}
      {...props} />
  );
}

export { Skeleton }