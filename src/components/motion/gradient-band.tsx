"use client";

import { useRef } from "react";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";

/**
 * "LTN. → AI vào vận hành thật." Two gradient bars slide in from the sides, close
 * around the word, then grow until the whole screen becomes a grainy brand gradient
 * and the copy dissolves into it.
 */
export function GradientBand() {
  const section = useRef<HTMLElement>(null);

  useScrollMotion(section, ({ gsap, root }) => {
    // Điện thoại: thẻ gradient tĩnh, chỉ cho hai dòng chữ trồi lên — không ghim 3 màn hình
    if (window.innerWidth < 800) {
      gsap.fromTo(root.querySelectorAll(".band-word--promise .char-line"), { yPercent: 60, opacity: 0 }, {
        yPercent: 0, opacity: 1, stagger: 0.12, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (window.innerWidth < 800 ? 1.5 : 2.4)}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    const inset = window.innerWidth < 800 ? 62 : 105; // phones: bars already peek in when the section pins
    tl.fromTo(".band-bar--left", { xPercent: -inset }, { xPercent: 0, duration: 1 }, 0)
      .fromTo(".band-bar--right", { xPercent: inset }, { xPercent: 0, duration: 1 }, 0)
      .fromTo(".band-word--brand", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.3)
      .to(".band-word--brand", { opacity: 0, yPercent: -40, filter: "blur(8px)", duration: 0.5 }, 1.3)
      .fromTo(".band-word--promise .char-line", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.6 }, 1.5)
      .to(".band-bar", { scaleY: 9, duration: 1.2, ease: "power2.in" }, 2.1)
      .to(".band-word--promise", { color: "#ffffff", duration: 0.6 }, 2.6)
      .fromTo(".band-flood", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1, ease: "power2.inOut" }, 2.9)
      .to(".band-word--promise", { opacity: 0.18, filter: "blur(18px)", scale: 1.06, duration: 0.9 }, 3.5);
  });

  return (
    <section ref={section} className="band-section" aria-label="Ý tưởng thành sản phẩm">
      <div className="band-stage">
        <span className="band-bar band-bar--left" aria-hidden="true" />
        <span className="band-bar band-bar--right" aria-hidden="true" />
        <p className="band-word band-word--brand">LTN<span className="pf-dot">.</span></p>
        <p className="band-word band-word--promise">
          <span className="char-line">Ý tưởng</span>
          <span className="char-line">thành sản phẩm.</span>
        </p>
        <div className="band-flood" aria-hidden="true" />
      </div>
    </section>
  );
}
