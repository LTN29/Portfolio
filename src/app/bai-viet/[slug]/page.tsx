import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogShell } from "@/site/blog-shell";
import { CATEGORY_LABEL, formatDate, getAllPosts, getPost } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { JsonLd } from "@/site/json-ld";
import { abs, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const url = `/bai-viet/${p.slug}/`;
  return {
    title: p.title,
    description: p.summary,
    keywords: p.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article", url, title: p.title, description: p.summary, publishedTime: p.date, authors: ["Lê Thanh Nhân"], tags: p.tags,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.summary },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = all[idx - 1], older = all[idx + 1];
  return (
    <BlogShell>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting", "@id": abs(`/bai-viet/${post.slug}/#post`), headline: post.title, description: post.summary,
            datePublished: post.date, dateModified: post.date, inLanguage: "vi", keywords: post.tags.join(", "), articleSection: CATEGORY_LABEL[post.category],
            wordCount: post.body.split(/\s+/).length, url: abs(`/bai-viet/${post.slug}/`), mainEntityOfPage: abs(`/bai-viet/${post.slug}/`),
            image: abs("/og.png"), author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Lê Thanh Nhân", url: `${SITE_URL}/` },
            publisher: { "@id": `${SITE_URL}/#person` },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trang chủ", item: abs("/") },
              { "@type": "ListItem", position: 2, name: "Bài viết", item: abs("/bai-viet/") },
              { "@type": "ListItem", position: 3, name: post.title, item: abs(`/bai-viet/${post.slug}/`) },
            ],
          },
        ],
      }} />
      <article className="post">
        <div className="wrap post__wrap">
          <p className="post__crumb"><Link href="/bai-viet/">Bài viết</Link> / <Link href={`/bai-viet/#${post.category}`}>{CATEGORY_LABEL[post.category]}</Link></p>
          <h1 className="post__title">{post.title}</h1>
          <p className="post__summary">{post.summary}</p>
          <p className="post__meta">
            <span>{formatDate(post.date)}</span><span>{post.minutes} phút đọc</span>
            {post.tags.map((t) => <em key={t}>{t}</em>)}
          </p>
          <div className="post__body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
          <nav className="post__nav" aria-label="Bài khác">
            {older ? <Link href={`/bai-viet/${older.slug}/`}><small>← Bài trước</small><b>{older.title}</b></Link> : <span />}
            {newer ? <Link href={`/bai-viet/${newer.slug}/`} className="is-next"><small>Bài sau →</small><b>{newer.title}</b></Link> : <span />}
          </nav>
        </div>
      </article>
    </BlogShell>
  );
}
