"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

type Worker = { job: number | null; prog: number; stuck: boolean; idle: number };
type S = { queue: number[]; workers: Worker[]; done: number[]; next: number; recovered: number; tick: number; log: string[] };

const init = (): S => ({
  queue: [101, 102, 103, 104, 105],
  workers: [0, 1, 2].map(() => ({ job: null, prog: 0, stuck: false, idle: 0 })),
  done: [],
  next: 106,
  recovered: 0,
  tick: 0,
  log: [],
});

function step(s: S, autoFault: boolean): S {
  const queue = [...s.queue];
  let { next, recovered } = s;
  const done = [...s.done];
  const log = [...s.log];
  const tick = s.tick + 1;
  if (queue.length < 2) { queue.push(next, next + 1, next + 2); next += 3; }
  const workers = s.workers.map((w, i) => {
    let x = { ...w };
    if (autoFault && tick % 17 === 8 && i === 1 && x.job) x.stuck = true;
    if (x.job === null) {
      const j = queue.shift();
      if (j !== undefined) { x = { job: j, prog: 0, stuck: false, idle: 0 }; log.unshift(`Phân bài #${j} cho máy ${i + 1}`); }
      return x;
    }
    if (x.stuck) {
      x.idle += 1;
      if (x.idle >= 3) {
        queue.unshift(x.job);
        log.unshift(`Giám sát: máy ${i + 1} treo → trả bài #${x.job} về hàng đợi, khởi động lại`);
        recovered += 1;
        return { job: null, prog: 0, stuck: false, idle: 0 };
      }
      return x;
    }
    x.prog += 20 + ((tick + i * 3) % 3) * 10;
    if (x.prog >= 100) {
      done.unshift(x.job);
      log.unshift(`Máy ${i + 1} xong bài #${x.job}`);
      return { job: null, prog: 0, stuck: false, idle: 0 };
    }
    return x;
  });
  return { queue, workers, done: done.slice(0, 40), next, recovered, tick, log: log.slice(0, 4) };
}

export function QueueDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [s, setS] = useState(init);
  const [total, setTotal] = useState(0);
  const [auto, setAuto] = useState(true);

  useTicker(() => {
    const n = step(s, auto);
    setTotal((t) => t + Math.max(0, n.done.length - s.done.length));
    setS(n);
  }, 650, inView);

  const freeze = () => {
    setAuto(false);
    setS((p) => ({ ...p, workers: p.workers.map((w, i) => (i === 1 && w.job ? { ...w, stuck: true } : w)) }));
  };
  const addPosts = () => setS((p) => ({ ...p, queue: [...p.queue, p.next, p.next + 1, p.next + 2, p.next + 3, p.next + 4], next: p.next + 5 }));

  const dup = new Set(s.done).size !== s.done.length ? 1 : 0;

  return (
    <DemoFrame title="Tự động hoá chiến dịch bình luận" frameRef={ref} className="dm-queue">
      <div className="dmq">
        <div className="dmq__col">
          <p className="dm-kicker">Hàng đợi · {s.queue.length}</p>
          <ul className="dmq__queue">
            {s.queue.slice(0, 6).map((j) => <li key={j}>Bài #{j}</li>)}
          </ul>
          <button type="button" className="dm-chip" onClick={addPosts}>+ Thêm 5 bài</button>
        </div>

        <div className="dmq__col dmq__col--wide">
          <p className="dm-kicker">Máy chạy song song</p>
          {s.workers.map((w, i) => (
            <div key={i} className={`dmq__worker${w.stuck ? " is-stuck" : ""}${w.job ? " is-busy" : ""}`}>
              <b>Máy {i + 1}</b>
              <span>{w.job ? (w.stuck ? `Treo ở bài #${w.job}` : `Đang làm bài #${w.job}`) : "Chờ việc"}</span>
              <i><em style={{ width: `${w.prog}%` }} /></i>
            </div>
          ))}
          <button type="button" className="dm-chip dm-chip--warn" onClick={freeze}>Giả lập máy 2 bị treo</button>
        </div>

        <div className="dmq__col">
          <p className="dm-kicker">Kết quả</p>
          <dl className="dmq__stats">
            <div><dt>Đã xong</dt><dd>{total}</dd></div>
            <div><dt>Bị làm trùng</dt><dd className="is-ok">{dup}</dd></div>
            <div><dt>Tự khôi phục</dt><dd>{s.recovered}</dd></div>
          </dl>
        </div>

        <ol className="dmq__log" aria-live="polite">
          {s.log.map((l, i) => <li key={`${s.tick}-${i}`} className={l.startsWith("Giám sát") ? "is-warn" : ""}>{l}</li>)}
        </ol>
      </div>
    </DemoFrame>
  );
}
