"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Search } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar, type DateRange } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FilterDateRange {
  start: Date
  end: Date
}

interface FilterBarProps {
  dateRange: FilterDateRange
  propertyType: string
  region: string
  status: string
  onFilterChange: (filters: {
    dateRange: FilterDateRange
    propertyType: string
    region: string
    status: string
  }) => void
}

export default function FilterBar({ dateRange, propertyType, region, status, onFilterChange }: FilterBarProps) {
  const [localDateRange, setLocalDateRange] = useState<FilterDateRange>(dateRange)
  const [startDateInput, setStartDateInput] = useState(format(dateRange.start, "dd/MM/yyyy"))
  const [endDateInput, setEndDateInput] = useState(format(dateRange.end, "dd/MM/yyyy"))
  const [localPropertyType, setLocalPropertyType] = useState<string>(propertyType)
  const [localRegion, setLocalRegion] = useState<string>(region)
  const [localStatus, setLocalStatus] = useState<string>(status)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateInputError, setDateInputError] = useState("")

  // Update input fields when date range changes from calendar
  useEffect(() => {
    setStartDateInput(format(localDateRange.start, "dd/MM/yyyy"))
    setEndDateInput(format(localDateRange.end, "dd/MM/yyyy"))
  }, [localDateRange])

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange: localDateRange,
      propertyType: localPropertyType,
      region: localRegion,
      status: localStatus,
    })
    setCalendarOpen(false)
  }

  const formatDateRange = (range: FilterDateRange) => {
    return `${format(range.start, "dd/MM/yyyy", { locale: ptBR })} - ${format(range.end, "dd/MM/yyyy", { locale: ptBR })}`
  }

  const handleStartDateChange = (value: string) => {
    setStartDateInput(value)
    setDateInputError("")

    // Parse the input date
    const parsedDate = parse(value, "dd/MM/yyyy", new Date())

    if (isValid(parsedDate)) {
      setLocalDateRange((prev) => ({
        start: parsedDate,
        end: prev.end,
      }))
    }
  }

  const handleEndDateChange = (value: string) => {
    setEndDateInput(value)
    setDateInputError("")

    // Parse the input date
    const parsedDate = parse(value, "dd/MM/yyyy", new Date())

    if (isValid(parsedDate)) {
      setLocalDateRange((prev) => ({
        start: prev.start,
        end: parsedDate,
      }))
    }
  }

  const validateDateInputs = () => {
    const startDate = parse(startDateInput, "dd/MM/yyyy", new Date())
    const endDate = parse(endDateInput, "dd/MM/yyyy", new Date())

    if (!isValid(startDate)) {
      setDateInputError("Data inicial inválida")
      return false
    }

    if (!isValid(endDate)) {
      setDateInputError("Data final inválida")
      return false
    }

    if (startDate > endDate) {
      setDateInputError("Data inicial não pode ser maior que a data final")
      return false
    }

    setDateInputError("")
    return true
  }

  const handleApplyDateRange = () => {
    if (validateDateInputs()) {
      const startDate = parse(startDateInput, "dd/MM/yyyy", new Date())
      const endDate = parse(endDateInput, "dd/MM/yyyy", new Date())

      setLocalDateRange({
        start: startDate,
        end: endDate,
      })

      setCalendarOpen(false)
    }
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setLocalDateRange({
        start: range.from,
        end: range.to,
      })
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar imóveis, clientes ou corretores..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {formatDateRange(localDateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg rounded-lg border-gray-200" align="start">
              <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Selecione o período</h3>

                {/* Date input fields */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="flex-1">
                    <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">
                      Data inicial
                    </label>
                    <Input
                      id="start-date"
                      value={startDateInput}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="text-sm h-9"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">
                      Data final
                    </label>
                    <Input
                      id="end-date"
                      value={endDateInput}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="text-sm h-9"
                    />
                  </div>
                </div>

                {dateInputError && <p className="text-xs text-red-500 mt-1">{dateInputError}</p>}
              </div>

              <div className="p-3 bg-white">
                <Calendar
                  numberOfMonths={2}
                  initialRange={{
                    from: localDateRange.start,
                    to: localDateRange.end,
                  }}
                  onSelect={handleCalendarSelect}
                  className="rounded-md border-0"
                />
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setCalendarOpen(false)} className="text-xs">
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleApplyDateRange} className="text-xs">
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel</label>
          <Select value={localPropertyType} onValueChange={setLocalPropertyType}>
            <SelectTrigger className="border-gray-200 hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
              <SelectItem value="house">Casa</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
          <Select value={localRegion} onValueChange={setLocalRegion}>
            <SelectTrigger className="border-gray-200 hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              <SelectItem value="north">Norte</SelectItem>
              <SelectItem value="south">Sul</SelectItem>
              <SelectItem value="east">Leste</SelectItem>
              <SelectItem value="west">Oeste</SelectItem>
              <SelectItem value="central">Central</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <Select value={localStatus} onValueChange={setLocalStatus}>
            <SelectTrigger className="border-gray-200 hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
              <SelectItem value="reserved">Reservado</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/90 transition-colors">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}

