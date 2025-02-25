"use client"

import { useState } from "react"
import { Search, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FilterOption {
  id: string
  label: string
}

// Filter options
const neighborhoods: FilterOption[] = [
  { id: "itaim-bibi", label: "Itaim Bibi" },
  { id: "jardim-paulista", label: "Jardim Paulista" },
  { id: "vila-nova-conceicao", label: "Vila Nova Conceição" },
  { id: "jardim-america", label: "Jardim América" },
  { id: "higienopolis", label: "Higienópolis" },
  { id: "pinheiros", label: "Pinheiros" },
  { id: "moema", label: "Moema" },
  { id: "brooklin", label: "Brooklin" },
]

const areaRanges: FilterOption[] = [
  { id: "50", label: "Até 50m²" },
  { id: "50-100", label: "50m² - 100m²" },
  { id: "100-200", label: "100m² - 200m²" },
  { id: "200-400", label: "200m² - 400m²" },
  { id: "400+", label: "Acima de 400m²" },
]

const priceRanges: FilterOption[] = [
  { id: "500k", label: "Até R$ 500.000" },
  { id: "500k-1m", label: "R$ 500.000 - R$ 1.000.000" },
  { id: "1m-2m", label: "R$ 1.000.000 - R$ 2.000.000" },
  { id: "2m-5m", label: "R$ 2.000.000 - R$ 5.000.000" },
  { id: "5m+", label: "Acima de R$ 5.000.000" },
]

const statusOptions: FilterOption[] = [
  { id: "available", label: "Disponível" },
  { id: "sold", label: "Vendido" },
  { id: "featured", label: "Em Destaque" },
]

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

function FilterDropdown({ title, options, selected, onSelect, onRemove }: FilterDropdownProps) {
  const [search, setSearch] = useState("")

  const filteredOptions = options.filter((option) => 
    option && option.label && typeof option.label === "string" 
    ? option.label.toLowerCase().includes(search.toLowerCase()) 
    : false
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 text-sm">
          {title}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[280px] p-3">
        <div className="space-y-3">
          <h3 className="font-medium text-base">{title}</h3>

          <Input
            placeholder={`Buscar ${title.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm"
          />

          {selected.length > 0 && (
            <ScrollArea className="max-h-[100px]">
              <div className="flex flex-wrap gap-2">
                {selected.map((id) => {
                  const option = options.find((opt) => opt.id === id)
                  if (!option) return null
                  return (
                    <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                      {option.label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => onRemove(id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </ScrollArea>
          )}

          <ScrollArea className="max-h-[200px]">
            <div className="grid gap-2">
              {filteredOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className="justify-start w-full text-sm"
                  onClick={() => onSelect(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface TableFilterProps {
  onFilter: (filters: TableFilters) => void
  brokers?: { id: string; name: string }[]
}

interface TableFilters {
  neighborhoods: string[]
  areas: string[]
  prices: string[]
  statuses: string[]
  brokers: string[]
  search: string
}

export function TableFilter({ onFilter, brokers = [] }: TableFilterProps) {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelect = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    setter((prev) => [...prev, id])
  }

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    setter((prev) => prev.filter((item) => item !== id))
  }

  const handleSearch = () => {
    onFilter({
      neighborhoods: selectedNeighborhoods,
      areas: selectedAreas,
      prices: selectedPrices,
      statuses: selectedStatuses,
      brokers: selectedBrokers,
      search: searchQuery,
    })
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }

  const brokerOptions = brokers.map((broker) => ({
    id: broker?.id,
    label: broker?.name,
  }))

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar imóveis..."
            className="pl-10 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <FilterDropdown
          title="Bairro"
          options={neighborhoods}
          selected={selectedNeighborhoods}
          onSelect={handleSelect(setSelectedNeighborhoods)}
          onRemove={handleRemove(setSelectedNeighborhoods)}
        />

        <FilterDropdown
          title="Área"
          options={areaRanges}
          selected={selectedAreas}
          onSelect={handleSelect(setSelectedAreas)}
          onRemove={handleRemove(setSelectedAreas)}
        />

        <FilterDropdown
          title="Valor"
          options={priceRanges}
          selected={selectedPrices}
          onSelect={handleSelect(setSelectedPrices)}
          onRemove={handleRemove(setSelectedPrices)}
        />

        <FilterDropdown
          title="Status"
          options={statusOptions}
          selected={selectedStatuses}
          onSelect={handleSelect(setSelectedStatuses)}
          onRemove={handleRemove(setSelectedStatuses)}
        />

        <FilterDropdown
          title="Corretor"
          options={brokerOptions}
          selected={selectedBrokers}
          onSelect={handleSelect(setSelectedBrokers)}
          onRemove={handleRemove(setSelectedBrokers)}
        />

        <Button onClick={handleSearch} className="h-10 px-6">
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>
    </div>
  )
}

