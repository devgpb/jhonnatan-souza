import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  if (!data || !data.transactions || data.transactions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Nenhuma transação recente encontrada.
      </div>
    );
  }
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

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
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                    {transaction.propertyImage ? (
                      <img src={transaction.propertyImage || "/placeholder.svg"} alt={transaction.propertyTitle} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">Sem imagem</div>
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${transaction.status === 'sold' ? 'bg-green-100 text-green-800' : 
                    transaction.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {transaction.status === 'sold' ? 'Vendido' : 
                   transaction.status === 'reserved' ? 'Reservado' : 'Disponível'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
