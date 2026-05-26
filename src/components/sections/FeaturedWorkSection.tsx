"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

export function FeaturedWorkSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const length = portfolioData.featuredWorks.length;

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % length);
  }, [length]);

  const prevSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
  }, [length]);

  React.useEffect(() => {
    if (isHovered) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const getPosition = (index: number) => {
    let diff = index - activeIndex;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  };

  return (
    <section id="work" className="py-12 md:py-24 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-10 md:mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-primary mb-3 md:mb-4">
            Selected System Work
          </h2>
          <p className="text-[15px] md:text-lg text-foreground-muted max-w-2xl mx-auto leading-[1.6]">
            Các hệ thống thực tế tôi đã xây dựng từ luồng nghiệp vụ đến giao diện và vận hành.
          </p>
        </motion.div>

        {/* Carousel Wrapper */}
        <div 
          className="relative w-full h-[620px] sm:h-[580px] md:h-[520px] lg:h-[480px] flex justify-center items-center perspective-1000"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false}>
            {portfolioData.featuredWorks.map((work, index) => {
              const pos = getPosition(index);
              const isCenter = pos === 0;
              const isPrev = pos === -1;
              const isNext = pos === 1;
              const isHidden = Math.abs(pos) > 1;

              return (
                <motion.div
                  key={index}
                  className={`absolute w-full max-w-[90vw] md:max-w-2xl lg:max-w-4xl cursor-pointer will-change-transform`}
                  onClick={() => {
                    if (isPrev) prevSlide();
                    if (isNext) nextSlide();
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    const swipe = offset.x;
                    if (swipe < -50) nextSlide();
                    else if (swipe > 50) prevSlide();
                  }}
                  initial={false}
                  animate={{
                    x: isCenter ? "0%" : isPrev ? "-80%" : isNext ? "80%" : pos < 0 ? "-120%" : "120%",
                    scale: isCenter ? 1 : 0.78,
                    opacity: isCenter ? 1 : isHidden ? 0 : 0.25,
                    zIndex: isCenter ? 20 : isHidden ? 0 : 10,
                    filter: isCenter ? "blur(0px) brightness(1)" : "blur(3px) brightness(0.6)",
                  }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    pointerEvents: isHidden ? 'none' : 'auto'
                  }}
                >
                  <Card 
                    className={`overflow-hidden transition-all duration-500 h-full border rounded-2xl ${
                      isCenter 
                        ? 'border-gold-primary/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.2)]' 
                        : 'border-border-gold/5 shadow-xl'
                    }`}
                    style={{
                      background: isCenter 
                        ? 'linear-gradient(180deg, rgba(20,18,10,0.96), rgba(10,10,8,0.98))' 
                        : 'linear-gradient(180deg, rgba(10,10,8,0.5), rgba(5,5,5,0.8))'
                    }}
                  >
                    <div className="flex flex-col h-full pointer-events-none">
                      <div className="p-5 md:p-8 space-y-5 md:space-y-6 flex-1 flex flex-col">
                        <div>
                          <Badge variant="outline" className={`mb-3 md:mb-4 ${isCenter ? 'border-gold-primary/30 text-gold-light bg-gold-primary/5' : 'border-border-gold/10 text-foreground-muted'}`}>
                            {work.type}
                          </Badge>
                          <h3 className={`text-xl md:text-3xl font-bold mb-2 md:mb-4 transition-colors ${isCenter ? 'text-foreground' : 'text-foreground-muted'}`}>
                            {work.title}
                          </h3>
                          <p className={`text-[14px] md:text-[16px] leading-[1.6] ${isCenter ? 'text-foreground-muted' : 'text-foreground-muted/40 line-clamp-2'}`}>
                            {work.description}
                          </p>
                        </div>

                        <div className="flex-1">
                          <h4 className={`text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.1em] mb-3 md:mb-4 ${isCenter ? 'text-gold-primary' : 'text-gold-primary/50'}`}>
                            Điểm nổi bật
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                            {work.keyPoints.map((point, i) => (
                              <li key={i} className={`flex items-start text-[13px] md:text-[15px] ${isCenter ? 'text-foreground-muted/90' : 'text-foreground-muted/40'}`}>
                                <CheckCircle2 className={`w-4 h-4 md:w-4 md:h-4 mr-2.5 mt-0.5 shrink-0 ${isCenter ? 'text-green-accent opacity-80' : 'text-green-accent/40'}`} />
                                <span className="leading-[1.5]">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={`pt-5 border-t mt-auto ${isCenter ? 'border-border-gold/20' : 'border-border-gold/5'}`}>
                          <div className="flex flex-wrap gap-2">
                            {work.stack.map((tech, i) => (
                              <span key={i} className={`text-[12px] md:text-[13px] px-2.5 py-1 rounded-full border whitespace-nowrap font-medium ${
                                isCenter 
                                  ? 'bg-[#0a0a08]/80 border-border-gold/30 text-foreground-muted' 
                                  : 'bg-transparent border-border-gold/10 text-foreground-muted/30'
                              }`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center items-center mt-6 md:mt-10 gap-6">
          <button 
            onClick={prevSlide} 
            className="w-10 h-10 rounded-full border border-border-gold/30 flex items-center justify-center text-foreground-muted hover:text-gold-light hover:border-gold-primary/50 hover:bg-surface transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2.5">
            {portfolioData.featuredWorks.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? 'w-6 bg-gold-primary shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                    : 'bg-border-gold/50 hover:bg-border-gold'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextSlide} 
            className="w-10 h-10 rounded-full border border-border-gold/30 flex items-center justify-center text-foreground-muted hover:text-gold-light hover:border-gold-primary/50 hover:bg-surface transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
