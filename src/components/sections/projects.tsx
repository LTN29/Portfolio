import type { ComponentType } from "react";
import { chapters, otherProjects, projects, type DemoKind } from "@/data/portfolio";
import { CategoryEmblem } from "@/components/visuals/icons";
import { OfficeDemo } from "@/components/demos/office-demo";
import { GatewayDemo } from "@/components/demos/gateway-demo";
import { WarrantyDemo } from "@/components/demos/warranty-demo";
import { StoreDemo } from "@/components/demos/store-demo";
import { PurchaseDemo } from "@/components/demos/purchase-demo";
import { InventoryDemo } from "@/components/demos/inventory-demo";
import { LiveDemo } from "@/components/demos/live-demo";
import { QueueDemo } from "@/components/demos/queue-demo";

const DEMOS: Record<DemoKind, ComponentType> = {
  office: OfficeDemo,
  gateway: GatewayDemo,
  chatbot: GatewayDemo,
  warranty: WarrantyDemo,
  store: StoreDemo,
  purchase: PurchaseDemo,
  inventory: InventoryDemo,
  live: LiveDemo,
  queue: QueueDemo,
};

export function Projects() {
  const total = String(projects.length).padStart(2, "0");
  let n = 0;

  return (
    <section id="projects" className="pf-features" aria-labelledby="projects-title">
      <div className="sg-wrap">
        <header className="sg-section-head reveal">
          <p className="sg-label">02 — Dự án tiêu biểu</p>
          <h2 id="projects-title" className="sg-display">
            Bấm thử từng sản phẩm. <span className="sg-tone">Dữ liệu mẫu, cách chạy thật.</span>
          </h2>
        </header>

        {chapters.map((ch) => (
          <div key={ch.id} className="pj-chapter">
            <div className="pj__chapter">
              <h3>{ch.title}</h3>
              <span>{ch.note}</span>
            </div>
            <div className="pf-features__list">
              {projects.filter((p) => p.chapter === ch.id).map((project) => {
                const i = n++;
                const Demo = DEMOS[project.demo];
                return (
                  <article
                    key={project.id}
                    id={project.id}
                    className={`pf-feature pj${i % 2 ? " pf-feature--reverse" : ""}`}
                    aria-labelledby={`${project.id}-title`}
                  >
                    <div className="pj__demo">
                      <Demo />
                    </div>
                    <div className="pf-feature__copy">
                      <div className="pf-feature__badge-row">
                        <span className="pf-feature__emblem">
                          <CategoryEmblem kind={project.visual} />
                        </span>
                        <div className="pf-feature__meta-text">
                          <em>{`DỰ ÁN ${String(i + 1).padStart(2, "0")} / ${total}`}</em>
                          <span>{project.kind}</span>
                        </div>
                      </div>

                      <h3 id={`${project.id}-title`} className="pf-feature__name">{project.name}</h3>
                      <p className="pf-feature__tagline">{project.tagline}</p>

                      <ul className="pj__role" aria-label="Vai trò của tôi">
                        {project.role.map((r) => <li key={r}>{r}</li>)}
                      </ul>

                      <ul className="pf-feature__list" aria-label="Điểm chính">
                        {project.highlights.map((h) => (
                          <li key={h}>
                            <i aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pf-feature__foot">
                        <ul className="pf-chips" aria-label="Công nghệ">
                          {project.stack.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pj__chapter">
          <h3>Dự án khác</h3>
          <span>Web &amp; trải nghiệm thương hiệu</span>
        </div>
        <div className="pj-more">
          {otherProjects.map((p) => (
            <article key={p.name}>
              <h4>{p.name}</h4>
              <p>{p.note}</p>
              <small>{p.stack}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
