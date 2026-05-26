"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function ExpertiseSection() {
  return (
    <section id="expertise" className="py-20 px-6 container mx-auto relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4">
          Chuyên Môn Cốt Lõi
        </h2>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Phát triển toàn diện từ giao diện người dùng đến logic nghiệp vụ backend và quy trình vận hành.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioData.expertise.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full bg-surface/50 backdrop-blur-sm hover:bg-surface border-border-gold/40">
              <CardHeader>
                <CardTitle className="text-lg text-gold-primary">
                  {exp.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {exp.skills.map((skill, i) => (
                    <li key={i} className="text-sm text-foreground-muted flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-primary/50 mt-1.5 mr-2 shrink-0"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
