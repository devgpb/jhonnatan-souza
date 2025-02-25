import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import MainLayout from '@/layouts/MainLayout';


const penthouses = [
  {
    id: "BR4800",
    image: "/images/imoveis/imovel-3.jpg",
    price: 2700000,
    area: 216,
    suites: 1,
    parking: 3,
    location: "Cobertura em Moema, São Paulo - SP",
    broker: {
      name: "Fernando Gaspar",
      company: "Brand Real Estate",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX8901",
    image: "/images/imoveis/imovel-3.jpg",
    price: 8500000,
    area: 450,
    suites: 4,
    parking: 4,
    location: "Cobertura em Itaim Bibi, São Paulo - SP",
    broker: {
      name: "Ana Paula",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS7654",
    image: "/images/imoveis/imovel-3.jpg",
    price: 6800000,
    area: 320,
    suites: 3,
    parking: 3,
    location: "Cobertura em Vila Nova Conceição, São Paulo - SP",
    broker: {
      name: "Roberto Carlos",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH2345",
    image: "/images/imoveis/imovel-3.jpg",
    price: 5900000,
    area: 280,
    suites: 3,
    parking: 2,
    location: "Cobertura em Pinheiros, São Paulo - SP",
    broker: {
      name: "Luciana Costa",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX3456",
    image: "/images/imoveis/imovel-3.jpg",
    price: 12000000,
    area: 520,
    suites: 4,
    parking: 4,
    location: "Cobertura nos Jardins, São Paulo - SP",
    broker: {
      name: "Pedro Silva",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS8765",
    image: "/images/imoveis/imovel-3.jpg",
    price: 7200000,
    area: 350,
    suites: 3,
    parking: 3,
    location: "Cobertura em Moema, São Paulo - SP",
    broker: {
      name: "Mariana Santos",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH5678",
    image: "/images/imoveis/imovel-3.jpg",
    price: 9500000,
    area: 420,
    suites: 4,
    parking: 4,
    location: "Cobertura em Campo Belo, São Paulo - SP",
    broker: {
      name: "Ricardo Lima",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX6789",
    image: "/images/imoveis/imovel-3.jpg",
    price: 15000000,
    area: 600,
    suites: 5,
    parking: 6,
    location: "Cobertura em Vila Olímpia, São Paulo - SP",
    broker: {
      name: "Fernanda Costa",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS9876",
    image: "/images/imoveis/imovel-3.jpg",
    price: 11000000,
    area: 480,
    suites: 4,
    parking: 4,
    location: "Cobertura em Perdizes, São Paulo - SP",
    broker: {
      name: "Carlos Eduardo",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
]

export default function PenthousesPage() {
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
            <h1 className="text-4xl font-semibold mb-2">Coberturas</h1>
            <p className="text-muted-foreground">Explore coberturas de alto padrão com vistas deslumbrantes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {penthouses.map((property) => (
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

