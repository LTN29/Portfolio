"use client";

import { useEffect, useRef } from "react";
import { IconG } from "@/components/sim/icons";
import { LogoPath } from "@/components/tech/logo";
import { Comet } from "@/components/sim/comet";

/* Sơ đồ kiến trúc ở hero (khổ ngang): kênh người dùng → Cloudflare → dịch vụ chạy trong Docker → dữ liệu, sàn, Zalo, model AI.
 * Không khung, nằm thẳng trên nền trắng. Đường nối vuông góc, gom theo trục chung. Dữ liệu đi thành từng "đợt" từ trái sang phải: vệt sáng vàng trượt dọc đường nối.
 * Ra khỏi màn hình thì dừng hiệu ứng. */

type N = { id: string; x: number; y: number; label: string; sub: string; logo?: string; icon?: string };

const NODES: N[] = [
  { id: "zalo", x: 96, y: 92, logo: "zalo", label: "Zalo Mini App", sub: "KHÁCH HÀNG" },
  { id: "app", x: 96, y: 196, logo: "react", label: "App iOS · Android", sub: "REACT NATIVE" },
  { id: "web", x: 96, y: 300, icon: "globe", label: "Website bán hàng", sub: "NỀN TẢNG TMĐT" },
  { id: "desk", x: 96, y: 404, logo: "electron", label: "Văn Phòng AI", sub: "NHÂN VIÊN · DESKTOP" },
  { id: "cf", x: 330, y: 248, logo: "cloudflare", label: "Cloudflare", sub: "TUNNEL · CDN · BẢO MẬT" },
  { id: "ci", x: 600, y: 48, logo: "githubactions", label: "GitHub Actions", sub: "BUILD · TRIỂN KHAI" },
  { id: "api", x: 600, y: 178, logo: "springboot", label: "Spring Boot API", sub: "BẢO HÀNH · KHO · MUA HÀNG" },
  { id: "gw", x: 600, y: 344, logo: "nodejs", label: "Node.js Gateway", sub: "AI · SẢNH 3D · CÔNG CỤ" },
  { id: "db", x: 880, y: 92, icon: "db", label: "Database", sub: "LƯU TRỮ · NHẬT KÝ" },
  { id: "san", x: 880, y: 196, logo: "shopee", label: "Shopee · TikTok", sub: "API SÀN TMĐT" },
  { id: "zns", x: 880, y: 300, icon: "bell", label: "Zalo ZNS · OTP", sub: "THÔNG BÁO" },
  { id: "ai", x: 880, y: 404, icon: "ai", label: "Model AI", sub: "GPT · CLAUDE · GEMINI" },
];
const at = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, N>;

/* [từ, tới, đợt (0 = trái → giữa, 1 = giữa → Docker, 2 = Docker → phải), nét đứt CI] */
const EDGES: [string, string, number, boolean?][] = [
  ["zalo", "cf", 0], ["app", "cf", 0], ["web", "cf", 0], ["desk", "cf", 0],
  ["cf", "api", 1], ["cf", "gw", 1],
  ["api", "db", 2], ["san", "api", 2], ["api", "zns", 2], ["gw", "ai", 2],
  ["ci", "api", 1, true],
];

const HS = 24; // nửa cạnh ô
const CYCLE = 4.2;

/* Đường gấp khúc vuông góc, bo góc nhỏ; các đường cùng nhóm dùng chung một trục dọc (bus) nên gọn và thẳng hàng. */
const BUS: Record<string, number> = { cf: 213, api: 455, gw: 455, out: 740 };

