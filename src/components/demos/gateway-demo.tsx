"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

const CLIENTS = [
  { id: "desk", label: "App desktop", y: 78 },
  { id: "chat", label: "Trợ lý chat", y: 170 },
  { id: "tool", label: "Công cụ nội bộ", y: 262 },
];

const PROVIDERS = [
  { id: "gpt", label: "GPT", y: 58 },
  { id: "claude", label: "Claude", y: 132 },
  { id: "gemini", label: "Gemini", y: 208 },
  { id: "local", label: "Model nội bộ", y: 282 },
];

const JOBS = [
  { team: "Kinh doanh", kind: "Soạn email", want: "gpt" },
  { team: "Kỹ thuật", kind: "Sửa code", want: "claude" },
  { team: "CSKH", kind: "Tóm tắt hội thoại", want: "local" },
  { team: "Marketing", kind: "Đọc tài liệu dài", want: "gemini" },
  { team: "Kỹ thuật", kind: "Review code", want: "claude" },
  { team: "Marketing", kind: "Tạo ảnh", want: "gpt" },
];

const FALLBACK: Record<string, string[]> = {
  gpt: ["claude", "gemini", "local"],
  claude: ["gpt", "gemini", "local"],
  gemini: ["gpt", "claude", "local"],
  local: ["gemini", "gpt", "claude"],
};

type Packet = { id: number; path: string; color: string };
type Log = { id: number; text: string; warn?: boolean };

const GX = 268, GW = 136; // khung Gateway

export function GatewayDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [down, setDown] = useState<Record<string, boolean>>({});
  const [packets, setPackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [count, setCount] = useState({ total: 0, failover: 0 });
  const seq = useRef(0);
  const jobIdx = useRef(0);

  const send = () => {
    const job = JOBS[jobIdx.current++ % JOBS.length];
    const client = CLIENTS[seq.current % CLIENTS.length];
    let target = job.want;
    let switched = false;
    if (down[target]) {
      target = FALLBACK[job.want].find((p) => !down[p]) ?? "";
      switched = true;
    }
    const id = ++seq.current;
    if (!target) {
      setLogs((l) => [{ id, text: `${job.team} · ${job.kind} → không còn model nào chạy`, warn: true }, ...l].slice(0, 4));
      return;
    }
    const prov = PROVIDERS.find((p) => p.id === target)!;
    const gy = 170;
    const path = `M118 ${client.y} C190 ${client.y} 200 ${gy} ${GX} ${gy} L${GX + GW} ${gy} C${GX + GW + 60} ${gy} 440 ${prov.y} 512 ${prov.y}`;
    setPackets((p) => [...p, { id, path, color: switched ? "#f0a35e" : "#dec084" }]);
    window.setTimeout(() => setPackets((p) => p.filter((x) => x.id !== id)), 1700);
    setCount((c) => ({ total: c.total + 1, failover: c.failover + (switched ? 1 : 0) }));
    const want = PROVIDERS.find((p) => p.id === job.want)!.label;
    setLogs((l) => [
      {
        id,
        text: switched
          ? `${job.team} · ${job.kind}: ${want} đang lỗi → tự chuyển sang ${prov.label}`
          : `${job.team} · ${job.kind} → ${prov.label}`,
        warn: switched,
      },
      ...l,
    ].slice(0, 4));
  };

  useTicker(send, 1150, inView);

  const toggle = (id: string) => setDown((d) => ({ ...d, [id]: !d[id] }));

  return (
    <DemoFrame title="AI Gateway · bảng điều phối" frameRef={ref} className="dm-gateway" aside="Bấm vào model để giả lập sự cố">
      <div className="dmg">
        <svg className="dmg__map" viewBox="0 0 640 340" role="img" aria-label="Sơ đồ yêu cầu đi qua Gateway tới các model">
          <defs>
            <linearGradient id="dmg-gw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2a3042" />
              <stop offset="1" stopColor="#1a1e2a" />
            </linearGradient>
          </defs>
          {CLIENTS.map((c) => (
            <path key={c.id} d={`M118 ${c.y} C190 ${c.y} 200 170 ${GX} 170`} className="dmg__wire" />
          ))}
          {PROVIDERS.map((p) => (
            <path key={p.id} d={`M${GX + GW} 170 C${GX + GW + 60} 170 440 ${p.y} 512 ${p.y}`} className={`dmg__wire${down[p.id] ? " is-down" : ""}`} />
          ))}

          {CLIENTS.map((c) => (
            <g key={c.id} transform={`translate(14 ${c.y - 20})`}>
              <rect width="104" height="40" rx="10" className="dmg__node" />
              <text x="52" y="25" textAnchor="middle" className="dmg__txt">{c.label}</text>
            </g>
          ))}

          <g transform={`translate(${GX} 70)`}>
            <rect width={GW} height="200" rx="16" fill="url(#dmg-gw)" className="dmg__gw" />
            <text x={GW / 2} y="30" textAnchor="middle" className="dmg__gw-title">GATEWAY</text>
            {["Xác thực", "Hạn mức", "Chọn model", "Dự phòng"].map((s, i) => (
              <g key={s} transform={`translate(14 ${48 + i * 36})`}>
                <rect width={GW - 28} height="26" rx="7" className="dmg__step" />
                <text x={(GW - 28) / 2} y="17.5" textAnchor="middle" className="dmg__txt dmg__txt--sm">{s}</text>
              </g>
            ))}
          </g>

          {PROVIDERS.map((p) => (
            <g
              key={p.id}
              transform={`translate(512 ${p.y - 18})`}
              className={`dmg__prov${down[p.id] ? " is-down" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={!!down[p.id]}
              aria-label={`${p.label}: ${down[p.id] ? "đang lỗi, bấm để bật lại" : "đang chạy, bấm để giả lập lỗi"}`}
              onClick={() => toggle(p.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(p.id); } }}
            >
              <rect width="116" height="36" rx="10" className="dmg__node" />
              <circle cx="16" cy="18" r="4.5" className="dmg__led" />
              <text x="66" y="23" textAnchor="middle" className="dmg__txt">{p.label}</text>
            </g>
          ))}

          {packets.map((p) => (
            <circle key={p.id} r="5" fill={p.color} className="dmg__pkt">
              <animateMotion
                ref={(el) => { try { (el as SVGAnimationElement | null)?.beginElement(); } catch { /* trình duyệt cũ */ } }}
                dur="1.6s"
                begin="indefinite"
                fill="freeze"
                path={p.path}
              />
            </circle>
          ))}
        </svg>

        <div className="dmg__side">
          <div className="dmg__stats">
            <div><b>{count.total}</b><span>yêu cầu</span></div>
            <div><b className={count.failover ? "is-warn" : ""}>{count.failover}</b><span>lần tự chuyển model</span></div>
          </div>
          <ol className="dmg__log" aria-live="polite">
            {logs.map((l) => (
              <li key={l.id} className={l.warn ? "is-warn" : ""}>{l.text}</li>
            ))}
          </ol>
        </div>
      </div>
    </DemoFrame>
  );
}
