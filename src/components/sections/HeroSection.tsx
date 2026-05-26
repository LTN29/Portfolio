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
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {portfolioData.personal.roleHeadline[0]}
          </h1>
          <h2 className="text-xl md:text-2xl text-foreground-muted font-medium">
            AI-assisted product builder tập trung vào nền tảng booking, vận hành marketplace, admin dashboards, API integrations và tối ưu hiệu năng trải nghiệm người dùng.
          </h2>
        </div>

        <p className="text-base text-foreground-muted max-w-2xl leading-relaxed">
          {portfolioData.personal.shortDescription}
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button size="lg" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
            Xem dự án
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Liên hệ với tôi
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-[450px]"
      >
        <Card className="relative overflow-hidden bg-gradient-to-b from-surface to-background border-gold-primary/20 p-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-3xl"></div>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm uppercase tracking-wider text-gold-primary flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-primary mr-2"></span>
              System Builder Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {portfolioData.systemStatus.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-sm font-medium text-foreground group-hover:text-gold-light transition-colors">
                  {item.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground-muted">{item.label}</span>
                  {item.active && <span className="w-1.5 h-1.5 rounded-full bg-green-accent shadow-[0_0_5px_#2ECC71]"></span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
