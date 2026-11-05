"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, clearGsapTransforms } from "@/components/motion/use-scroll-motion";

/* Wrap every word of a paragraph in a span (keeps <b>/<span> markup) so it can be lit word by word.
   Returns a function that restores the original markup. */
function splitWords(el: HTMLElement) {
  const original = el.innerHTML;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else {
            const w = document.createElement("span");
            w.className = "sg-w";
            w.textContent = part;
            frag.appendChild(w);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    });
  };
  walk(el);
  return () => { el.innerHTML = original; };
}

/**
 * Page-wide motion layer: smooth scrolling (desktop) and the shared scroll reveals.
 * Section-specific timelines live inside their own components.
 */
export function PageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("main.lux");
    if (!root || prefersReducedMotion()) return;
    let cancelled = false;
    let lenis: Lenis | undefined;
    let ticker: ((time: number) => void) | undefined;
    const restoreText: (() => void)[] = [];

    // mobile address-bar show/hide must not re-measure every pinned section
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (window.matchMedia("(min-width: 801px) and (pointer: fine)").matches) {
      void import("lenis").then(({ default: LenisCtor }) => {
        if (cancelled) return;
        const smooth = new LenisCtor({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.9 });
        lenis = smooth;
        smooth.on("scroll", ScrollTrigger.update);
        ticker = (time) => smooth.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      });
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((item) => {
        gsap.fromTo(item, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 87%", once: true },
        });
      });
      // Project visuals open out of a mask, then drift slower than the page
      gsap.utils.toArray<HTMLElement>(".pf-feature__media").forEach((media) => {
        gsap.fromTo(media, { clipPath: "inset(18% 8% 18% 8%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: media, start: "top 88%", once: true },
        });
        const inner = media.querySelector<HTMLElement>(".pv");
        if (inner && window.innerWidth >= 800) gsap.fromTo(inner, { yPercent: 6 }, {
          yPercent: -6, ease: "none",
          scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".pf-feature__name").forEach((h) => {
        gsap.fromTo(h, { yPercent: 40, autoAlpha: 0 }, {
          yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out",
          scrollTrigger: { trigger: h, start: "top 90%", once: true },
        });
      });
      // Values: each cell rises from a hairline mask
      gsap.utils.toArray<HTMLElement>(".sg-values__grid li, .pf-stack dl div").forEach((cell, i) => {
        gsap.fromTo(cell, { yPercent: 18, autoAlpha: 0 }, {
          yPercent: 0, autoAlpha: 1, duration: 1.1, delay: (i % 3) * 0.08, ease: "expo.out",
          scrollTrigger: { trigger: cell, start: "top 92%", once: true },
        });
      });
      // Hero: headline lines slide up, frieze tiles drift at two depths
      gsap.fromTo(".sg-hero .sg-line", { yPercent: 105, autoAlpha: 0 }, {
        yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".sg-hero", start: "top 80%", once: true },
      });
      if (window.innerWidth >= 800) gsap.utils.toArray<HTMLElement>(".sg-frieze__item").forEach((item) => {
        const far = item.dataset.depth === "far";
        gsap.fromTo(item, { y: far ? 90 : 40 }, {
          y: far ? -30 : 0, ease: "none",
          scrollTrigger: { trigger: ".sg-frieze", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      // Reading effect: words light up as the paragraph passes through the viewport
      gsap.utils.toArray<HTMLElement>(".sg-scrub").forEach((p) => {
        restoreText.push(splitWords(p));
        gsap.fromTo(p.querySelectorAll(".sg-w"), { opacity: 0.14 }, {
          opacity: 1, ease: "none", stagger: 0.05,
          scrollTrigger: { trigger: p, start: "top 88%", end: "bottom 58%", scrub: 0.6 },
        });
      });
      // Headlines rise out of a mask; negative insets keep diacritics and descenders (ạ, ợ, g) visible
      gsap.utils.toArray<HTMLElement>(".sg-display, .sg-chapter h3, .sg-values__head h3, .sg-promise blockquote").forEach((h) => {
        if (h.closest(".sg-hero")) return;
        gsap.fromTo(h, { yPercent: 22, clipPath: "inset(-25% -4% 100% -4%)" }, {
          yPercent: 0, clipPath: "inset(-25% -4% -35% -4%)", duration: 1.4, ease: "expo.out", clearProps: "clipPath,transform",
          scrollTrigger: { trigger: h, start: "top 86%", once: true },
        });
      });
      // Hairlines draw across before each chapter / row
      root.classList.add("sg-lines-anim");
      gsap.utils.toArray<HTMLElement>(".sg-chapter, .sg-roster__row, .sg-values__grid li, .sg-step, .sg-promise__list div").forEach((row) => {
        ScrollTrigger.create({ trigger: row, start: "top 90%", once: true, onEnter: () => row.classList.add("is-in") });
      });
      // Big opening line drifts slower than the page
      gsap.to(".sg-story__open .sg-display", {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: ".sg-story__open", start: "top bottom", end: "bottom top", scrub: true },
      });
      // Principles: big lines wipe in
      gsap.utils.toArray<HTMLElement>(".sg-principles li").forEach((line) => {
        gsap.fromTo(line, { clipPath: "inset(0 100% 0 0)" }, {
          clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "expo.out",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
        });
      });
      ScrollTrigger.refresh();
    }, root);

    return () => {
      cancelled = true;
      if (ticker) gsap.ticker.remove(ticker);
      context.revert();
      clearGsapTransforms(root);
      restoreText.forEach((restore) => restore());
      root.classList.remove("sg-lines-anim");
      lenis?.destroy();
    };
  }, []);

  return null;
}
