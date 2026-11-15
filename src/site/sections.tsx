import { chapters, heroFacts, otherProjects, processProtocol, profile, projects, services } from "@/data/portfolio";
import { SystemSim } from "@/components/sim/system-sim";
import { ArchLegend, EcoMap } from "./eco-map";
import { ProjectCarousel } from "./project-carousel";
import { ProjectRail } from "./project-rail";
import { ProjectStage } from "./project-stage";
import { Fragment } from "react";
import { Logo, STACK_LOGO } from "@/components/tech/logo";

const COUNT_VI: Record<number, string> = { 5: "Năm", 6: "Sáu", 7: "Bảy", 8: "Tám", 9: "Chín", 10: "Mười" };

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13L13 3M13 3H5.5M13 3v7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ═══ HERO ═══ */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero__top" data-reveal>
          <p className="hero__who"><b>{profile.name}</b><span>{profile.role}</span></p>
          <p className="label">Hồ sơ năng lực <b>·</b> 2026</p>
          <p className="label hero__loc">{profile.location}</p>
        </div>

        {/* Sơ đồ ở giữa, chữ chia về 4 góc */}
        <div className="hero__stage">
          <h1 id="hero-title" className="hero__title hero__tl" data-reveal>
            <span className="line"><span>Từ ý tưởng <span className="ed">đến sản phẩm</span></span></span>
            <span className="line"><span style={{ ["--d" as string]: "0.1s" }}><span className="ed">được dùng</span> mỗi ngày<span className="dot">.</span></span></span>
          </h1>

          <div className="hero__tr" data-reveal style={{ ["--d" as string]: "0.18s" }}>
            <p className="lead">
              Tôi tự lên ý tưởng, thiết kế và xây dựng ứng dụng AI, hệ thống vận hành nội bộ và app di động —
              rồi theo đến khi chúng chạy ổn mỗi ngày. Dưới đây là những gì tôi đã trải qua và học được.
            </p>
            <div className="hero__actions">
              <a className="ulink" href="#stack">Công nghệ</a>
              <a className="btn" href="#projects">Xem dự án &amp; mô phỏng <Arrow /></a>
            </div>
          </div>

          <div className="hero__center" data-reveal style={{ ["--d" as string]: "0.06s" }}>
            <EcoMap legend={false} />
          </div>

          <dl className="hero__facts hero__bl" data-reveal style={{ ["--d" as string]: "0.26s" }}>
            {heroFacts.map(([v, l], i) => (
              <div key={l}>
                <dd>{v}{i === 0 && <sup>+</sup>}</dd>
                <dt>{l}</dt>
              </div>
            ))}
          </dl>

          <div className="hero__br" data-reveal style={{ ["--d" as string]: "0.3s" }}>
            <ArchLegend />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ MỤC LỤC DỰ ÁN ═══ */
export function ProjectIndex() {
  return (
    <section className="sec" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="sec__head">
          <div>
            <h2 id="projects-title" className="h-sec" data-reveal>
              <span className="h-idx">02</span>
              {COUNT_VI[projects.length] ?? projects.length} hệ thống, <span className="ed">mỗi cái một mô phỏng</span> để bạn bấm thử.
            </h2>
          </div>
          <p className="lead" data-reveal>
            Mỗi dự án có một bản mô phỏng chạy bằng dữ liệu mẫu: các khâu xử lý, lời gọi API, số liệu thay đổi theo từng bước — đúng như hệ thống thật vận hành.
          </p>
        </div>
      </div>
      <div data-reveal>
        <ProjectCarousel />
      </div>
    </section>
  );
}

