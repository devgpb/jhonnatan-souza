"use client"

import { useEffect, useState } from "react"
import { PropertyCard } from "@/components/property-card"

interface SimilarPropertiesProps {
  currentId: string
  currentCategory: string
}

export function SimilarProperties({ currentId, currentCategory }: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties")
        const json = await res.json()

        console.log("Resposta da API de imóveis similares:", json)

        const allProperties = Array.isArray(json.data) ? json.data : []

        const filteredProperties = allProperties.filter(
          (property: any) =>
            property.id !== currentId &&
            property.title?.toLowerCase().includes(currentCategory.toLowerCase())
        )

        setProperties(filteredProperties)
      } catch (error) {
        console.error("Erro ao buscar imóveis similares:", error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [currentId, currentCategory])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-8">Imóveis similares</h2>
          <p>Carregando imóveis similares...</p>
        </div>
      </section>
    )
  }

  if (!properties.length) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-8">Imóveis similares</h2>
          <p>Nenhum imóvel similar encontrado.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-8">Imóveis similares</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              image={(property.images?.[0]) || "/images/imoveis/imovel-3.jpg"}
              price={property.price}
              area={property.area}
              suites={property.suites}
              location={property.location}
              parking={property.parking}
              broker={{
                name: property.brokers?.name || "Corretor não informado",
                company: property.brokers?.company || "Empresa não informada",
                avatar: property.brokers?.avatar || "/placeholder.svg",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
