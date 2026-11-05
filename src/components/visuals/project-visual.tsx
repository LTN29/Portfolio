import type { VisualKind } from "@/data/portfolio";

/* Minh hoạ dựng bằng HTML/CSS (không cần ảnh chụp màn hình) — chuyển động nhẹ bằng CSS, tắt khi reduced-motion. */

function Live() {
  return (
    <div className="pv pv-live" aria-hidden="true">
      <div className="pv-live__phone">
        <div className="pv-live__screen">
          <span className="pv-live__badge"><i />LIVE</span>
          <span className="pv-live__viewers">1.2K</span>
          <div className="pv-live__host">
            <span className="pv-live__halo" />
            <span className="pv-live__face" />
          </div>
          <div className="pv-live__wave">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.07}s` }} />)}</div>
          <ul className="pv-live__chat">
            <li><b>minh.t</b>Máy này hút được lông mèo không?</li>
            <li className="is-ai"><b>AI host</b>Có ạ, đầu chổi điện xử lý tốt lông thú cưng.</li>
            <li><b>lan.p</b>Còn voucher không shop?</li>
            <li className="is-ai"><b>AI host</b>Đang có giá ưu đãi trong phiên live hôm nay ạ.</li>
          </ul>
        </div>
      </div>
      <div className="pv-tags pv-tags--live">
        <span>FAQ-first</span>
        <span>VieNeu-TTS</span>
        <span>SSE → OBS</span>
      </div>
    </div>
  );
}

const desks = [
  { name: "Trưởng nhóm", model: "Claude", state: "plan" },
  { name: "Lập trình", model: "GPT", state: "run" },
  { name: "Kiểm thử", model: "Gemini", state: "check" },
  { name: "Viết tài liệu", model: "Local", state: "idle" },
  { name: "Thiết kế", model: "Gateway", state: "run" },
  { name: "Khay nộp", model: "3 việc", state: "done" },
];

function Office() {
  return (
    <div className="pv pv-office" aria-hidden="true">
      <div className="pv-office__floor">
        {desks.map((d, i) => (
          <div key={d.name} className={`pv-desk pv-desk--${d.state}`} style={{ animationDelay: `${i * 0.35}s` }}>
            <span className="pv-desk__dot" />
            <b>{d.name}</b>
            <small>{d.model}</small>
          </div>
        ))}
        <div className="pv-office__card">Viết API đơn hàng</div>
      </div>
    </div>
  );
}

function Gateway() {
  const nodes = ["App", "Edge", "Gateway", "Router"];
  return (
    <div className="pv pv-gateway" aria-hidden="true">
      <div className="pv-gateway__flow">
        {nodes.map((n, i) => (
          <div key={n} className={`pv-node${n === "Gateway" ? " is-core" : ""}`}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <b>{n}</b>
          </div>
        ))}
        <div className="pv-gateway__models">
          {["Claude", "GPT", "Gemini", "Local"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
      <div className="pv-gateway__memory">
        <span>COMPANY.md</span>
        <span>TEAM-SALES.md</span>
        <span>TEAM-CSKH.md</span>
      </div>
      <pre className="pv-gateway__code">{`POST /v1/chat/completions
→ team: SALES · memory +2 · fallback ok`}</pre>
    </div>
  );
}

function Orchestrator() {
  const flow = ["Campaign", "Dispatcher", "Worker", "Watchdog"];
  return (
    <div className="pv pv-orch" aria-hidden="true">
      <div className="pv-orch__canvas">
        {flow.map((n, i) => (
          <div key={n} className="pv-orch__node" style={{ animationDelay: `${i * 0.5}s` }}>
            <i />
            <b>{n}</b>
            <small>{["n8n trigger", "1 job / post", "Playwright", "retry · session"][i]}</small>
          </div>
        ))}
      </div>
      <div className="pv-orch__queue">
        <span className="is-ok">post #128 · đã xếp lịch</span>
        <span className="is-run">post #129 · đang nhập</span>
        <span>post #130 · chờ</span>
        <em>DRY_RUN=true</em>
      </div>
    </div>
  );
}

function Inventory() {
  const bars = [
    { k: "Có sẵn", v: 72 },
    { k: "Đang giữ", v: 34 },
    { k: "Đã chốt", v: 51 },
    { k: "Hoàn", v: 12 },
  ];
  return (
    <div className="pv pv-inv" aria-hidden="true">
      <div className="pv-inv__bars">
        {bars.map((b, i) => (
          <div key={b.k} style={{ "--v": b.v, animationDelay: `${i * 0.12}s` } as React.CSSProperties}>
            <i />
            <span>{b.k}</span>
          </div>
        ))}
      </div>
      <div className="pv-inv__log">
        <span>+20 NHẬP · HCM</span>
        <span>−3 SHOPEE · giữ</span>
        <span>−1 TIKTOK · chốt</span>
      </div>
    </div>
  );
}

function Warranty() {
  return (
    <div className="pv pv-warranty" aria-hidden="true">
      <ol>
        {["Tiếp nhận", "Kỹ thuật kiểm tra", "Đang sửa", "Trả khách"].map((s, i) => (
          <li key={s} className={i < 2 ? "is-done" : i === 2 ? "is-now" : ""}><i />{s}</li>
        ))}
      </ol>
      <span className="pv-warranty__code">BH-2611-0042</span>
    </div>
  );
}

function Mobile() {
  return (
    <div className="pv pv-mobile" aria-hidden="true">
      <div className="pv-mobile__phone">
        <span className="pv-mobile__title">Thiết bị của tôi</span>
        <span className="pv-mobile__item"><b>Máy hút bụi A9</b><small>Bảo hành đến 11/2027</small></span>
        <span className="pv-mobile__item"><b>Cân thông minh X6</b><small>Đã kích hoạt</small></span>
        <span className="pv-mobile__btn">Gửi yêu cầu bảo hành</span>
      </div>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "live": return <Live />;
    case "office": return <Office />;
    case "gateway": return <Gateway />;
    case "orchestrator": return <Orchestrator />;
    case "inventory": return <Inventory />;
    case "warranty": return <Warranty />;
    case "mobile": return <Mobile />;
  }
}
