"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";

/* "Tự xem" — trang tự cuộn qua từng phần cho khách ngồi xem.
 * Vừa mở link trên điện thoại: một bảng lớn hỏi khách có muốn tự xem không.
 * Đang chạy: thanh điều khiển nhỏ dưới đáy (tạm dừng / tiếp / thoát + tiến độ). Chạm hoặc vuốt màn hình là tự dừng.
 * Hết tour: bảng kết thúc mời đọc bài viết hoặc xem lại. */

type Step = { label: string; to: () => number; ms?: number; glide?: boolean; hold: number; during?: (t: number) => void; after?: () => void };
type Phase = "idle" | "offer" | "running" | "paused" | "done";

const SEEN_KEY = "ltn-tour-offered";
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

function topOf(sel: string | Element | null) {
  const el = typeof sel === "string" ? document.querySelector(sel) : sel;
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
}

function buildSteps(): Step[] {
  const H = () => window.innerHeight;
  const steps: Step[] = [
    { label: "Sơ đồ hệ thống", to: () => topOf(".hero__center") - 72, ms: 1500, hold: 3600 },
    { label: "Công nghệ", to: () => topOf("#stack"), ms: 1300, hold: 1400 },
    { label: "Công nghệ", to: () => { const s = document.getElementById("stack"); return s ? topOf(s) + s.offsetHeight - H() : 0; }, ms: 4200, glide: true, hold: 500 },
    { label: "Dự án", to: () => topOf("#projects"), ms: 1100, hold: 1400 },
    { label: "Dự án", to: () => topOf(".pc") - H() * 0.2, ms: 900, hold: 3800 },
  ];
  const stages = () => Array.from(document.querySelectorAll<HTMLElement>(".stg"));
  projects.forEach((p, i) => {
    const label = `Dự án ${i + 1}/${projects.length}`;
    steps.push(
      { label, to: () => { const st = stages()[i]; return st ? topOf(st) - H() * 0.35 : topOf(`#${p.id}`); }, ms: 1000, hold: 150 },
      { label, to: () => topOf(`#${p.id}`), ms: 5400, glide: true, hold: 700 },             // màn sân khấu diễn
      { label, to: () => topOf(`#${p.id} .sim`) - 64, ms: 900, hold: 5600 },                 // xem mô phỏng chạy
    );
  });
  const capsScroll = (t: number) => {
    const c = document.querySelector<HTMLElement>(".caps");
    if (!c) return;
    c.style.scrollSnapType = "none";
    c.scrollLeft = easeSine(t) * (c.scrollWidth - c.clientWidth);
  };
  steps.push(
    { label: "Về tôi", to: () => topOf("#about"), ms: 1300, hold: 3200 },
    { label: "Năng lực", to: () => topOf("#services"), ms: 1200, hold: 5200, during: capsScroll, after: () => { const c = document.querySelector<HTMLElement>(".caps"); if (c) c.style.scrollSnapType = ""; } },
    { label: "Cách làm", to: () => topOf("#process"), ms: 1200, hold: 1000 },
    { label: "Cách làm", to: () => { const s = document.getElementById("process"); return s ? topOf(s) + s.offsetHeight - H() : 0; }, ms: 3800, glide: true, hold: 600 },
    { label: "Bài viết", to: () => topOf("#notes"), ms: 1300, hold: 1600 },
  );
  return steps;
}

