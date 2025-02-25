export interface Broker {
    id: string
    name: string
    company?: string
    creci?: string
    phone?: string
    email?: string
    avatar?: string
    properties?: Property[]
  }
  
  export interface Property {
    featured: boolean
    id: string
    title: string
    location?: string
    price?: number
    area?: number
    bedrooms?: number
    sold: boolean
    year?: number
    iptu?: number
    suites?: number
    bathrooms?: number
    parking?: number
    description?: string
    amenities: string[]
    brokerId?: string
    broker?: Broker
    images: PropertyImage[]
  }
  
  export interface PropertyImage {
    id: number
    imageUrl: string
    orderIndex: number
    propertyId: string
  }
  
  