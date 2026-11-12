"use client";

import { useEffect, useRef, useState } from "react";
import { SYSTEMS } from "./scenarios";
import type { LogKind } from "./types";
import { FlowDiagram } from "./flow-diagram";

const STEP_MS = 2300;

const KIND_LABEL: Record<LogKind, string> = {
  in: "VÀO",
  out: "GỌI",
  ok: "OK",
  warn: "CHÚ Ý",
  err: "LỖI",
  info: "XỬ LÝ",
};

function useInView<T extends Element>(ref: React.RefObject<T | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return v;
}

export function SystemSim({ system }: { system: string }) {
  const sys = SYSTEMS[system];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [mi, setMi] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(0);
  const consoleRef = useRef<HTMLOListElement>(null);

  const mod = sys.modules[mi];
  const last = mod.steps.length - 1;

  const advance = () => {
    if (step < last) {
      setStep(step + 1);
      setHold(0);
    } else if (hold < 1) {
      setHold(hold + 1);
    } else {
      setMi((mi + 1) % sys.modules.length);
      setStep(0);
      setHold(0);
    }
  };

  // chỉ chạy khi đang nằm trên màn hình
  const saved = useRef(advance);
  useEffect(() => {
    saved.current = advance;
  });
  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setInterval(() => saved.current(), STEP_MS);
    return () => window.clearInterval(id);
  }, [playing, inView]);

  useEffect(() => {
    const el = consoleRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step, mi]);

  const pick = (i: number) => {
    setMi(i);
    setStep(0);
    setHold(0);
  };

  const cur = step >= 0 ? mod.steps[step] : null;
  const done = mod.steps.slice(0, step + 1);
  const logs = done.flatMap((s, si) => (s.logs ?? []).map((l, li) => ({ ...l, id: `${si}-${li}`, fresh: si === step })));
  const state = { ...mod.initial };
  for (const s of done) Object.assign(state, s.set ?? {});
  const activeNode = cur ? cur.node : -1;
  const reached = Math.max(-1, ...done.map((s) => s.node));

  return (
    <div className={`sim${inView ? "" : " is-paused"}`} ref={ref}>
      <div className="sim__bar">
        <span className="sim__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sim__title">{sys.title}</span>
        <span className="sim__tag">Mô phỏng · dữ liệu mẫu</span>
      </div>

      <div className="sim__grid">
        <div className="sim__mods" role="tablist" aria-label="Luồng xử lý">
          {sys.modules.map((m, i) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={i === mi}
              className={`sim__mod${i === mi ? " is-on" : ""}`}
              onClick={() => pick(i)}
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              <b>{m.label}</b>
              <span>{m.desc}</span>
              {i === mi && <i className="sim__mod-bar" style={{ transform: `scaleX(${(step + 1) / mod.steps.length})` }} />}
            </button>
          ))}
        </div>

        <div className="sim__main">
          <FlowDiagram nodes={mod.nodes} active={activeNode} reached={reached} runKey={`${mi}-${step}`} running={playing && inView} stepMs={STEP_MS} />

          <div className="sim__step" aria-live="polite">
            <span className="sim__count">
              {cur ? `Bước ${step + 1}/${mod.steps.length}` : "Sẵn sàng"}
            </span>
            <h4 key={`${mi}-${step}`}>{cur ? cur.title : mod.label}</h4>
            <p key={`p${mi}-${step}`}>{cur ? cur.detail : `Luồng gồm ${mod.steps.length} bước qua ${mod.nodes.length} khâu. Bấm “Chạy” hoặc chờ tự chạy.`}</p>
          </div>

          <div className="sim__lower">
            <div className="sim__console">
              <div className="sim__console-head"><span>Nhật ký hệ thống</span><span>{logs.length} dòng</span></div>
              <ol ref={consoleRef}>
                {logs.length === 0 && <li className="sim__log sim__log--idle">Chưa có sự kiện…</li>}
                {logs.map((l) => (
                  <li key={l.id} className={`sim__log sim__log--${l.kind}${l.fresh ? " is-fresh" : ""}`}>
                    <span className="sim__kind">{KIND_LABEL[l.kind]}</span>
                    <span className="sim__text">{l.text}</span>
                    {l.meta && <span className="sim__meta">{l.meta}</span>}
                    {l.body && l.fresh && <code className="sim__body">{l.body}</code>}
                  </li>
                ))}
              </ol>
            </div>

            <dl className="sim__state">
              {mod.stats.map((s) => (
                <div key={s.key} className={cur?.focus === s.key ? "is-focus" : ""}>
                  <dt>{s.label}</dt>
                  <dd key={`${s.key}-${String(state[s.key])}`}>{String(state[s.key])}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="sim__ctrl">
            <button type="button" className="sim__btn sim__btn--main" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
              {playing ? "❚❚ Tạm dừng" : "▶ Chạy"}
            </button>
            <button type="button" className="sim__btn" onClick={() => { setPlaying(false); advance(); }}>
              Bước tiếp →
            </button>
            <button type="button" className="sim__btn" onClick={() => { setStep(0); setHold(0); setPlaying(true); }}>
              Chạy lại
            </button>
            <span className="sim__progress" aria-hidden="true">
              {mod.steps.map((_, i) => <i key={i} className={i <= step ? "is-on" : ""} />)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
