"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Badge } from "@/components/ui/badge"

export function StackSection() {
  return (
    <section id="stack" className="py-20 px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4">
          Tech Stack & Workflow
        </h2>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Công cụ và công nghệ tôi sử dụng hàng ngày để xây dựng sản phẩm.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {portfolioData.stackCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground border-b border-border-gold/30 pb-2">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item, i) => (
                <Badge key={i} variant="outline" className="bg-surface/50 hover:bg-surface hover:text-gold-light transition-colors">
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
