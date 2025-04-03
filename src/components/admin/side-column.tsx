"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Home, Settings, Users2 } from "lucide-react"
import { useRouter } from "next/router"


const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Imóveis", href: "/admin", icon: Building2 },
  { name: "Corretores", href: "/admin/corretor", icon: Users2 },
  //{ name: "Configurações", href: "/admin/settings", icon: Settings },
]

export function SideColumn() {
  const pathname = usePathname()
  const router = useRouter();

  const handleImoveis = (href: string) => {
    router.push(href); 
  }

  return (
    <div className="w-64 h-screen border-r border-gray-300 bg-[#F7F7F7] flex flex-col fixed left-0 top-0">
      <div className="border-b bg-white">
        <h1 className="px-4 py-4 text-xl font-semibold">Jhonnathan Admin</h1>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Menu */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:bg-white/60 hover:text-black"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Filtros */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Filtros Rápidos</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
              onClick={() => handleImoveis("/admin/listagem")}>
              Disponíveis
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
             onClick={() => handleImoveis("/admin/listagem")}>
              Vendidos
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
             onClick={() => handleImoveis("/admin/listagem")}>
              Em Destaque
            </button>
          </div>
        </div>

        {/* Tipo de Imóvel */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Tipo de Imóvel</h3>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
             onClick={() => handleImoveis("/admin/listagem")}>
              Apartamentos
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
             onClick={() => handleImoveis("/admin/listagem")}>
              Casas
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-white/60 rounded-md"
             onClick={() => handleImoveis("/admin/listagem")}>
              Coberturas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

