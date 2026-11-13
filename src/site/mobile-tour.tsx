"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";

/* "Tự xem" — trang tự cuộn qua từng phần cho khách ngồi xem.
 * Vừa mở link trên điện thoại: một bảng lớn hỏi khách có muốn tự xem không.
 * Đang chạy: thanh điều khiển nhỏ dưới đáy (tạm dừng / tiếp / thoát + tiến độ). Chạm hoặc vuốt màn hình là tự dừng.
 * Hết tour: bảng kết thúc mời đọc bài viết hoặc xem lại. */

type Step = { label: string; chapter: string; to: () => number; ms?: number; glide?: boolean; hold: number; during?: (t: number) => void; after?: () => void };
type Phase = "idle" | "offer" | "running" | "paused" | "done";

const SEEN_KEY = "ltn-tour-offered";
// chuyển động: hình sin – tăng tốc và giảm tốc từ từ, không giật khi bắt đầu / dừng
const easeSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function topOf(sel: string | Element | null) {
  const el = typeof sel === "string" ? document.querySelector(sel) : sel;
  return el ? el.getBoundingClientRect().top + window.scrollY : 0;
}

/* Lộ trình. Nhịp chậm, đủ để đọc: di chuyển ~1,2–3,6 giây, lướt nội dung dài ~140 px/giây,
 * dừng ở sơ đồ 5 giây, ở mỗi mô phỏng 9 giây (khoảng 4 bước của mô phỏng). */
function buildSteps(): Step[] {
  const H = () => window.innerHeight;
  const steps: Step[] = [
    { chapter: "intro", label: "Sơ đồ hệ thống", to: () => (window.innerWidth > 860 ? 0 : topOf(".hero__center") - 72), hold: 5200 },
    { chapter: "stack", label: "Công nghệ", to: () => topOf("#stack"), hold: 2200 },
    { chapter: "stack", label: "Công nghệ", to: () => { const s = document.getElementById("stack"); return s ? topOf(s) + s.offsetHeight - H() : 0; }, glide: true, hold: 900 },
    { chapter: "projects", label: "Dự án", to: () => topOf("#projects"), hold: 2000 },
    { chapter: "projects", label: "Dự án", to: () => topOf(".pc") - H() * 0.2, hold: 5200 },
  ];
  const stages = () => Array.from(document.querySelectorAll<HTMLElement>(".stg"));
  projects.forEach((p, i) => {
    const label = `${i + 1}/${projects.length} · ${p.name}`;
    const chapter = "p" + i;
    steps.push(
      { chapter, label, to: () => { const st = stages()[i]; return st ? topOf(st) - H() * 0.35 : topOf(`#${p.id}`); }, hold: 500 },
      { chapter, label, to: () => topOf(`#${p.id}`), ms: 7600, glide: true, hold: 1400 },  // màn sân khấu diễn chậm rãi
      {
        chapter, label, hold: 9000,
        // xem mô phỏng: cuộn vừa đủ để thấy trọn mô phỏng, giữ lại tiêu đề dự án nếu màn đủ cao (máy tính)
        to: () => {
          const sim = document.querySelector<HTMLElement>(`#${p.id} .sim`);
          if (!sim) return topOf(`#${p.id}`);
          const t = topOf(sim);
          return Math.min(t - 64, Math.max(topOf(`#${p.id}`), t + sim.offsetHeight - H() + 40));
        },
      },                // xem mô phỏng chạy vài bước
    );
  });
  const caps = () => document.querySelector<HTMLElement>(".caps");
  steps.push(
    { chapter: "about", label: "Về tôi", to: () => topOf("#about"), hold: 4800 },
    {
      chapter: "caps", label: "Năng lực", to: () => topOf("#services"), hold: 8000,
      during: (t) => { const c = caps(); if (!c) return; c.style.scrollSnapType = "none"; c.scrollLeft = easeSine(t) * (c.scrollWidth - c.clientWidth); },
      after: () => { const c = caps(); if (c) c.style.scrollSnapType = ""; },
    },
    { chapter: "process", label: "Cách làm", to: () => topOf("#process"), hold: 1800 },
    { chapter: "process", label: "Cách làm", to: () => { const s = document.getElementById("process"); return s ? topOf(s) + s.offsetHeight - H() : 0; }, glide: true, hold: 1200 },
    { chapter: "notes", label: "Bài viết", to: () => topOf("#notes"), hold: 3000 },
  );
  return steps;
}

