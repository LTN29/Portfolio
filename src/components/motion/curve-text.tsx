"use client";

import { useRef } from "react";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";

const sentence = "Có ý tưởng? Cùng biến nó thành sản phẩm chạy thật.";

function graphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(text), (p) => p.segment);
  }
  return Array.from(text);
}

/**
 * Extruded letters riding a tilted 3D helix. Scrolling moves the sentence along the
 * curve so it sweeps past the camera. Pure CSS 3D transforms — no WebGL needed.
 */
export function CurveText() {
  const section = useRef<HTMLElement>(null);
  const chars = graphemes(sentence.normalize("NFC"));

  useScrollMotion(section, ({ gsap, root }) => {
    const mm = gsap.matchMedia();
    const pinLength = () => `+=${window.innerHeight * (window.innerWidth < 800 ? 1.1 : 2.6)}`;

    // Phones: the 3D helix would be tiny and mostly off-screen, so the sentence is set large
    // and lights up word by word while the section is pinned.
    mm.add("(max-width: 799px)", () => {
      gsap.fromTo(root.querySelectorAll(".curve-lines span"), { opacity: 0.12, yPercent: 30 }, {
        opacity: 1, yPercent: 0, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top top", end: pinLength, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
    });

    mm.add("(min-width: 800px)", () => {
      const els = gsap.utils.toArray<HTMLElement>(".curve-char", root);
      const radius = () => Math.min(620, window.innerWidth * 0.48);
      const rise = 5.5; // px per letter, makes it a helix
      let angles: number[] = [];
      let total = 0;
      // Place letters by their real width so the spacing stays natural on the curve
      const measure = () => {
        const r = radius();
        let acc = 0;
        angles = els.map((el) => {
          const w = el.offsetWidth || r * 0.05;
          const a = acc + (w / 2 / r) * (180 / Math.PI);
          acc += (w / r) * (180 / Math.PI);
          return a;
        });
        total = acc;
      };
      measure();
      const state = { offset: -70 };

      const render = () => {
        const r = radius();
        els.forEach((el, i) => {
          const angle = angles[i] - state.offset;
          const visible = angle > -95 && angle < 95;
          el.style.opacity = visible ? String(gsap.utils.clamp(0, 1, 1.4 - Math.abs(angle) / 80)) : "0";
          el.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${r}px) translateY(${(i - els.length / 2) * rise}px)`;
        });
      };

      gsap.to(state, {
        offset: () => total + 40,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: pinLength,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          onRefresh: () => { measure(); render(); },
        },
      });
      render();
    });
    return () => mm.revert();
  });

  return (
    <section ref={section} className="curve-section" aria-label={sentence}>
      <p className="curve-kicker">BƯỚC TIẾP THEO?</p>
      <div className="curve-stage" aria-hidden="true">
        <div className="curve-ring">
          {chars.map((char, i) => (
            <span
              key={i}
              className="curve-char"
              style={{ "--hue": `${i / Math.max(1, chars.length - 1)}` } as React.CSSProperties}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </div>
      </div>
      <p className="curve-lines" aria-hidden="true">
        {sentence.split(" ").map((word, i, all) => (
          <span key={i} style={{ "--hue": `${i / Math.max(1, all.length - 1)}` } as React.CSSProperties}>{word} </span>
        ))}
      </p>
      <a className="curve-cta" href="#contact">Gửi yêu cầu</a>
    </section>
  );
}
