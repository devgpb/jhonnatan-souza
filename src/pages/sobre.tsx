import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutValues } from "@/components/about-values"
import { AboutStats } from "@/components/about-stats"
import { AboutExperience } from "@/components/about-experience"
import MainLayout from '@/layouts/MainLayout';


export default function AboutPage() {
  return (
    <>
      <MainLayout>
      <main>
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutStats />
        <AboutExperience />
      </main>
      </MainLayout>
    </>
  )
}

