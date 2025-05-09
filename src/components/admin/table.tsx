"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Property } from "@/types/property"
import ActionButton from "@/components/ui/action-button"
import { propertyService } from "@/services/PropertyService"
import { PropertyFilters } from "../property-filter"
import { brokerService } from "@/services/BrokerService"

interface PropertiesTableProps {
  properties: Property[]
  onDelete: () => void
  onEdit: (property: any) => void
}

// Colunas que podem ser ordenadas
type SortableColumns = "title" | "location" | "price" | "area"

/**
 * Atualizamos a interface dos filtros para refletir a nova estrutura:
 * - `location`: bairro único (string) em vez de um array de bairros.
 * - Os demais filtros permanecem como array, permitindo seleção múltipla.
 */
export interface TableFilters {
  location: string
  areas: string[]
  prices: string[]
  statuses: string[]
  brokers: string[]
  search: string
}

export function PropertiesTable({ properties, onDelete, onEdit }: PropertiesTableProps) {
  const [sortColumn, setSortColumn] = useState<SortableColumns>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const itemsPerPage = 10
  const [brokersList, setBrokersList] = useState<{ id: string; name: string }[]>([])

  // Sempre que as propriedades originais mudam, atualizamos a lista filtrada
  useEffect(() => {
    setFilteredProperties(properties)
  }, [properties])

  // Carrega a lista de corretores
  useEffect(() => {
    brokerService.getBrokers().then((data: any) => {
      const mapped = data.map((b: any) => ({ id: String(b.id), name: b.name }))
      setBrokersList(mapped)
    })
  }, [])

  // Função de filtragem usando a nova interface dos filtros
  const handleFilter = (filters: TableFilters) => {
    let filtered = [...properties]

    // Filtra pela busca geral
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (property) =>
          property.title?.toLowerCase().includes(searchLower) ||
          property.location?.toLowerCase().includes(searchLower) ||
          property.brokers?.name.toLowerCase().includes(searchLower)
      )
    }

    // Filtra pelo bairro (location) – agora é único
    if (filters.location !== "") {
      filtered = filtered.filter((property) =>
        property.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Filtra pela área
    if (filters.areas.length > 0) {
      filtered = filtered.filter((property) => {
        const area = property.area
        if (area === undefined) return false

        return filters.areas.some((areaRange) => {
          if (areaRange === "50") return area <= 50
          if (areaRange === "400+") return area >= 400

          const [min, max] = areaRange.split("-").map(Number)
          return area >= min && area <= max
        })
      })
    }

    // Filtra pelo preço
    if (filters.prices.length > 0) {
      filtered = filtered.filter((property) => {
        const price = property.price
        if (price === undefined) return false

        return filters.prices.some((priceRange) => {
          if (priceRange === "500k") return price <= 500000
          if (priceRange === "5m+") return price >= 5000000

          const [minStr, maxStr] = priceRange.split("-")
          const min = Number(minStr.replace("k", "000").replace("m", "000000"))
          const max = Number(maxStr.replace("k", "000").replace("m", "000000"))

          return price >= min && price <= max
        })
      })
    }

    // Filtra pelo status
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((property) => {
        if (filters.statuses.includes("sold") && property.sold) return true
        if (filters.statuses.includes("available") && !property.sold) return true
        if (filters.statuses.includes("featured") && property.featured) return true
        return false
      })
    }

    // Filtra pelo corretor
    if (filters.brokers.length > 0) {
      filtered = filtered.filter((property) =>
        filters.brokers.includes(String(property.brokers?.id || ""))
      )
    }

    setFilteredProperties(filtered)
    setCurrentPage(1) // Reseta para a primeira página
  }

  // Ações de deletar, marcar como vendido ou em destaque
  const handleDelete = async (property: Property) => {
    await propertyService.deleteProperty(property.id)
    onDelete()
  }

  const handleSold = async (property: Property) => {
    await propertyService.markAsSold(property.id)
    onDelete()
  }

  const handleFeatured = async (property: Property) => {
    await propertyService.markAsFeatured(property.id)
    onDelete()
  }

  // Ordenação dos imóveis
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (aValue === bValue) return 0
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    const comparison = aValue < bValue ? -1 : 1
    return sortDirection === "asc" ? comparison : -comparison
  })

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: SortableColumns) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ column }: { column: SortableColumns }) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Usando o novo PropertyFilters */}
      <PropertyFilters
        onFilter={handleFilter}
        brokers={brokersList}
      />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Título
                    <SortIcon column="title" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-1">
                    Localização
                    <SortIcon column="location" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Preço
                    <SortIcon column="price" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Corretor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProperties.map((property) => (
                <tr key={property.id} className="border-b">
                  <td className="px-4 py-3">{property.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{property.location}</td>
                  <td className="px-4 py-3">
                    {property.price ? formatCurrency(property.price) : "Sob Consulta"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={property.sold ? "success" : "default"}>
                      {property.sold ? "Vendido" : "Disponível"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {property.brokers?.name || "Não atribuído"}
                  </td>
                  <td className="px-4 py-3 flex items-center">
                    {property.sold ? (
                      <ActionButton
                        onClick={() => handleSold(property)}
                        type="unsold"
                        className="mr-1"
                      />
                    ) : (
                      <ActionButton
                        onClick={() => handleSold(property)}
                        type="sold"
                        className="mr-1"
                      />
                    )}
                    <ActionButton
                      onClick={() => onEdit(property)}
                      type="edit"
                      className="mr-1"
                    />
                    {property.featured ? (
                      <ActionButton
                        onClick={() => handleFeatured(property)}
                        type="featured"
                        className="mr-1"
                      />
                    ) : (
                      <ActionButton
                        onClick={() => handleFeatured(property)}
                        type="unfeatured"
                        className="mr-1"
                      />
                    )}
                    <ActionButton
                      onClick={() => handleDelete(property)}
                      type="delete"
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
            {Math.min(currentPage * itemsPerPage, filteredProperties.length)} de {filteredProperties.length} imóveis
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
