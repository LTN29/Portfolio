"use client";

import { useRef, useState } from "react";
import { DemoFrame, fmtVnd, useInView, useTicker } from "./kit";

const ICONS: Record<string, React.ReactNode> = {
  fan: (<g><circle cx="24" cy="20" r="11" /><path d="M24 20c4-7 9-6 9-2s-5 4-9 2zM24 20c-1 8-6 10-9 7s1-6 9-7zM24 20c-7-3-7-8-3-9s4 4 3 9z" /><path d="M24 31v8M17 40h14" /></g>),
  lamp: (<g><path d="M14 13h20l-3 5H17z" /><path d="M24 18v19M16 40h16" /><path d="M17 22l-4 8M31 22l4 8" opacity=".5" /></g>),
  vac: (<g><rect x="20" y="6" width="8" height="12" rx="4" /><path d="M24 18v17" /><path d="M15 35h18a3 3 0 0 1 3 3v2H12v-2a3 3 0 0 1 3-3z" /></g>),
  air: (<g><rect x="15" y="7" width="18" height="33" rx="7" /><circle cx="24" cy="15" r="3.5" /><path d="M19 24h10M19 28h10M19 32h10" /></g>),
};

const PRODUCTS = [
  { id: 1, name: "Quạt đối lưu F2", price: 1290000, was: 1690000, icon: "fan", tone: 0 },
  { id: 2, name: "Đèn bàn học S2", price: 890000, was: 1190000, icon: "lamp", tone: 1 },
  { id: 3, name: "Máy hút bụi V5", price: 2490000, was: 3290000, icon: "vac", tone: 2 },
  { id: 4, name: "Máy lọc không khí P3", price: 2890000, was: 3590000, icon: "air", tone: 3 },
];

const THEMES = [
  { id: "teal", label: "Xanh ngọc", c: "#14b8a6" },
  { id: "amber", label: "Hổ phách", c: "#e0a24a" },
  { id: "rose", label: "Hồng đất", c: "#e07a6a" },
];

export function StoreDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [mobile, setMobile] = useState(false);
  const [theme, setTheme] = useState(THEMES[0]);
  const [cart, setCart] = useState<number[]>([]);
  const [toast, setToast] = useState<{ n: number; name: string } | null>(null);
  const [auto, setAuto] = useState(true);
  const tick = useRef(0);

  const add = (id: number) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    setCart((c) => [...c, id].slice(-9));
    setToast({ n: Date.now(), name: p.name });
  };

  useTicker(() => {
    const t = tick.current++;
    if (t % 3 === 2) setTheme(THEMES[(Math.floor(t / 3) + 1) % THEMES.length]);
    else add(PRODUCTS[t % PRODUCTS.length].id);
    if (t % 6 === 5) setMobile((m) => !m);
    if (cart.length > 6) setCart([]);
  }, 1700, inView && auto);

  const stop = () => setAuto(false);
  const total = cart.reduce((s, id) => s + PRODUCTS.find((p) => p.id === id)!.price, 0);

  return (
    <DemoFrame title="cua-hang-mau.vn" chrome="browser" frameRef={ref} className="dm-store" aside="Theme tuỳ biến trên Sapo">
      <div className="dms__tools">
        <div className="dms__seg" role="group" aria-label="Kích thước màn hình">
          <button type="button" aria-pressed={!mobile} onClick={() => { stop(); setMobile(false); }}>Máy tính</button>
          <button type="button" aria-pressed={mobile} onClick={() => { stop(); setMobile(true); }}>Điện thoại</button>
        </div>
        <div className="dms__swatches" role="group" aria-label="Màu giao diện">
          {THEMES.map((t) => (
            <button key={t.id} type="button" aria-label={t.label} aria-pressed={theme.id === t.id} style={{ background: t.c }} onClick={() => { stop(); setTheme(t); }} />
          ))}
        </div>
      </div>

      <div className="dms__stage">
        <div className={`dms__site${mobile ? " is-mobile" : ""}`} style={{ ["--acc" as string]: theme.c }}>
          <div className="dms__promo">Miễn phí giao hàng cho đơn từ 500.000đ</div>
          <header className="dms__head">
            <b className="dms__logo">Nhà<span>.</span></b>
            {!mobile && <nav aria-hidden="true"><span>Gia dụng</span><span>Học tập</span><span>Ưu đãi</span></nav>}
            <span className="dms__cart" aria-label={`Giỏ hàng ${cart.length} sản phẩm`}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14l-1.4 11H6.4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.7" /></svg>
              <i key={cart.length}>{cart.length}</i>
            </span>
          </header>
          <div className="dms__hero">
            <div>
              <span className="dms__eyebrow">Ưu đãi cuối năm</span>
              <b>Giảm đến 30%</b>
              <span className="dms__count">Còn 02 : 14 : 37</span>
            </div>
          </div>
          <div className="dms__grid">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="dms__card">
                <span className={`dms__tile dms__tile--${p.tone}`}>
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[p.icon]}</svg>
                  <em>-{Math.round((1 - p.price / p.was) * 100)}%</em>
                </span>
                <b>{p.name}</b>
                <span className="dms__price">{fmtVnd(p.price)} <s>{fmtVnd(p.was)}</s></span>
                <button type="button" onClick={() => { stop(); add(p.id); }}>Thêm vào giỏ</button>
              </div>
            ))}
          </div>
          {toast && (
            <div className="dms__toast" key={toast.n} role="status">
              Đã thêm {toast.name} · Tạm tính {fmtVnd(total)}
            </div>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
