"use client";

import { useRef, useState } from "react";
import { DemoFrame, useInView, useTicker } from "./kit";

type Agent = { id: string; name: string; role: string; model: string; hue: number };

const AGENTS: Agent[] = [
  { id: "m", name: "Minh", role: "Trưởng nhóm", model: "GPT", hue: 38 },
  { id: "l", name: "Lan", role: "Nghiên cứu", model: "Gemini", hue: 168 },
  { id: "h", name: "Hùng", role: "Viết nội dung", model: "Claude", hue: 18 },
  { id: "t", name: "Thảo", role: "Kiểm tra", model: "Local", hue: 262 },
];

const TASKS = [
  { title: "Kế hoạch khuyến mãi cuối năm", file: "ke-hoach-khuyen-mai.docx", parts: ["phân tích 3 kênh bán", "lịch đăng bài 2 tuần", "dự toán chi phí"] },
  { title: "Báo cáo bán hàng tuần", file: "bao-cao-tuan.xlsx", parts: ["gom số liệu các kênh", "so sánh tuần trước", "rút 3 điểm cần làm"] },
  { title: "Bộ câu hỏi cho chatbot CSKH", file: "faq-cskh.md", parts: ["đọc tài liệu sản phẩm", "viết 40 câu hỏi đáp", "rà lỗi chính tả"] },
];

/* Kịch bản: mỗi bước đổi trạng thái 1 agent + ghi nhật ký */
function script(task: (typeof TASKS)[number]) {
  return [
    { a: "m", s: "Lập kế hoạch", p: 30, log: `Minh nhận việc “${task.title}”, chia thành 3 phần` },
    { a: "l", s: "Tìm dữ liệu", p: 35, log: `Lan: ${task.parts[0]}` },
    { a: "h", s: "Đang viết", p: 30, log: `Hùng: ${task.parts[1]}` },
    { a: "l", s: "Xong phần 1", p: 100, log: "Lan gửi kết quả cho Hùng" },
    { a: "h", s: "Đang viết", p: 80, log: "Hùng ghép nội dung, gửi Thảo" },
    { a: "t", s: "Kiểm tra", p: 60, log: `Thảo: ${task.parts[2]}` },
    { a: "h", s: "Xong", p: 100, log: "Hùng sửa 2 góp ý của Thảo" },
    { a: "t", s: "Duyệt", p: 100, log: "Thảo duyệt — đạt yêu cầu" },
    { a: "m", s: "Nộp kết quả", p: 100, log: `Minh nộp ${task.file} vào khay kết quả` },
  ];
}

export function OfficeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [taskIdx, setTaskIdx] = useState(0);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [auto, setAuto] = useState(true);

  const task = TASKS[taskIdx];
  const steps = script(task);

  const start = (i = taskIdx) => {
    setTaskIdx(i);
    setStep(-1);
    setRunning(true);
  };

  useTicker(() => {
    if (running) {
      if (step + 1 < steps.length) setStep(step + 1);
      else {
        setRunning(false);
        setDone((d) => [task.file, ...d.filter((f) => f !== task.file)].slice(0, 3));
      }
    } else if (auto) {
      start(done.length === 0 && step === -1 ? taskIdx : (taskIdx + 1) % TASKS.length);
    }
  }, running ? 1100 : 2600, inView);

  // trạng thái hiện tại của mỗi agent = bước gần nhất của agent đó
  const state = (id: string) => {
    for (let i = step; i >= 0; i--) if (steps[i].a === id) return { s: steps[i].s, p: steps[i].p, active: i === step };
    return { s: "Đang rảnh", p: 0, active: false };
  };

  const log = steps.slice(0, step + 1).slice(-4).reverse();

  return (
    <DemoFrame title="Văn Phòng AI" frameRef={ref} className="dm-office">
      <div className="dmo">
        <div className="dmo__compose">
          <p className="dm-kicker">Giao việc mới</p>
          <div className="dmo__tasks" role="radiogroup" aria-label="Chọn việc">
            {TASKS.map((t, i) => (
              <button
                key={t.title}
                type="button"
                role="radio"
                aria-checked={i === taskIdx}
                className={i === taskIdx ? "is-on" : ""}
                onClick={() => { setAuto(false); start(i); }}
              >
                {t.title}
              </button>
            ))}
          </div>
          <button type="button" className="dm-btn" onClick={() => { setAuto(false); start(); }} disabled={running}>
            {running ? "Cả nhóm đang làm…" : "Giao cho cả nhóm"}
          </button>
          <div className="dmo__tray">
            <p className="dm-kicker">Khay kết quả</p>
            {done.length === 0 && <span className="dm-muted">Chưa có file nào</span>}
            {done.map((f) => (
              <span key={f} className="dmo__file"><i aria-hidden="true" />{f}</span>
            ))}
          </div>
        </div>

        <div className="dmo__floor">
          {AGENTS.map((a) => {
            const st = state(a.id);
            return (
              <div key={a.id} className={`dmo__desk${st.active ? " is-active" : ""}${st.p === 100 ? " is-done" : ""}`} style={{ ["--h" as string]: a.hue }}>
                <span className="dmo__avatar" aria-hidden="true">{a.name[0]}</span>
                <div className="dmo__who">
                  <b>{a.name}</b>
                  <span>{a.role}</span>
                </div>
                <span className="dmo__model">{a.model}</span>
                <span className="dmo__status">{st.s}</span>
                <span className="dmo__bar"><i style={{ width: `${st.p}%` }} /></span>
              </div>
            );
          })}
          <ol className="dmo__log" aria-live="polite">
            {log.map((l, i) => (
              <li key={`${step}-${i}`} className={i === 0 ? "is-new" : ""}>{l.log}</li>
            ))}
            {log.length === 0 && <li className="dm-muted">Chọn một việc và bấm “Giao cho cả nhóm”.</li>}
          </ol>
        </div>
      </div>
    </DemoFrame>
  );
}
