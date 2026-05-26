import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection"
import { ExpertiseSection } from "@/components/sections/ExpertiseSection"
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection"
import { StackSection } from "@/components/sections/StackSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Header />
      <HeroSection />
      <FeaturedWorkSection />
      <ExpertiseSection />
      <CaseStudiesSection />
      <StackSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
