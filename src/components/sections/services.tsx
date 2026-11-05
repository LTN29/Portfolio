import { services } from "@/data/portfolio";

export function Services() {
  return (
    <section id="services" className="sg-story pf-services" aria-labelledby="services-title">
      <div className="sg-wrap sg-values">
        <div className="sg-values__head reveal">
          <p className="sg-label">02 — Dịch vụ</p>
          <h2 id="services-title" className="pf-services__title">
            Tôi có thể làm gì <span className="sg-tone">cho bạn.</span>
          </h2>
        </div>
        <ol className="sg-values__grid">
          {services.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3 className="pf-services__name">{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
