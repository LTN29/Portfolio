import { heroFacts, profile, projects } from "@/data/portfolio";
import { ProjectVisual } from "@/components/visuals/project-visual";
import {
  CategoryEmblem,
  CompassGridIcon,
  CrestIcon,
  RadarPulseIcon,
  SparkArrowIcon,
} from "@/components/visuals/icons";

const frieze = ["van-phong-ai", "bao-hanh", "mua-hang", "ton-kho"]
  .map((id) => projects.find((p) => p.id === id)!)
  .map((p) => ({
    id: p.id,
    name: p.name,
    kind: p.id === "bao-hanh" ? "Web · Zalo · Mobile" : p.kind,
    stack: p.stack.slice(0, 3).join(" · "),
    visual: p.visual,
    tone: p.tone,
    href: `#${p.id}`,
  }));

const domainTags = [
  "Ý tưởng sản phẩm",
  "Thiết kế UI/UX",
  "Full-stack · AI",
  "Web · Mobile · Desktop",
];

export function Hero() {
  return (
    <section className="sg-hero" id="top" aria-labelledby="hero-title">
      <div className="sg-wrap">
        <div className="pf-hero-topbar">
          <div className="pf-identity-badge">
            <span className="pf-identity-badge__icon">
              <CrestIcon />
            </span>
            <div className="pf-identity-badge__text">
              <b>{profile.name}</b>
              <span>{profile.role}</span>
            </div>
          </div>

          <a href="#projects" className="pf-avail-card" aria-label="Hồ sơ năng lực — xem dự án">
            <span className="pf-avail-card__radar">
              <RadarPulseIcon />
            </span>
            <div className="pf-avail-card__body">
              <span className="pf-avail-card__title">{profile.status}</span>
              <span className="pf-avail-card__sub">{profile.location} · 8 demo bấm thử được</span>
            </div>
            <span className="pf-avail-card__cta">
              Xem dự án
              <SparkArrowIcon />
            </span>
          </a>
        </div>
      </div>

      <div className="sg-wrap sg-hero__grid">
        <div className="pf-hero-main">
          <ul className="pf-domain-tags" aria-label="Lĩnh vực chuyên môn">
            {domainTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <h1 id="hero-title" className="sg-hero__title">
            <span className="sg-line">Xây sản phẩm</span>
            <span className="sg-line sg-tone">chạy thật.</span>
          </h1>
        </div>

        <div className="sg-hero__aside pf-hero-dossier">
          <p className="pf-hero-dossier__lead">
            Tôi tự lên ý tưởng, thiết kế và xây dựng sản phẩm — từ ứng dụng AI, hệ thống vận hành nội bộ đến app cho khách hàng — rồi theo đến khi chúng được dùng mỗi ngày.
          </p>

          <div className="sg-actions">
            <a className="sg-btn" href="#projects">
              <span>Xem dự án &amp; demo</span>
              <SparkArrowIcon />
            </a>
            <a className="sg-link pf-btn-ghost" href="#contact">
              <CompassGridIcon />
              <span>Liên hệ</span>
            </a>
          </div>

          <dl className="pf-hero-metrics">
            {heroFacts.map(([value, label]) => (
              <div key={label} className="pf-hero-metrics__cell">
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="sg-wrap">
        <div className="pf-frieze-head">
          <span className="pf-frieze-head__title">Dự án tiêu biểu</span>
          <span className="pf-frieze-head__line" aria-hidden="true" />
          <span className="pf-frieze-head__meta">Chạm để xem demo</span>
        </div>

        <ul className="sg-frieze pf-frieze" aria-label="Dự án tiêu biểu">
          {frieze.map((item, i) => (
            <li
              key={item.id}
              className={`sg-frieze__item sg-frieze__item--${item.tone}`}
              data-depth={i % 2 ? "far" : "near"}
            >
              <a href={item.href}>
                <span className="sg-frieze__media pf-frieze__media">
                  <span className="pf-frieze__bar" aria-hidden="true">
                    <span className="pf-frieze__badge">
                      <CategoryEmblem kind={item.visual} />
                      <em>{`0${i + 1}`}</em>
                      <b>{item.kind}</b>
                    </span>
                    <span className="pf-frieze__orb">
                      <SparkArrowIcon />
                    </span>
                  </span>
                  <ProjectVisual kind={item.visual} />
                </span>
                <span className="sg-frieze__caption">
                  <span className="sg-frieze__title-row">
                    <b>{item.name}</b>
                    <small className="pf-frieze__stack">{item.stack}</small>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
