export interface DashboardData {
  kpis:kpiData
  summary: DashboardSummary
  recentTransactions: Transaction[]
}

export interface Transaction {
  property: string
  agent: string
  value: number
  date: string 
  status: string
}

export interface kpiData{
    monthlySales: {
        value: number
        percentageChange: number
    }
    totalRevenue: {
        value: number
        percentageChange: number
    }
    conversionRate: {
        percentage: number
        percentageChange: number
    }
}

export interface DashboardSummary{
    totalProperties: number
    averageMarketTime: {
        days: number
    }
    averagePrice: number
    soldProperties: number
}
