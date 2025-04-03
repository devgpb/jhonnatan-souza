import { Home, Clock, Tag, CheckCircle } from "lucide-react"

interface SummaryData {
  totalProperties: number
  avgTimeOnMarket: number
  avgPrice: number
  soldProperties: number
}

interface SummaryCardsProps {
  data: SummaryData
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  if (!data) return null

  const { totalProperties, avgTimeOnMarket, avgPrice, soldProperties } = data

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-100">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Imóveis</p>
            <h3 className="text-2xl font-bold">{totalProperties}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-amber-100">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tempo Médio no Mercado</p>
            <h3 className="text-2xl font-bold">{avgTimeOnMarket} dias</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-purple-100">
            <Tag className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Preço Médio</p>
            <h3 className="text-2xl font-bold">{formatCurrency(avgPrice)}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Imóveis Vendidos</p>
            <h3 className="text-2xl font-bold">{soldProperties}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

