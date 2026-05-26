import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "active"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-primary focus:ring-offset-2",
        {
          "border-transparent bg-gold-primary/10 text-gold-primary": variant === "default",
          "border-border-gold text-foreground-muted": variant === "outline",
          "border-transparent bg-green-accent/10 text-green-accent": variant === "active",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
