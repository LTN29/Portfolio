"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardContent } from "@/components/ui/card"
import { Server } from "lucide-react"

export function LearningGrowthSection() {
  return (
    <section id="learning-growth" className="py-20 px-6 container mx-auto relative">
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4 flex items-center justify-center gap-3">
          <Server className="w-8 h-8 text-gold-primary" />
          Learning & Engineering Growth
        </h2>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Các mảng kiến thức tôi đang tiếp tục nâng cao để triển khai hệ thống ổn định hơn.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioData.learningGrowth.map((credential, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full bg-surface/40 hover:bg-surface border-border-gold/30 hover:border-gold-primary/30 transition-all">
              <CardContent className="p-4 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-accent mr-3 shrink-0 shadow-[0_0_5px_#2ECC71]"></span>
                <span className="text-sm font-medium text-foreground-muted group-hover:text-gold-light transition-colors">
                  {credential}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
