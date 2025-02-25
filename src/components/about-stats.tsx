const stats = [
    {
      value: "R$ 2.5B+",
      label: "Em vendas realizadas",
    },
    {
      value: "1500+",
      label: "Imóveis vendidos",
    },
    {
      value: "98%",
      label: "Clientes satisfeitos",
    },
    {
      value: "250+",
      label: "Corretores parceiros",
    },
  ]
  
  export function AboutStats() {
    return (
      <section className="py-24 bg-black text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  