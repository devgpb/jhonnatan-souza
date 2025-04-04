import { useEffect, useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { FilterBar } from "@/components/filter-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import MainLayout from '@/layouts/MainLayout'

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
  title: string
  brokers: Broker
}

export default function HousesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleSearch = (filters: any) => {
    console.log(filters)
  }

  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const fetchProperties = async (page: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/properties?page=${page}&limit=6`)
      const data: Property[] = await res.json()

      // Filtrar somente casas
      const houses = data.filter((p) =>
        normalize(p.title).includes("casa")
      )

      setProperties((prev) => [...prev, ...houses])

      if (houses.length < 6) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(page)
  }, [page])

  const loadMore = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <>
      <MainLayout>
        <FilterBar onSearch={handleSearch} />
        <main className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-semibold mb-2">Casas</h1>
              <p className="text-muted-foreground">Descubra casas exclusivas com todo o conforto para sua família</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={(property.images?.[0]) || "/images/imoveis/imovel-3.jpg"}
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
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                className="px-8"
                onClick={loadMore}
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Carregar mais imóveis"}
              </Button>
            </div>
          )}
        </main>
      </MainLayout>
    </>
  )
}
