"use client";

import { useRef } from "react";
import { useAutoplayVideo } from "@/components/media/use-autoplay-video";
import { showcase } from "@/data/portfolio";
import { withBase } from "@/lib/base-path";
import { useScrollMotion } from "@/components/motion/use-scroll-motion";

/**
 * Showcase video: khung điện thoại nghiêng 3D, cuộn tới đâu thẳng lại và phóng to tới đó;
 * chữ "LTN." khổng lồ trôi ngang phía sau. Video tự phát (có tiếng) khi lướt tới.
 */
export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { muted, toggle: toggleSound } = useAutoplayVideo(video, section);

  useScrollMotion(section, ({ gsap, root }) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.4}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(".pf-show__frame", { rotateX: 26, rotateY: -22, rotateZ: 4, scale: 0.72, yPercent: 10 },
        { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, yPercent: 0, duration: 1, ease: "power2.out" }, 0)
        .fromTo(".pf-show__word", { xPercent: 18 }, { xPercent: -28, duration: 1.4 }, 0)
        .fromTo(".pf-show__glow", { scale: 0.6, opacity: 0.3 }, { scale: 1.1, opacity: 1, duration: 1 }, 0)
        .fromTo(".pf-show__copy > *", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 0.25);
    });
    return () => mm.revert();
  });

  return (
    <section ref={section} id="showcase" className="pf-show" aria-labelledby="showcase-title">
      <div className="pf-show__stage">
        <span className="pf-show__word" aria-hidden="true">LTN.</span>
        <span className="pf-show__glow" aria-hidden="true" />
        <div className="sg-wrap pf-show__grid">
          <div className="pf-show__copy">
            <p className="sg-label">04 — {showcase.kind}</p>
            <h2 id="showcase-title" className="sg-display">
              {showcase.title[0]}<br />
              <span className="sg-tone">{showcase.title[1]}</span>
            </h2>
            <p className="pf-show__tagline">{showcase.tagline}</p>
            <ul className="pf-chips" aria-label="Nền tảng">
              {showcase.stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="pf-show__device">
            <div className="pf-show__frame">
              <video
                ref={video}
                src={withBase(showcase.video)}
                poster={withBase(showcase.poster)}
                loop
                playsInline
                preload="metadata"
                aria-label={`Video giới thiệu ${showcase.name}`}
              />
              <button type="button" className="pf-show__sound" onClick={toggleSound} aria-pressed={!muted}>
                {muted ? "Bật tiếng" : "Tắt tiếng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
