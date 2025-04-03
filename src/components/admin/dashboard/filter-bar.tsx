"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"

interface DateRange {
  start: Date
  end: Date
}

interface FilterBarProps {
  dateRange: DateRange
  propertyType: string
  region: string
  status: string
  onFilterChange: (filters: {
    dateRange: DateRange
    propertyType: string
    region: string
    status: string
  }) => void
}

export default function FilterBar({ dateRange, propertyType, region, status, onFilterChange }: FilterBarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false)
  const [localDateRange, setLocalDateRange] = useState<DateRange>(dateRange)
  const [localPropertyType, setLocalPropertyType] = useState<string>(propertyType)
  const [localRegion, setLocalRegion] = useState<string>(region)
  const [localStatus, setLocalStatus] = useState<string>(status)

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const handleApplyFilters = (): void => {
    onFilterChange({
      dateRange: localDateRange,
      propertyType: localPropertyType,
      region: localRegion,
      status: localStatus,
    })
    setIsDatePickerOpen(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative">
          <button
            className="flex items-center space-x-2 border rounded-md px-4 py-2 w-full md:w-auto"
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          >
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {formatDate(localDateRange.start)} - {formatDate(localDateRange.end)}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {isDatePickerOpen && (
            <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg p-4 w-72">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 w-full"
                    value={new Date(localDateRange.start).toISOString().split("T")[0]}
                    onChange={(e) => setLocalDateRange({ ...localDateRange, start: new Date(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                  <input
                    type="date"
                    className="border rounded-md px-3 py-2 w-full"
                    value={new Date(localDateRange.end).toISOString().split("T")[0]}
                    onChange={(e) => setLocalDateRange({ ...localDateRange, end: new Date(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm" onClick={handleApplyFilters}>
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <select
          className="border rounded-md px-4 py-2 text-sm"
          value={localPropertyType}
          onChange={(e) => {
            setLocalPropertyType(e.target.value)
            onFilterChange({
              dateRange,
              propertyType: e.target.value,
              region,
              status,
            })
          }}
        >
          <option value="all">Todos os Tipos</option>
          <option value="apartment">Apartamento</option>
          <option value="house">Casa</option>
          <option value="commercial">Comercial</option>
          <option value="land">Terreno</option>
        </select>

        <select
          className="border rounded-md px-4 py-2 text-sm"
          value={localRegion}
          onChange={(e) => {
            setLocalRegion(e.target.value)
            onFilterChange({
              dateRange,
              propertyType,
              region: e.target.value,
              status,
            })
          }}
        >
          <option value="all">Todas as Regiões</option>
          <option value="north">Zona Norte</option>
          <option value="south">Zona Sul</option>
          <option value="east">Zona Leste</option>
          <option value="west">Zona Oeste</option>
          <option value="center">Centro</option>
        </select>

        <select
          className="border rounded-md px-4 py-2 text-sm"
          value={localStatus}
          onChange={(e) => {
            setLocalStatus(e.target.value)
            onFilterChange({
              dateRange,
              propertyType,
              region,
              status: e.target.value,
            })
          }}
        >
          <option value="all">Todos os Status</option>
          <option value="available">Disponível</option>
          <option value="sold">Vendido</option>
          <option value="reserved">Reservado</option>
        </select>
      </div>
    </div>
  )
}

