import { TrendingUp, TrendingDown, DollarSign, BarChart } from 'lucide-react';

interface KpiData {
  monthlySales: {
    count: number;
    trend: number;
  };
  totalRevenue: {
    value: number;
    trend: number;
  };
  conversionRate: {
    value: number;
    trend: number;
  };
}

interface KpiCardsProps {
  data: KpiData;
}

export default function KpiCards({ data }: KpiCardsProps) {
  if (!data) return null;
  
  const { monthlySales, totalRevenue, conversionRate } = data;
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Vendas do Mês</p>
            <h3 className="text-3xl font-bold mt-1">{monthlySales.count}</h3>
          </div>
          <div className={`p-3 rounded-full ${monthlySales.trend > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            {monthlySales.trend > 0 ? (
              <TrendingUp className="h-6 w-6 text-green-600" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className={`text-sm ${monthlySales.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {monthlySales.trend > 0 ? '+' : ''}{monthlySales.trend}% em relação ao mês anterior
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Receita Total</p>
            <h3 className="text-3xl font-bold mt-1">{formatCurrency(totalRevenue.value)}</h3>
          </div>
          <div className={`p-3 rounded-full ${totalRevenue.trend > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <DollarSign className={`h-6 w-6 ${totalRevenue.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        <div className="mt-4">
          <p className={`text-sm ${totalRevenue.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalRevenue.trend > 0 ? '+' : ''}{totalRevenue.trend}% em relação ao mês anterior
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
            <h3 className="text-3xl font-bold mt-1">{conversionRate.value}%</h3>
          </div>
          <div className={`p-3 rounded-full ${conversionRate.trend > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <BarChart className={`h-6 w-6 ${conversionRate.trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        <div className="mt-4">
          <p className={`text-sm ${conversionRate.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {conversionRate.trend > 0 ? '+' : ''}{conversionRate.trend}% em relação ao mês anterior
          </p>
        </div>
      </div>
    </div>
  );
}