/* ═══ TỪNG DỰ ÁN ═══ */
export function Projects() {
  const chapterOf = Object.fromEntries(chapters.map((c) => [c.id, c.title]));
  return (
    <>
      {/* thanh chương bên trái (dính khi cuộn) + nội dung từng dự án bên phải */}
      <div className="wrap pjs">
        <ProjectRail />
        <div className="pjs__main">
          {projects.map((p, i) => (
            <Fragment key={p.id}>
            <ProjectStage pitch={p.pitch} />
            <section id={p.id} className="pj" aria-labelledby={`${p.id}-t`}>
              <p className="pj__no">Dự án <b>{String(i + 1).padStart(2, "0")}</b> / {String(projects.length).padStart(2, "0")}</p>
              <div className="pj__intro">
                <div className="pj__title" data-reveal>
                  <h3 id={`${p.id}-t`}>{p.name}</h3>
                  <p className="pj__kind">{p.kind} · {chapterOf[p.chapter]}</p>
                </div>
                <p className="pj__copy" data-reveal style={{ ["--d" as string]: "0.1s" }}>{p.tagline}</p>
              </div>
              <div className="pj__body" data-reveal style={{ ["--d" as string]: "0.15s" }}>
                <SystemSim system={p.demo} />
                <div className="pj__spec">
                  <div className="pj__spec-main">
                    <h4>Những gì tôi đã trải qua</h4>
                    <ol className="pj__feats">
                      {p.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ol>
                    <div className="pj__lesson">
                      <h4>Bài học</h4>
                      <p>{p.lesson}</p>
                    </div>
                  </div>
                  <div className="pj__spec-side">
                    <div>
                      <h4>Vai trò</h4>
                      <ul className="pj__roles">
                        {p.role.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4>Công nghệ</h4>
                      <div className="pj__stack">
                        {p.stack.map((s) => (
                          <span key={s} className="chip">
                            {STACK_LOGO[s] && <Logo name={STACK_LOGO[s]} size={15} />}
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            </Fragment>
          ))}
        </div>
      </div>
      <section className="sec" aria-labelledby="more-t">
        <div className="wrap">
          <div className="sec__head">
            <div>
                <h2 id="more-t" className="h-sec" data-reveal>Dự án <span className="ed">khác</span></h2>
            </div>
          </div>
          <div className="more" data-reveal>
            {otherProjects.map((o) => (
              <article key={o.name}>
                <h3>{o.name}</h3>
                <p>{o.note}</p>
                <small>{o.stack}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══ VỀ TÔI ═══ */
const PILLARS = [
  { k: "Tự lên ý tưởng", t: "Bắt đầu từ việc thật", d: "Ý tưởng tốt nhất của tôi chưa từng đến từ một buổi họp, mà từ việc ngồi cạnh người dùng: xem họ chép số từ màn hình này sang bảng tính kia. Mỗi chỗ họ thở dài là một chỗ đáng làm." },
  { k: "Tự thiết kế", t: "Vẽ trước, code sau", d: "Một bản mẫu bấm được — dù thô — trả lời nhanh hơn mọi tài liệu mô tả: người dùng chỉ vào chỗ họ bối rối, và tôi sửa ngay khi việc sửa còn rẻ." },
  { k: "Tự vận hành", t: "Dùng thật từ tuần đầu", d: "Một tính năng nằm trên máy tôi ba tháng không bằng một tính năng nhỏ được dùng thật từ tuần đầu. Vì vậy tôi đầu tư sớm cho phát hành: khi phát hành rẻ, tôi dám phát hành thường xuyên." },
];

export function About() {
  return (
    <section className="sec sec--tint" id="about" aria-labelledby="about-t">
      <div className="wrap">
        <h2 id="about-t" className="visually-hidden">Về tôi</h2>
        <p className="about__quote" data-reveal>
          <span className="h-idx">03</span>
          <b>Một người, trọn vòng đời sản phẩm.</b> Tôi làm ở giữa người dùng và công nghệ: nhìn ra việc cần cải thiện,
          thiết kế giải pháp, <span className="ed">tự tay xây dựng</span> và đưa vào vận hành.
        </p>
        <ol className="pillars" data-reveal>
          {PILLARS.map((p) => (
            <li key={p.k}>
              <em>{p.k}</em>
              <b>{p.t}</b>
              <p>{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══ NĂNG LỰC ═══ */
export function Capabilities() {
  return (
    <section className="sec" id="services" aria-labelledby="caps-t">
      <div className="wrap">
        <div className="sec__head">
          <div>
            <h2 id="caps-t" className="h-sec" data-reveal>
              <span className="h-idx">04</span>Những gì tôi <span className="ed">làm được.</span></h2>
          </div>
          <p className="lead" data-reveal>Sáu mảng tôi đã dùng để làm ra các sản phẩm ở trên — từ thiết kế, lập trình đến vận hành.</p>
        </div>
        <ol className="caps" data-reveal>
          {services.map(([t, d, s], i) => (
            <li key={t}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              <b>{t}</b>
              <p>{d}</p>
              <small>{s}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══ CÁCH LÀM ═══ */
export function Process() {
  return (
    <section className="sec sec--tint" id="process" aria-labelledby="proc-t">
      <div className="wrap">
        <div className="sec__head">
          <div>
            <h2 id="proc-t" className="h-sec" data-reveal>
              <span className="h-idx">05</span>Từ việc thật <span className="ed">đến sản phẩm thật.</span></h2>
          </div>
          <p className="lead" data-reveal>Bốn bước tôi lặp lại ở mọi dự án: hiểu người dùng, thiết kế, ra bản dùng được sớm và theo đến khi chạy ổn.</p>
        </div>
        <ol className="steps">
          {processProtocol.map((s, i) => (
            <li key={s.step} data-reveal style={{ ["--d" as string]: `${i * 0.08}s` }}>
              <em>{s.step} · {s.phase}</em>
              <b>{s.title}</b>
              <p>{s.desc}</p>
              <small>{s.deliverable}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
