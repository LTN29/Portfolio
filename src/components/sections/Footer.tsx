import * as React from "react"
import { portfolioData } from "@/data/portfolio"

export function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="py-8 px-6 border-t border-border-gold/20 bg-background text-center">
      <div className="container mx-auto">
        <p className="text-sm text-foreground-muted">
          © {year} {portfolioData.personal.name}. All rights reserved.
        </p>
        <p className="text-xs text-foreground-muted/50 mt-2">
          Designed with a focus on product thinking & performance.
        </p>
      </div>
    </footer>
  )
}
