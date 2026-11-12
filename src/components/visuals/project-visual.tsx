import type { VisualKind } from "@/data/portfolio";

/* Minh hoạ kỹ thuật dựng bằng SVG đa lớp + giao diện vi mô (micro-dashboard) với ánh sáng kim loại rõ nét */

function Live() {
  return (
    <div className="pv pv-live" aria-hidden="true">
      <div className="pv-live__phone">
        <div className="pv-live__screen">
          <div className="pv-live__top">
            <span className="pv-live__badge"><i />LIVE · 60FPS</span>
            <span className="pv-live__viewers">
              <svg viewBox="0 0 16 16" fill="none"><path d="M1.5 8C3 4.8 5.4 3.2 8 3.2C10.6 3.2 13 4.8 14.5 8C13 11.2 10.6 12.8 8 12.8C5.4 12.8 3 11.2 1.5 8Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.2" fill="currentColor"/></svg>
              1.42K
            </span>
          </div>

          <div className="pv-live__host">
            <svg className="pv-live__rings" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="52" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="60" cy="60" r="40" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.2" />
              <circle cx="60" cy="60" r="28" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
            </svg>
            <span className="pv-live__halo" />
            <span className="pv-live__face" />
          </div>

          <div className="pv-live__wave">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>

          <ul className="pv-live__chat">
            <li><b>minh.t</b>Máy hút được lông thú cưng không shop?</li>
            <li className="is-ai"><b>AI Host</b>Dạ có ạ, đầu chổi chống rối hút sạch 99% lông mèo.</li>
            <li className="is-ai"><b>AI Host</b>Đang có mã giảm 350K ngay trên giỏ hàng số 1 ạ!</li>
          </ul>
        </div>
      </div>
      <div className="pv-tags pv-tags--live">
        <span>FAQ-First RAG</span>
        <span>VieNeu-TTS 24kHz</span>
        <span>SSE → OBS Studio</span>
      </div>
    </div>
  );
}

const desks = [
  { role: "Lead Architect", model: "Claude 3.7", state: "plan", task: "Phân rã spec" },
  { role: "Backend Coder", model: "GPT-4o", state: "run", task: "Order API" },
  { role: "QA Inspector", model: "Gemini 2.5", state: "check", task: "24/24 Pass" },
  { role: "Tech Writer", model: "Local LLM", state: "idle", task: "OpenAPI Doc" },
  { role: "Context Router", model: "AI Gateway", state: "run", task: "Memory Sync" },
  { role: "Release Hub", model: "Docker CI", state: "done", task: "Ready v2.4" },
];

