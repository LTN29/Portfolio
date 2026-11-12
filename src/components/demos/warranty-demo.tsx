"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

const STEPS = ["Đã tạo phiếu", "Trung tâm đã nhận", "Đang kiểm tra", "Đang sửa", "Sửa xong", "Đã gửi trả"];

const CHANNELS = [
  { id: "zalo", label: "Zalo Mini App" },
  { id: "app", label: "App iOS · Android" },
  { id: "web", label: "Website" },
] as const;
type Channel = (typeof CHANNELS)[number]["id"];

const OTHERS = [
  { code: "BH-1102", name: "Đèn bàn học S2", step: 4, tech: "Tuấn" },
  { code: "BH-1099", name: "Quạt đối lưu F2", step: 2, tech: "Vy" },
  { code: "BH-1095", name: "Máy lọc không khí P3", step: 5, tech: "Tuấn" },
];

function DeviceGlyph() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="20" y="6" width="9" height="13" rx="4.5" stroke="currentColor" strokeWidth="2" />
      <path d="M24.5 19v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 37h19a3 3 0 0 1 3 3v1H12v-1a3 3 0 0 1 3-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24.5" cy="12.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function WarrantyDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [step, setStep] = useState(1);
  const [channel, setChannel] = useState<Channel>("zalo");
  const [auto, setAuto] = useState(true);
  const [ping, setPing] = useState(0);
  const [looked, setLooked] = useState(true);

  const advance = () => {
    setStep((s) => {
      const n = s >= STEPS.length - 1 ? 0 : s + 1;
      if (n === 0) setChannel((c) => CHANNELS[(CHANNELS.findIndex((x) => x.id === c) + 1) % CHANNELS.length].id);
      return n;
    });
    setPing((p) => p + 1);
  };

  useTicker(advance, 2600, inView && auto);

  const counts = STEPS.map((_, i) => OTHERS.filter((o) => o.step === i).length + (i === step ? 1 : 0));

  return (
    <DemoFrame title="Hệ thống bảo hành · 1 dữ liệu, 3 kênh khách hàng" frameRef={ref} className="dm-warranty">
      <div className="dmw">
        <div className="dmw__cust">
          <div className="dmw__chan" role="tablist" aria-label="Kênh khách hàng">
            {CHANNELS.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={channel === c.id} className={channel === c.id ? "is-on" : ""} onClick={() => { setAuto(false); setChannel(c.id); }}>
                {c.label}
              </button>
            ))}
          </div>

          <div className={`dmw__device dmw__device--${channel}`}>
            {channel === "web" ? (
              <div className="dmw__urlbar"><i aria-hidden="true" />tra-cuu-bao-hanh.vn</div>
            ) : (
              <div className="dmw__status"><span>9:41</span><span aria-hidden="true">▮▮▮ ◔</span></div>
            )}
            {channel === "zalo" && (
              <div className="dmw__zalohead"><b>Bảo hành</b><span className="dmw__capsule" aria-hidden="true">··· | ✕</span></div>
            )}
            {channel === "app" && <div className="dmw__apphead"><b>Thiết bị của tôi</b></div>}
            {channel === "web" && <div className="dmw__webhead"><b>Tra cứu bảo hành</b><span>Nhập số seri hoặc số điện thoại</span></div>}

            <form className="dmw__lookup" onSubmit={(e) => { e.preventDefault(); setLooked(true); setPing((p) => p + 1); }}>
              <input aria-label="Số seri" defaultValue="SN-2026-0418-77" />
              <button type="submit">Tra cứu</button>
            </form>

            {looked && (
              <div className="dmw__result" key={`${channel}-${ping}`}>
                <div className="dmw__prod">
                  <span className="dmw__glyph"><DeviceGlyph /></span>
                  <div>
                    <b>Máy hút bụi cầm tay V5</b>
                    <span>Bảo hành đến 15/06/2027</span>
                  </div>
                </div>
                <div className="dmw__left"><span>Còn 225 ngày</span><i><em style={{ width: "62%" }} /></i></div>
                <p className="dmw__claim">Phiếu <b>BH-1104</b> · {STEPS[step]}</p>
                <ol className="dmw__tl">
                  {STEPS.map((s, i) => (
                    <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""}>{s}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        <div className="dmw__admin">
          <div className="dmw__admin-head">
            <p className="dm-kicker">Màn hình kỹ thuật viên</p>
            <span className="dm-muted">Cập nhật ở đây → khách thấy ngay trên mọi kênh</span>
          </div>
          <ul className="dmw__counts" aria-label="Số phiếu theo trạng thái">
            {STEPS.map((s, i) => (
              <li key={s} className={i === step ? "is-on" : ""}><b>{counts[i]}</b><span>{s}</span></li>
            ))}
          </ul>
          <table className="dmw__table">
            <thead><tr><th>Phiếu</th><th>Sản phẩm</th><th>Trạng thái</th></tr></thead>
            <tbody>
              <tr className="is-mine">
                <td>BH-1104</td><td>Máy hút bụi V5</td><td><span className="dm-pill" key={ping}>{STEPS[step]}</span></td>
              </tr>
              {OTHERS.map((o) => (
                <tr key={o.code}><td>{o.code}</td><td>{o.name}</td><td><span className="dm-pill dm-pill--dim">{STEPS[o.step]}</span></td></tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="dm-btn" onClick={() => { setAuto(false); advance(); }}>
            Chuyển BH-1104 sang bước tiếp
          </button>
        </div>
      </div>
    </DemoFrame>
  );
}
