import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { PropertyDescription } from "@/components/porperty-description"
import { PropertyContact } from "@/components/property-contact"
import { SimilarProperties } from "@/components/similar-properties"
import MainLayout from '@/layouts/MainLayout';

// This would typically come from an API or database
const property = {
  id: "AVA660",
  title: "Apartamento de Alto Padrão",
  location: "Itaim Bibi, São Paulo - SP",
  price: 5300000,
  area: 157,
  bedrooms: 3,
  sold: false,
  year: 2019,
  iptu: 1500,
  suites: 3,
  bathrooms: 4,
  parking: 3,
  description: `Apartamento de alto padrão no Itaim Bibi, um dos bairros mais valorizados de São Paulo. Com acabamento refinado e ambientes amplos, o imóvel oferece o máximo em conforto e sofisticação.

O apartamento conta com:
- Living ampliado com varanda gourmet
- Cozinha integrada com ilha
- 3 suítes com armários planejados
- Lavabo
- Área de serviço completa
- 3 vagas de garagem

O condomínio oferece:
- Piscina
- Academia
- Salão de festas
- Playground
- Segurança 24h`,
  amenities: [
    "Varanda Gourmet",
    "Cozinha Planejada",
    "Armários Planejados",
    "Ar Condicionado",
    "Piscina",
    "Academia",
    "Salão de Festas",
    "Playground",
    "Segurança 24h",
  ],
  images: [
    "/images/imoveis/imovel-2.jpg",
    "/images/imoveis/imovel-2.jpg",
    "/images/imoveis/imovel-2.jpg",
    "/images/imoveis/imovel-2.jpg",
  ],
  broker: {
    name: "Ana Silva",
    company: "Jhonnathan",
    creci: "123456",
    phone: "+55 11 99999-9999",
    email: "ana.silva@jhonnathan.com.br",
    avatar: "/placeholder.svg?height=400&width=400",
  },
}

export default function PropertyPage() {
  return (
    <>
      <MainLayout>
      <main>
        <PropertyGallery images={property.images} />
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 py-12">
            <div className="space-y-12">
              <PropertyDetails property={property} />
              <PropertyDescription property={property} />
            </div>
            <div className="space-y-6">
              <PropertyContact broker={property.broker} />
            </div>
          </div>
        </div>
        <SimilarProperties currentId={property.id} />
      </main>
      </MainLayout>
    </>
  )
}