export function MobileTour() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const [prog, setProg] = useState(0);
  const run = useRef({ steps: [] as Step[], i: 0, stage: "move" as "move" | "hold", t0: 0, from: 0, to: 0, ms: 0, raf: 0 });
  const phaseRef = useRef<Phase>("idle");
  const tickRef = useRef<FrameRequestCallback | null>(null);
  const setP = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  const stopLoop = () => { cancelAnimationFrame(run.current.raf); run.current.raf = 0; };
  const restoreScroll = () => { document.documentElement.style.scrollBehavior = ""; document.documentElement.classList.remove("is-touring"); };

  const beginStep = useCallback((i: number) => {
    const r = run.current, s = r.steps[i];
    if (!s) { // hết tour
      stopLoop(); restoreScroll(); setProg(1); setP("done"); return;
    }
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    r.i = i; r.stage = "move"; r.t0 = performance.now();
    r.from = window.scrollY; r.to = Math.max(0, Math.min(maxY, s.to()));
    const dist = Math.abs(r.to - r.from);
    r.ms = s.glide ? (s.ms ?? 3000) : Math.min(s.ms ?? 1200, 450 + dist * 0.9);
    if (dist < 2) r.ms = 1;
    setLabel(s.label);
    setProg(i / r.steps.length);
  }, []);

  const tick = useCallback((now: number) => {
    const r = run.current, s = r.steps[r.i];
    if (phaseRef.current !== "running" || !s) return;
    if (r.stage === "move") {
      const k = Math.min(1, (now - r.t0) / r.ms);
      const e = s.glide ? easeSine(k) : easeInOut(k);
      window.scrollTo(0, r.from + (r.to - r.from) * e);
      if (k >= 1) { r.stage = "hold"; r.t0 = now; }
    } else {
      const k = Math.min(1, (now - r.t0) / s.hold);
      s.during?.(k);
      if (k >= 1) { s.after?.(); beginStep(r.i + 1); }
    }
    r.raf = requestAnimationFrame((n) => tickRef.current?.(n));
  }, [beginStep]);
  useEffect(() => { tickRef.current = tick; }, [tick]);

  const start = useCallback((from = 0) => {
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {}
    run.current.steps = buildSteps();
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.classList.add("is-touring");
    setP("running");
    beginStep(from);
    stopLoop();
    run.current.raf = requestAnimationFrame(tick);
  }, [beginStep, tick]);

  const pause = useCallback(() => {
    if (phaseRef.current !== "running") return;
    stopLoop();
    run.current.steps[run.current.i]?.after?.();
    setP("paused");
  }, []);
  const resume = () => { start(run.current.i); };
  const exit = () => { stopLoop(); restoreScroll(); setP("idle"); };

  // mời tự xem khi vừa mở trang trên điện thoại
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 860px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch {}
    if (!narrow || reduced || seen) return;
    const id = window.setTimeout(() => { if (window.scrollY < 120 && phaseRef.current === "idle") setP("offer"); }, 1100);
    return () => window.clearTimeout(id);
  }, []);

  // khách chạm / vuốt / bấm phím → dừng tour
  useEffect(() => {
    const onUser = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".tour")) return;
      pause();
    };
    window.addEventListener("touchstart", onUser, { passive: true, capture: true });
    window.addEventListener("wheel", onUser, { passive: true, capture: true });
    window.addEventListener("keydown", onUser, { capture: true });
    const onStart = () => start(0);
    window.addEventListener("tour:start", onStart);
    return () => {
      window.removeEventListener("touchstart", onUser, { capture: true });
      window.removeEventListener("wheel", onUser, { capture: true });
      window.removeEventListener("keydown", onUser, { capture: true });
      window.removeEventListener("tour:start", onStart);
      stopLoop();
    };
  }, [pause, start]);

  // khoá cuộn nền khi bảng lớn đang mở
  useEffect(() => {
    const lock = phase === "offer" || phase === "done";
    document.documentElement.classList.toggle("tour-lock", lock);
  }, [phase]);

  const dismiss = () => { try { sessionStorage.setItem(SEEN_KEY, "1"); } catch {} setP("idle"); };

  return (
    <>
      {(phase === "offer" || phase === "done") && (
        <div className="tour tour__veil" role="dialog" aria-modal="true" aria-labelledby="tour-t" onClick={(e) => { if (e.target !== e.currentTarget) return; if (phase === "offer") dismiss(); else setP("idle"); }}>
          <div className="tour__sheet">
            <span className="tour__grab" aria-hidden="true" />
            {phase === "offer" ? (
              <>
                <p className="tour__kicker">Xem nhanh · khoảng 2 phút</p>
                <h2 id="tour-t" className="tour__title">Để trang tự dẫn bạn xem?</h2>
                <p className="tour__body">Trang sẽ tự cuộn qua sơ đồ hệ thống, công nghệ và {projects.length} dự án với mô phỏng đang chạy. Chạm vào màn hình bất cứ lúc nào để dừng.</p>
                <ol className="tour__path" aria-label="Lộ trình">
                  <li>Sơ đồ</li><li>Công nghệ</li><li>{projects.length} dự án</li><li>Bài viết</li>
                </ol>
                <button type="button" className="tour__go" onClick={() => start(0)} autoFocus>
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
                  Bắt đầu tự xem
                </button>
                <button type="button" className="tour__skip" onClick={dismiss}>Tôi tự lướt</button>
              </>
            ) : (
              <>
                <p className="tour__kicker">Đã xem hết {projects.length} dự án</p>
                <h2 id="tour-t" className="tour__title">Cảm ơn bạn đã xem.</h2>
                <p className="tour__body">Mỗi hệ thống ở đây đều đang chạy thật mỗi ngày. Những điều tôi học được khi làm chúng sẽ được ghi lại dần ở mục Bài viết.</p>
                <button type="button" className="tour__go" onClick={() => { setP("idle"); document.getElementById("notes")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Đọc bài viết
                </button>
                <button type="button" className="tour__skip" onClick={() => { setP("idle"); window.scrollTo({ top: 0 }); window.setTimeout(() => start(0), 600); }}>Xem lại từ đầu</button>
              </>
            )}
          </div>
        </div>
      )}

      {(phase === "running" || phase === "paused") && (
        <div className="tour tour__bar" role="group" aria-label="Điều khiển tự xem">
          <button type="button" className="tour__btn" onClick={phase === "running" ? pause : resume} aria-label={phase === "running" ? "Tạm dừng" : "Tiếp tục"}>
            {phase === "running"
              ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              : <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>}
          </button>
          <div className="tour__meta">
            <span>{phase === "paused" ? "Đã dừng · chạm ▶ để tiếp" : label}</span>
            <i><b style={{ transform: `scaleX(${prog.toFixed(3)})` }} /></i>
          </div>
          <button type="button" className="tour__btn tour__btn--x" onClick={exit} aria-label="Thoát tự xem">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
