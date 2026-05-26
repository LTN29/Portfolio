"use client"
import * as React from "react"
import { motion } from "framer-motion"
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
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border-gold bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter text-gold-primary">
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
          <Button variant="outline" size="sm" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Liên hệ
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-surface border-b border-border-gold p-6 flex flex-col space-y-4"
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-foreground hover:text-gold-primary transition-colors block"
            >
              {link.name}
            </a>
          ))}
          <Button variant="default" className="w-full mt-4" onClick={() => {
            setIsOpen(false)
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
          }}>
            Liên hệ
          </Button>
        </motion.div>
      )}
    </header>
  )
}
