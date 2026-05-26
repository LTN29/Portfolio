"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export function FeaturedWorkSection() {
  return (
    <section id="work" className="py-20 px-6 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-6">
          Selected System Work
        </h2>
        <p className="text-lg text-foreground-muted max-w-3xl leading-relaxed">
          Một số hệ thống thực tế tôi đã xây dựng hoặc tham gia thiết kế flow, logic, giao diện và vận hành kỹ thuật.
        </p>
      </motion.div>

      <div className="space-y-12">
        {portfolioData.featuredWorks.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-border-gold/50 hover:border-gold-primary/30 group">
              <div className="flex flex-col">
                <div className="p-8 md:p-10 space-y-6">
                  <div>
                    <Badge variant="default" className="mb-4">
                      {work.type}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-gold-light transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-lg text-foreground-muted leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gold-primary uppercase tracking-wider mb-4">Điểm nổi bật</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {work.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start text-base text-foreground-muted">
                          <CheckCircle2 className="w-5 h-5 text-green-accent mr-3 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-border-gold/30">
                    <div className="flex flex-wrap gap-2.5">
                      {work.stack.map((tech, i) => (
                        <span key={i} className="text-sm px-3 py-1.5 bg-surface rounded-md border border-border-gold/30 text-foreground font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
