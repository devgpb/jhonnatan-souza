import { Building2, Users2, Trophy, LineChart } from "lucide-react"

const values = [
  {
    icon: Building2,
    title: "Excelência",
    description: "Buscamos a excelência em cada detalhe, desde a curadoria dos imóveis até o atendimento aos clientes.",
  },
  {
    icon: Users2,
    title: "Transparência",
    description: "Mantemos uma comunicação clara e honesta com todos os envolvidos no processo.",
  },
  {
    icon: Trophy,
    title: "Profissionalismo",
    description:
      "Nossa equipe é formada por profissionais altamente qualificados e comprometidos com o sucesso dos clientes.",
  },
  {
    icon: LineChart,
    title: "Inovação",
    description: "Utilizamos tecnologia de ponta para oferecer a melhor experiência possível aos nossos clientes.",
  },
]

export function AboutValues() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
          <p className="text-lg text-muted-foreground">
            Construímos nossa reputação com base em valores sólidos que norteiam todas as nossas ações
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="bg-white p-8 rounded-2xl">
              <value.icon className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

