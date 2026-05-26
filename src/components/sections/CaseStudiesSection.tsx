"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"

export function CaseStudiesSection() {
  return (
    <section id="cases" className="py-20 px-6 container mx-auto bg-surface/30 border-y border-border-gold/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4">
          Problem Solving
        </h2>
        <p className="text-foreground-muted max-w-2xl">
          Cách tôi tiếp cận và giải quyết các vấn đề kỹ thuật chuyên sâu trong dự án thực tế.
        </p>
      </motion.div>

      <div className="space-y-8">
        {portfolioData.caseStudies.map((caseStudy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row gap-6 p-6 rounded-[20px] bg-background border border-border-gold/30 hover:border-gold-primary/40 transition-colors"
          >
            <div className="md:w-1/3 shrink-0">
              <h3 className="text-xl font-bold text-foreground mb-2">{caseStudy.title}</h3>
              <div className="h-1 w-12 bg-gold-primary/50 rounded-full mt-4"></div>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-2">Vấn đề</h4>
                <p className="text-sm text-foreground-muted leading-relaxed">{caseStudy.problem}</p>
                {caseStudy.rootCause && (
                  <>
                    <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mt-4 mb-2">Root Cause</h4>
                    <p className="text-sm text-foreground-muted leading-relaxed">{caseStudy.rootCause}</p>
                  </>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gold-primary uppercase tracking-wider mb-2">Giải pháp & Kết quả</h4>
                <p className="text-sm text-foreground-muted leading-relaxed mb-3">{caseStudy.solution}</p>
                <div className="p-3 bg-surface/50 rounded-lg border border-border-gold/20">
                  <p className="text-sm text-gold-light font-medium">{caseStudy.result}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
