import Link from "next/link"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container">
        <div className="grid grid-cols-12 gap-8 py-20">
          {/* Logo and Description */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold">Liecon</h2>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Conectamos compradores e vendedores a corretores especialistas com acesso ao maior portfólio de imóveis de
              alto padrão de São Paulo.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/liecon"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-6 lg:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Empresa</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/parceiros" className="text-gray-400 hover:text-white transition-colors">
                  Seja um Parceiro
                </Link>
              </li>
              <li>
                <Link href="/carreiras" className="text-gray-400 hover:text-white transition-colors">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-6 lg:col-span-2 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Imóveis</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/imoveis/apartamentos" className="text-gray-400 hover:text-white transition-colors">
                  Apartamentos
                </Link>
              </li>
              <li>
                <Link href="/imoveis/casas" className="text-gray-400 hover:text-white transition-colors">
                  Casas
                </Link>
              </li>
              <li>
                <Link href="/imoveis/coberturas" className="text-gray-400 hover:text-white transition-colors">
                  Coberturas
                </Link>
              </li>
              <li>
                <Link href="/exclusivos" className="text-gray-400 hover:text-white transition-colors">
                  Exclusivos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contato</h3>
            <div className="space-y-4">
              <p className="text-gray-400">
                Rua dos Pinheiros, 1673 - Pinheiros
                <br />
                São Paulo - SP, 05422-012
              </p>
              <div>
                <a href="tel:+551193502-5003" className="text-gray-400 hover:text-white transition-colors">
                  +55 (11) 93502-5003
                </a>
              </div>
              <div>
                <a href="mailto:contato@liecon.com.br" className="text-gray-400 hover:text-white transition-colors">
                  contato@liecon.com.br
                </a>
              </div>
              <p className="text-gray-400">
                Segunda a Sexta: 9h às 18h
                <br />
                Sábado: 9h às 13h
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Liecon. CRECI 39836-J. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacidade" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="text-sm text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

