"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Menu, 
  Search, 
  X, 
  User, 
  ArrowRight, 
  Building2, 
  Home, 
  Building, 
  ChevronDown 
} from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Image from "next/image"

// Tipar as propriedades, permitindo receber "background"
interface NavBarProps {
  background?: boolean
}

const propertyTypes = [
  {
    name: "Apartamentos",
    icon: Building2,
    href: "/imoveis/apartamentos",
    description: "Encontre seu apartamento ideal em localização privilegiada",
    featured: [
      {
        name: "Apartamento com 4 suítes no Itaim",
        price: "R$ 8.500.000",
        href: "/imoveis/apartamentos/itaim-4-suites",
      },
      {
        name: "Apartamento com vista para o parque",
        price: "R$ 6.200.000",
        href: "/imoveis/apartamentos/vista-parque",
      },
      { 
        name: "Garden de 300m² na Vila Nova", 
        price: "R$ 12.000.000", 
        href: "/imoveis/apartamentos/garden-vila-nova" 
      },
      {
        name: "Apartamento decorado nos Jardins",
        price: "R$ 5.800.000",
        href: "/imoveis/apartamentos/decorado-jardins",
      },
      { 
        name: "Duplex com terraço em Moema", 
        price: "R$ 7.300.000", 
        href: "/imoveis/apartamentos/duplex-moema" 
      },
    ],
  },
  {
    name: "Casas",
    icon: Home,
    href: "/imoveis/casas",
    description: "Descubra casas exclusivas com todo o conforto para sua família",
    featured: [
      { name: "Casa com piscina no Alto de Pinheiros", price: "R$ 15.000.000", href: "/imoveis/casas/alto-pinheiros" },
      { name: "Casa em condomínio no Morumbi", price: "R$ 8.900.000", href: "/imoveis/casas/morumbi" },
      { name: "Casa contemporânea no Jardim Europa", price: "R$ 22.000.000", href: "/imoveis/casas/jardim-europa" },
      { name: "Casa com jardim no Jardim Guedala", price: "R$ 12.500.000", href: "/imoveis/casas/jardim-guedala" },
      { name: "Casa de vila no Itaim", price: "R$ 6.800.000", href: "/imoveis/casas/vila-itaim" },
    ],
  },
  {
    name: "Coberturas",
    icon: Building,
    href: "/imoveis/coberturas",
    description: "Explore coberturas de alto padrão com vistas deslumbrantes",
    featured: [
      { name: "Cobertura duplex com piscina", price: "R$ 18.000.000", href: "/imoveis/coberturas/duplex-piscina" },
      { name: "Cobertura com vista 360º", price: "R$ 25.000.000", href: "/imoveis/coberturas/vista-360" },
      { name: "Cobertura garden em Moema", price: "R$ 15.500.000", href: "/imoveis/coberturas/garden-moema" },
      {
        name: "Cobertura reformada nos Jardins",
        price: "R$ 20.000.000",
        href: "/imoveis/coberturas/reformada-jardins",
      },
      { name: "Cobertura com terraço gourmet", price: "R$ 16.800.000", href: "/imoveis/coberturas/terraco-gourmet" },
    ],
  },
]