function route(a: N, b: N) {
  if (Math.abs(a.x - b.x) < 2) {
    const dir = b.y > a.y ? 1 : -1;
    const y1 = a.y + dir * (HS + 34), y2 = b.y - dir * (HS + 8);
    return { d: `M${a.x} ${y1} V${y2}`, ex: b.x, ey: y2, rot: dir > 0 ? 90 : -90 };
  }
  const dir = b.x > a.x ? 1 : -1;
  const x1 = a.x + dir * (HS + 6), x2 = b.x - dir * (HS + 8);
  const mx = a.x > 500 || b.x > 700 ? BUS.out : BUS[b.id] ?? (x1 + x2) / 2;
  const dy = b.y - a.y;
  if (Math.abs(dy) < 1) return { d: `M${x1} ${a.y} H${x2}`, ex: x2, ey: b.y, rot: dir > 0 ? 0 : 180 };
  const sy = Math.sign(dy);
  const r = Math.min(12, Math.abs(dy) / 2, Math.abs(mx - x1), Math.abs(x2 - mx));
  const d = `M${x1} ${a.y} H${mx - dir * r} Q${mx} ${a.y} ${mx} ${a.y + sy * r} V${b.y - sy * r} Q${mx} ${b.y} ${mx + dir * r} ${b.y} H${x2}`;
  return { d, ex: x2, ey: b.y, rot: dir > 0 ? 0 : 180 };
}

export function ArchLegend() {
  return (
    <p className="arch__foot">
      <span><i className="arch__lg" />Dữ liệu</span>
      <span><i className="arch__lg arch__lg--ci" />Build &amp; triển khai</span>
      <span><i className="arch__lg arch__lg--docker" />Docker</span>
      <span className="arch__live"><i />Các hệ thống đang chạy</span>
    </p>
  );
}

export function EcoMap({ legend = true }: { legend?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="arch" ref={ref}>
      <div className="arch__canvas">
        <svg viewBox="0 0 980 460" role="img" aria-label="Sơ đồ kiến trúc: Zalo Mini App, app mobile, website và Văn Phòng AI đi qua Cloudflare tới Spring Boot API và Node.js Gateway chạy trong Docker; API nối Database, API sàn Shopee/TikTok, Zalo ZNS; Gateway nối các model AI; GitHub Actions build và triển khai.">
          {/* cột */}
          <g className="arch__colh">
            <text x="96" y="22">KÊNH NGƯỜI DÙNG</text>
            <text x="330" y="22">CỔNG VÀO</text>
            <text x="880" y="22">DỮ LIỆU · DỊCH VỤ</text>
          </g>

          {/* vùng Docker */}
          <g className="arch__docker">
            <rect x="490" y="112" width="220" height="300" rx="22" />
            <g transform="translate(506 124) scale(0.8)"><LogoPath name="docker" /></g>
            <text x="534" y="140">Docker</text>
            <text x="694" y="140" textAnchor="end" className="arch__docker-sub">CONTAINER</text>
          </g>

          {EDGES.map(([a, b, wave, ci]) => {
            const r = route(at[a], at[b]);
            const t0 = wave * 1.1;
            return (
              <g key={`${a}-${b}`} className={`arch__link${ci ? " arch__link--ci" : ""}`}>
                <path d={r.d} className="arch__edge" />
                <path d="M-6 -4.2 L1.5 0 L-6 4.2 Z" transform={`translate(${r.ex} ${r.ey}) rotate(${r.rot})`} className="arch__arrow" />
                <Comet d={r.d} dur={CYCLE} delay={t0} />
              </g>
            );
          })}

          {NODES.map((n) => (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`} className="flow__node is-done arch__node">
              <rect x={-HS} y={-HS} width={HS * 2} height={HS * 2} rx="14" className="flow__tile" />
              <g transform="translate(-12 -12)" className="flow__icon">
                {n.logo ? <LogoPath name={n.logo} /> : <IconG name={n.icon ?? "cpu"} />}
              </g>
              <text y={HS + 18} textAnchor="middle" className="flow__label">{n.label}</text>
              <text y={HS + 31} textAnchor="middle" className="arch__sub">{n.sub}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="arch__hint">Vuốt ngang để xem cả sơ đồ →</p>
      {legend && <ArchLegend />}
    </figure>
  );
}
