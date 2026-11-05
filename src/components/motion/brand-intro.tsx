"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useScrollMotion } from "@/components/motion/use-scroll-motion";
import { detectGpuTier, type GpuTier } from "@/components/motion/gpu-tier";

const BrandIntroScene = dynamic(() => import("@/components/motion/brand-intro-scene").then((m) => m.BrandIntroScene), {
  ssr: false,
  loading: () => <div className="intro-webgl-fallback" />,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Full-screen opening: a terminal prompt rendered as refractive glass over a live
 * shader gradient. Scrolling spins the arrow and cross-fades the baked headline.
 */
export function BrandIntro() {
  const section = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(true);
  const [still, setStill] = useState(false);
  const [tier, setTier] = useState<GpuTier>("high");

  useEffect(() => {
    // Browser-only capability checks; they cannot run during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(prefersReducedMotion());
    setTier(detectGpuTier());
    // Start downloading three.js right away, but create the WebGL context only once the
    // page has painted — the CSS gradient carries the first frame, so text shows sooner.
    void import("@/components/motion/brand-intro-scene");
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setWebgl(supportsWebGL()), { timeout: 700 })
      : window.setTimeout(() => setWebgl(supportsWebGL()), 120);
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setActive(Boolean(entry?.isIntersecting)), { rootMargin: "120px 0px" });
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  useScrollMotion(section, ({ gsap }) => {
    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: "none",
      onUpdate: () => { progressRef.current = proxy.p; },
      scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
    });
    gsap.to(".intro-scroll-cue, .intro-tagline", {
      autoAlpha: 0, y: -20, ease: "none",
      scrollTrigger: { trigger: section.current, start: "top top", end: "+=35%", scrub: true },
    });
    gsap.fromTo(".intro-overlay-bottom", { autoAlpha: 0, y: 30 }, {
      autoAlpha: 1, y: 0, ease: "none",
      scrollTrigger: { trigger: section.current, start: "40% top", end: "62% top", scrub: true },
    });
  });

  return (
    <section ref={section} className="intro-section" aria-label="Lê Thanh Nhân — Đưa AI vào vận hành thật">
      <div className="intro-stage">
        {webgl === true && <BrandIntroScene progressRef={progressRef} active={active} still={still} tier={tier} />}
        {webgl === null && <div className="intro-webgl-fallback" />}
        {webgl === false && (
          <div className="intro-webgl-fallback">
            <span>Thanh Nhân.</span>
          </div>
        )}
        <p className="visually-hidden">Lê Thanh Nhân — Full-stack &amp; AI Developer. Đưa AI vào vận hành thật.</p>
        <p className="intro-tagline" aria-hidden="true">
          {"Full-stack · AI Developer".split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${1.9 + i * 0.04}s` }}>{ch === " " ? "\u00a0" : ch}</span>
          ))}
        </p>
        <div className="intro-overlay-bottom" aria-hidden="true">
          <span>BUILD. SHIP. OPERATE.</span>
        </div>
        <a className="intro-scroll-cue" href="#top" aria-label="Cuộn xuống phần giới thiệu">
          <i />
          <span>CUỘN ĐỂ BẮT ĐẦU</span>
        </a>
      </div>
    </section>
  );
}
