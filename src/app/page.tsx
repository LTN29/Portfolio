import { Nav } from "@/site/nav";
import { Motion } from "@/site/motion";
import { About, Capabilities, Hero, Process, ProjectIndex, Projects } from "@/site/sections";
import { Footer, Notes } from "@/site/notes";
import { TechStack } from "@/site/tech-stack";
import { MobileDock } from "@/site/mobile-dock";
import { MobileTour } from "@/site/mobile-tour";
import { JsonLd } from "@/site/json-ld";
import { projects } from "@/data/portfolio";
import { PERSON, SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    PERSON,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: "vi", publisher: { "@id": `${SITE_URL}/#person` } },
    {
      "@type": "ProfilePage", "@id": `${SITE_URL}/#profile`, url: `${SITE_URL}/`, name: "Hồ sơ năng lực — Lê Thanh Nhân", description: SITE_DESC,
      inLanguage: "vi", isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ItemList", name: "Dự án tiêu biểu",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "CreativeWork", name: p.name, description: p.tagline, genre: p.kind, url: `${SITE_URL}/#${p.id}`, creator: { "@id": `${SITE_URL}/#person` }, keywords: p.stack.join(", ") },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={ld} />
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <ProjectIndex />
        <Projects />
        <About />
        <Capabilities />
        <Process />
        <Notes />
      </main>
      <Footer />
      <MobileDock />
      <MobileTour />
      <Motion />
    </>
  );
}
