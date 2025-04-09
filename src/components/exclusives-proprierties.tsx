"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/router"

export function ExclusiveProperties() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [groupSize, setGroupSize] = useState(1)
  const [properties, setProperties] = useState<any[]>([])
  const router = useRouter()

  // Atualiza o groupSize com base na largura da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGroupSize(1)
      } else if (window.innerWidth < 1024) {
        setGroupSize(2)
      } else {
        setGroupSize(3)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Busca os imóveis exclusivos da API Supabase
  useEffect(() => {
    const fetchExclusiveProperties = async () => {
      try {
        const res = await fetch("/api/properties/exclusive")
        const data = await res.json()

        if (Array.isArray(data)) {
          setProperties(data)
        } else {
          console.error("Formato inesperado:", data)
        }
      } catch (error) {
        console.error("Erro ao buscar imóveis exclusivos:", error)
      }
    }

    fetchExclusiveProperties()
  }, [])

  const groups = []
  for (let i = 0; i < properties.length; i += groupSize) {
    groups.push(properties.slice(i, i + groupSize))
  }
  const totalSlides = groups.length

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(totalSlides - 1)
    }
  }, [currentSlide, totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 10000)
    return () => clearInterval(interval)
  }, [totalSlides])

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    })
  }

  return (
    <section
      className="py-16 sm:py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #0c1e20, #132e30, #1c3e40)",
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.3)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fabc3f]/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fabc3f]/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#fabc3f]/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[#fabc3f]/5 blur-3xl"></div>

      <div className="container px-4 sm:px-6 relative z-10">
        <div className="flex items-center gap-6 mb-12">
          <div className="h-12 w-12 rotate-180 bg-[#fabc3f]/10 rounded-full flex items-center justify-center p-2 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M9 5L16 12L9 19" stroke="#fabc3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 relative inline-block"
              style={{
                color: "#fabc3f",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Exclusivos Jhonnathan
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#fabc3f]"></span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl">
              Imóveis únicos e selecionados, disponíveis exclusivamente em nosso portfólio premium.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {groups.map((group, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-none grid gap-6 sm:gap-8"
                  style={{ gridTemplateColumns: `repeat(${groupSize}, minmax(0, 1fr))` }}
                >
                  {group.map((property) => (
                    <Card
                      key={property.id}
                      className="cursor-pointer overflow-hidden group transition-all duration-300 hover:translate-y-[-8px] hover:shadow-2xl"
                      style={{
                        background: "linear-gradient(to bottom, #1c3e40, #132e30)",
                        borderColor: "rgba(250, 188, 63, 0.2)",
                        borderWidth: "1px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 1px 3px rgba(250, 188, 63, 0.1)",
                      }}
                      onClick={() => router.push(`/imovel/${property.id}`)}
                    >
                      <div className="relative">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Badge
                            className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase"
                            style={{
                              background: "linear-gradient(135deg, #fabc3f, #e69b10)",
                              color: "#0c1e20",
                              boxShadow: "0 2px 10px rgba(250, 188, 63, 0.3)",
                            }}
                          >
                            Exclusivo
                          </Badge>
                          <Image
                            src={property.images?.[0] || "/placeholder.svg"}
                            alt={property.location}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ filter: "brightness(0.9) contrast(1.1)" }}
                          />
                          <div
                            className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(12, 30, 32, 0.95), rgba(12, 30, 32, 0.7), transparent)",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div className="relative">
                              <Image
                                src={property.brokers?.avatar || "/placeholder.svg"}
                                alt={property.brokers?.name || "Corretor"}
                                width={48}
                                height={48}
                                className="rounded-full"
                                style={{
                                  border: "2px solid rgba(250, 188, 63, 0.5)",
                                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#132e30]"></div>
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold">{property.brokers?.name || "Corretor"}</p>
                              <p className="text-[#fabc3f] text-xs">{property.brokers?.company || "Empresa"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                        <div className="flex flex-col">
                            <p
                              className="text-lg sm:text-xl font-bold mb-2"
                              style={{
                                color: "#fabc3f",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                              }}
                            >
                              {property.title}
                            </p>
                            <p
                              className="text-2xl sm:text-3xl font-bold"
                              style={{
                                color: "#fabc3f",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                              }}
                            >
                              {formatPrice(Number(property.price))}
                            </p>
                          </div>

                          <div className="flex justify-between text-white">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-[#fabc3f]/10">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8 2H16L22 8V16L16 22H8L2 16V8L8 2Z"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 16V16.01"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 12V8"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span>{property.area}m²</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-[#fabc3f]/10">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 22V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H19C19.5304 6 20.0391 6.21071 20.4142 6.58579C20.7893 6.96086 21 7.46957 21 8V22"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M2 22H22"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M12 2V6"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 10H16"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 14H16"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 18H16"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span>{property.suites} suítes</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-[#fabc3f]/10">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M19 17H5V10C5 8.93913 5.42143 7.92172 6.17157 7.17157C6.92172 6.42143 7.93913 6 9 6H15C16.0609 6 17.0783 6.42143 17.8284 7.17157C18.5786 7.92172 19 8.93913 19 10V17Z"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M3 17H21V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17Z"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                    stroke="#fabc3f"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span>{property.parking} vagas</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-[#fabc3f]/10">
                            <p className="text-gray-300 flex items-center gap-2">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                                  stroke="#fabc3f"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                  stroke="#fabc3f"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {property.location}
                            </p>
                            <p className="text-[#fabc3f]/80 text-sm mt-1">ID: {property.id}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:-left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#0c1e20]/80 text-white hover:bg-[#0c1e20] hover:text-[#fabc3f] backdrop-blur-sm border border-[#fabc3f]/20 shadow-lg transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:-right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#0c1e20]/80 text-white hover:bg-[#0c1e20] hover:text-[#fabc3f] backdrop-blur-sm border border-[#fabc3f]/20 shadow-lg transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <div className="flex gap-3">
            {groups.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-[#fabc3f] w-8" : "bg-gray-600 hover:bg-gray-500"
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            className="group relative overflow-hidden text-[#fabc3f] hover:text-[#0c1e20] px-8 py-4 text-lg font-semibold border border-[#fabc3f] rounded-lg transition-all duration-300"
            onClick={() => router.push("/imoveis")}
          >
            <span className="relative z-10">
              Ver todos os imóveis
              <svg
                className="ml-2 h-5 w-5 inline-block transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5L16 12L9 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="absolute inset-0 bg-[#fabc3f] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
          </Button>
        </div>
      </div>
    </section>
  )
}
