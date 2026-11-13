import Link from "next/link";
import { profile, sectionLinks } from "@/data/portfolio";
import { CATEGORY_LABEL, formatDate, getAllPosts, type PostMeta } from "@/lib/posts";

/* Mục Bài viết ở trang chủ: 4 bài mới nhất, đọc từ content/bai-viet/*.md lúc build. */
export function PostRow({ p, no }: { p: PostMeta; no?: number }) {
  return (
    <li>
      <Link className="notes__row is-live" href={`/bai-viet/${p.slug}/`}>
        <span className="notes__no">{no ? String(no).padStart(2, "0") : ""}</span>
        <span className="notes__main">
          <small className="notes__cat">{CATEGORY_LABEL[p.category]}</small>
          <b>{p.title}</b>
          <span>{p.summary}</span>
        </span>
        <span className="notes__meta">
          <span className="notes__tags">{p.tags.slice(0, 3).map((t) => <em key={t}>{t}</em>)}</span>
          <span className="notes__date">{formatDate(p.date)} · {p.minutes} phút đọc</span>
        </span>
        <i className="notes__arrow" aria-hidden="true">↗</i>
      </Link>
    </li>
  );
}

export function Notes() {
  const posts = getAllPosts();
  const latest = posts.slice(0, 4);
  return (
    <section className="sec notes" id="notes" aria-labelledby="notes-t">
      <div className="wrap">
        <div className="sec__head">
          <div>
            <h2 id="notes-t" className="h-sec" data-reveal>
              <span className="h-idx">06</span>Sau mỗi sản phẩm, một bài học.
            </h2>
          </div>
          <p className="lead" data-reveal>
            Viết lại sau từng hệ thống: vì sao chọn cách này, chỗ nào từng sai và lần sau sẽ làm khác đi ra sao — cùng điểm tin công nghệ & AI mỗi tuần.
          </p>
        </div>
        <ol className="notes__list" data-reveal>
          {latest.map((p, i) => <PostRow key={p.slug} p={p} no={posts.length - i} />)}
        </ol>
        <p className="notes__all" data-reveal>
          <Link href="/bai-viet/" className="ulink">Tất cả {posts.length} bài viết →</Link>
        </p>
      </div>
    </section>
  );
}

export function Footer({ home = "" }: { home?: string }) {
  return (
    <footer className="foot dark">
      <div className="wrap">
        <p className="foot__mark" aria-hidden="true">LTN<span className="dot">.</span></p>
        <div className="foot__row">
          <span>© 2026 {profile.name} · {profile.role}</span>
          <nav aria-label="Liên kết chân trang">
            {sectionLinks.map((l) => <a key={l.href} href={`${home}${l.href}`}>{l.label}</a>)}
            <a href={`${home}#top`}>Lên đầu trang ↑</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
