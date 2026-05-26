"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card className="max-w-4xl mx-auto overflow-hidden bg-gradient-to-br from-surface via-surface to-[#1a1813] border-gold-primary/30 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <CardContent className="p-10 md:p-16 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
              Let’s build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary">practical and polished.</span>
            </h2>
            <p className="text-foreground-muted text-lg mb-10 max-w-2xl mx-auto">
              Sẵn sàng cho các công việc freelance, hợp tác dự án, phát triển sản phẩm hoặc giải quyết các vấn đề kỹ thuật chuyên sâu.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Mail className="w-5 h-5" />
                Email cho tôi
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-border-gold/50 text-foreground-muted hover:text-gold-light">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-border-gold/50 text-foreground-muted hover:text-gold-light">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
