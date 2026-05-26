"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CoreTechnicalSection() {
  return (
    <section id="capabilities" className="py-20 px-6 container mx-auto relative border-t border-border-gold/20 bg-surface/20">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-6">
          Core Technical Capabilities
        </h2>
        <p className="text-lg text-foreground-muted max-w-3xl leading-relaxed">
          Những năng lực kỹ thuật tôi dùng để biến nghiệp vụ thực tế thành hệ thống có thể vận hành, triển khai, kiểm thử và mở rộng.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolioData.coreCapabilities.map((capability, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full bg-surface/50 backdrop-blur-sm border-border-gold/40 hover:border-gold-primary/50 transition-colors p-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-foreground font-bold">
                  {capability.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base text-foreground-muted leading-relaxed">
                  {capability.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {capability.chips.map((chip, i) => (
                    <Badge key={i} variant="outline" className="bg-background text-xs py-1 border-border-gold/50 text-foreground-muted">
                      {chip}
                    </Badge>
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
