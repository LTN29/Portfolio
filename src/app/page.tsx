import { SiteNav } from "@/components/navigation/site-nav";
import { BrandIntro } from "@/components/motion/brand-intro";
import { Hero } from "@/components/sections/hero";
import { WaveStatement } from "@/components/motion/wave-statement";
import { Story } from "@/components/sections/story";
import { StatSequence } from "@/components/motion/stat-sequence";
import { GradientBand } from "@/components/motion/gradient-band";
import { AiProjects } from "@/components/sections/ai-projects";
import { Systems } from "@/components/sections/systems";
import { Showcase } from "@/components/sections/showcase";
import { CurveText } from "@/components/motion/curve-text";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Footer } from "@/components/sections/site-footer";
import { Contact } from "@/components/sections/contact";
import { PageMotion } from "@/components/motion/page-motion";

export default function Home() {
  return (
    <main className="lux">
      <div className="site-loader" aria-hidden="true">
        <span className="loader-glow" />
        <span className="loader-mark">LTN<b>.</b></span>
        <span className="loader-caption">BUILD · SHIP · OPERATE</span>
        <i />
      </div>
      <SiteNav />
      <BrandIntro />
      <Hero />
      <WaveStatement />
      <Story />
      <Services />
      <StatSequence />
      <GradientBand />
      <AiProjects />
      <Showcase />
      <Systems />
      <Process />
      <CurveText />
      <Contact />
      <Footer />
      {/* cuối cùng, để các pin của từng section đã tồn tại trước khi reveal chung đo trang */}
      <PageMotion />
    </main>
  );
}
