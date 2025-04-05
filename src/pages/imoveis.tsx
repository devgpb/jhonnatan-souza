import { useEffect, useState } from "react"
import * as React from "react"
import { FilterBar } from "@/components/filter-bar"
import { NavBar } from "@/components/nav-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/router"
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

type Broker = {
  name: string
  company?: string
  avatar?: string
}

type Property = {
  id: string
  price: number
  area: number
  suites: number
  parking: number
  images: string[]
  location: string
  title: string
  brokers: Broker
}

type PropertiesPageProps = {
  allProperties: Property[]
}

export default function PropertiesPage({ allProperties }: PropertiesPageProps) {
  const router = useRouter()
  console.log(allProperties)

  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  const apartments = allProperties.filter((p) =>
    normalize(p.title).includes("apartamento")
  )

  const houses = allProperties.filter((p) =>
    normalize(p.title).includes("casa")
  )

  const penthouses = allProperties.filter((p) =>
    normalize(p.title).includes("cobertura")
  )

  const handleSearch = (filters: any) => {
    console.log(filters)
  }

  const handleCasas = () => router.push("/casas")
  const handleApartamentos = () => router.push("/apartamentos")
  const handleCoberturas = () => router.push("/coberturas")

  const renderPropertyCard = (property: Property) => (
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
        name: property.brokers.name,
        company: property.brokers.company || "N/A",
        avatar: property.brokers.avatar || "/default-avatar.jpg",
      }}
    />
  )

  return (
    <>
      <NavBar background />
      <main className="container py-12 px-4 md:px-0 pt-14">
        <FilterBar onSearch={handleSearch} />

        <Section
          title="Apartamentos"
          description="Encontre seu apartamento ideal em localização privilegiada"
          handleClick={handleApartamentos}
          properties={apartments}
          renderPropertyCard={renderPropertyCard}
        />

        <Section
          title="Casas"
          description="Descubra casas exclusivas com todo o conforto para sua família"
          handleClick={handleCasas}
          properties={houses}
          renderPropertyCard={renderPropertyCard}
        />

        <Section
          title="Coberturas"
          description="Explore coberturas de alto padrão com vistas deslumbrantes"
          handleClick={handleCoberturas}
          properties={penthouses}
          renderPropertyCard={renderPropertyCard}
        />
      </main>
    </>
  )
}

type SectionProps = {
  title: string
  description: string
  handleClick: () => void
  properties: Property[]
  renderPropertyCard: (property: Property) => any
}

function Section({
  title,
  description,
  handleClick,
  properties,
  renderPropertyCard
}: SectionProps) {
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-1">{title}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{description}</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-sm h-10 w-full md:w-auto"
          onClick={handleClick}
        >
          Ver todos {title.toLowerCase()}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {properties.map(renderPropertyCard)}
      </div>
    </section>
  )
}

// SSR
interface ApiResponse {
  id: string
  price: number
  area: number
  suites: number
  parking: number
  images: string[]
  location: string
  title: string
  brokers: {
    name: string
    company?: string
    avatar?: string
  }
}

interface ServerSideProps {
  allProperties: ApiResponse[]
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ServerSideProps>> {
  const { req } = context
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host

  const url = `${protocol}://${host}/api/properties`

  const res = await fetch(url)
  const json = await res.json()

  return {
    props: {
      allProperties: json.data ?? [],
    },
  }
}
