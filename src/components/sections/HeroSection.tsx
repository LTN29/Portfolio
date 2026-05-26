"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 container mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 space-y-8"
      >
        <Badge variant="outline" className="border-gold-primary/30 text-gold-primary py-1 px-3">
          <span className="w-2 h-2 rounded-full bg-green-accent mr-2 inline-block"></span>
          Sẵn sàng cho dự án mới / Xây dựng hệ thống thực tế
        </Badge>
        
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            {portfolioData.personal.roleHeadline[0]}
          </h1>
          <h2 className="text-xl md:text-2xl text-foreground-muted font-medium leading-relaxed">
            {portfolioData.personal.shortDescription}
          </h2>
        </div>

        <p className="text-base md:text-lg text-foreground-muted max-w-2xl leading-relaxed">
          {portfolioData.personal.heroCopy}
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
            Xem dự án
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-[500px] xl:w-[650px] shrink-0"
      >
        <Card className="relative overflow-hidden bg-gradient-to-b from-surface to-background border-gold-primary/30 p-4 md:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          <CardHeader className="pb-8">
            <CardTitle className="text-lg uppercase tracking-widest text-gold-primary flex items-center font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-primary mr-3 shadow-[0_0_12px_rgba(212,175,55,0.6)]"></span>
              System Builder Skill Map
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-y-8 relative z-10">
            {portfolioData.systemStatus.map((item, i) => (
              <div key={i} className="flex flex-col space-y-3 group">
                <span className="text-lg font-bold text-foreground group-hover:text-gold-light transition-colors">
                  {item.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.chips.map((chip, j) => (
                    <Badge key={j} variant="outline" className="bg-surface/50 text-xs py-1 border-border-gold/30 text-foreground-muted font-medium group-hover:border-gold-primary/40 transition-colors">
                      {chip}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
