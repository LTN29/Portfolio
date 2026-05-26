"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CoreTechnicalSection() {
  return (
    <section id="capabilities" className="py-12 md:py-20 px-4 md:px-6 container mx-auto relative border-t border-border-gold/20 bg-surface/20">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-8 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-3 md:mb-6">
          Core Technical Capabilities
        </h2>
        <p className="text-[15px] md:text-lg text-foreground-muted max-w-3xl leading-[1.6] md:leading-relaxed">
          Những năng lực kỹ thuật tôi dùng để biến nghiệp vụ thực tế thành hệ thống có thể vận hành, triển khai, kiểm thử và mở rộng.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {portfolioData.coreCapabilities.map((capability, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            className="flex h-full"
          >
            <Card className="w-full flex flex-col bg-surface/50 backdrop-blur-sm border-border-gold/40 hover:border-gold-primary/50 transition-colors p-5 md:p-6">
              <CardHeader className="pb-3 md:pb-4 px-0 pt-0">
                <CardTitle className="text-[18px] md:text-xl text-foreground font-bold">
                  {capability.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 px-0 pb-0 flex-1 flex flex-col">
                <p className="text-[14px] md:text-base text-foreground-muted leading-[1.6] line-clamp-3 sm:line-clamp-none flex-1">
                  {capability.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {capability.chips.map((chip, i) => (
                    <Badge key={i} variant="outline" className="bg-background/80 text-[13px] py-1 px-2.5 border-border-gold/40 text-foreground-muted whitespace-normal">
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
