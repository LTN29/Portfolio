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
  { id: "zalo", x: 96, y: 92, logo: "zalo", label: "Zalo Mini App", sub: "NGƯỜI DÙNG" },
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

/* ── Bản dọc cho điện thoại: cùng nội dung, xếp từ trên xuống, vừa khít bề ngang, không phải vuốt ── */
type V = { id: string; x: number; y: number; label: string; logo?: string; icon?: string };
const VS = 20; // nửa cạnh ô (bản dọc)
const VNODES: V[] = [
  { id: "zalo", x: 48, y: 62, logo: "zalo", label: "Zalo App" },
  { id: "app", x: 135, y: 62, logo: "react", label: "iOS · Android" },
  { id: "web", x: 225, y: 62, icon: "globe", label: "Website" },
  { id: "desk", x: 310, y: 62, logo: "electron", label: "Văn Phòng AI" },
  { id: "ci", x: 56, y: 178, logo: "githubactions", label: "GitHub Actions" },
  { id: "cf", x: 180, y: 178, logo: "cloudflare", label: "Cloudflare" },
  { id: "api", x: 115, y: 302, logo: "springboot", label: "Spring Boot API" },
  { id: "gw", x: 245, y: 302, logo: "nodejs", label: "Node.js Gateway" },
  { id: "db", x: 45, y: 440, icon: "db", label: "Database" },
  { id: "san", x: 135, y: 440, logo: "shopee", label: "Sàn TMĐT" },
  { id: "zns", x: 225, y: 440, icon: "bell", label: "Zalo ZNS" },
  { id: "ai", x: 315, y: 440, icon: "ai", label: "Model AI" },
];
const vat = Object.fromEntries(VNODES.map((n) => [n.id, n])) as Record<string, V>;
const below = (n: V) => n.y + VS + 24; // điểm ra: dưới nhãn
const above = (n: V) => n.y - VS - 7; // điểm vào: trên ô

/* đường dọc → ngang theo trục chung (bus) → dọc, bo góc */
function vpath(ax: number, ay: number, bx: number, by: number, bus: number) {
  if (Math.abs(ax - bx) < 1) return `M${ax} ${ay} V${by}`;
  const s1 = Math.sign(bus - ay), s2 = Math.sign(by - bus), d = Math.sign(bx - ax);
  const r = Math.min(9, Math.abs(bx - ax) / 2, Math.abs(bus - ay), Math.abs(by - bus));
  return `M${ax} ${ay} V${bus - s1 * r} Q${ax} ${bus} ${ax + d * r} ${bus} H${bx - d * r} Q${bx} ${bus} ${bx} ${bus + s2 * r} V${by}`;
}

const VEDGES: { d: string; ex: number; ey: number; rot: number; wave: number; ci?: boolean }[] = [
  ...["zalo", "app", "web", "desk"].map((k) => ({ d: vpath(vat[k].x, below(vat[k]), 180, above(vat.cf), 128), ex: 180, ey: above(vat.cf), rot: 90, wave: 0 })),
  ...["api", "gw"].map((k) => ({ d: vpath(180, below(vat.cf), vat[k].x, above(vat[k]), 252), ex: vat[k].x, ey: above(vat[k]), rot: 90, wave: 1 })),
  { d: `M56 ${below(vat.ci)} V${vat.api.y - 9} Q56 ${vat.api.y} 65 ${vat.api.y} H${vat.api.x - VS - 7}`, ex: vat.api.x - VS - 7, ey: vat.api.y, rot: 0, wave: 1, ci: true },
  ...["db", "zns"].map((k) => ({ d: vpath(115, below(vat.api), vat[k].x, above(vat[k]), 384), ex: vat[k].x, ey: above(vat[k]), rot: 90, wave: 2 })),
  { d: vpath(135, above(vat.san), 115, below(vat.api), 392), ex: 115, ey: below(vat.api), rot: -90, wave: 2 },
  { d: vpath(245, below(vat.gw), 315, above(vat.ai), 384), ex: 315, ey: above(vat.ai), rot: 90, wave: 2 },
];

function EcoMapV() {
  return (
    <svg className="arch__v" viewBox="0 0 360 490" role="img" aria-label="Sơ đồ kiến trúc: các kênh người dùng đi qua Cloudflare tới Spring Boot API và Node.js Gateway chạy trong Docker; API nối Database, sàn Shopee/TikTok, Zalo ZNS; Gateway nối các model AI; GitHub Actions build và triển khai.">
      <g className="arch__colh"><text x="180" y="14">KÊNH NGƯỜI DÙNG</text></g>
      <g className="arch__docker">
        <rect x="22" y="236" width="316" height="128" rx="18" />
        <g transform="translate(32 244) scale(0.62)"><LogoPath name="docker" /></g>
        <text x="52" y="256">Docker</text>
      </g>
      {VEDGES.map((e, i) => (
        <g key={i} className={`arch__link${e.ci ? " arch__link--ci" : ""}`}>
          <path d={e.d} className="arch__edge" />
          <path d="M-5 -3.6 L1.2 0 L-5 3.6 Z" transform={`translate(${e.ex} ${e.ey}) rotate(${e.rot})`} className="arch__arrow" />
          <Comet d={e.d} dur={CYCLE} delay={e.wave * 1.1} />
        </g>
      ))}
      {VNODES.map((n) => (
        <g key={n.id} transform={`translate(${n.x} ${n.y})`} className="flow__node is-done arch__node arch__node--v">
          <rect x={-VS} y={-VS} width={VS * 2} height={VS * 2} rx="12" className="flow__tile" />
          <g transform="translate(-10.5 -10.5) scale(0.875)" className="flow__icon">
            {n.logo ? <LogoPath name={n.logo} /> : <IconG name={n.icon ?? "cpu"} />}
          </g>
          <text y={VS + 15} textAnchor="middle" className="flow__label">{n.label}</text>
        </g>
      ))}
    </svg>
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
      <EcoMapV />
      {legend && <ArchLegend />}
    </figure>
  );
}
