import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface SalesChartData {
  labels: string[];
  sales: number[];
  revenue: number[];
}

interface SalesChartProps {
  data: SalesChartData;
}

export default function SalesChart({ data }: SalesChartProps) {
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
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Vendas',
            data: data.sales,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Receita (R$ mil)',
            data: data.revenue,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.0)',
            tension: 0.3,
            borderDash: [5, 5],
            yAxisID: 'y1',
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
              text: 'Número de Vendas'
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Receita (R$ mil)'
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
