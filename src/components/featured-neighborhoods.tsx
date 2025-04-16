"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function FeaturedNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const res = await fetch('/api/featured-locations')
        const data = await res.json()
        console.log(data)
        setNeighborhoods(data)
      } catch (error) {
        console.error('Erro ao carregar bairros:', error)
      }
    }

    fetchNeighborhoods()
  }, [])

  const neighborhoodTags = neighborhoods.map(n => n.location)

  const handleTagClick = (tag: string) => {
    const newIndex = neighborhoodTags.indexOf(tag)
    setCurrentSlide(newIndex)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % neighborhoods.length)
    }, 10000)
    return () => clearInterval(timer)
  }, [neighborhoods.length])

  return (
    <section className="py-12 sm:py-16 container px-4 sm:px-6 md:px-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-6 md:mb-12">
        Bairros em destaque
      </h2>

      {/* Tags dos bairros */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
        {neighborhoodTags.map((tag, index) => (
          <Button
            key={tag}
            variant="outline"
            onClick={() => handleTagClick(tag)}
            className={`rounded-full px-3 py-1 text-sm sm:text-base text-green-900 transition-colors ${
              currentSlide === index
                ? "bg-black text-yellow-600"
                : "hover:bg-black hover:text-yellow-600"
            }`}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Slider principal */}
      <div className="relative overflow-hidden">
        {neighborhoods.map((neighborhood, index) => {
          const propertyTypes = [
            { type: "Apartamento", data: neighborhood.apartamento },
            { type: "Casa", data: neighborhood.casa },
            { type: "Cobertura", data: neighborhood.cobertura },
          ]
          console.log(propertyTypes[0])
          return (
            <div
              key={neighborhood.location}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 relative z-10" : "opacity-0 -z-10"
              }`}
            >
              {/* Imagem principal */}
              <div className="relative h-64 sm:h-[500px] mb-6">
                <Image
                  src={neighborhood.principal.image || "/placeholder.svg"}
                  alt={neighborhood.location}
                  fill
                  className="object-cover rounded-lg brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Link
                    href={`/imoveis?location=${encodeURIComponent(neighborhood.location)}`}
                    className="group inline-flex items-center gap-2 hover:opacity-80"
                  >
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-4">
                      {neighborhood.location}
                    </h3>
                    <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <p className="text-lg max-w-2xl">{neighborhood.description}</p>
                </div>
              </div>

              {/* Cards dos tipos de propriedade */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {propertyTypes.map((property) =>
                  property.data ? (
                    <Link
                      key={property.type}
                      href={`/imoveis?search=${encodeURIComponent(property.type)}&location=${encodeURIComponent(neighborhood.location)}`}
                    >
                      <Card
                        className="relative overflow-hidden cursor-pointer p-2 sm:p-4"
                        onMouseEnter={() => setHoveredCard(property.type)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={property.data[0].images?.[0] || "/placeholder.svg"}
                            alt={property.type}
                            fill
                            className={`object-cover transition-transform duration-300 ${
                              hoveredCard === property.type ? "scale-105" : "scale-100"
                            }`}
                          />
                          <div
                            className={`absolute inset-0 transition-colors duration-300 ${
                              hoveredCard === property.type ? "bg-black/40" : "bg-black/20"
                            }`}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white">
                            <span className="font-medium">{property.type}</span>
                            <ArrowRight
                              className={`h-5 w-5 transition-transform duration-300 ${
                                hoveredCard === property.type ? "translate-x-1" : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ) : null
                )}

                {/* Card "Ver bairro" */}
                <Link href={`/imoveis?location=${encodeURIComponent(neighborhood.location)}`}>
                  <Card
                    className="relative overflow-hidden bg-black cursor-pointer"
                    onMouseEnter={() => setHoveredCard("view-all")}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative aspect-[15/3] flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="font-medium mb-1">Ver bairro</p>
                        <ArrowRight
                          className={`h-6 w-6 mx-auto transition-transform duration-300 ${
                            hoveredCard === "view-all" ? "translate-x-1" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          )
        })}

        {/* Navegação do slider */}
        <div className="flex justify-between items-center mt-6 sm:mt-8">
          <Button variant="outline" className="text-sm sm:text-lg px-4 sm:px-6">
            Ver todos os imóveis
            <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
          </Button>

          <div className="flex items-center gap-3 sm:gap-4" style={{ color: "#1c3e40" }}>
            <div className="flex gap-2">
              {neighborhoods.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-black" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentSlide(
                    (prev) => (prev - 1 + neighborhoods.length) % neighborhoods.length
                  )
                }
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % neighborhoods.length)}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
