"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

const CHANNELS = ["Shopee", "TikTok Shop", "Website"] as const;
type Ch = (typeof CHANNELS)[number];

type Sku = { sku: string; name: string; hcm: number; hn: number };
const START: Sku[] = [
  { sku: "V5", name: "Máy hút bụi V5", hcm: 14, hn: 9 },
  { sku: "S2", name: "Đèn bàn học S2", hcm: 7, hn: 3 },
  { sku: "F2", name: "Quạt đối lưu F2", hcm: 22, hn: 18 },
];
const LOW = 8;

type Log = { id: number; text: string; warn?: boolean };

export function InventoryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [rows, setRows] = useState(START);
  const [flash, setFlash] = useState<{ sku: string; n: number } | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [auto, setAuto] = useState(true);
  const seq = useRef(0);

  const sell = (ch: Ch, skuCode?: string) => {
    const id = ++seq.current;
    const pick = skuCode ?? rows[id % rows.length].sku;
    const out = rows.map((r) => {
      if (r.sku !== pick || r.hcm + r.hn === 0) return r;
      // trừ ở kho còn nhiều hàng hơn
      return r.hcm >= r.hn ? { ...r, hcm: r.hcm - 1 } : { ...r, hn: r.hn - 1 };
    });
    const after = out.find((r) => r.sku === pick)!;
    const total = after.hcm + after.hn;
    setRows(out);
    setFlash({ sku: pick, n: id });
    setLogs((l) => [
      { id, text: `${ch} · đơn mới ${after.name} → còn ${total}, đã cập nhật 3 kênh` },
      ...(total <= LOW ? [{ id: id + 0.5, text: `${after.name} sắp hết (còn ${total}) — gợi ý nhập thêm`, warn: true }] : []),
      ...l,
    ].slice(0, 4));
  };

  const restock = (sku: string) => {
    const id = ++seq.current;
    setRows(rows.map((r) => (r.sku === sku ? { ...r, hcm: r.hcm + 20 } : r)));
    setFlash({ sku, n: id });
    setLogs((l) => [{ id, text: `Nhập kho HCM +20 ${sku} — 3 kênh tự tăng số bán được` }, ...l].slice(0, 4));
  };

  useTicker(() => {
    // tự bổ sung khi gần hết để demo chạy mãi
    const empty = rows.find((r) => r.hcm + r.hn <= 2);
    if (empty) restock(empty.sku);
    else sell(CHANNELS[seq.current % 3]);
  }, 1500, inView && auto);

  return (
    <DemoFrame title="Tồn kho & kết nối đa sàn" frameRef={ref} className="dm-inventory">
      <div className="dmi">
        <div className="dmi__actions">
          <span className="dm-kicker">Bán thử 1 đơn trên</span>
          {CHANNELS.map((c) => (
            <button key={c} type="button" className="dm-chip" onClick={() => { setAuto(false); sell(c); }}>{c}</button>
          ))}
        </div>
        <div className="dmi__scroll">
          <table className="dmi__table">
            <thead>
              <tr>
                <th>Sản phẩm</th><th>Kho HCM</th><th>Kho HN</th>
                {CHANNELS.map((c) => <th key={c}>{c}</th>)}
                <th aria-label="Nhập kho" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const total = r.hcm + r.hn;
                const hot = flash?.sku === r.sku;
                return (
                  <tr key={r.sku} className={total <= LOW ? "is-low" : ""}>
                    <td><b>{r.name}</b><small>SKU {r.sku}</small></td>
                    <td>{r.hcm}</td>
                    <td>{r.hn}</td>
                    {CHANNELS.map((c) => (
                      <td key={c}><span className={`dmi__sync${hot ? " is-hot" : ""}`} key={hot ? flash!.n : 0}>{total}</span></td>
                    ))}
                    <td><button type="button" className="dm-chip dm-chip--ghost" onClick={() => { setAuto(false); restock(r.sku); }}>+20</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ol className="dmi__log" aria-live="polite">
          {logs.map((l) => <li key={l.id} className={l.warn ? "is-warn" : ""}>{l.text}</li>)}
          {logs.length === 0 && <li className="dm-muted">Mỗi đơn ở một sàn sẽ trừ kho và cập nhật số bán được trên cả 3 kênh.</li>}
        </ol>
      </div>
    </DemoFrame>
  );
}
