import { Nav } from "@/site/nav";
import { Motion } from "@/site/motion";
import { About, Capabilities, Hero, Process, ProjectIndex, Projects } from "@/site/sections";
import { ContactAndFooter } from "@/site/contact";
import { TechStack } from "@/site/tech-stack";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TechStack />
        <ProjectIndex />
        <Projects />
        <About />
        <Capabilities />
        <Process />
      </main>
      <ContactAndFooter />
      <Motion />
    </>
  );
}
