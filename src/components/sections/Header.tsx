"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { portfolioData } from "@/data/portfolio"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  const links = [
    { name: "Dự án", href: "#work" },
    { name: "Chuyên môn", href: "#expertise" },
    { name: "Case Studies", href: "#cases" },
    { name: "Công nghệ", href: "#stack" },
    { name: "Về tôi", href: "#about" },
    { name: "Liên hệ", href: "#contact" },
  ]

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-gold bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter text-gold-primary z-50">
          {portfolioData.personal.logoText}
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground-muted hover:text-gold-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground z-50 p-2 -mr-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="text-gold-primary" /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-20 bg-background border-t border-border-gold/30 p-6 flex flex-col space-y-6 overflow-y-auto pb-24 shadow-2xl"
          >
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground hover:text-gold-primary transition-colors block py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
