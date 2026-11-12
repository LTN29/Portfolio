import { PillarEmblem } from "@/components/visuals/icons";

const pillars = [
  {
    badge: "Tự lên ý tưởng",
    title: "Bắt đầu từ việc thật",
    desc: "Các sản phẩm ở đây đều sinh ra từ một việc đang làm thủ công, chậm hoặc dễ sai. Tôi tự đề xuất, tự làm bản đầu tiên để mọi người dùng thử.",
    metric: "Idea → Product",
  },
  {
    badge: "Tự thiết kế",
    title: "Giao diện là một phần của sản phẩm",
    desc: "Tự vẽ giao diện, luồng thao tác, chuyển động và cả không gian 3D — để người dùng không cần hướng dẫn vẫn dùng được.",
    metric: "UI/UX · 3D · Motion",
  },
  {
    badge: "Tự vận hành",
    title: "Chạy thật, không dừng ở demo",
    desc: "Tự triển khai máy chủ, phát hành bản cập nhật, theo dõi lỗi và cải tiến theo số liệu sử dụng — có hàng đợi, tự khôi phục và lưu vết đầy đủ.",
    metric: "Build · Ship · Operate",
  },
];

export function Story() {
  return (
    <section id="about" className="sg-story pf-story" aria-labelledby="story-title">
      <div className="sg-wrap sg-story__open pf-story-open reveal">
        <div className="pf-story__top">
          <div>
            <p className="sg-label">03 — Về tôi</p>
            <h2 id="story-title" className="sg-display">
              Một người,<br />
              <span className="sg-tone">trọn vòng đời sản phẩm.</span>
            </h2>
          </div>

          <div className="pf-story__quote">
            <div className="sg-story__name sg-lead">
              <p className="sg-scrub">
                <b>Tôi là Lê Thanh Nhân, Product Engineer.</b> Tôi làm ở giữa người dùng và công nghệ: nhìn ra việc cần cải thiện, thiết kế giải pháp, tự xây dựng và đưa vào vận hành — từ AI, hệ thống nội bộ đến app cho khách hàng.
              </p>
            </div>
            <div className="pf-story__domains">
              <span>Ý tưởng sản phẩm</span>
              <span>UI/UX &amp; 3D</span>
              <span>Full-stack &amp; AI</span>
              <span>Triển khai &amp; vận hành</span>
            </div>
          </div>
        </div>

        <dl className="pf-pillars">
          {pillars.map((p, index) => (
            <div key={p.title} className="pf-pillar">
              <div className="pf-pillar__head">
                <span className="pf-pillar__emblem">
                  <PillarEmblem index={index} />
                </span>
                <span className="pf-pillar__badge">{p.badge}</span>
              </div>
              <dt>
                <b>{p.title}</b>
              </dt>
              <dd>{p.desc}</dd>
              <div className="pf-pillar__foot">
                <span>{`0${index + 1}`}</span>
                <em>{p.metric}</em>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
