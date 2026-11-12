"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

const TOTAL = 18400; // USD

const STEPS = [
  { s: "Dự tính", note: "AI đọc báo giá PDF, điền sẵn 6 dòng hàng", who: "Mua hàng" },
  { s: "Đàm phán", note: "Chốt giá, điều kiện FOB, hạn xong hàng 20/11", who: "Mua hàng" },
  { s: "Hợp đồng", note: "Tạo hợp đồng từ mẫu Word · đặt cọc 30%", who: "Kế toán", pay: 0.3 },
  { s: "Sản xuất", note: "Nhà máy báo tiến độ 70% · còn 5 ngày đến hạn", who: "Mua hàng", alert: "Sắp đến hạn xong hàng" },
  { s: "Book tàu", note: "Đặt chỗ tàu, thanh toán 70% còn lại", who: "Kế toán", pay: 1 },
  { s: "Vận chuyển", note: "Tàu rời cảng · dự kiến cập cảng 28/11", who: "Logistics" },
  { s: "Thông quan", note: "Đủ chứng từ: hoá đơn, phiếu đóng gói, C/O", who: "Logistics" },
  { s: "Về kho", note: "Nhập kho 1.240 sản phẩm, đóng lô theo SKU", who: "Kho" },
  { s: "Kiểm định", note: "QC lấy mẫu 2% · đạt", who: "QC" },
  { s: "Hoàn tất", note: "Đóng đơn, lưu toàn bộ chứng từ", who: "Hệ thống" },
];

export function PurchaseDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [i, setI] = useState(2);
  const [auto, setAuto] = useState(true);

  const next = () => setI((x) => (x + 1) % STEPS.length);
  useTicker(next, 2000, inView && auto);

  const paid = STEPS.slice(0, i + 1).reduce((m, s) => Math.max(m, s.pay ?? 0), 0);
  const cur = STEPS[i];
  const history = STEPS.slice(0, i + 1).slice(-3).reverse();

  return (
    <DemoFrame title="Quản lý mua hàng & nhập khẩu" frameRef={ref} className="dm-purchase">
      <div className="dmp">
        <div className="dmp__head">
          <div>
            <p className="dm-kicker">Đơn mua PO-2026-0418</p>
            <b className="dmp__title">Nhà cung cấp A · 6 mặt hàng</b>
          </div>
          <span className={`dm-pill${i === STEPS.length - 1 ? " dm-pill--ok" : ""}`}>{cur.s}</span>
        </div>

        <ol className="dmp__rail" aria-label="Các mốc của đơn mua">
          {STEPS.map((s, k) => (
            <li key={s.s} className={k < i ? "is-done" : k === i ? "is-now" : ""}>
              <button type="button" onClick={() => { setAuto(false); setI(k); }} aria-current={k === i ? "step" : undefined}>
                <i aria-hidden="true">{k < i ? "✓" : k + 1}</i>
                <span>{s.s}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="dmp__grid">
          <div className="dmp__card">
            <p className="dm-kicker">Bước hiện tại · {cur.who}</p>
            <p className="dmp__note" key={i}>{cur.note}</p>
            {cur.alert && <p className="dmp__alert" role="status">⚠ {cur.alert}</p>}
            <ul className="dmp__hist">
              {history.map((h) => <li key={h.s}><b>{h.s}</b>{h.note}</li>)}
            </ul>
          </div>
          <div className="dmp__card">
            <p className="dm-kicker">Thanh toán</p>
            <div className="dmp__pay">
              <b>{Math.round(TOTAL * paid).toLocaleString("vi-VN")}</b>
              <span>/ {TOTAL.toLocaleString("vi-VN")} USD</span>
            </div>
            <span className="dmp__bar"><i style={{ width: `${paid * 100}%` }} /></span>
            <ul className="dmp__sched">
              <li className={paid >= 0.3 ? "is-paid" : ""}>Đặt cọc 30% · khi ký hợp đồng</li>
              <li className={paid >= 1 ? "is-paid" : ""}>Còn lại 70% · trước khi lên tàu</li>
            </ul>
            <button type="button" className="dm-btn" onClick={() => { setAuto(false); next(); }}>Cập nhật trạng thái</button>
          </div>
        </div>
      </div>
    </DemoFrame>
  );
}
