"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Badge } from "@/components/ui/badge"

export function StackSection() {
  return (
    <section id="stack" className="py-12 md:py-20 px-4 md:px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-10 md:mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-3 md:mb-4">
          Tech Stack & Workflow
        </h2>
        <p className="text-[15px] md:text-base text-foreground-muted max-w-2xl mx-auto leading-[1.6]">
          Công cụ và công nghệ tôi sử dụng hàng ngày để xây dựng sản phẩm.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        {portfolioData.stackCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05 }}
            className="space-y-4 md:space-y-5"
          >
            <h3 className="text-[18px] md:text-lg font-semibold text-foreground border-b border-border-gold/30 pb-2 md:pb-3">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-2.5">
              {category.items.map((item, i) => (
                <Badge key={i} variant="outline" className="bg-surface/50 text-[13px] md:text-sm py-1 md:py-1.5 px-3 hover:bg-surface hover:text-gold-light transition-colors whitespace-nowrap">
                  {item}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
