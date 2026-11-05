import { aiProjects, heroFacts, profile } from "@/data/portfolio";
import { ProjectVisual } from "@/components/visuals/project-visual";

/* Bốn dự án tiêu biểu xếp như tác phẩm trong phòng trưng bày: một hàng, cao bằng nhau, nền khác tông */
const frieze = [
  ...aiProjects.slice(0, 3).map((p) => ({ id: p.id, name: p.name, kind: p.kind, visual: p.visual, tone: p.tone, href: `#${p.id}` })),
  { id: "app-bao-hanh", name: "App Bảo Hành", kind: "Ứng dụng di động", visual: "mobile" as const, tone: "sand" as const, href: "#showcase" },
];

export function Hero() {
  return (
    <section className="sg-hero" id="top" aria-labelledby="hero-title">
      <div className="sg-wrap sg-hero__grid">
        <p className="sg-label sg-hero__label">
          {profile.name} · {profile.role} · <span className="pf-status">{profile.status}</span>
        </p>
        <h1 id="hero-title" className="sg-hero__title">
          <span className="sg-line">Xây sản phẩm</span>
          <span className="sg-line sg-tone">chạy thật.</span>
        </h1>
        <div className="sg-hero__aside">
          <p>AI, web, mobile và automation — từ ý tưởng đến khi chạy thật cho doanh nghiệp của bạn.</p>
          <div className="sg-actions">
            <a className="sg-btn" href="#contact">Gửi yêu cầu</a>
            <a className="sg-link" href="#ai">Xem dự án</a>
          </div>
        </div>
      </div>

      <div className="sg-wrap">
        <ul className="sg-frieze pf-frieze" aria-label="Dự án tiêu biểu">
          {frieze.map((item, i) => (
            <li key={item.id} className={`sg-frieze__item sg-frieze__item--${item.tone}`} data-depth={i % 2 ? "far" : "near"}>
              <a href={item.href}>
                <span className="sg-frieze__media pf-frieze__media">
                  <ProjectVisual kind={item.visual} />
                </span>
                <span className="sg-frieze__caption">
                  <small>{String(i + 1).padStart(2, "0")} · {item.kind}</small>
                  <b>{item.name}</b>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sg-wrap">
        <dl className="sg-facts">
          {heroFacts.map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
