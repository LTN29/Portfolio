import { aiProjects } from "@/data/portfolio";
import { ProjectVisual } from "@/components/visuals/project-visual";
import { FeatureVideo } from "@/components/sections/feature-video";

export function AiProjects() {
  const total = String(aiProjects.length).padStart(2, "0");
  return (
    <section id="ai" className="pf-ai" aria-labelledby="ai-title">
      <div className="sg-wrap">
        <header className="sg-section-head reveal">
          <p className="sg-label">03 — Dự án AI</p>
          <h2 id="ai-title" className="sg-display">
            Không dừng ở demo.<br />
            <span className="sg-tone">Chạy mỗi ngày.</span>
          </h2>
        </header>

        <div className="pf-features">
          {aiProjects.map((project, i) => (
            <article
              key={project.id}
              id={project.id}
              className={`pf-feature${i % 2 ? " pf-feature--flip" : ""}`}
              aria-labelledby={`${project.id}-title`}
            >
              <div className={`pf-feature__media pf-tone--${project.tone}${project.video ? " pf-feature__media--video" : ""}`}>
                {project.video
                  ? <FeatureVideo src={project.video} poster={project.poster} label={project.name} />
                  : <ProjectVisual kind={project.visual} />}
              </div>
              <div className="pf-feature__copy">
                <p className="pf-feature__meta">
                  <span>{String(i + 1).padStart(2, "0")} / {total}</span>
                  <span>{project.kind}</span>
                </p>
                <h3 id={`${project.id}-title`} className="pf-feature__name">{project.name}</h3>
                <p className="pf-feature__tagline">{project.tagline}</p>
                <ul className="pf-chips" aria-label="Công nghệ">
                  {project.stack.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
