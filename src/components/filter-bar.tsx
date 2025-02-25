"use client"

import { useState } from "react"
import { MapPin, ChevronDown, SlidersHorizontal, Search, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"; 
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RoomFilterGroup } from "@/components/ui/room-filter-group"

interface FilterOption {
  id: string
  label: string
}

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

const priceRanges: FilterOption[] = [
  { id: "500k", label: "Até R$ 500.000" },
  { id: "500k-1m", label: "R$ 500.000 - R$ 1.000.000" },
  { id: "1m-2m", label: "R$ 1.000.000 - R$ 2.000.000" },
  { id: "2m-5m", label: "R$ 2.000.000 - R$ 5.000.000" },
  { id: "5m+", label: "Acima de R$ 5.000.000" },
]

const areaRanges: FilterOption[] = [
  { id: "50", label: "Até 50m²" },
  { id: "50-100", label: "50m² - 100m²" },
  { id: "100-200", label: "100m² - 200m²" },
  { id: "200-400", label: "200m² - 400m²" },
  { id: "400+", label: "Acima de 400m²" },
]

const propertyTypes: FilterOption[] = [
  { id: "apartment", label: "Apartamento" },
  { id: "house", label: "Casa" },
  { id: "penthouse", label: "Cobertura" },
  { id: "condo", label: "Casa de Condomínio" },
  { id: "flat", label: "Flat" },
  { id: "studio", label: "Studio" },
]

const roomOptions: FilterOption[] = [
  { id: "1", label: "1 quarto" },
  { id: "2", label: "2 quartos" },
  { id: "3", label: "3 quartos" },
  { id: "4", label: "4 quartos" },
  { id: "5", label: "5+ quartos" },
]

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  searchPlaceholder?: string
  featured?: FilterOption[]
}

function FilterDropdown({
  title,
  options,
  selected,
  onSelect,
  onRemove,
  searchPlaceholder,
  featured,
}: FilterDropdownProps) {
  const [search, setSearch] = useState("")

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 w-full md:w-auto text-sm">
          {title}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(320px,calc(100vw-2rem))] p-3">
        <h3 className="font-medium text-base">{title}</h3>

        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar ${title.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        {selected.length > 0 && (
          <ScrollArea className="max-h-[100px] mt-2">
            <div className="flex flex-wrap gap-2">
              {selected.map((id) => {
                const option = options.find((opt) => opt.id === id);
                if (!option) return null;
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    {option.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        onRemove(id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </ScrollArea>
        )}

        <ScrollArea className="max-h-[180px] mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="justify-start w-full text-sm"
                onClick={() => onSelect(option.id)}
              >
                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{option.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface RangeInputProps {
  label: string
  minPlaceholder?: string
  maxPlaceholder?: string
}

interface FilterProps{ 
  onSearch: (filters: any) => void;
}

function RangeInput({ label, minPlaceholder = "Valor mínimo", maxPlaceholder = "Valor máximo" }: RangeInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-base font-medium">{label}</label>
      <div className="flex gap-3 items-center">
        <Input placeholder={minPlaceholder} className="flex-1 h-12 text-base border-gray-300 focus:border-primary" />
        <span className="text-muted-foreground text-lg">—</span>
        <Input placeholder={maxPlaceholder} className="flex-1 h-12 text-base border-gray-300 focus:border-primary" />
      </div>
    </div>
  )
}

export function FilterBar({onSearch}: FilterProps) {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [isExclusive, setIsExclusive] = useState(false)
  const [bedroomCount, setBedroomCount] = useState<number | null>(null)
  const [suiteCount, setSuiteCount] = useState<number | null>(null)
  const [bathroomCount, setBathroomCount] = useState<number | null>(null)
  const [parkingCount, setParkingCount] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>(""); //Estado para armazenar o input
  


  const handleSearch =  () => {
    const filters = { 
      neighborhoods: searchQuery ? [searchQuery] : selectedNeighborhoods, 
      price: selectedPrices,
      type: selectedTypes,
      rooms: selectedRooms,
      area: selectedAreas,
    };

    onSearch(filters);
  }

  const handleSelect = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    setter((prev) => [...prev, id])
  }

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (id: string) => {
    setter((prev) => prev.filter((item) => item !== id))
  }

  const featuredNeighborhoods = neighborhoods.slice(0, 4)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      handleSearch(); //Executa a busca ao pressionar Enter
    }
  }

  return (
    <div className="bg-white p-4 shadow-sm rounded-lg mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Campo de busca ajustado para ficar à esquerda */}
        <div className="relative w-full md:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Busque por bairros"
            className="pl-10 h-10 w-full text-sm"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress} //Captura enter pra buscar diretamente
          />
        </div>

          <div className="flex flex-wrap gap-3 items-center">
            <FilterDropdown
              title="Bairros"
              options={neighborhoods}
              selected={selectedNeighborhoods}
              onSelect={handleSelect(setSelectedNeighborhoods)}
              onRemove={handleRemove(setSelectedNeighborhoods)}
              searchPlaceholder="Buscar por bairros"
              featured={featuredNeighborhoods}
            />

            <FilterDropdown
              title="Valor"
              options={priceRanges}
              selected={selectedPrices}
              onSelect={handleSelect(setSelectedPrices)}
              onRemove={handleRemove(setSelectedPrices)}
            />

            <FilterDropdown
              title="Área"
              options={areaRanges}
              selected={selectedAreas}
              onSelect={handleSelect(setSelectedAreas)}
              onRemove={handleRemove(setSelectedAreas)}
            />

            <FilterDropdown
              title="Tipo do imóvel"
              options={propertyTypes}
              selected={selectedTypes}
              onSelect={handleSelect(setSelectedTypes)}
              onRemove={handleRemove(setSelectedTypes)}
            />

            <FilterDropdown
              title="Quartos"
              options={roomOptions}
              selected={selectedRooms}
              onSelect={handleSelect(setSelectedRooms)}
              onRemove={handleRemove(setSelectedRooms)}
            />

            {/* Botão de Pesquisa */}
        <Button
          className="h-10 px-6 bg-white text-black font-medium rounded-lg border border-gray hover:bg-gray-200 flex items-center gap-2"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
          Buscar
        </Button>
          </div>
        </div>
      </div>
  )
}