export function NavBar({ background = false }: NavBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredType, setHoveredType] = useState("Apartamentos")
  const [isBackgroundActive, setIsBackgroundActive] = useState(false)

  useEffect(() => {
    // Se background=true, força o fundo escuro e não adiciona listener de scroll
    if (background) {
      setIsBackgroundActive(true)
      return
    }

    // Caso contrário, adiciona listener para controlar a transição
    function handleScroll() {
      // Se quiser que o fundo ative depois de qq scroll, pode usar window.scrollY > 0
      // Se quiser que seja depois de 200px, mude para > 200
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

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 
        transition-colors duration-300 ease-in-out
        ${isBackgroundActive ? "bg-black" : "bg-transparent"}
      `}
    >
      <div className="container flex h-20 items-center justify-between">
      <Link
        href="/"
        className="font-bold text-2xl sm:text-3xl mt-2 tracking-tight text-white drop-shadow-[0_0_1px_rgba(0,0,0,1)] flex items-center"
      >
        <Image
          src="/marca/icone.svg"
          alt="Logo Jhonnatan"
          width={50}
          height={50}
          className="w-10 h-auto sm:w-12"
        />
      </Link>


        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-lg font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
            style={{ color: "#fabc3f" }}
          >
            Início
          </Link>

          {/* Dropdown Imóveis */}
          <div className="relative group cursor-pointer">
            <Link
              href="/imoveis"
              className="text-lg font-medium hover:text-primary transition-colors inline-flex items-center gap-1 text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
              style={{ color: "#fabc3f" }}
            >
              Imóveis
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-180" />
            </Link>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white rounded-lg overflow-hidden flex min-w-[800px] shadow-xl border">
                {/* Coluna 1 */}
                <div className="w-[300px] p-6 border-r">
                  <h3 className="text-lg font-semibold mb-4">Explore por imóveis</h3>
                  <div className="space-y-1">
                    {propertyTypes.map((type) => (
                      <div
                        key={type.name}
                        onMouseEnter={() => setHoveredType(type.name)}
                        className={`rounded-lg transition-colors ${
                          hoveredType === type.name ? "bg-muted" : ""
                        }`}
                      >
                        <Link href={type.href} className="flex items-center gap-2 py-3 px-3 transition-colors group">
                          <type.icon className="h-5 w-5 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-medium">{type.name}</span>
                            <span className="text-sm text-muted-foreground">{type.description}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Coluna 2 */}
                <div className="flex-1 p-6">
                  {hoveredType && propertyTypes.find((t) => t.name === hoveredType) && (
                    <div>
                      <h4 className="font-semibold mb-4">{hoveredType} em destaque</h4>
                      <div className="space-y-3">
                        {propertyTypes
                          .find((t) => t.name === hoveredType)
                          ?.featured.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between py-2 hover:bg-muted px-3 rounded-lg transition-colors group"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm text-muted-foreground">{item.price}</span>
                              </div>
                              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        <div className="pt-3 mt-3 border-t">
                          <Link
                            href={
                              propertyTypes.find((t) => t.name === hoveredType)?.href || "#"
                            }
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                          >
                            Ver todos os {hoveredType.toLowerCase()}
                            <ArrowRight className="h-4 w-4" />
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

          <Link
            href="/sobre"
            className="text-lg font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
            style={{ color: "#fabc3f" }}
          >
            Sobre
          </Link>
          <Link
            href="/contato"
            className="text-lg font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
            style={{ color: "#fabc3f" }}
          >
            Contato
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="h-12 w-12"
          >
            <Search className="h-6 w-6" />
          </Button>

          <Link
            href="/login"
            className="hidden md:flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
            style={{ color: "#fabc3f" }}
          >
            <User className="h-6 w-6" />
            Entrar
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-12 w-12">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-8 pt-8">
                <Link
                  href="/"
                  className="text-xl font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                >
                  Início
                </Link>
                <div className="space-y-4">
                  <Link
                    href="/imoveis"
                    className="text-xl font-medium inline-flex items-center gap-1 text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                  >
                    Imóveis
                  </Link>
                </div>
                <Link
                  href="/sobre"
                  className="text-xl font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                >
                  Sobre
                </Link>
                <Link
                  href="/contato"
                  className="text-xl font-medium hover:text-primary transition-colors text-white font-bold drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                >
                  Contato
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-3 text-xl font-medium hover:text-primary transition-colors"
                >
                  <User className="h-6 w-6" />
                  Entrar
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Barra de busca expansível */}
      <div
        className={`
          border-t overflow-hidden 
          transition-all duration-300 ease-in-out
          ${isSearchOpen ? "h-[84px] opacity-100" : "h-0 opacity-0"}
        `}
      >
        <div className="container py-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar imóveis..."
              className="w-full pl-12 pr-4 py-4 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary transform transition-transform duration-300 ease-in-out text-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
