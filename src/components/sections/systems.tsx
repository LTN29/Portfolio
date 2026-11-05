import { systems } from "@/data/portfolio";

export function Systems() {
  return (
    <section id="systems" className="sg-eco pf-systems" aria-labelledby="systems-title">
      <div className="sg-wrap">
        <header className="sg-section-head reveal">
          <p className="sg-label">05 — Đã làm thêm</p>
          <h2 id="systems-title" className="sg-display">
            Không chỉ AI.<br />
            <span className="sg-tone">Cả hệ thống phía sau.</span>
          </h2>
        </header>

        <ol className="sg-roster pf-roster reveal" aria-label="Danh sách hệ thống">
          {systems.map((row, index) => (
            <li key={row.name} className="sg-roster__row pf-roster__row">
              <span className="sg-roster__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="sg-roster__role">{row.role}</span>
              <span className="sg-roster__name"><b>{row.name}</b></span>
              <span className="pf-roster__title">{row.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
