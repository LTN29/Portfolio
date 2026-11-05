export function Story() {
  return (
    <section id="about" className="sg-story pf-story" aria-labelledby="story-title">
      <div className="sg-wrap sg-story__open pf-story-open reveal">
        <p className="sg-label">01 — Câu chuyện</p>
        <h2 id="story-title" className="sg-display">
          Code cho chạy.<br />
          <span className="sg-tone">Hệ thống để vận hành.</span>
        </h2>
        <div className="sg-story__name sg-lead">
          <p className="sg-scrub">
            <b>Một đầu mối, trọn vòng.</b> Từ phân tích nghiệp vụ, giao diện, backend đến máy chủ — tôi lo hết, bạn chỉ cần mô tả bài toán.
          </p>
        </div>
        <p className="sg-story__byline pf-mono">~/{"{"}ai, ops, commerce, brand{"}"}</p>
      </div>
    </section>
  );
}
