"use client";

import { useRef } from "react";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";
import { stats } from "@/data/portfolio";

const items = stats;

/**
 * Pinned scene: one figure at a time. Each line sits in its own mask and slides
 * up into place, then up and out — crisp type, no blur or ghost copies.
 */
export function StatSequence() {
  const section = useRef<HTMLElement>(null);

  useScrollMotion(section, ({ gsap, root }) => {
    const slides = gsap.utils.toArray<HTMLElement>(".sg-stat", root);
    const counter = root.querySelector<HTMLElement>(".sg-stats__count b");
    const bar = root.querySelector<HTMLElement>(".sg-stats__bar i");
    const mm = gsap.matchMedia();

    // Điện thoại: hiển thị dạng danh sách tĩnh tự nhiên, không ghim / snap gây khựng cảm ứng
    mm.add("(max-width: 799px)", () => {
      slides.forEach((slide) => {
        const parts = slide.querySelectorAll(".sg-mask > *");
        gsap.fromTo(parts, { yPercent: 60, autoAlpha: 0 }, {
          yPercent: 0, autoAlpha: 1, stagger: 0.06, duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: slide, start: "top 86%", once: true },
        });
      });
    });

    mm.add("(min-width: 800px)", () => {
      let rest: number[] = [];
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut", duration: 0.32 },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * slides.length * 0.58}`,
          pin: true,
          scrub: 0.55,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value: number) => rest.reduce((best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best), rest[0] ?? 0),
            duration: { min: 0.2, max: 0.55 },
            delay: 0.06,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
            const i = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
            if (counter) counter.textContent = String(i + 1).padStart(2, "0");
          },
        },
      });

      gsap.set(slides.slice(1), { autoAlpha: 0 });
      slides.forEach((slide, i) => {
        const parts = slide.querySelectorAll(".sg-mask > *");
        if (i > 0) {
          tl.set(slide, { autoAlpha: 1 }, i);
          tl.fromTo(parts, { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.04, duration: 0.22, ease: "expo.out" }, i + 0.02);
        }
        if (i < slides.length - 1) {
          tl.to(parts, { yPercent: -115, stagger: 0.02, duration: 0.18, ease: "expo.in" }, i + 0.78);
          tl.to(parts, { autoAlpha: 0, stagger: 0.02, duration: 0.1, ease: "none" }, i + 0.8);
          tl.set(slide, { autoAlpha: 0 }, i + 0.99);
        }
      });
      tl.to({}, { duration: 0.4 });
      const total = tl.duration();
      rest = slides.map((_, i) => (i === 0 ? 0 : i === slides.length - 1 ? 1 : (i + 0.5) / total));
    });

    return () => mm.revert();
  });

  return (
    <section ref={section} className="sg-stats" aria-label="Vài con số">
      <div className="sg-wrap sg-stats__frame">
        <p className="sg-label sg-stats__label">Vài con số</p>
        <div className="sg-stats__stage">
          {items.map((item) => (
            <div className="sg-stat" key={item.title}>
              <span className="sg-mask sg-stat__value"><span>{item.value}</span></span>
              <div className="sg-stat__text">
                <span className="sg-mask sg-stat__title"><span>{item.title}</span></span>
                <span className="sg-mask sg-stat__note"><span>{item.note}</span></span>
              </div>
            </div>
          ))}
        </div>
        <div className="sg-stats__foot" aria-hidden="true">
          <span className="sg-stats__count"><b>01</b> / {String(items.length).padStart(2, "0")}</span>
          <span className="sg-stats__bar"><i /></span>
        </div>
      </div>
    </section>
  );
}
