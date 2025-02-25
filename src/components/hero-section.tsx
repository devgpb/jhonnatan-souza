"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Typewriter } from './ui/typewriter'
import { Button } from "./ui/button"

const slides = [
  {
    image: "/images/imoveis/imovel-1.jpg",
    title: "Descubra seu Lugar Ideal",
    description: "Imóveis exclusivos em localizações privilegiadas",
  },
  {
    image: "/images/imoveis/imovel-5.jpg",
    title: "Experiência Premium",
    description: "Residências únicas com acabamento excepcional",
  },
  {
    image: "/images/imoveis/imovel-11.jpg",
    title: "Viva com Estilo",
    description: "Ambientes sofisticados para uma vida extraordinária",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [offset, setOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setOffset(-rect.top * 0.2)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div ref={containerRef} className="relative h-[95vh] w-[full] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0" style={{ transform: `translateY(${offset}px)` }}>
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              layout = "fill"
              objectFit="cover"
              priority={index === 0}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center text-white space-y-4 sm:space-y-6 max-w-4xl px-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <Typewriter text={slides[currentSlide].title} />
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light">
            {slides[currentSlide].description}
          </p>
        </div>

        <Button className="mt-6 sm:mt-8 px-12 py-6 border border-white text-white bg-transparent hover:bg-white/10 text-lg sm:text-xl font-semibold rounded-md">
          Veja os imóveis
        </Button>
      </div>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border border-white/20"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 sm:h-6 w-5 sm:w-6" />
        </Button>
        <div className="flex gap-1 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-8 sm:w-12 h-1 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/30"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 border border-white/20"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 sm:h-6 w-5 sm:w-6" />
        </Button>
      </div>
    </div>
  )
}
