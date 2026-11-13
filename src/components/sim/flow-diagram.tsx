"use client";

import { useEffect, useRef, useState } from "react";
import { IconG, NODE_ICON } from "./icons";
import { LogoPath } from "@/components/tech/logo";
import { Comet } from "./comet";

/* Sơ đồ luồng: mỗi khâu là một ô icon, nối bằng mũi tên.
 * Bước mới: mũi tên tới khâu đó được "vẽ" ra cùng một vệt sáng vàng trượt dọc; đoạn đã đi qua thỉnh thoảng có vệt sáng chạy lại.
 * Màn rộng: 1 hàng. Màn hẹp: 3 ô / hàng, đi theo hình chữ S. */

const TILE = 56;

function splitLabel(s: string, max: number) {
  if (s.length <= max) return [s];
  const words = s.split(" ");
  let best = [s];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
    const d = Math.abs(a.length - b.length);
    if (d < bestDiff) { bestDiff = d; best = [a, b]; }
  }
  return best;
}

type Edge = { d: string; ex: number; ey: number; dir: 1 | -1 };

export function FlowDiagram({ nodes, active, reached, runKey, running = true, stepMs = 2300 }: { nodes: string[]; active: number; reached: number; runKey: string; running?: boolean; stepMs?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 620));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = nodes.length;
  const cols = narrow ? Math.min(3, n) : n;
  const rows = Math.ceil(n / cols);
  const colW = narrow ? 118 : 150;
  const rowH = narrow ? 146 : 140;
  const W = cols * colW;
  const H = narrow ? (rows - 1) * rowH + 112 : rows * rowH - 14; // màn hẹp: bỏ khoảng trống thừa dưới hàng cuối
  const half = TILE / 2;

  const pos = nodes.map((_, i) => {
    const r = Math.floor(i / cols);
    const k = i % cols;
    const c = r % 2 === 0 ? k : cols - 1 - k;
    return { x: (c + 0.5) * colW, y: r * rowH + 42, r };
  });

  const edge = (i: number): Edge => {
    const a = pos[i], b = pos[i + 1];
    if (a.r === b.r) {
      const dir = b.x > a.x ? 1 : -1;
      const ex = b.x - dir * (half + 7);
      return { d: `M${a.x + dir * (half + 7)} ${a.y} L${ex} ${b.y}`, ex, ey: b.y, dir };
    }
    // xuống hàng: vòng ra mép ngoài để không cắt qua chữ
    const side = a.x > W / 2 ? 1 : -1;
    const ox = a.x + side * (colW / 2 - 6);
    const ex = b.x + side * (half + 7);
    return {
      d: `M${a.x + side * (half + 7)} ${a.y} L${ox - side * 12} ${a.y} Q${ox} ${a.y} ${ox} ${a.y + 12} L${ox} ${b.y - 12} Q${ox} ${b.y} ${ox - side * 12} ${b.y} L${ex} ${b.y}`,
      ex, ey: b.y, dir: (-side) as 1 | -1,
    };
  };

  return (
    <div className="flow" ref={box}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W * 1.1 }} role="img" aria-label={`Sơ đồ ${n} khâu: ${nodes.join(" → ")}`}>

        {nodes.slice(0, -1).map((_, i) => {
          const e = edge(i);
          const isActive = i + 1 === active;
          const done = i + 1 <= reached && !isActive;
          const state = isActive ? " is-active" : done ? " is-done" : "";
          return (
            <g key={`e${i}-${isActive ? runKey : "s"}`} className={`flow__link${state}`}>
              <path d={e.d} pathLength={100} className="flow__track" />
              {(done || isActive) && <path d={e.d} pathLength={100} className="flow__line" />}
              {done && <Comet d={e.d} dur={3.2} delay={i * 0.4} />}
              {isActive && <Comet d={e.d} once />}
              <path
                d="M-6 -4.2 L1.5 0 L-6 4.2 Z"
                transform={`translate(${e.ex} ${e.ey}) rotate(${e.dir === 1 ? 0 : 180})`}
                className="flow__arrow"
              />
            </g>
          );
        })}

        {nodes.map((label, i) => {
          const { x, y } = pos[i];
          const now = i === active;
          const done = i <= reached && !now;
          const lines = splitLabel(label, narrow ? 12 : 16);
          const icon = NODE_ICON[label] ?? "cpu";
          return (
            <g key={label + i} className={`flow__node${now ? " is-now" : ""}${done ? " is-done" : ""}`} transform={`translate(${x} ${y})`}>
              {now && (
                /* viền tiến độ: vẽ dần quanh ô trong thời gian xử lý bước này */
                <rect
                  key={runKey}
                  x={-half - 5} y={-half - 5} width={TILE + 10} height={TILE + 10} rx="20"
                  pathLength={100}
                  className={`flow__trace${running ? "" : " is-static"}`}
                  style={{ ["--step" as string]: `${stepMs}ms` }}
                />
              )}
              <rect x={-half} y={-half} width={TILE} height={TILE} rx="16" className="flow__tile" />
              <g transform="translate(-12.5 -12.5) scale(1.04)" className="flow__icon">
                {icon.startsWith("@") ? <LogoPath name={icon.slice(1)} mono={now || !done} /> : <IconG name={icon} />}
              </g>
              {done && (
                <g transform={`translate(${half - 4} ${-half + 4})`} className="flow__badge">
                  <circle r="7.5" />
                  <path d="m-3.2 0 2.2 2.2 4.2-4.4" />
                </g>
              )}
              <text y={half + 19} textAnchor="middle" className="flow__label">
                {lines.map((l, k) => <tspan key={k} x="0" dy={k ? 14.5 : 0}>{l}</tspan>)}
              </text>
              <text y={-half - 9} textAnchor="middle" className="flow__idx">{String(i + 1).padStart(2, "0")}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
