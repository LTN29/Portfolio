"use client";

import { useRef } from "react";
import { SplitChars } from "@/components/motion/split-chars";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";
import { statement } from "@/data/portfolio";


/**
 * Pinned section: one long sentence travels right-to-left while every letter
 * lifts and tilts as it enters and leaves the screen edges.
 */
export function WaveStatement() {
  const section = useRef<HTMLElement>(null);

  useScrollMotion(section, ({ gsap, root }) => {
    const track = root.querySelector<HTMLElement>(".wave-track");
    const chars = gsap.utils.toArray<HTMLElement>(".wave-char", root);
    if (!track || !chars.length) return;

    // Điện thoại: không ghim — câu hiện đầy đủ, các chữ sáng dần theo nhịp cuộn
    if (window.innerWidth < 800) {
      gsap.fromTo(chars, { opacity: 0.12 }, {
        opacity: 1, ease: "none", stagger: 0.02,
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 55%", scrub: 0.5 },
      });
      return;
    }

    let offsets: number[] = [];
    let widths: number[] = [];
    const measure = () => {
      const prev = track.style.transform;
      track.style.transform = "none";
      offsets = chars.map((c) => c.offsetLeft);
      widths = chars.map((c) => c.offsetWidth);
      track.style.transform = prev;
    };
    measure();

    const setters = chars.map((c) => gsap.quickSetter(c, "css") as (v: Record<string, string | number>) => void);
    const state = { x: 0 };

    const render = () => {
      const vw = window.innerWidth;
      const half = vw / 2;
      for (let i = 0; i < chars.length; i++) {
        const center = state.x + offsets[i] + widths[i] / 2;
        const n = gsap.utils.clamp(-1.25, 1.25, (center - half) / half);
        const edge = Math.max(0, Math.abs(n) - 0.45) / 0.8; // 0 in the middle, ~1 at the edges
        const lift = -Math.pow(edge, 1.6) * 190 * (n > 0 ? 1 : 0.7);
        const wave = Math.sin(center * 0.012) * 8;
        setters[i]({
          y: lift + wave,
          rotation: n * Math.pow(edge, 1.3) * 38,
          rotationX: -n * edge * 40,
          opacity: 1 - gsap.utils.clamp(0, 1, (Math.abs(n) - 0.95) / 0.3),
        });
      }
      track.style.transform = `translate3d(${state.x}px,0,0)`;
    };

    const distance = () => track.scrollWidth + window.innerWidth * 0.2;
    const startX = () => window.innerWidth * (window.innerWidth < 800 ? 0.12 : 1);
    gsap.fromTo(state, { x: startX }, {
      // phones: stop while the last words are still on screen
      x: () => -track.scrollWidth + window.innerWidth * (window.innerWidth < 800 ? 0.7 : 0.2),
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${distance() * 0.6}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onRefresh: () => { measure(); render(); },
      },
    });
    render();
  });

  return (
    <section ref={section} className="wave-section" aria-label="Tuyên ngôn">
      <p className="wave-kicker"><span className="pf-mono">$ cat</span> TUYÊN NGÔN</p>
      <div className="wave-viewport">
        <div className="wave-track">
          <SplitChars text={statement} className="wave-text" charClassName="wave-char" />
        </div>
      </div>
    </section>
  );
}
