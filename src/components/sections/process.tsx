import { processProtocol } from "@/data/portfolio";
import { ProcessEmblem } from "@/components/visuals/icons";

export function Process() {
  return (
    <section id="process" className="sg-vision pf-process" aria-labelledby="process-title">
      <div className="sg-wrap sg-vision__grid">
        <div className="reveal">
          <p className="sg-label">05 — Cách tôi làm</p>
          <h2 id="process-title" className="sg-display">
            Từ việc thật<br />
            <span className="sg-tone">đến sản phẩm thật.</span>
          </h2>
        </div>
        <p className="pf-process__lead reveal">
          Bốn bước tôi lặp lại ở mọi dự án: hiểu người dùng, thiết kế, ra bản dùng được sớm và theo đến khi chạy ổn.
        </p>
      </div>

      <div className="sg-wrap">
        <ol className="pf-protocol">
          {processProtocol.map((item, index) => (
            <li key={item.step} className="pf-protocol__card reveal">
              <div className="pf-protocol__head">
                <span className="pf-protocol__emblem">
                  <ProcessEmblem index={index} />
                </span>
                <div className="pf-protocol__step-badge">
                  <em>GIAI ĐOẠN {item.step}</em>
                  <span>{item.phase}</span>
                </div>
              </div>
              <h3 className="pf-protocol__title">{item.title}</h3>
              <p className="pf-protocol__desc">{item.desc}</p>
              <div className="pf-protocol__foot">
                <span>KẾT QUẢ</span>
                <b>{item.deliverable}</b>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
