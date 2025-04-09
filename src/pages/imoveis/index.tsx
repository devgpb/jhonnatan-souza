"use client"
import { useEffect, useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { PropertyFilters } from "@/components/property-filter"
import { propertyService } from "@/services/PropertyService"

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

  // Função para normalizar o texto (sem acentos e tudo em minúsculas)
  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Efeito que atualiza os estados de imóveis filtrados sempre que `allProperties` mudar
  useEffect(() => {
    setApartments(
      allProperties.filter((p) => p.type == "apartamento")
    )
    setHouses(
      allProperties.filter((p) => p.type == "casa")
    )
    setPenthouses(
      allProperties.filter((p) => p.type == "cobertura")
    )
  }, [allProperties])

  // Carregamento inicial dos imóveis (opcional)
  useEffect(() => {
    propertyService
      .getPropertiesList(filters)
      .then((res) => setAllProperties(res.data || []))
      .catch(() => setAllProperties([]))
  }, [])

  // Callback de busca que atualiza os filtros e recarrega os imóveis
  const handleSearch = async (newFilters: Partial<TableFilters>) => {
    setFilters(newFilters)

    try {
      const response = await propertyService.getPropertiesList(newFilters)
      setAllProperties(response.data || [])
    } catch (error) {
      console.error("Erro ao buscar propriedades", error)
      setAllProperties([])
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
      <main className="container py-12 px-4 md:px-0 pt-14">
        <div className="h-10 w-100"></div>
        <PropertyFilters onFilter={handleSearch} initialFilters={filters} />

        {apartments.length > 0 && (
          <Section
            title="Apartamentos"
            description="Encontre seu apartamento ideal..."
            handleClick={handleApartamentos}
            properties={apartments}
            renderPropertyCard={renderPropertyCard}
          />
        )}

        {houses.length > 0 && (
          <Section
            title="Casas"
            description="Descubra casas exclusivas..."
            handleClick={handleCasas}
            properties={houses}
            renderPropertyCard={renderPropertyCard}
          />
        )}

        {penthouses.length > 0 && (
          <Section
            title="Coberturas"
            description="Explore coberturas de alto padrão..."
            handleClick={handleCoberturas}
            properties={penthouses}
            renderPropertyCard={renderPropertyCard}
          />
        )}
      </main>
    </>
  )
}

interface SectionProps {
  title: string
  description: string
  handleClick: () => void
  properties: Property[]
  renderPropertyCard: (property: Property) => any
}

function Section({
  title,
  description,
  handleClick,
  properties,
  renderPropertyCard,
}: SectionProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-1">{title}</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {description}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-sm h-10 w-full md:w-auto"
          onClick={handleClick}
        >
          Ver todos {title.toLowerCase()}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {properties.map(renderPropertyCard)}
      </div>
    </section>
  )
}
