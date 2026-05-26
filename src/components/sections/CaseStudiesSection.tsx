"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"

export function CaseStudiesSection() {
  return (
    <section id="cases" className="py-16 md:py-24 px-4 md:px-6 container mx-auto bg-surface/30 border-y border-border-gold/20 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 md:mb-16 text-center md:text-left"
      >
        <h2 className="text-3xl md:text-[40px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-4 md:mb-6 tracking-tight">
          Problem Solving
        </h2>
        <p className="text-[16px] md:text-[18px] text-foreground-muted max-w-3xl leading-[1.7] mx-auto md:mx-0">
          Cách tôi tiếp cận và giải quyết các vấn đề kỹ thuật, vận hành và hiệu năng trong dự án thực tế.
        </p>
      </motion.div>

      <div className="space-y-8 md:space-y-12">
        {portfolioData.caseStudies.map((caseStudy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col lg:flex-row gap-8 md:gap-10 p-6 md:p-10 rounded-2xl border border-border-gold/15 transition-all duration-300 hover:border-gold-primary/30 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.12)] group relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(14,12,8,0.96), rgba(9,9,8,0.98))'
            }}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(212,175,55,0.05), transparent 50%)'
            }}></div>

            <div className="lg:w-[32%] shrink-0 relative z-10">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-[20px] md:text-[24px] font-bold text-foreground mb-4 group-hover:text-gold-light transition-colors leading-[1.3] pr-4">
                  {caseStudy.title}
                </h3>
                <div className="h-[3px] w-12 bg-gold-primary/40 rounded-full group-hover:w-20 group-hover:bg-gold-primary/80 transition-all duration-500"></div>
              </div>
            </div>
            
            <div className="lg:w-[68%] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10 md:gap-y-10 relative z-10">
              {/* Problem */}
              <div className="space-y-3">
                <h4 className="text-[12px] md:text-[13px] font-bold text-foreground-muted uppercase tracking-[0.15em] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/70 mr-2.5"></span>
                  Vấn đề
                </h4>
                <p className="text-[14px] md:text-[15px] text-foreground-muted/90 leading-[1.65]">
                  {caseStudy.problem}
                </p>
              </div>

              {/* Root Cause */}
              {caseStudy.rootCause && (
                <div className="space-y-3">
                  <h4 className="text-[12px] md:text-[13px] font-bold text-foreground-muted uppercase tracking-[0.15em] flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/70 mr-2.5"></span>
                    Root Cause
                  </h4>
                  <p className="text-[14px] md:text-[15px] text-foreground-muted/90 leading-[1.65]">
                    {caseStudy.rootCause}
                  </p>
                </div>
              )}

              {/* Solution */}
              <div className="space-y-3 md:col-span-1">
                <h4 className="text-[12px] md:text-[13px] font-bold text-foreground-muted uppercase tracking-[0.15em] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 mr-2.5"></span>
                  Giải pháp
                </h4>
                <p className="text-[14px] md:text-[15px] text-foreground-muted/90 leading-[1.65]">
                  {caseStudy.solution}
                </p>
              </div>

              {/* Result */}
              <div className="space-y-3 md:col-span-1 h-full flex flex-col">
                <h4 className="text-[12px] md:text-[13px] font-bold text-gold-primary uppercase tracking-[0.15em] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-primary mr-2.5 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
                  Kết quả
                </h4>
                <div className="p-4 md:p-5 bg-gold-primary/[0.04] rounded-xl border border-gold-primary/20 shadow-[inset_0_0_20px_rgba(212,175,55,0.02)] flex-1 transition-colors duration-300 group-hover:bg-gold-primary/[0.06] group-hover:border-gold-primary/30">
                  <p className="text-[14px] md:text-[15px] text-gold-light font-medium leading-[1.65]">
                    {caseStudy.result}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
