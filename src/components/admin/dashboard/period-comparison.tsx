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
    if (!data || !chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.categories,
        datasets: [
          {
            label: data.currentPeriodLabel,
            data: data.currentPeriod,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: data.previousPeriodLabel,
            data: data.previousPeriod,
            backgroundColor: 'rgba(209, 213, 219, 0.7)',
            borderColor: 'rgb(156, 163, 175)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor (R$)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            position: 'top',
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) return <div className="h-64 flex items-center justify-center">Sem dados disponíveis</div>;

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
