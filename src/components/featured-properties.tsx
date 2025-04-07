"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Bed, Bath, Square, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/router"
import { propertyService } from "@/services/PropertyService"
import type { Property } from "@/types/property" // ajuste o caminho conforme sua estrutura

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    propertyService.getFeaturedProperties()
      .then((res) => {
        // Supondo que a resposta venha no formato { data: Property[] }
        setProperties(res.data)
      })
      .catch((error) => {
        console.error("Erro ao buscar propriedades em destaque:", error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleImoveis = () => {
    router.push("/imoveis")
  }

  if (loading) return <div>Loading...</div>
  if (properties.length === 0) return <div className="text-center"></div>
  return (
    <section className="py-16 sm:py-24 container px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-2">Imóveis em Destaque</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Selecionamos as melhores opções para você</p>
        </div>
        <Button variant="outline" size="lg" className="gap-2 mt-4 sm:mt-0" onClick={handleImoveis}>
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {properties.map((property) => (
          <Link key={property.id} href={`/imovel/${property.id}`}>
            <Card className="group overflow-hidden border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative">
                <div className="relative h-64 sm:h-72">
                  {/* <Badge
                    className="absolute top-4 right-4 z-10"
                    variant={property.type === "Venda" ? "default" : "secondary"}
                  >
                    {property.type}
                  </Badge> */}
                  <Image
                    src={
                      property.images && property.images.length > 0
                        ? String(property.images[0])
                        : "/placeholder.svg"
                    }
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="relative -mt-16 sm:-mt-20 mx-4 p-4 bg-white rounded-lg shadow-lg">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <h3 className="text-lg sm:text-xl font-semibold line-clamp-1">{property.title}</h3>
                    <p className="text-lg sm:text-xl font-bold text-primary whitespace-nowrap sm:ml-4">
                      {property.price?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">{property.location}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground pt-4 border-t">
                    <span className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms ?? property.bedrooms} Quartos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms ?? property.bedrooms} Banheiros
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Square className="h-4 w-4" />
                      {property.area}m²
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
