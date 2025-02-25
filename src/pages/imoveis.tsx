import { FilterBar } from "@/components/filter-bar"
import { NavBar } from "@/components/nav-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Link } from "lucide-react"
import { Footer } from "../components/footer";
import MainLayout from '@/layouts/MainLayout';
import { useRouter } from "next/router"


const properties = {
  apartments: [
    {
      id: "FH123",
      image: "/images/imoveis/imovel-8.jpg",
      price: 5300000,
      area: 410,
      suites: 4,
      parking: 4,
      location: "Apartamento em Santa Cecília, São Paulo - SP",
      broker: {
        name: "Flávia Heilman",
        company: "Flavia Heilman Broker",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "FOX24002",
      image: "/images/imoveis/imovel-7.jpg",
      price: 3200000,
      area: 193,
      suites: 1,
      parking: 2,
      location: "Apartamento em Jardim América, São Paulo - SP",
      broker: {
        name: "Marcos Sottile Casati",
        company: "Casa Fox",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "BM510",
      image: "/images/imoveis/imovel-6.jpg",
      price: 2790000,
      area: 123,
      suites: 2,
      parking: 3,
      location: "Apartamento em Itaim Bibi, São Paulo - SP",
      broker: {
        name: "Silvia Gentil",
        company: "Biagi Martins Imóveis",
        avatar: "/images/corretores/user-02.png",
      },
    },
  ],
  houses: [
    {
      id: "FH124",
      image: "/images/imoveis/imovel-5.jpg",
      price: 15000000,
      area: 750,
      suites: 5,
      parking: 6,
      location: "Casa em Alto de Pinheiros, São Paulo - SP",
      broker: {
        name: "Flávia Heilman",
        company: "Flavia Heilman Broker",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "FOX24003",
      image: "/images/imoveis/imovel-4.jpg",
      price: 8900000,
      area: 520,
      suites: 4,
      parking: 4,
      location: "Casa em Cidade Jardim, São Paulo - SP",
      broker: {
        name: "Marcos Sottile Casati",
        company: "Casa Fox",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "BM511",
      image: "/images/imoveis/imovel-3.jpg",
      price: 12500000,
      area: 650,
      suites: 4,
      parking: 5,
      location: "Casa em Jardim Europa, São Paulo - SP",
      broker: {
        name: "Silvia Gentil",
        company: "Biagi Martins Imóveis",
        avatar: "/images/corretores/user-02.png",
      },
    },
  ],
  penthouses: [
    {
      id: "FH125",
      image: "/images/imoveis/imovel-2.jpg",
      price: 18000000,
      area: 480,
      suites: 4,
      parking: 5,
      location: "Cobertura em Moema, São Paulo - SP",
      broker: {
        name: "Flávia Heilman",
        company: "Flavia Heilman Broker",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "FOX24004",
      image: "/images/imoveis/imovel-1.jpg",
      price: 25000000,
      area: 600,
      suites: 5,
      parking: 6,
      location: "Cobertura nos Jardins, São Paulo - SP",
      broker: {
        name: "Marcos Sottile Casati",
        company: "Casa Fox",
        avatar: "/images/corretores/user-02.png",
      },
    },
    {
      id: "BM512",
      image: "/images/imoveis/imovel-10.jpg",
      price: 15500000,
      area: 380,
      suites: 3,
      parking: 4,
      location: "Cobertura em Itaim Bibi, São Paulo - SP",
      broker: {
        name: "Silvia Gentil",
        company: "Biagi Martins Imóveis",
        avatar: "/images/corretores/user-02.png",
      },
    },
  ],
}

export default function PropertiesPage() {
  const handleSearch = (filters:any) => {
    console.log(filters)
  }

  const router = useRouter();

  const handleCasas = () => {
    router.push("/casas")
  }

  const handleApartamentos = () => {
    router.push("/apartamentos")
  }

  const handleCoberturas = () => {
    router.push("/coberturas")
  }
  return (
    <>
      <NavBar background/>
      <main className="container py-12 px-4 md:px-0 pt-14">
      <FilterBar onSearch={handleSearch}/>
        {/* Apartments Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">Apartamentos</h2>
              <p className="text-muted-foreground text-sm md:text-base">Encontre seu apartamento ideal em localização privilegiada</p>
            </div>
              <Button variant="outline" className="gap-2 text-sm h-10 w-full md:w-auto" onClick={handleApartamentos}>
                Ver todos os apartamentos
                <ArrowRight className="h-4 w-4" />
              </Button>
          </div>  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.apartments.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>

        {/* Houses Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">Casas</h2>
              <p className="text-muted-foreground text-sm md:text-base">Descubra casas exclusivas com todo o conforto para sua família</p>
            </div>
              <Button variant="outline" className="gap-2 text-sm h-10 w-full md:w-auto" onClick={handleCasas}>
                Ver todas as casas
                <ArrowRight className="h-4 w-4" />
              </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.houses.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>

        {/* Penthouses Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">Coberturas</h2>
              <p className="text-muted-foreground text-sm md:text-base">Explore coberturas de alto padrão com vistas deslumbrantes</p>
            </div>
              <Button variant="outline" className="gap-2 text-sm h-10 w-full md:w-auto" onClick={handleCoberturas}>
                Ver todas as coberturas
                <ArrowRight className="h-4 w-4" />
              </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.penthouses.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

