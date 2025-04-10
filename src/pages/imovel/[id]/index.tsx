import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { PropertyGallery } from "@/components/property-gallery"
import { PropertyDetails } from "@/components/property-details"
import { PropertyDescription } from "@/components/porperty-description"
import { PropertyContact } from "@/components/property-contact"
import { SimilarProperties } from "@/components/similar-properties"
import MainLayout from '@/layouts/MainLayout'

type Broker = {
  name: string
  company?: string
  avatar?: string
  creci?: string
  phone?: string
  email?: string
}

type Property = {
  id: string
  title: string
  location: string
  price: number
  area: number
  bedrooms: number
  sold: boolean
  year?: number
  iptu?: number
  suites: number
  bathrooms: number
  parking: number
  description?: string
  amenities?: string[]
  images: string[]
  brokers: Broker
}

interface PropertyPageProps {
  property: Property
}

export default function PropertyPage({ property }: PropertyPageProps) {
  const normalize = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  const category = normalize(property.title).includes("apartamento")
    ? "apartamento"
    : normalize(property.title).includes("casa")
    ? "casa"
    : "cobertura"
  return (
    <MainLayout>
      <main>
        <PropertyGallery images={property.images} />
        <div className="container">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 py-12">
            <div className="space-y-12">
              <PropertyDetails property={{ ...property, amenities: property.amenities || [] }} />
              <PropertyDescription property={{ description: property.description || '' }} />
            </div>
            <div className="space-y-6">
              <PropertyContact
                data={{
                  property: {
                    price: property.price,
                    iptu: property.iptu || 0,
                    year: property.year || 0
                  },
                  broker: {
                    name: property.brokers.name,
                    company: property.brokers.company || '',
                    creci: property.brokers.creci || '',
                    phone: property.brokers.phone || '',
                    email: property.brokers.email || '',
                    avatar: property.brokers.avatar || '/placeholder.svg',
                  }
                }}
              />
            </div>
          </div>
        </div>
        <SimilarProperties currentId={property.id} currentCategory={category} />
      </main>
    </MainLayout>
  )
}

// SSR para buscar da API
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PropertyPageProps>> {
  const { id } = context.query

  const protocol = context.req.headers['x-forwarded-proto'] || 'http'
  const host = context.req.headers.host
  const url = `${protocol}://${host}/api/properties/${id}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      return { notFound: true }
    }

    const data = await res.json()

    return {
      props: {
        property: {
          id: data.id ?? 'ID não informado',
          title: data.title ?? 'Título não informado',
          location: data.location ?? 'Localização não informada',
          price: data.price ?? 0,
          area: data.area ?? 0,
          bedrooms: data.bedrooms ?? 0,
          sold: data.sold ?? false,
          iptu: data.iptu != null ? data.iptu : null,
          year: data.year != null ? data.year : null,
          suites: data.suites ?? 0,
          bathrooms: data.bathrooms ?? 0,
          parking: data.parking ?? 0,
          description: data.description ?? 'Descrição não disponível.',
          amenities: Array.isArray(data.amenities)
            ? data.amenities
            : typeof data.amenities === 'string'
              ? data.amenities.split(',').map((item: string) => item.trim()).filter(Boolean)
              : [],
          images: Array.isArray(data.images)
            ? data.images
            : typeof data.images === 'string'
              ? data.images.split(',').map((item: string) => item.trim()).filter(Boolean)
              : ["/placeholder.svg"],
          brokers: data.brokers ?? {
            name: 'Corretor não informado',
            company: 'Empresa não informada',
            creci: '',
            phone: '',
            email: '',
            avatar: '/placeholder.svg',
          },
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar propriedade:', error)
    return { notFound: true }
  }
}
