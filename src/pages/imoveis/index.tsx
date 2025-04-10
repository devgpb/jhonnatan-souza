"use client"
import { useEffect, useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { PropertyFilters } from "@/components/property-filter"
import { propertyService } from "@/services/PropertyService"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useMediaQuery } from "@/hooks/use-media-query"

interface TableFilters {
  type?: string
  location: string
  areas: string[]
  prices: string[]
  statuses: string[]
  brokers: string[]
  search: string
}

type Broker = {
  name: string
  company?: string
  avatar?: string
}

type Property = {
  id: string
  price: number
  area: number
  suites: number
  parking: number
  images: string[]
  location: string
  type: "casa" | "apartamento" | "cobertura"
  title: string
  brokers: Broker
}

export default function PropertiesPage() {
  // Estado que mantém todos os imóveis
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  // Estados para os imóveis filtrados
  const [apartments, setApartments] = useState<Property[]>([])
  const [houses, setHouses] = useState<Property[]>([])
  const [penthouses, setPenthouses] = useState<Property[]>([])

  // Estado de filtros
  const [filters, setFilters] = useState<Partial<TableFilters>>({
    type: "",
    location: "",
    areas: [],
    prices: [],
    statuses: [],
    brokers: [],
    search: "",
  })

  // Media queries para responsividade
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // Função para normalizar o texto (sem acentos e tudo em minúsculas)
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  // Efeito que atualiza os estados de imóveis filtrados sempre que `allProperties` mudar
  useEffect(() => {
    setApartments(allProperties.filter((p) => p.type == "apartamento"))
    setHouses(allProperties.filter((p) => p.type == "casa"))
    setPenthouses(allProperties.filter((p) => p.type == "cobertura"))
  }, [allProperties])

  // Carregamento inicial dos imóveis
  useEffect(() => {
    setLoading(true)
    propertyService
      .getPropertiesList(filters)
      .then((res) => {
        setAllProperties(res.data || [])
        setLoading(false)
      })
      .catch(() => {
        setAllProperties([])
        setLoading(false)
      })
  }, [])

  // Callback de busca que atualiza os filtros e recarrega os imóveis
  const handleSearch = async (newFilters: Partial<TableFilters>) => {
    setFilters(newFilters)
    setLoading(true)

    try {
      const response = await propertyService.getPropertiesList(newFilters)
      setAllProperties(response.data || [])
    } catch (error) {
      console.error("Erro ao buscar propriedades", error)
      setAllProperties([])
    } finally {
      setLoading(false)
    }
  }

  // Funções para filtrar por tipo ao clicar nos botões "Ver todos..."
  const handleCasas = () => {
    handleSearch({
      ...filters,
      type: "casa",
    })
  }

  const handleApartamentos = () => {
    handleSearch({
      ...filters,
      type: "apartamento",
    })
  }

  const handleCoberturas = () => {
    handleSearch({
      ...filters,
      type: "cobertura",
    })
  }

  // Renderização do card do imóvel
  const renderPropertyCard = (property: Property) => (
    <PropertyCard
      key={property.id}
      id={property.id}
      image={property.images?.[0] || "/images/imoveis/imovel-3.jpg"}
      price={property.price}
      area={property.area}
      suites={property.suites}
      location={property.location}
      parking={property.parking}
      title={property.title}
      broker={{
        name: property.brokers.name,
        company: property.brokers.company || "N/A",
        avatar: property.brokers.avatar || "/default-avatar.jpg",
      }}
    />
  )

  return (
    <>
      <NavBar background />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container py-12 px-4 md:px-6 pt-24">
          {/* Filters Section */}
          <div className="mb-12 transition-all duration-300 hover:shadow-lg rounded-xl">
            <PropertyFilters onFilter={handleSearch} initialFilters={filters} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
          )}

          {/* No Results State */}
          {!loading && allProperties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Nenhum imóvel encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros para ver mais resultados.</p>
            </div>
          )}

          {/* Property Sections */}
          <div className="space-y-16">
            {apartments.length > 0 && (
              <CarouselSection
                title="Apartamentos"
                description="Encontre seu apartamento ideal com localização privilegiada e acabamento premium"
                handleClick={handleApartamentos}
                properties={apartments}
                renderPropertyCard={renderPropertyCard}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}

            {houses.length > 0 && (
              <CarouselSection
                title="Casas"
                description="Descubra casas exclusivas com espaços amplos e conforto para toda a família"
                handleClick={handleCasas}
                properties={houses}
                renderPropertyCard={renderPropertyCard}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}

            {penthouses.length > 0 && (
              <CarouselSection
                title="Coberturas"
                description="Explore coberturas de alto padrão com vistas deslumbrantes e áreas de lazer privativas"
                handleClick={handleCoberturas}
                properties={penthouses}
                renderPropertyCard={renderPropertyCard}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}

interface CarouselSectionProps {
  title: string
  description: string
  handleClick: () => void
  properties: Property[]
  renderPropertyCard: (property: Property) => any
  isMobile: boolean
  isTablet: boolean
}

function CarouselSection({
  title,
  description,
  handleClick,
  properties,
  renderPropertyCard,
  isMobile,
  isTablet,
}: CarouselSectionProps) {
  // Determina quantos slides mostrar por vez com base no tamanho da tela
  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <section className="relative">
      <div className="absolute left-0 w-24 h-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
      <div className="pt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600 text-sm md:text-base">{description}</p>
          </div>
          <Button
            variant="outline"
            className="gap-2 text-sm h-10 w-full md:w-auto group transition-all duration-300 hover:bg-gray-800 hover:text-white"
            onClick={handleClick}
          >
            Ver todos {title.toLowerCase()}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: properties.length > slidesPerView,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {properties.map((property) => (
                <CarouselItem
                  key={property.id}
                  className={`pl-4 ${isMobile ? "basis-full" : isTablet ? "basis-1/2" : "basis-1/3"}`}
                >
                  {renderPropertyCard(property)}
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex items-center justify-end gap-2 mt-4">
              <CarouselPrevious className="relative inset-0 translate-y-0 bg-white hover:bg-gray-100 border border-gray-200" />
              <CarouselNext className="relative inset-0 translate-y-0 bg-white hover:bg-gray-100 border border-gray-200" />
            </div>
          </Carousel>

          {/* Indicador de navegação */}
          <div className="flex justify-center mt-6 gap-1.5">
            {Array.from({ length: Math.ceil(properties.length / slidesPerView) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300 hover:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
