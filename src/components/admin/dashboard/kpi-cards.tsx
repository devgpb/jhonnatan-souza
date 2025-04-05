import { TrendingUp, TrendingDown, DollarSign, BarChart, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { kpiData } from '@/types/dashboard';


interface KpiCardsProps {
  data: kpiData;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Vendas Mensais</p>
            <p className="text-2xl font-bold mt-1">{data.monthlySales.value}</p>
          </div>
          <div className={`flex items-center ${data.monthlySales.percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {data.monthlySales.percentageChange >= 0 ? (
              <ArrowUpIcon className="h-5 w-5 mr-1" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 mr-1" />
            )}
            <span className="font-medium">{Math.abs(data.monthlySales.percentageChange)}%</span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, data.monthlySales.value)}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Receita Total</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(data.totalRevenue.value)}</p>
          </div>
          <div className={`flex items-center ${data.totalRevenue.percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {data.totalRevenue.percentageChange >= 0 ? (
              <ArrowUpIcon className="h-5 w-5 mr-1" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 mr-1" />
            )}
            <span className="font-medium">{Math.abs(data.totalRevenue.percentageChange)}%</span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(100, (data.totalRevenue.value / 1000000) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
            <p className="text-2xl font-bold mt-1">{formatPercentage(data.conversionRate.percentage)}</p>
          </div>
          <div className={`flex items-center ${data.conversionRate.percentageChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {data.conversionRate.percentageChange >= 0 ? (
              <ArrowUpIcon className="h-5 w-5 mr-1" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 mr-1" />
            )}
            <span className="font-medium">{Math.abs(data.conversionRate.percentageChange)}%</span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(100, data.conversionRate.percentage * 2)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}