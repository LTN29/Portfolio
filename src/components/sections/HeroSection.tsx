"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { portfolioData } from "@/data/portfolio"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function HeroSection() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  
  // For drag to scroll
  const isDragging = React.useRef(false);
  const startY = React.useRef(0);
  const scrollTopRef = React.useRef(0);
  const exactScrollTop = React.useRef(0);
  const isHovered = React.useRef(false);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    
    // Set initial scroll to half height so we can continuously scroll upwards (items move down)
    const halfHeight = track.scrollHeight / 2;
    viewport.scrollTop = halfHeight;
    exactScrollTop.current = halfHeight;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.04; // pixels per ms (approx 40px per sec)

    const updateScroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      // Auto scroll logic (fractional precision required since scrollTop truncates)
      if (!isDragging.current && !isHovered.current) {
        exactScrollTop.current -= speed * delta;
        
        // Infinite loop wrap for scrolling up (items moving down)
        if (exactScrollTop.current <= 0) {
          exactScrollTop.current += halfHeight;
        }
        
        viewport.scrollTop = exactScrollTop.current;
      } else {
        // Sync the exact tracking variable with user's manual drag/wheel changes
        exactScrollTop.current = viewport.scrollTop;
        
        // Wrap manual scrolling as well
        if (viewport.scrollTop >= halfHeight) {
          viewport.scrollTop -= halfHeight;
          exactScrollTop.current = viewport.scrollTop;
        } else if (viewport.scrollTop <= 0 && isDragging.current) {
          viewport.scrollTop += halfHeight;
          exactScrollTop.current = viewport.scrollTop;
        }
      }
      
      // Update Center Focus Effect
      const viewportRect = viewport.getBoundingClientRect();
      const viewportCenter = viewportRect.top + viewportRect.height / 2;
      
      const groups = track.querySelectorAll('.skill-group');
      
      groups.forEach((group) => {
        const rect = group.getBoundingClientRect();
        const groupCenter = rect.top + rect.height / 2;
        
        const distance = Math.abs(viewportCenter - groupCenter);
        const normalized = Math.min(distance / (viewportRect.height / 2), 1);
        
        const scale = 1 - (normalized * 0.07);
        const opacity = 1 - (normalized * 0.45);
        
        const htmlElement = group as HTMLElement;
        htmlElement.style.transform = `scale(${scale})`;
        htmlElement.style.opacity = `${opacity}`;
      });
      
      animationFrameId = requestAnimationFrame(updateScroll);
    };
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(updateScroll);
    } else {
      const groups = track.querySelectorAll('.skill-group');
      groups.forEach(g => {
        const el = g as HTMLElement;
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      });
    }
    
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!viewportRef.current) return;
    isDragging.current = true;
    startY.current = e.pageY - viewportRef.current.offsetTop;
    scrollTopRef.current = viewportRef.current.scrollTop;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    isHovered.current = false;
  };
  
  const handleMouseEnter = () => {
    isHovered.current = false; // Set to true if we want to pause on hover, but user said "không phải chờ scroll" so we keep it false for continuous unless dragging
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !viewportRef.current) return;
    e.preventDefault();
    const y = e.pageY - viewportRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5; // Scroll speed multiplier
    viewportRef.current.scrollTop = scrollTopRef.current - walk;
  };

  return (
    <section className="pt-24 pb-12 md:pt-40 md:pb-28 px-4 md:px-6 container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-16 min-h-[90vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 space-y-6 md:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left w-full mt-4 md:mt-0 max-w-2xl lg:max-w-none"
      >
        <Badge variant="outline" className="border-gold-primary/30 text-gold-primary py-1.5 px-3 md:px-4 text-[13px] md:text-sm whitespace-normal text-center bg-gold-primary/5">
          <span className="w-2 h-2 rounded-full bg-green-accent mr-2 inline-block shadow-[0_0_8px_#2ECC71]"></span>
          Sẵn sàng cho dự án mới / Xây dựng hệ thống thực tế
        </Badge>
        
        <div className="space-y-4 md:space-y-6 w-full">
          <h1 className="text-[clamp(2.5rem,5vw,5.5rem)] font-extrabold leading-[1.1] md:leading-[1.02] tracking-[-0.04em] text-balance">
            {portfolioData.personal.roleHeadline[0]}
          </h1>
          <h2 className="text-[17px] md:text-xl lg:text-2xl text-foreground-muted font-medium leading-[1.6] max-w-2xl mx-auto lg:mx-0">
            {portfolioData.personal.shortDescription}
          </h2>
        </div>

        <p className="text-[15px] md:text-[17px] text-foreground-muted/70 max-w-2xl leading-[1.7] mx-auto lg:mx-0">
          {portfolioData.personal.heroCopy}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-6 w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto min-h-[48px] px-8 text-[16px] font-semibold bg-gold-primary text-background shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>
            Xem dự án
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-[420px] xl:w-[480px] shrink-0 mt-8 md:mt-0"
      >
        <Card 
          className="relative overflow-hidden border p-5 md:p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, rgba(14,12,8,0.96), rgba(9,9,8,0.98))',
            borderColor: 'rgba(212,175,55,0.18)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03), 0 20px 40px -10px rgba(0,0,0,0.6)'
          }}
        >
          <div 
            className="absolute top-0 right-0 w-full h-full pointer-events-none" 
            style={{
              background: 'radial-gradient(circle at 82% 18%, rgba(212,175,55,0.08), transparent 32%)'
            }}
          ></div>

          <CardHeader className="pb-6 px-2 pt-2 md:pt-4 relative z-10 pointer-events-none">
            <CardTitle className="text-[12px] md:text-[13px] font-bold tracking-[0.2em] text-gold-light flex items-center justify-center lg:justify-start uppercase">
              <span className="w-2 h-2 rounded-full bg-gold-primary mr-3 shadow-[0_0_10px_rgba(212,175,55,0.6)] shrink-0"></span>
              System Builder Skill Map
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 px-2 pb-2">
            <div 
              className="relative overflow-y-auto overflow-x-hidden h-[340px] md:h-[420px] cursor-grab active:cursor-grabbing no-scrollbar" 
              ref={viewportRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              // For mobile touch drag, native overflow-y-auto handles it perfectly!
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}} />
              <div className="flex flex-col gap-8 pb-8" ref={trackRef}>
                {/* First set */}
                <div className="flex flex-col gap-8 shrink-0">
                  {portfolioData.systemStatus.map((item, i) => (
                    <div key={`s1-${i}`} className="skill-group flex flex-col space-y-3 items-center lg:items-start text-center lg:text-left origin-center lg:origin-left select-none">
                      <span className="text-[15px] md:text-[16px] font-extrabold text-foreground/95 tracking-wide">
                        {item.name}
                      </span>
                      <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                        {item.chips.map((chip, j) => (
                          <Badge key={j} variant="outline" className="bg-[#0f0e0c] text-[12px] md:text-[13px] py-1.5 px-3 rounded-md border-border-gold/30 text-foreground-muted/95 font-medium whitespace-nowrap shadow-sm pointer-events-none">
                            {chip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second set for loop */}
                <div className="flex flex-col gap-8 shrink-0" aria-hidden="true">
                  {portfolioData.systemStatus.map((item, i) => (
                    <div key={`s2-${i}`} className="skill-group flex flex-col space-y-3 items-center lg:items-start text-center lg:text-left origin-center lg:origin-left select-none">
                      <span className="text-[15px] md:text-[16px] font-extrabold text-foreground/95 tracking-wide">
                        {item.name}
                      </span>
                      <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                        {item.chips.map((chip, j) => (
                          <Badge key={`dup-chip-${j}`} variant="outline" className="bg-[#0f0e0c] text-[12px] md:text-[13px] py-1.5 px-3 rounded-md border-border-gold/30 text-foreground-muted/95 font-medium whitespace-nowrap shadow-sm pointer-events-none">
                            {chip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
