import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para mesclar classes do Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de moeda (BRL)
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Formatação de área (m²)
export function formatArea(meters: number): string {
  return `${meters.toLocaleString("pt-BR")}m²`
}

// Formatação de data
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

// Função para gerar slug a partir de texto
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim()
}

// Função para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de telefone brasileiro (corrigida)
export function isValidPhone(phone: string): boolean {
  // Aceita formatos: (11) 99999-9999 ou 11999999999
  const phoneRegex = /^(\d{2}|$$\d{2}$$)\s?9?\d{4}[-\s]?\d{4}$/
  return phoneRegex.test(phone)
}

// Formatação de telefone
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Tipos de imóveis
export const propertyTypes = ["Apartamento", "Casa", "Cobertura", "Terreno", "Comercial", "Casa de Condomínio"] as const

export type PropertyType = (typeof propertyTypes)[number]

// Interface para filtros de imóveis
export interface PropertyFilters {
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
  bathrooms?: number
  parking?: number
}

// Função para filtrar imóveis
export function filterProperties<T extends Record<string, any>>(properties: T[], filters: PropertyFilters): T[] {
  return properties.filter((property) => {
    if (filters.type && property.type !== filters.type) return false
    if (filters.minPrice && property.price < filters.minPrice) return false
    if (filters.maxPrice && property.price > filters.maxPrice) return false
    if (filters.minArea && property.area < filters.minArea) return false
    if (filters.maxArea && property.area > filters.maxArea) return false
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false
    if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false
    if (filters.parking && property.parking < filters.parking) return false
    return true
  })
}

// Função para ordenar imóveis
export function sortProperties<T extends Record<string, any>>(
  properties: T[],
  sortBy: "price" | "area" | "date",
  order: "asc" | "desc" = "asc",
): T[] {
  return [...properties].sort((a, b) => {
    const modifier = order === "asc" ? 1 : -1
    return (a[sortBy] - b[sortBy]) * modifier
  })
}

// Função para gerar URL da imagem com fallback
export function getImageUrl(path?: string, fallback = "/placeholder.svg"): string {
  if (!path) return fallback
  return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`
}

// Função para calcular valor do condomínio por m²
export function calculateCondoPerMeter(condoValue: number, area: number): number {
  return condoValue / area
}

// Função para calcular valor do IPTU mensal
export function calculateMonthlyIPTU(yearlyIPTU: number): number {
  return yearlyIPTU / 12
}

// Função para calcular valor total do imóvel com custos adicionais
export interface PropertyCosts {
  price: number
  condoFee?: number
  iptu?: number
  additionalCosts?: number
}

export function calculateTotalCost(costs: PropertyCosts): number {
  const { price, condoFee = 0, iptu = 0, additionalCosts = 0 } = costs
  return price + condoFee * 12 + iptu + additionalCosts
}

// Função para gerar texto de descrição do imóvel
export function generatePropertyDescription(
  type: PropertyType,
  area: number,
  bedrooms: number,
  neighborhood: string,
  features: string[],
): string {
  const bedroomText = bedrooms === 1 ? "quarto" : "quartos"
  const featuresText = features.length > 0 ? ` com ${features.join(", ")}` : ""

  return `${type} com ${area}m² e ${bedrooms} ${bedroomText} localizado no ${neighborhood}${featuresText}.`
}

// Função para validar CEP
export function isValidCEP(cep: string): boolean {
  const cepRegex = /^\d{5}-?\d{3}$/
  return cepRegex.test(cep)
}

// Função para formatar CEP
export function formatCEP(cep: string): string {
  return cep.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2")
}

// Função para gerar range de preços para filtros
export function generatePriceRanges(min: number, max: number, steps: number): number[] {
  const step = (max - min) / (steps - 1)
  return Array.from({ length: steps }, (_, i) => Math.round(min + step * i))
}

// Função para calcular financiamento
interface FinancingParams {
  propertyValue: number
  downPayment: number
  years: number
  interestRate: number // taxa de juros anual em decimal (ex: 0.08 para 8%)
}

export function calculateFinancing({ propertyValue, downPayment, years, interestRate }: FinancingParams): {
  monthlyPayment: number
  totalAmount: number
  numberOfPayments: number
} {
  const loanAmount = propertyValue - downPayment
  const monthlyRate = interestRate / 12
  const numberOfPayments = years * 12

  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalAmount = monthlyPayment * numberOfPayments

  return {
    monthlyPayment,
    totalAmount,
    numberOfPayments,
  }
}

