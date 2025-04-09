"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Menu, Search, X, User, ArrowRight, Building2, Home, Building, ChevronDown, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Image from "next/image"
import EnterLogo from "./ui/enter-logo"
import { supabase } from "@/lib/supabase"

// Tipar as propriedades, permitindo receber "background"
interface NavBarProps {
  background?: boolean
}

interface Property {
  id: string
  title: string
  price: number
  images: string[]
  location: string
}

// Cada "categoria" do drop-down
interface CategoryType {
  name: string
  icon: any
  href: string
  description: string
  featured: Property[] // Aqui guardamos até 5 imóveis de destaque
}

export function NavBar({ background = false }: NavBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredType, setHoveredType] = useState("Apartamentos")
  const [isBackgroundActive, setIsBackgroundActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [popularLocations, setPopularLocations] = useState<string[]>([])



  // Estado que substitui seus mocks
  const [categories, setCategories] = useState<CategoryType[]>([
    {
      name: "Apartamentos",
      icon: Building2,
      href: "/imoveis/apartamentos",
      description: "Encontre seu apartamento ideal em localização privilegiada",
      featured: [],
    },
    {
      name: "Casas",
      icon: Home,
      href: "/imoveis/casas",
      description: "Descubra casas exclusivas com todo o conforto para sua família",
      featured: [],
    },
    {
      name: "Coberturas",
      icon: Building,
      href: "/imoveis/coberturas",
      description: "Explore coberturas de alto padrão com vistas deslumbrantes",
      featured: [],
    },
  ])

  useEffect(() => {
    // Se background=true, força o fundo escuro e não adiciona listener de scroll
    if (background) {
      setIsBackgroundActive(true)
      return
    }

    function handleScroll() {
      if (window.scrollY > 200) {
        setIsBackgroundActive(true)
      } else {
        setIsBackgroundActive(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [background])

  useEffect(() => {
    // Carrega dados da API e separa por categoria
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties")
        const json = await res.json()

        // supomos que vem { data: [] }
        const allProps: Property[] = Array.isArray(json.data) ? json.data : []

        const normalize = (txt: string) =>
          txt
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")

        // Filtra por palavra-chave no título
        const apartments = allProps.filter((p) => normalize(p.title).includes("apartamento"))
        const houses = allProps.filter((p) => normalize(p.title).includes("casa"))
        const penthouses = allProps.filter((p) => normalize(p.title).includes("cobertura"))

        // Seleciona 5 imóveis de destaque
        function getFeatured(list: Property[]) {
          return list.slice(0, 5)
        }

        setCategories([
          {
            name: "Apartamentos",
            icon: Building2,
            href: "/apartamentos",
            description: "Encontre seu apartamento ideal em localização privilegiada",
            featured: getFeatured(apartments),
          },
          {
            name: "Casas",
            icon: Home,
            href: "/casas",
            description: "Descubra casas exclusivas com todo o conforto para sua família",
            featured: getFeatured(houses),
          },
          {
            name: "Coberturas",
            icon: Building,
            href: "/coberturas",
            description: "Explore coberturas de alto padrão com vistas deslumbrantes",
            featured: getFeatured(penthouses),
          },
        ])
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error)
      }
    }

    fetchProperties()
  }, [])

  // Focus the search input when the search bar is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 300)
    }
  }, [isSearchOpen])

  // Sugestões de busca
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  
    if (value.length < 2) {
      setSuggestions([])
      return
    }
  
    try {
      const res = await fetch(`/api/search-suggestion?query=${encodeURIComponent(value)}`)
      const json = await res.json()
      setSuggestions(json.suggestions || [])
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
    }
  }
  
  useEffect(() => {
    async function fetchPopularLocations() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("location")
        
        if (error) throw error
  
        const uniqueLocations = Array.from(new Set(data.map(item => item.location).filter(Boolean)))
  
        setPopularLocations(uniqueLocations)
      } catch (err) {
        console.error("Erro ao buscar bairros populares:", err)
      }
    }
  
    fetchPopularLocations()
  }, [])
  

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    })
  }
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!searchQuery.trim()) return
  
    const query = encodeURIComponent(searchQuery.trim())
  
    router.push(`/imoveis?search=${query}`)
    setIsSearchOpen(false)
  }

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 
        transition-all duration-500 ease-in-out
        ${
          isBackgroundActive
            ? "bg-gradient-to-b from-[#0c1e20] to-[#132e30] shadow-lg backdrop-blur-lg"
            : "bg-transparent"
        }
      `}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-bold text-2xl sm:text-3xl mt-2 tracking-tight text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)] flex items-center"
          style={{ height: "100%" }}
        >
          <EnterLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-lg font-medium transition-colors relative group">
            <span className="text-[#fabc3f] font-semibold drop-shadow-sm">Início</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Dropdown Imóveis */}
          <div className="relative group">
            <Link
              href="/imoveis"
              className="text-lg font-medium transition-colors inline-flex items-center gap-1 relative"
            >
              <span className="text-[#fabc3f] font-semibold drop-shadow-sm">Imóveis</span>
              <ChevronDown className="h-4 w-4 text-[#fabc3f] transition-transform duration-300 group-hover:-rotate-180" />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div
                className="bg-gradient-to-br from-[#132e30] to-[#0c1e20] rounded-xl overflow-hidden flex min-w-[800px] shadow-2xl border border-[#fabc3f]/20"
                style={{ backdropFilter: "blur(10px)" }}
              >
                {/* Coluna 1 */}
                <div className="w-[300px] p-6 border-r border-[#fabc3f]/10">
                  <h3 className="text-lg font-bold mb-4 text-[#fabc3f] flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                        stroke="#fabc3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 22V12H15V22"
                        stroke="#fabc3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Categorias de Imóveis
                  </h3>
                  <div className="space-y-2">
                    {categories.map((type) => (
                      <div
                        key={type.name}
                        onMouseEnter={() => setHoveredType(type.name)}
                        className={`rounded-lg transition-all duration-300 ${
                          hoveredType === type.name
                            ? "bg-[#fabc3f]/10 border-l-2 border-[#fabc3f]"
                            : "border-l-2 border-transparent"
                        }`}
                      >
                        <Link href={type.href} className="flex items-center gap-3 py-3 px-4 transition-colors group">
                          <div
                            className={`p-2 rounded-full ${
                              hoveredType === type.name ? "bg-[#fabc3f]/20" : "bg-[#fabc3f]/5"
                            }`}
                          >
                            <type.icon className="h-5 w-5 text-[#fabc3f]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white">{type.name}</span>
                            <span className="text-sm text-gray-300">{type.description}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Coluna 2 */}
                <div className="flex-1 p-6">
                  {hoveredType && categories.find((t) => t.name === hoveredType) && (
                    <div>
                      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-[#fabc3f]">{hoveredType}</span> em destaque
                      </h4>
                      <div className="space-y-1">
                        {categories
                          .find((t) => t.name === hoveredType)
                          ?.featured.map((item) => (
                            <Link
                              key={item.id}
                              href={`/imovel/${item.id}`}
                              className="flex items-center gap-4 p-3 hover:bg-[#fabc3f]/10 rounded-lg transition-all duration-200 group"
                            >
                              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-[#fabc3f]/20">
                                <Image
                                  src={item.images?.[0] || "/placeholder.svg"}
                                  alt={item.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="font-medium text-white line-clamp-1">{item.title}</span>
                                <span className="text-[#fabc3f] font-bold">{formatPrice(item.price)}</span>
                                <span className="text-xs text-gray-300 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-[#fabc3f]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="h-4 w-4 text-[#fabc3f]" />
                              </div>
                            </Link>
                          ))}
                        <div className="pt-4 mt-4 border-t border-[#fabc3f]/10">
                          <Link
                            href={categories.find((t) => t.name === hoveredType)?.href || "#"}
                            className="inline-flex items-center gap-2 text-[#fabc3f] hover:text-[#fabc3f]/80 font-semibold group"
                          >
                            Ver todos os {hoveredType.toLowerCase()}
                            <span className="w-6 h-6 rounded-full bg-[#fabc3f]/10 flex items-center justify-center group-hover:bg-[#fabc3f]/20 transition-colors">
                              <ArrowRight className="h-3 w-3 text-[#fabc3f]" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Fim dropdown Imóveis */}

          <Link href="/sobre" className="text-lg font-medium transition-colors relative group">
            <span className="text-[#fabc3f] font-semibold drop-shadow-sm">Sobre</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contato" className="text-lg font-medium transition-colors relative group">
            <span className="text-[#fabc3f] font-semibold drop-shadow-sm">Contato</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`h-10 w-10 rounded-full transition-all duration-300 ${
              isSearchOpen
                ? "bg-[#fabc3f] text-[#0c1e20] rotate-90"
                : "bg-[#fabc3f]/10 hover:bg-[#fabc3f]/20 text-[#fabc3f]"
            }`}
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 text-[#fabc3f] font-semibold drop-shadow-sm hover:text-[#fabc3f]/80 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            Entrar
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 rounded-full bg-[#fabc3f]/10 hover:bg-[#fabc3f]/20 text-[#fabc3f]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-gradient-to-br from-[#132e30] to-[#0c1e20] border-l border-[#fabc3f]/20"
            >
              <nav className="flex flex-col gap-8 pt-8">
                <Link
                  href="/"
                  className="text-xl font-semibold text-[#fabc3f] hover:text-[#fabc3f]/80 transition-colors flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
                    <Home className="h-5 w-5" />
                  </div>
                  Início
                </Link>
                <div className="space-y-4">
                  <Link
                    href="/imoveis"
                    className="text-xl font-semibold text-[#fabc3f] hover:text-[#fabc3f]/80 transition-colors flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5" />
                    </div>
                    Imóveis
                  </Link>
                  <div className="pl-12 space-y-3 border-l border-[#fabc3f]/20">
                    {categories.map((type) => (
                      <Link
                        key={type.name}
                        href={type.href}
                        className="block text-white hover:text-[#fabc3f] transition-colors"
                      >
                        {type.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/sobre"
                  className="text-xl font-semibold text-[#fabc3f] hover:text-[#fabc3f]/80 transition-colors flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16V12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 8H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Sobre
                </Link>
                <Link
                  href="/contato"
                  className="text-xl font-semibold text-[#fabc3f] hover:text-[#fabc3f]/80 transition-colors flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 16.92V19.92C22 20.4704 21.7893 20.9991 21.4142 21.3742C21.0391 21.7493 20.5104 21.96 19.96 21.96C19.3167 21.9544 18.6771 21.8468 18.06 21.64C17.4168 21.4194 16.8016 21.1265 16.23 20.77C15.6168 20.3919 15.0413 19.9585 14.51 19.48C13.9867 18.9475 13.5133 18.3721 13.1 17.76C12.7415 17.1895 12.4414 16.5779 12.21 15.94C11.9972 15.3229 11.8824 14.6833 11.87 14.04C11.8663 13.4933 12.0719 12.9646 12.4438 12.5871C12.8156 12.2097 13.3407 11.9941 13.887 11.99H16.887C17.3043 11.9839 17.7077 12.1338 18.0177 12.416C18.3277 12.6983 18.5233 13.0894 18.567 13.51C18.6451 14.3385 18.8067 15.1559 19.05 15.95C19.1411 16.2445 19.1312 16.5614 19.0217 16.8496C18.9123 17.1377 18.7102 17.3796 18.447 17.54L17.407 18.11C17.8559 19.0902 18.4676 19.9777 19.2 20.73C19.9522 21.4624 20.8397 22.0741 21.82 22.523L22.39 21.483C22.5504 21.2198 22.7923 21.0177 23.0804 20.9083C23.3686 20.7988 23.6855 20.7889 23.98 20.88C24.7741 21.1233 25.5915 21.2849 26.42 21.363C26.8406 21.4067 27.2317 21.6023 27.514 21.9123C27.7962 22.2223 27.9461 22.6257 27.94 23.043L22 16.92Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Contato
                </Link>
                <Link
                  href="/login"
                  className="text-xl font-semibold text-[#fabc3f] hover:text-[#fabc3f]/80 transition-colors flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#fabc3f]/10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  Entrar
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Barra de busca expansível com design aprimorado */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isSearchOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
          bg-gradient-to-r from-[#0c1e20] to-[#132e30]
          border-t border-b border-[#fabc3f]/20 backdrop-blur-lg
        `}
      >
        <div className="container py-6">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            <div className="relative">
              <div
                className={`
                absolute left-4 top-1/2 -translate-y-1/2 
                transition-all duration-300
                ${isFocused ? "text-[#fabc3f]" : "text-gray-400"}
              `}
              >
                <Search className="h-5 w-5" />
              </div>

              <input
                ref={searchInputRef}
                type="search"
                placeholder="Buscar imóveis, localizações, características..."
                value={searchQuery}
                onChange={handleInputChange} 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full pl-12 pr-12 py-4 
                  bg-[#fabc3f]/5 
                  rounded-xl
                  text-lg text-white 
                  placeholder:text-gray-400
                  transition-all duration-300 ease-in-out
                  border-2
                  ${
                    isFocused
                      ? "border-[#fabc3f] shadow-[0_0_15px_rgba(250,188,63,0.15)] bg-[#fabc3f]/10"
                      : "border-transparent hover:bg-[#fabc3f]/8"
                  }
                  focus:outline-none
                `}
              />

              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-[#fabc3f]/10 text-gray-400 hover:text-[#fabc3f] flex items-center justify-center transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sugestões dinâmicas */}
            {suggestions.length > 0 && (
              <div className="bg-[#0c1e20] rounded-lg mt-2 border border-[#fabc3f]/20">
                {suggestions.map((suggestion, index) => (
                 <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const query = encodeURIComponent(suggestion)
                     router.push(`/imoveis?search=${query}`)
                      setIsSearchOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#fabc3f]/10 text-white transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Bairros sugeridos */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-grow bg-[#fabc3f]/10"></div>
                <span className="text-sm text-gray-400">Explore também</span>
                <div className="h-px flex-grow bg-[#fabc3f]/10"></div>
              </div>

              <div className="flex flex-wrap gap-2">
                {popularLocations.map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const query = encodeURIComponent(location)
                      router.push(`/imoveis?search=${query}`)
                      setIsSearchOpen(false)
                    }}
                    className={`
                      px-4 py-2 rounded-full text-sm
                      transition-all duration-300
                      ${
                        searchQuery === location
                          ? "bg-[#fabc3f] text-[#0c1e20] font-medium"
                          : "bg-[#fabc3f]/10 text-gray-300 hover:bg-[#fabc3f]/20 hover:text-white"
                      }
                    `}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Search button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className={`
                  bg-[#fabc3f] hover:bg-[#fabc3f]/90 text-[#0c1e20] 
                  px-6 py-3 rounded-lg font-medium
                  transition-all duration-300
                  flex items-center gap-2
                  ${searchQuery ? "opacity-100 translate-y-0" : "opacity-70 translate-y-1"}
                `}
                disabled={!searchQuery}
              >
                <Search className="h-4 w-4" />
                Buscar Imóveis
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  )
}
