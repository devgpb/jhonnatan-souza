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

    // Generate colors for each broker
    const generateColors = (count: number) => {
      const colors = [
        "rgba(59, 130, 246, 0.8)", // blue
        "rgba(16, 185, 129, 0.8)", // green
        "rgba(245, 158, 11, 0.8)", // amber
        "rgba(239, 68, 68, 0.8)", // red
        "rgba(139, 92, 246, 0.8)", // purple
      ]

      return Array.from({ length: count }, (_, i) => colors[i % colors.length])
    }

    const backgroundColors = generateColors(data.brokers.length)
    const borderColors = backgroundColors.map((color) => color.replace("0.8", "1"))

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.brokers,
        datasets: [
          {
            label: "Vendas",
            data: data.sales,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "rgba(203, 213, 225, 0.5)",
            borderWidth: 1,
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              precision: 0,
            },
          },
          y: {
            grid: {
              display: false,
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

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

