import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import MainLayout from '@/layouts/MainLayout';


const apartments = [
  {
    id: "HS25498",
    image: "/images/imoveis/imovel-3.jpg",
    price: 5650000,
    area: 157,
    suites: 3,
    parking: 3,
    location: "Apartamento em Vila Nova Conceição, São Paulo - SP",
    broker: {
      name: "Vania Ceccotto",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LXH3432",
    image: "/images/imoveis/imovel-2.jpg",
    price: 4700000,
    area: 185,
    suites: 3,
    parking: 3,
    location: "Apartamento em Itaim Bibi, São Paulo - SP",
    broker: {
      name: "Claudia Mangieri",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH3587",
    image: "/images/imoveis/imovel-3.jpg",
    price: 4790000,
    area: 244,
    suites: 4,
    parking: 4,
    location: "Apartamento em Campo Belo, São Paulo - SP",
    broker: {
      name: "Gilson Oliveira",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  // Add 6 more apartments with similar structure
  {
    id: "MSP507",
    image: "/images/imoveis/imovel-4.jpg",
    price: 2000000,
    area: 84,
    suites: 2,
    parking: 2,
    location: "Apartamento em Brooklin, São Paulo - SP",
    broker: {
      name: "João Victor",
      company: "Morar SP",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX4521",
    image: "/images/imoveis/imovel-5.jpg",
    price: 3900000,
    area: 165,
    suites: 3,
    parking: 2,
    location: "Apartamento em Moema, São Paulo - SP",
    broker: {
      name: "Patricia Santos",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS7823",
    image: "/images/imoveis/imovel-6.jpg",
    price: 6200000,
    area: 210,
    suites: 4,
    parking: 3,
    location: "Apartamento em Jardins, São Paulo - SP",
    broker: {
      name: "Ricardo Lima",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH9012",
    image: "/images/imoveis/imovel-7.jpg",
    price: 3500000,
    area: 140,
    suites: 3,
    parking: 2,
    location: "Apartamento em Pinheiros, São Paulo - SP",
    broker: {
      name: "Marina Costa",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX6789",
    image: "/images/imoveis/imovel-8.jpg",
    price: 5100000,
    area: 190,
    suites: 3,
    parking: 3,
    location: "Apartamento em Vila Olímpia, São Paulo - SP",
    broker: {
      name: "Fernando Silva",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS4567",
    image: "/images/imoveis/imovel-10.jpg",
    price: 4200000,
    area: 170,
    suites: 3,
    parking: 2,
    location: "Apartamento em Perdizes, São Paulo - SP",
    broker: {
      name: "Carolina Santos",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
]

export default function ApartmentsPage() {
  const handleSearch = (filters:any) => {
    console.log(filters)
  }
  return (
    <>
      <MainLayout>
      <FilterBar onSearch={handleSearch}/>
      <main className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2">Apartamentos</h1>
            <p className="text-muted-foreground">Encontre seu apartamento ideal em localização privilegiada</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="px-8">
            Carregar mais imóveis
          </Button>
        </div>
      </main>
      </MainLayout>
    </>
  )
}

