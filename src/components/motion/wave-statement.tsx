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

    const mm = gsap.matchMedia();

    // Điện thoại: không ghim — câu hiện đầy đủ, các chữ sáng dần theo nhịp cuộn
    mm.add("(max-width: 799px)", () => {
      gsap.fromTo(chars, { opacity: 0.14 }, {
        opacity: 1, ease: "none", stagger: 0.02,
        scrollTrigger: { trigger: root, start: "top 82%", end: "bottom 55%", scrub: 0.4 },
      });
    });

    mm.add("(min-width: 800px)", () => {
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

      const state = { x: 0 };

      const render = () => {
        const vw = window.innerWidth;
        const half = vw / 2;
        for (let i = 0; i < chars.length; i++) {
          const center = state.x + offsets[i] + widths[i] / 2;
          const n = gsap.utils.clamp(-1.25, 1.25, (center - half) / half);
          const absN = Math.abs(n);
          const op = 1 - gsap.utils.clamp(0, 1, (absN - 0.95) / 0.3);
          const el = chars[i];
          if (op <= 0.01) {
            if (el.style.opacity !== "0") el.style.opacity = "0";
            continue;
          }
          const edge = Math.max(0, absN - 0.45) / 0.8;
          const lift = -Math.pow(edge, 1.6) * 165 * (n > 0 ? 1 : 0.7);
          const wave = Math.sin(center * 0.012) * 7;
          const rotZ = n * Math.pow(edge, 1.3) * 34;
          const rotX = -n * edge * 36;
          el.style.opacity = op > 0.99 ? "1" : op.toFixed(3);
          el.style.transform = `translate3d(0,${(lift + wave).toFixed(1)}px,0) rotateX(${rotX.toFixed(1)}deg) rotateZ(${rotZ.toFixed(1)}deg)`;
        }
        track.style.transform = `translate3d(${state.x.toFixed(1)}px,0,0)`;
      };

      const distance = () => track.scrollWidth + window.innerWidth * 0.15;
      gsap.fromTo(state, { x: () => window.innerWidth * 0.88 }, {
        x: () => -track.scrollWidth + window.innerWidth * 0.24,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance() * 0.46}`,
          pin: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: () => { measure(); render(); },
        },
      });
      render();
    });

    return () => mm.revert();
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
