import { otherProjects, projects, services } from "@/data/portfolio";
import { CATEGORY_LABEL, getAllPosts } from "@/lib/posts";
import { abs, SITE_DESC } from "@/lib/site";

/* Nội dung llms.txt (chuẩn llmstxt.org): bản tóm tắt dạng chữ để trợ lý AI hiểu và trích dẫn đúng. */
export function llmsText(full = false) {
  const posts = getAllPosts();
  const out: string[] = [];
  out.push("# Lê Thanh Nhân — Product Engineer · Full-stack & AI", "");
  out.push(`> ${SITE_DESC}`, "");
  out.push(
    "Lê Thanh Nhân làm việc tại TP. Hồ Chí Minh, tự đi trọn vòng đời sản phẩm: quan sát việc thật, thiết kế giao diện, lập trình full-stack, triển khai máy chủ và vận hành. " +
      "Trang có mô phỏng tương tác cho từng hệ thống (dữ liệu mẫu) và mục Bài viết cập nhật hằng tuần.",
    "",
  );
  out.push("## Trang chính", "");
  out.push(`- [Trang chủ — hồ sơ năng lực](${abs("/")}): sơ đồ hệ thống, công nghệ, 7 dự án kèm mô phỏng, năng lực, cách làm`);
  out.push(`- [Tất cả bài viết](${abs("/bai-viet/")})`);
  out.push(`- [RSS bài viết](${abs("/bai-viet/rss.xml")})`, "");
  out.push("## Dự án", "");
  for (const p of projects) {
    out.push(`- **${p.name}** (${p.kind}; vai trò: ${p.role.join(", ")}): ${p.tagline} Công nghệ: ${p.stack.join(", ")}. [Xem mô phỏng](${abs(`/#${p.id}`)})`);
    if (full) for (const h of p.highlights) out.push(`  - ${h}`);
  }
  for (const o of otherProjects) out.push(`- **${o.name}**: ${o.note} (${o.stack})`);
  out.push("", "## Năng lực", "");
  for (const [t, d, s] of services) out.push(`- **${t}**: ${d} (${s})`);
  out.push("", "## Bài viết", "");
  for (const p of posts) out.push(`- [${p.title}](${abs(`/bai-viet/${p.slug}/`)}) — ${CATEGORY_LABEL[p.category]}, ${p.date}: ${p.summary}`);
  if (full) {
    for (const p of posts) out.push("", "---", "", `# ${p.title}`, "", `${CATEGORY_LABEL[p.category]} · ${p.date} · ${abs(`/bai-viet/${p.slug}/`)}`, "", p.body);
  } else {
    out.push("", "## Optional", "", `- [Toàn văn tất cả bài viết và chi tiết dự án](${abs("/llms-full.txt")})`);
  }
  return out.join("\n") + "\n";
}
