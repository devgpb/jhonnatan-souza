import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge'; // Replace with the correct path to the Badge component

interface Transaction {
  id: number;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string | null;
  brokerName: string;
  brokerCreci: string;
  value: number;
  date: string | Date;
  status: string;
}

interface RecentTransactionsData {
  transactions: Transaction[];
}

interface RecentTransactionsProps {
  data: RecentTransactionsData;
}

export default function RecentTransactions({ data }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return format(dateObj, "dd MMM yyyy", { locale: ptBR })
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "sold":
      case "vendido":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Vendido</Badge>
      case "reserved":
      case "reservado":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Reservado</Badge>
      case "available":
      case "disponível":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Disponível</Badge>
      case "inactive":
      case "inativo":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inativo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imóvel
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Corretor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    {transaction.propertyImage ? (
                      <img
                        src={transaction.propertyImage || "/placeholder.svg"}
                        alt={transaction.propertyTitle}
                        className="rounded-md object-cover h-10 w-10"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{transaction.propertyTitle}</div>
                    <div className="text-sm text-gray-500">{transaction.propertyLocation}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaction.brokerName}</div>
                <div className="text-sm text-gray-500">CRECI: {transaction.brokerCreci}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.value)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(transaction.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
