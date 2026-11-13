import type { Metadata } from "next";
import { BlogShell } from "@/site/blog-shell";
import { PostRow } from "@/site/notes";
import { CATEGORY_LABEL, getAllPosts, type Category } from "@/lib/posts";
import { JsonLd } from "@/site/json-ld";
import { abs, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bài viết",
  description: "Bài học sau từng sản phẩm, góc nhìn về thị trường AI và điểm tin công nghệ & AI mỗi tuần — Lê Thanh Nhân, Product Engineer · Full-stack & AI.",
  alternates: { canonical: "/bai-viet/" },
  openGraph: { url: "/bai-viet/", title: "Bài viết — Lê Thanh Nhân", images: [{ url: "/og.png", width: 1200, height: 630 }] },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const cats = (Object.keys(CATEGORY_LABEL) as Category[]).filter((c) => posts.some((p) => p.category === c));
  return (
    <BlogShell>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Blog", "@id": abs("/bai-viet/#blog"), url: abs("/bai-viet/"), name: "Bài viết — Lê Thanh Nhân", inLanguage: "vi",
        author: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/bai-viet/${p.slug}/`), datePublished: p.date, description: p.summary })),
      }} />
      <section className="sec blog">
        <div className="wrap">
          <h1 className="h-sec blog__title">Bài viết</h1>
          <p className="lead blog__lead">Bài học sau từng sản phẩm, góc nhìn về thị trường AI và điểm tin công nghệ mỗi tuần.</p>
          {cats.map((c) => {
            const list = posts.filter((p) => p.category === c);
            return (
              <div key={c} className="blog__group" id={c}>
                <h2 className="blog__cat">{CATEGORY_LABEL[c]} <span>{list.length}</span></h2>
                <ol className="notes__list">
                  {list.map((p, i) => <PostRow key={p.slug} p={p} no={list.length - i} />)}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </BlogShell>
  );
}
