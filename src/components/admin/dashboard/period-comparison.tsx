import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PeriodComparisonData {
  categories: string[];
  currentPeriodLabel: string;
  previousPeriodLabel: string;
  currentPeriod: number[];
  previousPeriod: number[];
}

interface PeriodComparisonProps {
  data: PeriodComparisonData;
}

export default function PeriodComparison({ data }: PeriodComparisonProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.categories,
        datasets: [
          {
            label: data.currentPeriodLabel,
            data: data.currentPeriod,
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: data.previousPeriodLabel,
            data: data.previousPeriod,
            backgroundColor: "rgba(203, 213, 225, 0.8)",
            borderColor: "rgb(203, 213, 225)",
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              boxWidth: 6,
            },
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
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              precision: 0,
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

