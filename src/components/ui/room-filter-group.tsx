"use client"

import { Button } from "@/components/ui/button"

interface RoomFilterGroupProps {
  title: string
  value: number | null
  onChange: (value: number | null) => void
}

export function RoomFilterGroup({ title, value, onChange }: RoomFilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium">{title}</h3>
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          className={`h-10 flex-1 min-w-[90px] ${
            value === null ? "bg-black text-white hover:bg-black/90 hover:text-white" : "bg-background hover:bg-muted"
          }`}
          onClick={() => onChange(null)}
        >
          Qualquer
        </Button>
        {[1, 2, 3, 4, 5].map((number) => (
          <Button
            key={number}
            variant="outline"
            className={`h-10 flex-1 min-w-[48px] ${
              value === number ? "bg-black text-white hover:bg-black/90 hover:text-white" : "bg-muted/30 hover:bg-muted"
            }`}
            onClick={() => onChange(number)}
          >
            +{number}
          </Button>
        ))}
      </div>
    </div>
  )
}

