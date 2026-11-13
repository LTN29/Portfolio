/* Địa chỉ chính thức của trang — dùng cho canonical, sitemap, Open Graph, JSON-LD, RSS, llms.txt.
 * Khi có tên miền riêng: đặt biến môi trường NEXT_PUBLIC_SITE_URL (vd https://lethanhnhan.com) trên Cloudflare Pages,
 * hoặc sửa giá trị mặc định dưới đây. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ltn-portfolio.pages.dev").replace(/\/$/, "");
export const SITE_NAME = "Lê Thanh Nhân";
export const SITE_TITLE = "Lê Thanh Nhân — Product Engineer · Full-stack & AI";
export const SITE_DESC =
  "Hồ sơ năng lực của Lê Thanh Nhân, Product Engineer tại TP.HCM: tự lên ý tưởng, thiết kế và xây dựng ứng dụng AI đa agent, cổng AI cho doanh nghiệp, hệ thống tồn kho đa sàn, bảo hành đa kênh, Zalo Mini App và app mobile — kèm mô phỏng hệ thống bấm thử và bài viết về thị trường AI.";

export const abs = (p = "/") => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;

export const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Lê Thanh Nhân",
  alternateName: "LTN",
  jobTitle: "Product Engineer · Full-stack & AI",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.png`,
  address: { "@type": "PostalAddress", addressLocality: "TP. Hồ Chí Minh", addressCountry: "VN" },
  knowsAbout: [
    "AI agent", "Multi-agent", "LLM", "MCP", "AI Gateway", "Tự động hoá quy trình", "Next.js", "React", "React Native",
    "Spring Boot", "Node.js", "Electron", "three.js", "Zalo Mini App", "Shopee API", "TikTok Shop API", "Docker", "Cloudflare", "UI/UX",
  ],
};
