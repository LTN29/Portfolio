import { processSteps } from "@/data/portfolio";

export function Process() {
  return (
    <section id="process" className="sg-vision" aria-labelledby="process-title">
      <div className="sg-wrap sg-vision__grid">
        <div className="reveal">
          <p className="sg-label">06 — Quy trình</p>
          <h2 id="process-title" className="sg-display">Làm việc cùng tôi. <span className="sg-tone">Rõ ràng từ ngày đầu.</span></h2>
        </div>
      </div>
      <div className="sg-wrap">
        <ol className="sg-principles">
          {processSteps.map((p, i) => (
            <li key={p} className="reveal"><span>{String(i + 1).padStart(2, "0")}</span>{p}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
