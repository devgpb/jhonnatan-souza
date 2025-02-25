import Link from "next/link"
import { Building2, HandshakeIcon, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Building2,
    title: "Maior portfólio de alto padrão em SP",
    description: "Acesso exclusivo a um portfólio robusto, construído por profissionais líderes no segmento.",
  },
  {
    icon: HandshakeIcon,
    title: "Conexão direta com especialistas",
    description: "Corretores com acesso ao portfólio completo, garantindo um processo eficiente e personalizado.",
  },
  {
    icon: ShieldCheck,
    title: "Experiência segura para o alto padrão",
    description: "Imóveis exclusivos de parceiros confiáveis, sem duplicações, para uma compra segura.",
  },
]

export function AboutExperience() {
  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-medium">
            A experiência de compra e venda que faltava no mercado de alto padrão.
          </h2>
          <p className="text-lg text-muted-foreground">
            Imobiliárias têm visibilidade limitada e portfólios restritos, enquanto outros portais priorizam volume. O
            Jhonnathan une um portfólio exclusivo à expertise de corretores especialistas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="bg-black hover:bg-black/90 text-white px-8">
              Buscar imóveis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

