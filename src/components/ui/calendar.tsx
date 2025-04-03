"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DateRange = {
  from: Date
  to: Date
}

export type CalendarProps = {
  className?: string
  numberOfMonths?: number
  fromDate?: Date
  toDate?: Date
  initialRange?: DateRange
  onSelect?: (range: DateRange | undefined) => void
}

export function Calendar({ className, numberOfMonths = 2, fromDate, toDate, initialRange, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(initialRange?.from || new Date())
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(initialRange)
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null)

  // Gerar meses para exibição
  const months = React.useMemo(() => {
    return Array.from({ length: numberOfMonths }, (_, i) => addMonths(currentMonth, i))
  }, [currentMonth, numberOfMonths])

  // Navegar para o mês anterior
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }

  // Navegar para o próximo mês
  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }

  // Manipular clique em um dia
  const handleDayClick = (day: Date) => {
    if (!selectedRange || (selectedRange.from && selectedRange.to)) {
      // Iniciar nova seleção
      const newRange = { from: day, to: day }
      setSelectedRange(newRange)
      onSelect?.(newRange)
    } else if (selectedRange.from && !selectedRange.to) {
      // Completar a seleção
      if (day < selectedRange.from) {
        const newRange = { from: day, to: selectedRange.from }
        setSelectedRange(newRange)
        onSelect?.(newRange)
      } else {
        const newRange = { from: selectedRange.from, to: day }
        setSelectedRange(newRange)
        onSelect?.(newRange)
      }
    }
  }

  // Manipular hover sobre um dia
  const handleDayHover = (day: Date) => {
    if (selectedRange?.from && !selectedRange.to) {
      setHoverDate(day)
    }
  }

  // Verificar se um dia está dentro do intervalo selecionado
  const isDayInRange = (day: Date) => {
    if (!selectedRange?.from) return false

    if (selectedRange.to) {
      return isWithinInterval(day, { start: selectedRange.from, end: selectedRange.to })
    }

    if (hoverDate) {
      const start = hoverDate < selectedRange.from ? hoverDate : selectedRange.from
      const end = hoverDate < selectedRange.from ? selectedRange.from : hoverDate
      return isWithinInterval(day, { start, end })
    }

    return isSameDay(day, selectedRange.from)
  }

  // Verificar se um dia é o início do intervalo
  const isDayRangeStart = (day: Date) => {
    if (!selectedRange?.from) return false
    return isSameDay(day, selectedRange.from)
  }

  // Verificar se um dia é o fim do intervalo
  const isDayRangeEnd = (day: Date) => {
    if (!selectedRange?.to) return false
    return isSameDay(day, selectedRange.to)
  }

  // Alterar o mês
  const handleMonthChange = (monthIndex: number, monthDate: Date) => {
    const newDate = setMonth(monthDate, monthIndex)
    setCurrentMonth(newDate)
  }

  // Alterar o ano
  const handleYearChange = (year: number, monthDate: Date) => {
    const newDate = setYear(monthDate, year)
    setCurrentMonth(newDate)
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-md p-4 w-fit mx-auto", className)}>
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0">
        {months.map((month, index) => (
          <div key={index} className="space-y-6">
            <div className="flex justify-center pt-2 pb-4 relative items-center px-10">
              {index === 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 h-8 w-8 bg-transparent p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-md flex items-center justify-center"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Mês anterior</span>
                </Button>
              )}

              <MonthYearSelector
                date={month}
                onMonthChange={(monthIndex) => handleMonthChange(monthIndex, month)}
                onYearChange={(year) => handleYearChange(year, month)}
              />

              {index === months.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-8 w-8 bg-transparent p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-md flex items-center justify-center"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Próximo mês</span>
                </Button>
              )}
            </div>

            <CalendarMonth
              month={month}
              selectedRange={selectedRange}
              onDayClick={handleDayClick}
              onDayHover={handleDayHover}
              isDayInRange={isDayInRange}
              isDayRangeStart={isDayRangeStart}
              isDayRangeEnd={isDayRangeEnd}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para seleção de mês e ano
function MonthYearSelector({
  date,
  onMonthChange,
  onYearChange,
}: {
  date: Date
  onMonthChange: (monthIndex: number) => void
  onYearChange: (year: number) => void
}) {
  const currentYear = getYear(date)
  const currentMonthIndex = getMonth(date)

  // Gerar anos (5 anos antes e 10 anos depois do ano atual)
  const currentYearActual = new Date().getFullYear()
  const years = Array.from({ length: 16 }, (_, i) => currentYearActual - 5 + i)

  // Gerar meses
  const months = Array.from({ length: 12 }, (_, i) => {
    return {
      index: i,
      name: format(new Date(currentYear, i, 1), "MMMM", { locale: ptBR }),
    }
  })

  return (
    <div className="flex items-center gap-2 justify-center">
      <Select value={currentMonthIndex.toString()} onValueChange={(value) => onMonthChange(Number.parseInt(value))}>
        <SelectTrigger className="h-8 w-[130px] text-sm font-medium bg-white border-none shadow-none hover:bg-gray-50 focus:ring-0">
          <SelectValue placeholder={months[currentMonthIndex].name} />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.index} value={month.index.toString()} className="text-sm capitalize">
              {month.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentYear.toString()} onValueChange={(value) => onYearChange(Number.parseInt(value))}>
        <SelectTrigger className="h-8 w-[90px] text-sm font-medium bg-white border-none shadow-none hover:bg-gray-50 focus:ring-0">
          <SelectValue placeholder={currentYear.toString()} />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()} className="text-sm">
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Componente para exibir um mês
function CalendarMonth({
  month,
  selectedRange,
  onDayClick,
  onDayHover,
  isDayInRange,
  isDayRangeStart,
  isDayRangeEnd,
}: {
  month: Date
  selectedRange?: DateRange
  onDayClick: (day: Date) => void
  onDayHover: (day: Date) => void
  isDayInRange: (day: Date) => boolean
  isDayRangeStart: (day: Date) => boolean
  isDayRangeEnd: (day: Date) => boolean
}) {
  const today = new Date()

  // Gerar dias do mês
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Gerar semanas completas (incluindo dias de outros meses)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Agrupar dias em semanas
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  calendarDays.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return (
    <div>
      {/* Cabeçalho dos dias da semana */}
      <div className="flex w-full">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center rounded-md text-[0.8rem] font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex w-full">
            {week.map((day, dayIndex) => {
              const isToday = isSameDay(day, today)
              const isCurrentMonth = isSameMonth(day, month)
              const isInRange = isDayInRange(day)
              const isRangeStart = isDayRangeStart(day)
              const isRangeEnd = isDayRangeEnd(day)

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    "relative w-10 h-10 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    isInRange && "bg-primary/10",
                    isRangeStart && "rounded-l-md",
                    isRangeEnd && "rounded-r-md",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onDayClick(day)}
                    onMouseEnter={() => onDayHover(day)}
                    className={cn(
                      "h-10 w-10 p-0 font-medium aria-selected:opacity-100 rounded-md",
                      "transition-colors duration-200 ease-in-out",
                      !isCurrentMonth && "text-gray-300 opacity-50",
                      isToday && "border-2 border-primary text-primary font-semibold",
                      isRangeStart &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      isRangeEnd && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      isInRange && !isRangeStart && !isRangeEnd && "bg-primary/10 text-gray-900 hover:bg-primary/20",
                      !isInRange && isCurrentMonth && "hover:bg-gray-100",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                  <div
                    className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none z-[-1]"
                    aria-hidden="true"
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

