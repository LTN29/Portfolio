import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-gold-primary to-gold-light text-black hover:opacity-90 shadow-[0_0_15px_rgba(212,175,55,0.2)]": variant === "default",
            "border border-border-gold bg-transparent hover:bg-gold-primary/10 text-gold-primary": variant === "outline",
            "hover:bg-surface text-foreground hover:text-gold-primary": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-md px-8 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