function Office() {
  return (
    <div className="pv pv-office" aria-hidden="true">
      <div className="pv-office__stage">
        <div className="pv-office__hud">
          <span className="pv-office__status"><i />6 AI AGENTS ONLINE</span>
          <span className="pv-office__sync">SYNC 99.8% · 32ms</span>
        </div>

        <div className="pv-office__hub">
          <svg className="pv-office__wires" viewBox="0 0 320 140" fill="none" preserveAspectRatio="none">
            <path d="M55 35 L160 70 L265 35 M55 105 L160 70 L265 105 M160 22 L160 118" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="160" cy="70" r="18" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
            <circle cx="160" cy="70" r="4" fill="currentColor" />
          </svg>

          <div className="pv-office__floor">
            {desks.map((d, i) => (
              <div key={d.role} className={`pv-desk pv-desk--${d.state}`} style={{ animationDelay: `${i * 0.25}s` }}>
                <div className="pv-desk__head">
                  <span className="pv-desk__dot" />
                  <small>{d.model}</small>
                </div>
                <b>{d.role}</b>
                <span className="pv-desk__task">{d.task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pv-office__footer">
          <div className="pv-office__card">
            <span>TASK #14</span>
            <b>Triển khai Webhook &amp; Thanh toán</b>
            <em>86%</em>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gateway() {
  const nodes = [
    { idx: "01", name: "Apps", sub: "Web · App" },
    { idx: "02", name: "Edge", sub: "Auth · Rate" },
    { idx: "03", name: "Gateway", sub: "Core Router" },
    { idx: "04", name: "Models", sub: "Multi-LLM" },
  ];
  return (
    <div className="pv pv-gateway" aria-hidden="true">
      <div className="pv-gateway__top">
        <span className="pv-gateway__badge"><i />NEURAL GATEWAY v3</span>
        <span className="pv-gateway__metric">P95: 24ms · Fallback OK</span>
      </div>

      <div className="pv-gateway__flow">
        {nodes.map((n) => (
          <div key={n.name} className={`pv-node${n.name === "Gateway" ? " is-core" : ""}`}>
            <span>{n.idx}</span>
            <b>{n.name}</b>
            <small>{n.sub}</small>
          </div>
        ))}
        <div className="pv-gateway__models">
          {["Claude 3.7", "GPT-4o", "Gemini 2.5", "vLLM Local"].map((m) => (
            <span key={m}><i />{m}</span>
          ))}
        </div>
      </div>

      <div className="pv-gateway__memory">
        <span>COMPANY.md</span>
        <span>TEAM-SALES.md</span>
        <span>TEAM-CSKH.md</span>
      </div>
      <pre className="pv-gateway__code">{`POST /v1/chat/completions  [200 OK]
→ route: SALES_AGENT · memory: +3 chunks`}</pre>
    </div>
  );
}

function Orchestrator() {
  const flow = [
    { name: "Campaign", sub: "n8n Trigger", icon: "◎" },
    { name: "Dispatcher", sub: "Queue Redis", icon: "◈" },
    { name: "Workers", sub: "Playwright", icon: "❖" },
    { name: "Watchdog", sub: "Auto-Retry", icon: "✦" },
  ];
  return (
    <div className="pv pv-orch" aria-hidden="true">
      <div className="pv-orch__top">
        <span>ORCHESTRATOR DAG</span>
        <em>12 WORKERS ACTIVE</em>
      </div>
      <div className="pv-orch__canvas">
        {flow.map((n, i) => (
          <div key={n.name} className="pv-orch__node" style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="pv-orch__node-head">
              <i />
              <span>{n.icon}</span>
            </div>
            <b>{n.name}</b>
            <small>{n.sub}</small>
          </div>
        ))}
      </div>
      <div className="pv-orch__queue">
        <span className="is-ok">post #128 · Đã xuất bản</span>
        <span className="is-run">post #129 · Đang render media</span>
        <span>post #130 · Hàng đợi ưu tiên</span>
        <em>SESSION_GUARD=ON</em>
      </div>
    </div>
  );
}

function Inventory() {
  const bars = [
    { k: "Khả dụng", v: 78, num: "1,420" },
    { k: "Đang giữ", v: 42, num: "318" },
    { k: "Đã xuất", v: 64, num: "890" },
    { k: "Đối soát", v: 24, num: "99.9%" },
  ];
  return (
    <div className="pv pv-inv" aria-hidden="true">
      <div className="pv-inv__head">
        <span>REALTIME LEDGER · 4 KÊNH</span>
        <b>Đồng bộ tức thì</b>
      </div>
      <div className="pv-inv__bars">
        {bars.map((b, i) => (
          <div key={b.k} style={{ "--v": b.v, animationDelay: `${i * 0.12}s` } as React.CSSProperties}>
            <em>{b.num}</em>
            <i />
            <span>{b.k}</span>
          </div>
        ))}
      </div>
      <div className="pv-inv__log">
        <span className="is-plus">+20 NHẬP · KHO HCM</span>
        <span>−3 SHOPEE MALL · GIỮ ĐƠN</span>
        <span>−1 TIKTOK SHOP · ĐÃ CHỐT</span>
      </div>
    </div>
  );
}

function Warranty() {
  const steps = [
    { label: "Tiếp nhận mã QR & Serial", meta: "10:15 · Hoàn tất" },
    { label: "Kỹ thuật chẩn đoán", meta: "11:40 · Đã xác nhận" },
    { label: "Thay linh kiện chính hãng", meta: "Đang xử lý · SLA 4h" },
    { label: "Bàn giao & kích hoạt lại", meta: "Dự kiến 16:00" },
  ];
  return (
    <div className="pv pv-warranty" aria-hidden="true">
      <div className="pv-warranty__head">
        <div>
          <small>MÃ BẢO HÀNH ĐIỆN TỬ</small>
          <span className="pv-warranty__code">BH-2611-0042</span>
        </div>
        <span className="pv-warranty__seal">CHÍNH HÃNG</span>
      </div>
      <ol>
        {steps.map((s, i) => (
          <li key={s.label} className={i < 2 ? "is-done" : i === 2 ? "is-now" : ""}>
            <i />
            <div>
              <b>{s.label}</b>
              <small>{s.meta}</small>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Mobile() {
  return (
    <div className="pv pv-mobile" aria-hidden="true">
      <div className="pv-mobile__phone">
        <div className="pv-mobile__statusbar">
          <span>09:41</span>
          <span className="pv-mobile__island" />
          <span>5G · 100%</span>
        </div>
        <div className="pv-mobile__header">
          <small>XIN CHÀO, MINH QUÂN</small>
          <span className="pv-mobile__title">Thiết bị thông minh</span>
        </div>
        <div className="pv-mobile__item is-active">
          <div className="pv-mobile__item-row">
            <b>Robot Hút Bụi A9 Pro</b>
            <em>Còn 18 tháng</em>
          </div>
          <small>Serial: SN-88492 · Bảo hành Vàng</small>
          <span className="pv-mobile__bar"><i style={{ width: "78%" }} /></span>
        </div>
        <div className="pv-mobile__item">
          <div className="pv-mobile__item-row">
            <b>Máy Lọc Khí AirPure X6</b>
            <em>Đã kích hoạt</em>
          </div>
          <small>Lõi lọc HEPA: Tốt (92%)</small>
        </div>
        <span className="pv-mobile__btn">Quét QR · Yêu cầu bảo hành</span>
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
