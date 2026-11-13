"use client";

import { useEffect, useRef } from "react";

/* Màn sân khấu trước mỗi dự án — chạy theo thanh cuộn, dính màn hình (sticky) trong lúc diễn:
 *  1. Hai cánh màn màu mực trượt vào từ hai mép, khép lại thành một dải giữa màn hình; đường nối giữa hai cánh có vệt sáng xanh.
 *  2. Câu hỏi hiện trên dải; rồi tan đi, thay bằng câu trả lời "Đây là cách tôi đã làm."
 *  3. Dải nở cao kín màn hình; từ đường nối, một quầng sáng xanh dịu toả ra.
 *  4. Hai cánh màn tách ra theo đường nối — lộ phần dự án thật nằm ngay bên dưới (sân khấu chồng lên 1 màn hình đầu của dự án).
 * Mọi chuyển động là transform / opacity / clip-path / filter, cập nhật bằng rAF có độ trễ mượt (lerp). */

const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const START = 0.35; // bắt đầu diễn khi đỉnh sân khấu còn cách đỉnh màn hình 35% chiều cao

export function ProjectStage({ pitch, answer = "Đây là cách tôi đã làm." }: { pitch: string; answer?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, box = pin.current;
    if (!el || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-static"); return; }

    const q = (s: string) => box.querySelector<HTMLElement>(s)!;
    const barL = q(".stg__bar--l"), barR = q(".stg__bar--r"), seam = q(".stg__seam");
    const halfL = q(".stg__half--l"), halfR = q(".stg__half--r");
    const glows = box.querySelectorAll<HTMLElement>(".stg__glow");
    const txt = q(".stg__txt"), qEl = q(".stg__q"), aEl = q(".stg__a");

    let W = 0, H = 0, bh0 = 120, R = 0;
    let target = 0, cur = 0, raf = 0, active = false;

    // tràn hết bề ngang màn hình dù nằm trong cột nội dung
    const bleed = () => {
      const parent = el.parentElement!.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      el.style.marginLeft = `${-parent.left}px`;
      el.style.marginRight = `${-(vw - parent.right)}px`;
    };
    const measure = () => {
      bleed();
      W = box.clientWidth; H = box.clientHeight;
      const textH = Math.max(qEl.offsetHeight, aEl.offsetHeight);
      bh0 = Math.min(H * 0.6, textH + (W < 600 ? 72 : 112));
      R = Math.hypot(W, H) / 2 + 40;
      [barL, barR].forEach((x) => { x.style.width = `${W / 2 + 1}px`; x.style.height = `${bh0}px`; x.style.top = `${(H - bh0) / 2}px`; });
      seam.style.height = `${bh0}px`; seam.style.top = `${(H - bh0) / 2}px`;
      glows.forEach((g) => { g.style.width = `${W}px`; });
      halfR.querySelector<HTMLElement>(".stg__glow")!.style.left = `${-W / 2}px`;
    };
    const readTarget = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - H + H * START;
      target = Math.min(1, Math.max(0, (H * START - r.top) / total));
    };

    const render = (p: number) => {
      const a = ease(seg(p, 0.0, 0.16));   // hai cánh khép vào
      const qi = seg(p, 0.12, 0.2);        // câu hỏi hiện
      const t = ease(seg(p, 0.28, 0.4));   // đổi sang câu trả lời
      const c = ease(seg(p, 0.46, 0.6));   // dải nở kín màn
      const o = ease(seg(p, 0.5, 0.72));   // quầng sáng toả
      const f = seg(p, 0.7, 0.8);          // chữ tan
      const e = ease(seg(p, 0.8, 0.98));   // tách màn

      const half = W / 2;
      const sy = (bh0 + (H - bh0) * c) / bh0;
      const slide = e * (half + 8);
      barL.style.transform = `translate3d(${(-(1 - a) * half - slide).toFixed(1)}px,0,0) scaleY(${sy.toFixed(4)})`;
      barR.style.transform = `translate3d(${((1 - a) * half + slide).toFixed(1)}px,0,0) scaleY(${sy.toFixed(4)})`;
      seam.style.opacity = String(seg(a, 0.85, 1) * (0.45 + 0.55 * o) * (1 - e));
      seam.style.transform = `scaleY(${sy.toFixed(4)})`;

      const r = o * R;
      glows.forEach((g) => { g.style.clipPath = `circle(${r.toFixed(1)}px at 50% 50%)`; g.style.opacity = String(o); });
      halfL.style.transform = `translate3d(${-slide}px,0,0)`;
      halfR.style.transform = `translate3d(${slide}px,0,0)`;

      const qo = qi * (1 - t), qb = (1 - qi) * 8 + t * 10;
      qEl.style.opacity = qo.toFixed(3);
      qEl.style.filter = qb > 0.05 ? `blur(${qb.toFixed(1)}px)` : "none";
      qEl.style.transform = `translateY(${((1 - qi) * 10 - t * 12).toFixed(1)}px)`;
      const ab = (1 - t) * 10 + f * 12;
      aEl.style.opacity = (t * (1 - f)).toFixed(3);
      aEl.style.filter = ab > 0.05 ? `blur(${ab.toFixed(1)}px)` : "none";
      aEl.style.transform = `translateY(${((1 - t) * 12).toFixed(1)}px) scale(${(1 + f * 0.05).toFixed(3)})`;
      txt.style.visibility = qi > 0 && f < 1 ? "visible" : "hidden";

      // nền trắng che phần dự án bên dưới cho tới khi màn đã phủ kín, rồi trong suốt để lộ dự án lúc tách màn
      box.classList.toggle("is-open", e > 0);
      box.classList.toggle("is-done", e >= 0.999);
    };

    const tick = () => {
      readTarget();
      cur += (target - cur) * 0.16;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      render(cur);
      raf = active || cur !== target ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    measure(); readTarget(); cur = target; render(cur);
    const io = new IntersectionObserver(([en]) => { active = en.isIntersecting; if (active) kick(); }, { rootMargin: "20% 0px 20% 0px" });
    io.observe(el);
    const onScroll = () => { if (active) kick(); };
    const onResize = () => { measure(); kick(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="stg" ref={root}>
      <p className="sr-only">{pitch} {answer}</p>
      <div className="stg__pin" ref={pin} aria-hidden="true">
        <i className="stg__bar stg__bar--l" />
        <i className="stg__bar stg__bar--r" />
        <div className="stg__half stg__half--l"><div className="stg__glow" /></div>
        <div className="stg__half stg__half--r"><div className="stg__glow" /></div>
        <i className="stg__seam" />
        <div className="stg__txt">
          <span className="stg__lines">
            <span className="stg__q">{pitch}</span>
            <span className="stg__a">{answer}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
