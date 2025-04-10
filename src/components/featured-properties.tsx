"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "./ui/card"
import { Bed, Bath, Square, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { propertyService } from "@/services/PropertyService"
import type { Property } from "@/types/property" // ajuste o caminho conforme sua estrutura
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { useMediaQuery } from "@/hooks/use-media-query"

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Media queries para responsividade
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // Determina quantos slides mostrar por vez com base no tamanho da tela
  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3

  useEffect(() => {
    propertyService
      .getFeaturedProperties()
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

  if (loading) {
    return (
      <div className="py-16 sm:py-24 container px-4 sm:px-6 md:px-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="py-16 sm:py-24 container px-4 sm:px-6 md:px-8">
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Nenhum imóvel em destaque</h3>
          <p className="text-gray-500">Volte em breve para ver nossas recomendações.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 sm:py-24 container px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-2">Imóveis em Destaque</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Selecionamos as melhores opções para você</p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 mt-4 sm:mt-0 group transition-all duration-300 hover:bg-gray-800 hover:text-white"
          onClick={handleImoveis}
        >
          Ver todos
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
                <Link href={`/imovel/${property.id}`}>
                  <Card className="group overflow-hidden border-0 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <div className="relative h-64 sm:h-72">
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
                            {property.bathrooms ?? property.bathrooms} Banheiros
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
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex items-center justify-end gap-2 mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 bg-white hover:bg-gray-100 border border-gray-200">
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            <CarouselNext className="relative inset-0 translate-y-0 bg-white hover:bg-gray-100 border border-gray-200">
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
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
    </section>
  )
}
