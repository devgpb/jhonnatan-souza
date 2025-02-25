import { PropertyCard } from "@/components/property-card"

// This would typically come from an API or database
const similarProperties = [
  {
    id: "LXH3432",
    image: "/images/imoveis/imovel-2.jpg",
    price: 4700000,
    area: 185,
    suites: 3,
    parking: 3,
    location: "Apartamento em Itaim Bibi, São Paulo - SP",
    broker: {
      name: "Claudia Mangieri",
      company: "Luxury Home",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "SH3587",
    image: "/images/imoveis/imovel-2.jpg",
    price: 4790000,
    area: 244,
    suites: 4,
    parking: 4,
    location: "Apartamento em Campo Belo, São Paulo - SP",
    broker: {
      name: "Gilson Oliveira",
      company: "Singular House",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "MSP507",
    image: "/images/imoveis/imovel-2.jpg",
    price: 2000000,
    area: 84,
    suites: 2,
    parking: 2,
    location: "Apartamento em Brooklin, São Paulo - SP",
    broker: {
      name: "João Victor",
      company: "Morar SP",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

interface SimilarPropertiesProps {
  currentId: string
}

export function SimilarProperties({ currentId }: SimilarPropertiesProps) {
  const filteredProperties = similarProperties.filter((property) => property.id !== currentId)

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-8">Imóveis similares</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  )
}

