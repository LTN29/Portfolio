"use client";

import { useRef } from "react";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";

const sentence = "Từ một ý tưởng nhỏ đến sản phẩm được dùng mỗi ngày.";

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

    // Điện thoại: không ghim màn hình trước form liên hệ — chữ sáng dần tự nhiên khi cuộn tới
    mm.add("(max-width: 799px)", () => {
      gsap.fromTo(root.querySelectorAll(".curve-lines span"), { opacity: 0.15, yPercent: 24 }, {
        opacity: 1, yPercent: 0, stagger: 0.08, ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 60%", scrub: 0.4 },
      });
    });

    mm.add("(min-width: 800px)", () => {
      const els = gsap.utils.toArray<HTMLElement>(".curve-char", root);
      const radius = () => Math.min(620, window.innerWidth * 0.48);
      const rise = 5.5; // px per letter, makes it a helix
      let angles: number[] = [];
      let total = 0;
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
      const state = { offset: -65 };

      const render = () => {
        const r = radius();
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          const angle = angles[i] - state.offset;
          const visible = angle > -92 && angle < 92;
          if (!visible) {
            if (el.style.opacity !== "0") el.style.opacity = "0";
            continue;
          }
          const op = gsap.utils.clamp(0, 1, 1.38 - Math.abs(angle) / 78);
          el.style.opacity = op > 0.99 ? "1" : op.toFixed(3);
          el.style.transform = `translate3d(-50%, -50%, 0) rotateY(${angle.toFixed(1)}deg) translateZ(${r.toFixed(0)}px) translateY(${((i - els.length / 2) * rise).toFixed(1)}px)`;
        }
      };

      gsap.to(state, {
        offset: () => total + 35,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.75}`,
          pin: true,
          scrub: 0.7,
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
      <p className="curve-kicker">LTN · BUILD · SHIP · OPERATE</p>
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
      <a className="curve-cta" href="#contact">Liên hệ</a>
    </section>
  );
}
