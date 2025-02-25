import { Button } from "./button"
import { ArrowRight, Heart, Mail, Plus } from "lucide-react"

export function ButtonDemo() {
  return (
    <div className="p-12 space-y-8">
      {/* Seção de variantes básicas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Variantes Básicas</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>

      {/* Seção de variantes personalizadas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Variantes Personalizadas</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            Começar Agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="accent">
            <Heart className="mr-2 h-4 w-4" />
            Favoritos
          </Button>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg">
            <Button variant="glass">Efeito Glass</Button>
          </div>
          <Button variant="glass-dark">Glass Dark</Button>
        </div>
      </div>

      {/* Seção de tamanhos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Tamanhos</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Seção de larguras */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Larguras</h2>
        <div className="space-y-4 max-w-md">
          <Button width="default">Largura Padrão</Button>
          <Button width="full">Largura Total</Button>
        </div>
      </div>

      {/* Seção de estados */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Estados</h2>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Desabilitado</Button>
          <Button variant="primary" disabled>
            Desabilitado Primary
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Com Ícone
          </Button>
        </div>
      </div>
    </div>
  )
}

