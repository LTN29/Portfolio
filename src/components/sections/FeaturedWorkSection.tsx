"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardContent } from "@/components/ui/card"
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
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4">
          Dự Án Tiêu Biểu
        </h2>
        <p className="text-foreground-muted max-w-2xl">
          Các hệ thống thực tế tôi đã xây dựng, tập trung vào giải quyết bài toán kinh doanh, trải nghiệm người dùng và tính ổn định.
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
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-8 md:p-10 space-y-6">
                  <div>
                    <Badge variant="default" className="mb-4">
                      {work.type}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-gold-light transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-foreground-muted leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gold-primary uppercase tracking-wider mb-3">Điểm nổi bật</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {work.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start text-sm text-foreground-muted">
                          <CheckCircle2 className="w-4 h-4 text-green-accent mr-2 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border-gold/30">
                    <div className="flex flex-wrap gap-2">
                      {work.stack.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-surface rounded-md border border-border-gold/20 text-foreground-muted">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Decorative Visual Area */}
                <div className="hidden lg:block w-[300px] xl:w-[400px] bg-gradient-to-br from-background to-surface border-l border-border-gold/30 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-primary via-transparent to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-gold-primary/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-gold-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        <div className="w-8 h-8 bg-gold-primary/20 rounded-full blur-sm"></div>
                      </div>
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
