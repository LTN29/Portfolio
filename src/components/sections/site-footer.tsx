import { aiProjects, profile, sectionLinks } from "@/data/portfolio";

export function Footer() {
  const contact = [
    profile.email && { label: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    profile.zalo && { label: "Zalo", href: profile.zalo.startsWith("http") ? profile.zalo : `https://zalo.me/${profile.zalo.replace(/\s/g, "")}` },
    { label: "GitHub · LTN29", href: profile.github },
  ].filter(Boolean) as { label: string; href: string }[];

  const columns = [
    { title: "Liên hệ", links: contact, external: true },
    { title: "Dự án", links: aiProjects.map((p) => ({ label: p.name, href: `#${p.id}` })), external: false },
    { title: "Mục lục", links: sectionLinks.slice(0, 4).map((l) => ({ label: l.label, href: l.href })), external: false },
  ];

  return (
    <footer className="sg-footer">
      <div className="sg-wrap">
        <div className="sg-footer__top">
          <div className="pf-footer__intro">
            <a href="#top" className="pf-footer__mark" aria-label="Về đầu trang">LTN<b>.</b></a>
            <p>{profile.status}: AI, automation, web và mobile. <a className="sg-link sg-link--light" href="#contact">Gửi yêu cầu dự án</a></p>
          </div>
          <nav className="sg-footer__cols" aria-label="Liên kết">
            {columns.map((col) => (
              <div key={col.title}>
                <p>{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        className="sg-link sg-link--light"
                        href={l.href}
                        {...(col.external && l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="sg-footer__statement" aria-hidden="true">Build. Ship. <span>Operate.</span></p>
        <div className="sg-footer__bottom">
          <span>© 2026 {profile.name}</span>
          <span>{profile.role}</span>
          <a className="sg-link sg-link--light" href="#top">Lên đầu trang</a>
        </div>
      </div>
    </footer>
  );
}
