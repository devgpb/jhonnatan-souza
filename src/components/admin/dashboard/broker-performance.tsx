"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

interface BrokerPerformanceData {
  brokers: string[];
  sales: number[];
}

export default function BrokerPerformance({ data }: { data: BrokerPerformanceData }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!data || !chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.brokers,
        datasets: [
          {
            data: data.sales,
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(239, 68, 68, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(236, 72, 153, 0.7)",
            ],
            borderColor: [
              "rgb(59, 130, 246)",
              "rgb(16, 185, 129)",
              "rgb(245, 158, 11)",
              "rgb(239, 68, 68)",
              "rgb(139, 92, 246)",
              "rgb(236, 72, 153)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((Number(value) / Number(total)) * 100)
                return `${label}: ${value} vendas (${percentage}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  if (!data) return <div className="h-64 flex items-center justify-center">Sem dados disponíveis</div>

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

