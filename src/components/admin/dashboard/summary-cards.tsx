import { Home, Clock, Tag, CheckCircle, DollarSign, Building } from "lucide-react"
import { DashboardSummary } from "@/types/dashboard"

interface SummaryCardsProps {
  data: DashboardSummary
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-primary/10 mr-4">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Imóveis</p>
            <p className="text-2xl font-bold mt-1">{data.totalProperties}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-amber-100 mr-4">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tempo Médio no Mercado</p>
            <p className="text-2xl font-bold mt-1">{data.averageMarketTime.days} dias</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-emerald-100 mr-4">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Preço Médio</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(data.averagePrice)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Imóveis Vendidos</p>
            <p className="text-2xl font-bold mt-1">{data.soldProperties}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

