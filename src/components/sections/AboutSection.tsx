"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 container mx-auto relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary">
          Mindset Làm Việc
        </h2>
        
        <div className="relative">
          <span className="text-8xl text-gold-primary/10 absolute -top-8 -left-4 font-serif">"</span>
          <p className="text-lg md:text-xl text-foreground-muted leading-relaxed relative z-10 font-medium italic">
            {portfolioData.personal.about}
          </p>
          <span className="text-8xl text-gold-primary/10 absolute -bottom-16 -right-4 font-serif">"</span>
        </div>
      </motion.div>
    </section>
  )
}
