"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"
import EnterLogo from "./ui/enter-logo"

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <footer ref={footerRef} className="bg-primario text-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-12 gap-8 py-20" style={{ borderBottom: "2px solid #fabc3f" }}>
          {/* Logo and Description - Logo remains static */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="h-[200px]">
              <Link href="/" className="inline-block" style={{ height: 120 }}>
                <EnterLogo className="w-full h-full" />
              </Link>
            </div>
            <p
              className={`text-gray-400 leading-relaxed transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Conectamos compradores e vendedores a corretores especialistas com acesso ao maior portfólio de imóveis de
              alto padrão de São Paulo.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-6 lg:col-span-2 space-y-6">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Empresa
            </h3>
            <ul className="space-y-4">
              {["Sobre nós", "Seja um Parceiro", "Carreiras", "Blog"].map((item, index) => (
                <li
                  key={item}
                  className={`transition-all duration-700 delay-${index * 100} ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-white transition-colors relative group"
                  >
                    {item}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2 space-y-6">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Imóveis
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Apartamentos", path: "/imoveis/apartamentos" },
                { name: "Casas", path: "/imoveis/casas" },
                { name: "Coberturas", path: "/imoveis/coberturas" },
                { name: "Exclusivos", path: "/exclusivos" },
              ].map((item, index) => (
                <li
                  key={item.name}
                  className={`transition-all duration-700 delay-${index * 100 + 200} ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  <Link href={item.path} className="text-gray-400 hover:text-white transition-colors relative group">
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <h3
              className={`text-sm font-semibold uppercase tracking-wider transition-all duration-700 ${
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              Contato
            </h3>
            <div className="space-y-4">
              <div
                className={`flex items-start gap-2 transition-all duration-700 delay-300 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
              >
                <MapPin className="h-5 w-5 text-[#fabc3f] mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  Rua dos Pinheiros, 1673 - Pinheiros
                  <br />
                  São Paulo - SP, 05422-012
                </p>
              </div>
              <div
                className={`flex items-center gap-2 transition-all duration-700 delay-400 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
              >
                <Phone className="h-5 w-5 text-[#fabc3f] flex-shrink-0" />
                <a
                  href="tel:+551193502-5003"
                  className="text-gray-400 hover:text-white transition-colors relative group"
                >
                  +55 (11) 93502-5003
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div
                className={`flex items-center gap-2 transition-all duration-700 delay-500 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
              >
                <Mail className="h-5 w-5 text-[#fabc3f] flex-shrink-0" />
                <a
                  href="mailto:contato@jhonnathan.com.br"
                  className="text-gray-400 hover:text-white transition-colors relative group"
                >
                  contato@jhonnathan.com.br
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div
                className={`flex items-start gap-2 transition-all duration-700 delay-600 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
              >
                <Clock className="h-5 w-5 text-[#fabc3f] mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  Segunda a Sexta: 9h às 18h
                  <br />
                  Sábado: 9h às 13h
                </p>
              </div>
              <div
                className={`flex items-center gap-2  transition-all duration-700 delay-700 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-[#fabc3f] transition-all duration-300  rounded-full"
                >
                  <Instagram className="h-5 w-5 flex-shrink-0" />

                </a>
                  <p className="text-gray-400">@Jhonsouza</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div
            className={`flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-800 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Jhonnathan. CRECI 39836-J. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              {["Política de Privacidade", "Termos de Uso", "Política de Cookies"].map((item, index) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, "-").replace(/í/g, "i")}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#fabc3f] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
