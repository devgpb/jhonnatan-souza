"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building2, Home, Settings, Users2 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Imóveis", href: "/admin/properties", icon: Building2 },
  { name: "Corretores", href: "/admin/brokers", icon: Users2 },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
]

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="px-8 flex h-16 items-center">
        <Link href="/admin" className="font-bold text-xl">
          Liecon Admin
        </Link>
        <nav className="flex items-center gap-1 ml-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

