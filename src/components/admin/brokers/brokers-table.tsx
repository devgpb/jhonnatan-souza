"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import ActionButton from "@/components/ui/action-button"
import { brokerService } from "@/services/BrokerService"

interface Broker {
  id: number
  name: string
  company: string
  creci: string
  phone: string
  email: string
  avatar?: string
  // Outros campos, se houver
}

interface BrokersTableProps {
  brokers: Broker[]
  onDelete: () => void
  onEdit?: (broker: Broker) => void
}

type SortableColumns = "name" | "company" | "creci"

export function BrokersTable({ brokers, onDelete, onEdit }: BrokersTableProps) {
  const [sortedBrokers, setSortedBrokers] = useState<Broker[]>([])
  const [sortColumn, setSortColumn] = useState<SortableColumns>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalPages = Math.ceil(brokers.length / itemsPerPage)

  useEffect(() => {
    setSortedBrokers(brokers)
  }, [brokers])

  // Função de ordenação
  const handleSort = (column: SortableColumns) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Ordena a lista em memória
  const orderedBrokers = [...sortedBrokers].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue === bValue) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    const comparison = aValue < bValue ? -1 : 1
    return sortDirection === "asc" ? comparison : -comparison
  })

  // Paginação
  const paginatedBrokers = orderedBrokers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Icone de ordenação
  const SortIcon = ({ column }: { column: SortableColumns }) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  // Excluir corretor
  const handleDelete = async (broker: Broker) => {
    await brokerService.deleteBroker(broker.id.toString())
    onDelete() // callback para recarregar a listagem no componente-pai
  }

  // Editar corretor (chama callback do componente-pai)
  const handleEdit = (broker: Broker) => {
    if (onEdit) onEdit(broker)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Nome
                    <SortIcon column="name" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("company")}
                >
                  <div className="flex items-center gap-1">
                    Empresa
                    <SortIcon column="company" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("creci")}
                >
                  <div className="flex items-center gap-1">
                    CRECI
                    <SortIcon column="creci" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Telefone
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  E-mail
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrokers.map((broker) => (
                <tr key={broker.id} className="border-b">
                  <td className="px-4 py-3">{broker.name}</td>
                  <td className="px-4 py-3">{broker.company}</td>
                  <td className="px-4 py-3">{broker.creci}</td>
                  <td className="px-4 py-3">{broker.phone}</td>
                  <td className="px-4 py-3">{broker.email}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <ActionButton
                      type="update"
                      onClick={() => handleEdit(broker)}
                    />
                    <ActionButton
                      type="delete"
                      onClick={() => handleDelete(broker)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} até{" "}
            {Math.min(currentPage * itemsPerPage, brokers.length)} de{" "}
            {brokers.length} corretores
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
