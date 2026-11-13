import { getAllPosts, CATEGORY_LABEL } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { abs, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = getAllPosts().map((p) => `
    <item>
      <title>${x(p.title)}</title>
      <link>${abs(`/bai-viet/${p.slug}/`)}</link>
      <guid isPermaLink="true">${abs(`/bai-viet/${p.slug}/`)}</guid>
      <pubDate>${new Date(`${p.date}T07:00:00+07:00`).toUTCString()}</pubDate>
      <category>${x(CATEGORY_LABEL[p.category])}</category>
      <description>${x(p.summary)}</description>
      <content:encoded><![CDATA[${renderMarkdown(p.body)}]]></content:encoded>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bài viết — ${x(SITE_NAME)}</title>
    <link>${abs("/bai-viet/")}</link>
    <atom:link href="${abs("/bai-viet/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Bài học sau từng sản phẩm, góc nhìn về thị trường AI và điểm tin công nghệ &amp; AI mỗi tuần.</description>
    <language>vi</language>${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