export function MobileTour() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const [wide, setWide] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const paintProg = (v: number) => { if (bar.current) bar.current.style.transform = `scaleX(${clamp(v, 0, 1).toFixed(4)})`; };
  const run = useRef({ steps: [] as Step[], i: 0, stage: "move" as "move" | "hold", t0: 0, from: 0, to: 0, ms: 0, raf: 0 });
  const phaseRef = useRef<Phase>("idle");
  const tickRef = useRef<FrameRequestCallback | null>(null);
  const setP = (p: Phase) => { phaseRef.current = p; setPhase(p); };

  const stopLoop = () => { cancelAnimationFrame(run.current.raf); run.current.raf = 0; };
  const restoreScroll = () => { document.documentElement.style.scrollBehavior = ""; document.documentElement.classList.remove("is-touring"); };

  const beginStep = useCallback((i: number) => {
    const r = run.current, s = r.steps[i];
    if (!s) { // hết tour
      stopLoop(); restoreScroll(); setP("done"); return;
    }
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    r.i = i; r.stage = "move"; r.t0 = performance.now();
    r.from = window.scrollY; r.to = Math.max(0, Math.min(maxY, s.to()));
    const dist = Math.abs(r.to - r.from);
    r.ms = s.glide ? (s.ms ?? clamp(dist / 0.14, 2600, 10000)) : clamp(900 + dist * 0.75, 1200, 3600);
    if (dist < 2) r.ms = 1;
    setLabel(s.label);
  }, []);

  const tick = useCallback((now: number) => {
    const r = run.current, s = r.steps[r.i];
    if (phaseRef.current !== "running" || !s) return;
    if (r.stage === "move") {
      const k = Math.min(1, (now - r.t0) / r.ms);
      window.scrollTo(0, r.from + (r.to - r.from) * easeSine(k));
      paintProg((r.i + k * 0.5) / r.steps.length);
      if (k >= 1) { r.stage = "hold"; r.t0 = now; }
    } else {
      const k = Math.min(1, (now - r.t0) / s.hold);
      s.during?.(k);
      paintProg((r.i + 0.5 + k * 0.5) / r.steps.length);
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
  // ⏭ sang phần kế tiếp (dự án sau, mục sau)
  const skip = () => {
    const r = run.current; const ch = r.steps[r.i]?.chapter;
    let j = r.i + 1; while (j < r.steps.length && r.steps[j].chapter === ch) j++;
    r.steps[r.i]?.after?.();
    if (phaseRef.current === "paused") { r.i = j; start(j); } else beginStep(j);
  };
  const exit = () => { stopLoop(); restoreScroll(); setP("idle"); };
  const keys = useRef({ resume, skip, exit });
  useEffect(() => { keys.current = { resume, skip, exit }; });

  // mời tự xem khi vừa mở trang trên điện thoại
  useEffect(() => {
    const wideNow = window.matchMedia("(min-width: 861px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch {}
    if (reduced || seen) return;
    // máy tính: để khách nhìn trang đầu lâu hơn một chút rồi mới mời
    const id = window.setTimeout(() => { if (window.scrollY < 120 && phaseRef.current === "idle") { setWide(wideNow); setP("offer"); } }, wideNow ? 1800 : 1100);
    return () => window.clearTimeout(id);
  }, []);

  // khách chạm / vuốt / bấm phím → dừng tour
  useEffect(() => {
    const onUser = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(".tour")) return;
      pause();
    };
    // phím tắt khi đang tự xem: Space dừng/tiếp · → sang phần kế · Esc thoát; phím khác (mũi tên, PageDown…) = khách tự cuộn → dừng
    const onKey = (e: KeyboardEvent) => {
      const ph = phaseRef.current;
      if (ph !== "running" && ph !== "paused") return;
      if (e.key === " " || e.key === "k") { e.preventDefault(); if (ph === "running") pause(); else keys.current.resume(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); keys.current.skip(); return; }
      if (e.key === "Escape") { keys.current.exit(); return; }
      if ((e.target as Element | null)?.closest?.(".tour")) return;
      if (!["Shift", "Control", "Alt", "Meta", "Tab"].includes(e.key)) pause();
    };
    window.addEventListener("touchstart", onUser, { passive: true, capture: true });
    window.addEventListener("mousedown", onUser, { capture: true });
    window.addEventListener("wheel", onUser, { passive: true, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    const onStart = () => { setWide(window.matchMedia("(min-width: 861px)").matches); start(0); };
    window.addEventListener("tour:start", onStart);
    return () => {
      window.removeEventListener("touchstart", onUser, { capture: true });
      window.removeEventListener("mousedown", onUser, { capture: true });
      window.removeEventListener("wheel", onUser, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
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
                <div className="tour__head">
                  <span className="tour__ic" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg></span>
                  <p className="tour__kicker">Xem nhanh · khoảng 3 phút rưỡi</p>
                </div>
                <h2 id="tour-t" className="tour__title">Để trang tự dẫn bạn xem?</h2>
                <p className="tour__body">Trang tự cuộn qua từng phần và dừng lại ở mỗi mô phỏng. {wide ? "Cuộn chuột hoặc bấm phím cách để dừng bất cứ lúc nào." : "Chạm màn hình bất cứ lúc nào để dừng."}</p>
                <ol className="tour__path" aria-label="Lộ trình">
                  <li>Sơ đồ</li><li>Công nghệ</li><li>{projects.length} dự án</li><li>Bài viết</li>
                </ol>
                <div className="tour__acts">
                  <button type="button" className="tour__go" onClick={() => start(0)}>
                    <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor" /></svg>
                    Bắt đầu tự xem
                  </button>
                  <button type="button" className="tour__skip" onClick={dismiss}>Tôi tự lướt</button>
                </div>
              </>
            ) : (
              <>
                <div className="tour__head">
                  <span className="tour__ic is-ok" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <p className="tour__kicker">Đã xem hết {projects.length} dự án</p>
                </div>
                <h2 id="tour-t" className="tour__title">Cảm ơn bạn đã xem.</h2>
                <p className="tour__body">Mỗi hệ thống ở đây đều đang chạy thật mỗi ngày. Những điều tôi học được khi làm chúng sẽ được ghi lại dần ở mục Bài viết.</p>
                <div className="tour__acts">
                  <button type="button" className="tour__go" onClick={() => { setP("idle"); document.getElementById("notes")?.scrollIntoView({ behavior: "smooth" }); }}>
                    Đọc bài viết
                  </button>
                  <button type="button" className="tour__skip" onClick={() => { setP("idle"); window.scrollTo({ top: 0 }); window.setTimeout(() => start(0), 600); }}>Xem lại từ đầu</button>
                </div>
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
            <span key={phase === "paused" ? "p" : label}>{phase === "paused" ? (wide ? "Đã dừng · bấm ▶ hoặc phím cách để xem tiếp" : "Đã dừng · chạm ▶ để xem tiếp") : label}</span>
            <i><b ref={bar} /></i>
          </div>
          <button type="button" className="tour__btn tour__btn--ghost" onClick={skip} aria-label="Sang phần tiếp theo">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5v9l6-4.5zM12 3.5v9" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
          </button>
          <button type="button" className="tour__btn tour__btn--ghost" onClick={exit} aria-label="Thoát tự xem">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
