"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chapters, projects } from "@/data/portfolio";
import { SYSTEMS } from "@/components/sim/scenarios";
import { IconG, NODE_ICON } from "@/components/sim/icons";
import { Logo, LogoPath, STACK_LOGO } from "@/components/tech/logo";

/* Vòng thẻ dự án chạy liên tục như một vòng quay: trôi chậm, đều, không điểm đầu/cuối.
 * Vị trí là một số thực `cur` (đơn vị: thẻ). Mỗi khung hình, thẻ có chỉ số tuyệt đối a được đặt ở (a - cur) × bước;
 * độ to, độ rõ và bóng đổ đổi liên tục theo khoảng cách tới tâm, nên không có cú nhảy nào.
 * Rê chuột vẫn trôi; chỉ khi nắm kéo / vuốt mới dừng và đi theo tay, thả ra có quán tính rồi trôi tiếp.
 * Dùng bàn phím (Tab tới thẻ) thì dừng đúng một thẻ ở giữa để đọc.
 * Ra khỏi màn hình thì dừng hẳn vòng lặp. */

const SPEED = 1 / 5.5; // thẻ / giây khi tự trôi
const R = 5; // số thẻ dựng mỗi bên tâm
const N = projects.length;
const chapterOf = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
const mod = (a: number) => ((a % N) + N) % N;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function MiniFlow({ demo }: { demo: string }) {
  const nodes = SYSTEMS[demo]?.modules[0]?.nodes.slice(0, 4) ?? [];
  return (
    <svg className="pc__flow" viewBox={`0 0 ${nodes.length * 64 - 16} 40`} aria-hidden="true">
      {nodes.map((n, i) => {
        const icon = NODE_ICON[n] ?? "cpu";
        const x = i * 64;
        return (
          <g key={n}>
            {i > 0 && <path d={`M${x - 14} 20 H${x - 4}`} className="pc__wire" />}
            {i > 0 && <path d={`M${x - 7} 16.5 L${x - 3} 20 L${x - 7} 23.5`} className="pc__wire" />}
            <rect x={x} y="2" width="36" height="36" rx="11" className="pc__tile" />
            <g transform={`translate(${x + 7} 9) scale(0.92)`} className="pc__icon">
              {icon.startsWith("@") ? <LogoPath name={icon.slice(1)} /> : <IconG name={icon} />}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

type Tween = { from: number; to: number; t0: number; ms: number } | null;

export function ProjectCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const els = useRef(new Map<number, HTMLElement>());
  const st = useRef({
    cur: 0, v: 0, step: 360, hold: false, inView: false, reduced: false,
    tween: null as Tween,
    drag: { on: false, id: -1, x: 0, start: 0, moved: 0, lastX: 0, lastT: 0, vel: 0 },
  });
  const [ci, setCi] = useState(0); // thẻ gần tâm nhất (chỉ số tuyệt đối)
  const ciRef = useRef(0);

  /* đặt 1 thẻ theo vị trí hiện tại */
  const place = useCallback((el: HTMLElement) => {
    const s = st.current;
    const d = Number(el.dataset.a) - s.cur;
    const ad = Math.abs(d);
    const near = Math.min(ad, 1);
    const scale = 1 - 0.07 * near;
    const op = ad <= 1 ? 1 - 0.45 * ad : Math.max(0.12, 0.55 - 0.2 * (ad - 1));
    el.style.transform = `translate3d(${(d * s.step).toFixed(2)}px,0,0) scale(${scale.toFixed(4)})`;
    el.style.opacity = op.toFixed(3);
    el.style.zIndex = String(10 - Math.round(ad * 2));
    el.style.setProperty("--c", (1 - near).toFixed(3));
  }, []);

  const placeAll = useCallback(() => {
    els.current.forEach(place);
    const c = Math.round(st.current.cur);
    if (c !== ciRef.current) { ciRef.current = c; setCi(c); }
  }, [place]);

  const measure = useCallback(() => {
    const t = track.current;
    const card = t?.querySelector<HTMLElement>(".pc__card");
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 20;
    st.current.step = card.offsetWidth + gap;
    placeAll();
  }, [placeAll]);

  /* tới thẻ a (tuyệt đối), trượt mượt */
  const goTo = useCallback((a: number) => {
    const s = st.current;
    s.tween = { from: s.cur, to: a, t0: performance.now(), ms: s.reduced ? 1 : 750 };
    s.v = 0;
  }, []);
  const go = (d: number) => goTo(Math.round(st.current.cur) + d);

  // vòng lặp khung hình
  useEffect(() => {
    const s = st.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (s.tween) {
        const k = Math.min(1, (now - s.tween.t0) / s.tween.ms);
        s.cur = s.tween.from + (s.tween.to - s.tween.from) * easeOut(k);
        if (k >= 1) s.tween = null;
      } else if (!s.drag.on) {
        const target = s.hold || s.reduced ? 0 : SPEED;
        s.v += (target - s.v) * Math.min(1, dt * 2.2); // tăng / giảm tốc êm
        s.cur += s.v * dt;
      }
      placeAll();
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([e]) => { s.inView = e.isIntersecting; if (e.isIntersecting) start(); else stop(); }, { threshold: 0.05 });
    if (root.current) io.observe(root.current);
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => { stop(); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, [measure, placeAll]);

  const setHold = (h: boolean) => {
    const s = st.current;
    if (h === s.hold) return;
    s.hold = h;
    // dừng lại thì dừng đúng một thẻ ở giữa
    if (h && !s.drag.on && !s.tween) goTo(s.v >= 0 ? Math.ceil(s.cur - 0.15) : Math.floor(s.cur + 0.15));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = st.current;
    s.tween = null;
    s.drag = { on: true, id: e.pointerId, x: e.clientX, start: s.cur, moved: 0, lastX: e.clientX, lastT: performance.now(), vel: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = st.current, d = s.drag;
    if (!d.on || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 5 && !track.current!.classList.contains("is-dragging")) {
      track.current!.classList.add("is-dragging");
      track.current!.setPointerCapture?.(e.pointerId);
    }
    if (d.moved > 5) {
      const now = performance.now();
      const inst = -(e.clientX - d.lastX) / s.step / Math.max(0.008, (now - d.lastT) / 1000);
      d.vel = d.vel * 0.6 + inst * 0.4;
      d.lastX = e.clientX; d.lastT = now;
      s.cur = d.start - dx / s.step;
    }
  };
  const endDrag = () => {
    const s = st.current, d = s.drag;
    if (!d.on) return;
    d.on = false;
    track.current!.classList.remove("is-dragging");
    if (d.moved > 5) {
      // quán tính: trôi theo đà rồi dừng ở thẻ gần nhất
      const v = Math.max(-6, Math.min(6, d.vel));
      goTo(Math.round(s.cur + v * 0.35));
      s.tween!.ms = 650 + Math.min(500, Math.abs(v) * 120);
    }
    setHold(false);
  };

  const cards = [];
  for (let a = ci - R; a <= ci + R; a++) {
    const i = mod(a);
    const p = projects[i];
    const center = a === ci;
    cards.push(
      <a
        key={a}
        ref={(el) => { if (el) { els.current.set(a, el); place(el); } else els.current.delete(a); }}
        data-a={a}
        href={`#${p.id}`}
        className={`pc__card${center ? " is-center" : ""}`}
        tabIndex={center ? 0 : -1}
        aria-hidden={center ? undefined : true}
        aria-label={center ? `${p.name} — ${p.kind}. Xem mô phỏng` : undefined}
        draggable={false}
        onClick={(e) => {
          if (st.current.drag.moved > 5) { e.preventDefault(); st.current.drag.moved = 0; return; }
          if (Math.abs(a - st.current.cur) > 0.5) { e.preventDefault(); goTo(a); }
        }}
      >
        <span className="pc__top">
          <em>{String(i + 1).padStart(2, "0")}</em>
          <span>{chapterOf[p.chapter]}</span>
        </span>
        <MiniFlow demo={p.demo} />
        <b className="pc__name">{p.name}</b>
        <span className="pc__kind">{p.kind}</span>
        <span className="pc__stack">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="pc__chip">
              {STACK_LOGO[s] && <Logo name={STACK_LOGO[s]} size={13} />}
              {s}
            </span>
          ))}
        </span>
        <span className="pc__go">Xem mô phỏng <i aria-hidden="true">→</i></span>
      </a>,
    );
  }

  return (
    <div
      ref={root}
      className="pc"
      role="region"
      aria-roledescription="carousel"
      aria-label="Dự án — kéo, vuốt hoặc dùng phím mũi tên"
      onMouseLeave={() => endDrag()}
      onFocusCapture={(e) => { if ((e.target as HTMLElement).matches?.(":focus-visible")) setHold(true); }}
      onBlurCapture={() => setHold(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      }}
    >
      <div
        ref={track}
        className="pc__track"
        onPointerDown={(e) => { onPointerDown(e); setHold(true); }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {cards}
      </div>
    </div>
  );
}
