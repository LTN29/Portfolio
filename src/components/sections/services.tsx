import { services } from "@/data/portfolio";
import { ServiceEmblem, SparkArrowIcon } from "@/components/visuals/icons";

export function Services() {
  return (
    <section id="services" className="sg-story pf-services" aria-labelledby="services-title">
      <div className="sg-wrap sg-values">
        <div className="sg-values__head reveal">
          <div>
            <p className="sg-label">04 — Năng lực</p>
            <h2 id="services-title" className="pf-services__title">
              Những gì tôi <span className="sg-tone">làm được.</span>
            </h2>
          </div>
          <p className="pf-services__sub">
            Sáu mảng tôi đã dùng để làm ra các sản phẩm ở trên — từ thiết kế, lập trình đến vận hành.
          </p>
        </div>

        <ol className="sg-values__grid">
          {services.map(([title, description, spec], index) => {
            const tags = spec.split("·").map((s) => s.trim());
            return (
              <li key={title} className={index < 2 ? "is-featured" : undefined}>
                <div className="pf-service__top">
                  <span className="pf-service__emblem">
                    <ServiceEmblem index={index} />
                  </span>
                  <div className="pf-service__meta">
                    <span className="pf-service__num">{`0${index + 1}`}</span>
                    <span className="pf-service__arrow">
                      <SparkArrowIcon />
                    </span>
                  </div>
                </div>
                <h3 className="pf-services__name">{title}</h3>
                <p>{description}</p>
                <ul className="pf-service__tags" aria-label="Công nghệ cốt lõi">
                  {tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
