import { Logo } from "@/components/tech/logo";
import { IconG } from "@/components/sim/icons";

/* Bảng công nghệ theo tầng: mỗi hàng là một nhóm, các công nghệ nối nhau bằng đường kẻ có chấm dữ liệu chạy. */

type Item = { name: string; logo?: string; icon?: string };

const ROWS: { title: string; note: string; items: Item[] }[] = [
  {
    title: "Giao diện & ứng dụng",
    note: "Web, desktop, 3D",
    items: [
      { name: "React", logo: "react" }, { name: "Next.js", logo: "nextjs" }, { name: "TypeScript", logo: "typescript" },
      { name: "Vite", logo: "vite" }, { name: "Tailwind", logo: "tailwind" }, { name: "Ant Design", logo: "antd" },
      { name: "three.js", logo: "threejs" }, { name: "Electron", logo: "electron" },
    ],
  },
  {
    title: "Mobile & Mini App",
    note: "iOS, Android, Zalo",
    items: [
      { name: "React Native", logo: "react" }, { name: "Android", logo: "android" }, { name: "iOS", logo: "apple" },
      { name: "Zalo Mini App", logo: "zalo" }, { name: "Codemagic", logo: "codemagic" },
    ],
  },
  {
    title: "Backend & dữ liệu",
    note: "API, nghiệp vụ, lưu trữ",
    items: [
      { name: "Spring Boot", logo: "springboot" }, { name: "Java", logo: "openjdk" }, { name: "Node.js", logo: "nodejs" },
      { name: "Database", icon: "db" }, { name: "Flyway", logo: "flyway" }, { name: "JWT", logo: "jwt" },
    ],
  },
  {
    title: "AI & tự động hoá",
    note: "Agent, công cụ, quy trình",
    items: [
      { name: "Claude", logo: "claude" }, { name: "Gemini", logo: "gemini" }, { name: "GPT", icon: "ai" },
      { name: "Ollama", logo: "ollama" }, { name: "MCP", icon: "wrench" }, { name: "n8n", logo: "n8n" },
      { name: "Playwright", icon: "globe" }, { name: "Python", logo: "python" },
    ],
  },
  {
    title: "Tích hợp",
    note: "Sàn, nền tảng TMĐT, nhắn tin",
    items: [
      { name: "Shopee API", logo: "shopee" }, { name: "TikTok Shop", logo: "tiktok" }, { name: "Zalo OA · ZNS", logo: "zalo" },
      { name: "Shopify", logo: "shopify" }, { name: "WooCommerce", logo: "woocommerce" },
      { name: "Sapo · Haravan", icon: "store" }, { name: "Microsoft Graph", icon: "mail" },
    ],
  },
  {
    title: "Hạ tầng & triển khai",
    note: "Container, CI/CD, mạng",
    items: [
      { name: "Docker", logo: "docker" }, { name: "Nginx", logo: "nginx" }, { name: "Linux", logo: "ubuntu" },
      { name: "Cloudflare", logo: "cloudflare" }, { name: "Git", logo: "git" }, { name: "GitHub", logo: "github" },
      { name: "GitHub Actions", logo: "githubactions" }, { name: "Jenkins", logo: "jenkins" },
    ],
  },
];

export function TechStack() {
  return (
    <section className="sec" id="stack" aria-labelledby="stack-t">
      <div className="wrap">
        <div className="sec__head">
          <div>
            <h2 id="stack-t" className="h-sec" data-reveal>
              <span className="h-idx">01</span>Công nghệ <span className="ed">tôi dùng hằng ngày.</span></h2>
          </div>
          <p className="lead" data-reveal>Chia theo tầng, từ giao diện người dùng đến hạ tầng chạy thật — đều đã dùng trong các dự án bên dưới.</p>
        </div>
        <ol className="stack">
          {ROWS.map((r, i) => (
            <li key={r.title} className="stack__row" data-reveal style={{ ["--d" as string]: `${i * 0.06}s` }}>
              <div className="stack__cat">
                <em>{String(i + 1).padStart(2, "0")}</em>
                <b>{r.title}</b>
                <span>{r.note}</span>
              </div>
              <div className="stack__track">
                <i className="stack__run" aria-hidden="true" style={{ animationDelay: `${i * -0.9}s` }} />
                <ul>
                  {r.items.map((it) => (
                    <li key={it.name}>
                      <span className="stack__tile">
                        {it.logo ? <Logo name={it.logo} size={30} /> : (
                          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" className="stack__generic"><IconG name={it.icon ?? "cpu"} /></svg>
                        )}
                      </span>
                      <small>{it.name}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
