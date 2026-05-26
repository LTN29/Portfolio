"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server } from "lucide-react"

export function LearningGrowthSection() {
  return (
    <section id="learning-growth" className="py-12 md:py-20 px-4 md:px-6 container mx-auto relative">
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-3 md:mb-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
          <Server className="w-6 h-6 md:w-8 md:h-8 text-gold-primary" />
          <span>Learning & Engineering Growth</span>
        </h2>
        <p className="text-[15px] md:text-lg text-foreground-muted max-w-2xl mx-auto leading-[1.6]">
          Các mảng kiến thức tôi đang tiếp tục nâng cao để triển khai hệ thống ổn định hơn.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {portfolioData.learningGrowthCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full bg-surface/30 hover:bg-surface/50 border-border-gold/30 hover:border-gold-primary/40 transition-all">
              <CardHeader className="pb-3 px-5 pt-5">
                <CardTitle className="text-[16px] md:text-lg font-bold text-foreground border-b border-border-gold/20 pb-2">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0">
                <div className="flex flex-wrap gap-2 md:gap-2.5">
                  {category.items.map((item, i) => (
                    <span key={i} className="inline-flex items-center text-[13px] md:text-sm font-medium text-foreground-muted bg-background/50 px-3 py-1.5 rounded-full border border-border-gold/20 hover:text-gold-light hover:border-gold-primary/30 transition-colors whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-accent mr-2 shrink-0 shadow-[0_0_5px_#2ECC71]"></span>
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
