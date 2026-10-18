"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-left"
      className="toaster group rtl text-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1a2c6b] group-[.toaster]:border-[#1a2c6b]/10 group-[.toaster]:shadow-2xl rtl text-right font-sans",
          description: "group-[.toast]:text-[#1a2c6b]/60 text-right",
          actionButton:
            "group-[.toast]:bg-[#1a2c6b] group-[.toast]:text-white font-medium hover:bg-[#1a2c6b]/90",
          cancelButton:
            "group-[.toast]:bg-[#1a2c6b]/10 group-[.toast]:text-[#1a2c6b] hover:bg-[#1a2c6b]/20",
          success: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-[#f28c28]",
          error: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-red-500",
        },
      }}
      {...props} />
  );
}

export { Toaster }