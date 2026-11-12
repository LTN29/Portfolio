"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

type Kind = "price" | "warranty" | "hello" | "spam" | "ship";
const COMMENTS: { user: string; text: string; kind: Kind }[] = [
  { user: "minh.t", text: "Máy hút có hút được lông mèo không shop?", kind: "price" },
  { user: "lan_nguyen", text: "Chào shop ạ", kind: "hello" },
  { user: "xx_sale_xx", text: "Inbox mình bán follow giá rẻ", kind: "spam" },
  { user: "hoang.p", text: "Bảo hành bao lâu vậy?", kind: "warranty" },
  { user: "thao.vy", text: "Ship về Đà Nẵng mấy ngày?", kind: "ship" },
  { user: "khanh.d", text: "Giá quạt hôm nay bao nhiêu?", kind: "price" },
  { user: "an.le", text: "hello mọi người", kind: "hello" },
];

const ANSWER: Record<Kind, string | null> = {
  price: "Dạ có ạ, đầu chổi chống rối hút sạch lông thú cưng. Hôm nay giảm thêm 300 nghìn trong giỏ hàng số 1 ạ!",
  warranty: "Dạ sản phẩm bảo hành 12 tháng, kích hoạt ngay trên Zalo bằng số điện thoại, không cần giữ phiếu ạ.",
  ship: "Dạ về Đà Nẵng khoảng 2 đến 3 ngày, đơn từ 500 nghìn được miễn phí giao hàng ạ.",
  hello: null,
  spam: null,
};

const TAG: Record<Kind, { label: string; cls: string }> = {
  price: { label: "Hỏi mua → trả lời", cls: "is-go" },
  warranty: { label: "Hỏi bảo hành → trả lời", cls: "is-go" },
  ship: { label: "Hỏi giao hàng → trả lời", cls: "is-go" },
  hello: { label: "Chào → gom chào chung", cls: "" },
  spam: { label: "Spam → bỏ qua", cls: "is-skip" },
};

export function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [feed, setFeed] = useState<{ id: number; c: (typeof COMMENTS)[number] }[]>([]);
  const [speech, setSpeech] = useState<{ text: string; shown: number; to: string } | null>(null);
  const [queue, setQueue] = useState<{ text: string; to: string }[]>([]);
  const [viewers, setViewers] = useState(1420);
  const seq = useRef(0);

  // bình luận mới
  useTicker(() => {
    const id = seq.current++;
    const c = COMMENTS[id % COMMENTS.length];
    setFeed((f) => [...f, { id, c }].slice(-5));
    setViewers((v) => v + ((id * 7) % 11) - 4);
    const a = ANSWER[c.kind];
    if (a) setQueue((q) => [...q, { text: a, to: c.user }].slice(-2));
  }, 1700, inView);

  // giọng đọc: chữ chạy theo lời nói
  useTicker(() => {
    if (speech && speech.shown < speech.text.length) {
      setSpeech({ ...speech, shown: Math.min(speech.text.length, speech.shown + 3) });
    } else if (queue.length) {
      setSpeech({ ...queue[0], shown: 0 });
      setQueue((q) => q.slice(1));
    } else if (speech) {
      setSpeech(null);
    }
  }, speech && speech.shown >= speech.text.length ? 1400 : 70, inView);

  const talking = !!speech && speech.shown < speech.text.length;

  return (
    <DemoFrame title="AI Livestream · phòng phát" frameRef={ref} className="dm-live">
      <div className="dml">
        <div className="dml__stage">
          <div className="dml__top">
            <span className="dml__badge"><i />LIVE</span>
            <span className="dml__viewers">{viewers.toLocaleString("vi-VN")} người xem</span>
          </div>
          <div className={`dml__host${talking ? " is-talking" : ""}`} aria-hidden="true">
            <span className="dml__ring" />
            <span className="dml__ring dml__ring--2" />
            <span className="dml__face"><i /><i /><b /></span>
          </div>
          <div className="dml__wave" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.05}s` }} />)}
          </div>
          <p className="dml__sub" aria-live="polite">
            {speech ? (<><b>@{speech.to}</b> {speech.text.slice(0, speech.shown)}</>) : <span className="dm-muted">Đang chờ câu hỏi…</span>}
          </p>
        </div>

        <div className="dml__panel">
          <p className="dm-kicker">AI lọc bình luận</p>
          <ol className="dml__feed">
            {feed.map(({ id, c }) => (
              <li key={id} className={TAG[c.kind].cls}>
                <span><b>{c.user}</b> {c.text}</span>
                <em>{TAG[c.kind].label}</em>
              </li>
            ))}
          </ol>
          <p className="dml__meta">Giọng đọc tiếng Việt · đẩy thẳng vào phần mềm phát (OBS)</p>
        </div>
      </div>
    </DemoFrame>
  );
}
