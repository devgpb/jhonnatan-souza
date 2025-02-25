import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import MainLayout from '@/layouts/MainLayout';

const houses = [
  {
    id: "VK096",
    image: "/images/imoveis/imovel-8.jpg",
    price: 65000000,
    area: 411,
    suites: 4,
    parking: 6,
    location: "Casa de condomínio em Alto de Pinheiros, São Paulo - SP",
    broker: {
      name: "KÁTIA PETRIS",
      company: "Go In Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX2345",
    image: "/images/imoveis/imovel-7.jpg",
    price: 18000000,
    area: 650,
    suites: 5,
    parking: 6,
    location: "Casa em Cidade Jardim, São Paulo - SP",
    broker: {
      name: "Ricardo Santos",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS6543",
    image: "/images/imoveis/imovel-6.jpg",
    price: 12500000,
    area: 480,
    suites: 4,
    parking: 4,
    location: "Casa em Alto de Pinheiros, São Paulo - SP",
    broker: {
      name: "Patricia Lima",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH7654",
    image: "/images/imoveis/imovel-5.jpg",
    price: 9800000,
    area: 420,
    suites: 4,
    parking: 4,
    location: "Casa em Morumbi, São Paulo - SP",
    broker: {
      name: "Fernando Costa",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX8765",
    image: "/images/imoveis/imovel-4.jpg",
    price: 22000000,
    area: 750,
    suites: 6,
    parking: 8,
    location: "Casa em Jardim Europa, São Paulo - SP",
    broker: {
      name: "Ana Clara",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS9876",
    image: "/images/imoveis/imovel-3.jpg",
    price: 15500000,
    area: 580,
    suites: 5,
    parking: 6,
    location: "Casa em Jardim Guedala, São Paulo - SP",
    broker: {
      name: "Roberto Silva",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "SH0987",
    image: "/images/imoveis/imovel-2.jpg",
    price: 8900000,
    area: 380,
    suites: 4,
    parking: 4,
    location: "Casa em Brooklin, São Paulo - SP",
    broker: {
      name: "Marina Santos",
      company: "Singular House",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "LX1098",
    image: "/images/imoveis/imovel-1.jpg",
    price: 28000000,
    area: 850,
    suites: 6,
    parking: 8,
    location: "Casa em Cidade Jardim, São Paulo - SP",
    broker: {
      name: "Carlos Eduardo",
      company: "Luxury Home",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "HS2109",
    image: "/images/imoveis/imovel-10.jpg",
    price: 19500000,
    area: 680,
    suites: 5,
    parking: 6,
    location: "Casa em Alto da Boa Vista, São Paulo - SP",
    broker: {
      name: "Luciana Costa",
      company: "Homesphere",
      avatar: "/images/corretores/user-02.png",
    },
  },
]

export default function HousesPage() {
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
            <h1 className="text-4xl font-semibold mb-2">Casas</h1>
            <p className="text-muted-foreground">Descubra casas exclusivas com todo o conforto para sua família</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((property) => (
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

