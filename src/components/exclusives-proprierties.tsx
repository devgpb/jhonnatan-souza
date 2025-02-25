"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Link } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/router";

// Dados simulados dos imóveis
const properties = [
  {
    id: "MO2801",
    image: "/images/imoveis/imovel-5.jpg?height=400&width=600",
    price: 18000000,
    area: 600,
    suites: 6,
    parking: 6,
    location: "Cobertura em Jardim América, São Paulo - SP",
    agent: {
      name: "Anna Gama",
      company: "Jhonnathan",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "PI252",
    image: "/images/imoveis/imovel-1.jpg?height=400&width=600",
    price: 7950000,
    area: 420,
    suites: 3,
    parking: 3,
    location: "Casa de condomínio em Cidade Jardim, São Paulo - SP",
    agent: {
      name: "Giselo Schmidt",
      company: "Pitaya",
      avatar: "/images/corretores/user-01.png?height=40&width=40",
    },
  },
  {
    id: "FB21082",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 6000000,
    area: 230,
    suites: 4,
    parking: 3,
    location: "Apartamento em Pinheiros, São Paulo - SP",
    agent: {
      name: "Gabriela Donat",
      company: "First Boutique",
      avatar: "/images/corretores/user-02.png?height=40&width=40",
    },
  },
  // Mais 6 propriedades para completar as 9 abas:
  {
    id: "MO2802",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 15000000,
    area: 550,
    suites: 5,
    parking: 4,
    location: "Cobertura em Moema, São Paulo - SP",
    agent: {
      name: "Pedro Silva",
      company: "Jhonnathan",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "PI253",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 8500000,
    area: 480,
    suites: 4,
    parking: 4,
    location: "Casa em Alto de Pinheiros, São Paulo - SP",
    agent: {
      name: "Maria Santos",
      company: "Pitaya",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "FB21083",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 5500000,
    area: 200,
    suites: 3,
    parking: 2,
    location: "Apartamento na Vila Nova Conceição, São Paulo - SP",
    agent: {
      name: "Carlos Mendes",
      company: "First Boutique",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "MO2803",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 12000000,
    area: 400,
    suites: 4,
    parking: 3,
    location: "Apartamento no Itaim, São Paulo - SP",
    agent: {
      name: "Laura Costa",
      company: "Jhonnathan",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "PI254",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 9500000,
    area: 520,
    suites: 5,
    parking: 4,
    location: "Casa em Alphaville, São Paulo - SP",
    agent: {
      name: "Roberto Alves",
      company: "Pitaya",
      avatar: "/images/corretores/user-02.png",
    },
  },
  {
    id: "FB21084",
    image: "/images/imoveis/imovel-11.jpg?height=400&width=600",
    price: 7200000,
    area: 280,
    suites: 3,
    parking: 2,
    location: "Apartamento nos Jardins, São Paulo - SP",
    agent: {
      name: "Ana Paula",
      company: "First Boutique",
      avatar: "/images/corretores/user-02.png",
    },
  },
]

export function ExclusiveProperties() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [groupSize, setGroupSize] = useState(1)
  const router = useRouter();

  // Atualiza o groupSize com base na largura da tela (mobile: <768px)
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

  // Agrupa as propriedades conforme o groupSize
  const groups = []
  for (let i = 0; i < properties.length; i += groupSize) {
    groups.push(properties.slice(i, i + groupSize))
  }
  const totalSlides = groups.length

  // Garante que o slide atual esteja dentro dos limites quando o groupSize mudar
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

  // Timer: avança o slide automaticamente a cada 10 segundos
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
    <section  style={{ backgroundColor: "#132e30" }} className="py-12 sm:py-16">
      <div className="container px-4 sm:px-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-8 rotate-180">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 5L16 12L9 19"
                stroke="#fabc3f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8" style={{ color: "#fabc3f" }}
            >Exclusivos Jhonnathan</h2>
            <p className="text-gray-400" style={{ color: "#fabc3f" }}
            >Imóveis únicos, listados apenas no Jhonnathan.</p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {groups.map((group, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-none grid gap-4 sm:gap-6"
                  style={{ gridTemplateColumns: `repeat(${groupSize}, minmax(0, 1fr))` }}
                >
                  {group.map((property) => (
                    <Card key={property.id}  style={{ backgroundColor: "#1c3e40" }} className="cursor-pointer  border-yellow-800 overflow-hidden group"
                    onClick={() => router.push(`/imovel/${property.id}`)}>
                      <div className="relative">
                        {/* Imagem e badge */}
                        <div className="relative aspect-[4/3]">
                          <Badge className="absolute top-4 left-4 z-10 bg-black/80 text-white border-none">
                            Exclusivo
                          </Badge>
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.location}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Informações do corretor com efeito glass */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-3 flex items-center gap-3">
                            <Image
                              src={property.agent.avatar || "/placeholder.svg"}
                              alt={property.agent.name}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-white/10"
                            />
                            <div>
                              <p className="text-white text-sm font-medium">{property.agent.name}</p>
                              <p className="text-gray-300 text-xs">{property.agent.company}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="space-y-2">
                          <p className="text-xl sm:text-2xl font-semibold text-white">{formatPrice(property.price)}</p>
                          <div className="flex gap-2 text-sm" style={{ color: "#fabc3f" }}>
                            <span>{property.area}m² área útil</span>
                            <span>•</span>
                            <span>{property.suites} suítes</span>
                            <span>•</span>
                            <span>{property.parking} vagas</span>
                          </div>
                          <p className="text-gray-400 text-sm sm:text-base" style={{ color: "#fabc3f" }}>{property.location}</p>
                          <p className="text-gray-400 text-sm sm:text-base" style={{ color: "#fabc3f" }}>{property.id}</p>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 sm:h-8 w-6 sm:w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 sm:h-8 w-6 sm:w-8" />
          </Button>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-2">
            {groups.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-gray-600"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            className="text-[#D4B78F] hover:text-[#D4B78F] hover:bg-[#D4B78F]/10 px-6 py-3 text-lg font-medium border border-[#D4B78F]/20 hover:border-[#D4B78F]/40 transition-all duration-300"
          >
            Ver todos
            <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  )
}
