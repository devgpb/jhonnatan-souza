import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import MainLayout from '@/layouts/MainLayout';


export default function ContactPage() {
  return (
    <>
      <MainLayout>
      <main>
        <ContactHero />
        <div className="container py-16">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </main>
      </MainLayout>
    </>
  )
}


// Aplicando o layout com Header e Footer

