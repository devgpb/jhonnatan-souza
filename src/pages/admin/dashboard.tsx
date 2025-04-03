import { useState, useEffect } from 'react';
import Head from 'next/head';
import SidebarLayout from "@/layouts/SideBarLayout";

import KpiCards from '@/components/admin/dashboard/kpi-cards';
import SalesChart from '@/components/admin/dashboard/sales-chart';
import BrokerPerformance from '@/components/admin/dashboard/broker-performance';
import PropertyMap from '@/components/admin/dashboard/property-map';
import RecentTransactions from '@/components/admin/dashboard/recent-transactions';
import FilterBar from '@/components/admin/dashboard/filter-bar';
import SummaryCards from '@/components/admin/dashboard/summary-cards';
import PeriodComparison from '@/components/admin/dashboard/period-comparison';

// Define types for filter state
interface DateRange {
  start: Date;
  end: Date;
}

interface FilterState {
  dateRange: DateRange;
  propertyType: string;
  region: string;
  status: string;
}

// Dashboard data interface
interface DashboardData {
  kpis: {
    monthlySales: {
      count: number;
      trend: number;
    };
    totalRevenue: {
      value: number;
      trend: number;
    };
    conversionRate: {
      value: number;
      trend: number;
    };
  };
  salesTrend: {
    labels: string[];
    sales: number[];
    revenue: number[];
  };
  periodComparison: {
    categories: string[];
    currentPeriodLabel: string;
    previousPeriodLabel: string;
    currentPeriod: number[];
    previousPeriod: number[];
  };
  brokerPerformance: {
    brokers: string[];
    sales: number[];
  };
  locationData: {
    points: Array<{
      x: number;
      y: number;
      value: number;
      sold: boolean;
    }>;
  };
  summary: {
    totalProperties: number;
    avgTimeOnMarket: number;
    avgPrice: number;
    soldProperties: number;
  };
  recentTransactions: {
    transactions: Array<{
      id: number;
      propertyTitle: string;
      propertyLocation: string;
      propertyImage: string | null;
      brokerName: string;
      brokerCreci: string;
      value: number;
      date: string | Date;
      status: string;
    }>;
  };
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({ 
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)), 
    end: new Date() 
  });
  const [propertyType, setPropertyType] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRange,
            propertyType,
            region,
            status
          }),
        });
        
        if (!response.ok) {
          // throw new Error('Failed to fetch dashboard data');
          console.log(response)
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange, propertyType, region, status]);

  const handleFilterChange = (filters: FilterState) => {
    setDateRange(filters.dateRange);
    setPropertyType(filters.propertyType);
    setRegion(filters.region);
    setStatus(filters.status);
  };

  return (
    <SidebarLayout>
      <div className="flex-1 p-4 ml-64">

        <Head>
          <title>Dashboard Imobiliário</title>
        </Head>
        
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Imobiliário</h1>
          </div>

          <FilterBar 
            dateRange={dateRange}
            propertyType={propertyType}
            region={region}
            status={status}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : dashboardData ? (
            <>
              <div className="mb-6">
                <KpiCards data={dashboardData.kpis} />
              </div>
  
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Tendência de Vendas</h2>
                  <SalesChart data={dashboardData.salesTrend} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Comparativo de Períodos</h2>
                  <PeriodComparison data={dashboardData.periodComparison} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Desempenho por Corretor</h2>
                  <BrokerPerformance data={dashboardData.brokerPerformance} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Distribuição Geográfica</h2>
                  <PropertyMap data={dashboardData.locationData} />
                </div>
              </div>

              <div className="mb-6">
                <SummaryCards data={dashboardData.summary} />
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Transações Recentes</h2>
                <RecentTransactions data={dashboardData.recentTransactions} />
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum dado disponível. Tente ajustar os filtros.</p>
            </div>
          )}
        </div>
        </div>
    </SidebarLayout>
  );
}
