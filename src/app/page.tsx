import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { CoreTechnicalSection } from "@/components/sections/CoreTechnicalSection"
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection"
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection"
import { StackSection } from "@/components/sections/StackSection"
import { LearningGrowthSection } from "@/components/sections/LearningGrowthSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      <Header />
      <HeroSection />
      <CoreTechnicalSection />
      <FeaturedWorkSection />
      <CaseStudiesSection />
      <StackSection />
      <LearningGrowthSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
