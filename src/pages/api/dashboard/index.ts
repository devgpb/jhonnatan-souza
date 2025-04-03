
// pages/api/brokers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { dateRange, propertyType, region, status } = req.body

    // Parse date range
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    // Calculate previous period for comparison
    const periodDuration = endDate.getTime() - startDate.getTime()
    const previousStartDate = new Date(startDate.getTime() - periodDuration)
    const previousEndDate = new Date(startDate)

    // Preparar os filtros (ajuste conforme o seu schema, por exemplo, adicionando filtros de "type" ou "region")
    const baseFilters = (query: any, fromDate: Date, toDate: Date) =>
      query
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString())

    // Filtros para período atual e anterior
    let currentQuery = supabase
      .from("properties")
      .select("id", { count: "exact" })
      .eq("sold", true)
    currentQuery = baseFilters(currentQuery, startDate, endDate)

    let previousQuery = supabase
      .from("properties")
      .select("id", { count: "exact" })
      .eq("sold", true)
    previousQuery = baseFilters(previousQuery, previousStartDate, previousEndDate)

    // Filtros opcionais para propertyType e region
    if (propertyType !== "all") {
      currentQuery = currentQuery.eq("type", propertyType)
      previousQuery = previousQuery.eq("type", propertyType)
    }
    if (region !== "all") {
      currentQuery = currentQuery.eq("region", region)
      previousQuery = previousQuery.eq("region", region)
    }
    if (status !== "all") {
      if (status === "sold") {
        currentQuery = currentQuery.eq("sold", true)
        previousQuery = previousQuery.eq("sold", true)
      } else if (status === "available") {
        currentQuery = currentQuery.eq("sold", false)
        previousQuery = previousQuery.eq("sold", false)
      }
    }

    // Obter contagem de vendas nos períodos
    const { count: currentPeriodSales, error: currentCountError } = await currentQuery
    if (currentCountError) throw currentCountError

    const { count: previousPeriodSales, error: previousCountError } = await previousQuery
    if (previousCountError) throw previousCountError

    const salesTrend =
      (previousPeriodSales ?? 0) > 0
        ? Math.round((((currentPeriodSales ?? 0) - (previousPeriodSales ?? 0)) / (previousPeriodSales ?? 1)) * 100)
        : 100

    // Calcular receita total para os períodos (buscando os registros e somando no servidor)
    let currentRevenueQuery = supabase
      .from("properties")
      .select("price")
      .eq("sold", true)
    currentRevenueQuery = baseFilters(currentRevenueQuery, startDate, endDate)
    if (propertyType !== "all") currentRevenueQuery = currentRevenueQuery.eq("type", propertyType)
    if (region !== "all") currentRevenueQuery = currentRevenueQuery.eq("region", region)

    let previousRevenueQuery = supabase
      .from("properties")
      .select("price")
      .eq("sold", true)
    previousRevenueQuery = baseFilters(previousRevenueQuery, previousStartDate, previousEndDate)
    if (propertyType !== "all") previousRevenueQuery = previousRevenueQuery.eq("type", propertyType)
    if (region !== "all") previousRevenueQuery = previousRevenueQuery.eq("region", region)

    const { data: currentRevenueData, error: currentRevenueError } = await currentRevenueQuery
    if (currentRevenueError) throw currentRevenueError

    const { data: previousRevenueData, error: previousRevenueError } = await previousRevenueQuery
    if (previousRevenueError) throw previousRevenueError

    const currentRevenueValue = currentRevenueData.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    )
    const previousRevenueValue = previousRevenueData.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    )

    const revenueTrend =
      previousRevenueValue > 0
        ? Math.round(((currentRevenueValue - previousRevenueValue) / previousRevenueValue) * 100)
        : 100

    // Obter performance dos corretores (agrupamento feito no lado do servidor)
    let brokerQuery = supabase
      .from("properties")
      .select("broker_id")
      .eq("sold", true)
      .not("broker_id", "is", null)
    brokerQuery = baseFilters(brokerQuery, startDate, endDate)

    const { data: brokerData, error: brokerError } = await brokerQuery
    if (brokerError) throw brokerError

    // Agrupar vendas por broker_id
    const brokerPerformanceMap: { [key: string]: number } = {}
    brokerData.forEach((item) => {
      if (item.broker_id) {
        brokerPerformanceMap[item.broker_id] = (brokerPerformanceMap[item.broker_id] || 0) + 1
      }
    })

    const brokerIds = Object.keys(brokerPerformanceMap)
    let brokers: { id: string; name: string; creci: string }[] = []
    if (brokerIds.length > 0) {
      const { data: brokersData, error: brokersError } = await supabase
        .from("brokers")
        .select("id, name, creci")
        .in("id", brokerIds)
      if (brokersError) throw brokersError
      brokers = brokersData
    }

    const brokerMap: { [key: string]: string } = {}
    brokers.forEach((broker) => {
      brokerMap[broker.id] = broker.name
    })

    const formattedBrokerPerformance = {
      brokers: Object.keys(brokerPerformanceMap).map(
        (brokerId) => brokerMap[brokerId] || `Corretor ${brokerId}`
      ),
      sales: Object.keys(brokerPerformanceMap).map(
        (brokerId) => brokerPerformanceMap[brokerId]
      ),
    }

    // Gerar dados mock para trend de vendas e receita (últimos 7 dias)
    const today = new Date()
    const labels = []
    const salesData = []
    const revenueDataArray = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      labels.push(
        date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      )
      const dailySales = Math.floor(Math.random() * 10) + 1
      salesData.push(dailySales)
      const dailyRevenue = Math.floor(Math.random() * 400) + 100
      revenueDataArray.push(dailyRevenue)
    }

    // Dados mock para comparação de períodos e dados de localização
    const periodComparisonData = {
      categories: ["Apartamentos", "Casas", "Comercial", "Terrenos"],
      currentPeriodLabel: "Período Atual",
      previousPeriodLabel: "Período Anterior",
      currentPeriod: [450000, 680000, 320000, 210000],
      previousPeriod: [380000, 720000, 290000, 180000],
    }

    const locationPoints = []
    for (let i = 0; i < 15; i++) {
      locationPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        value: Math.floor(Math.random() * 20) + 5,
        sold: Math.random() > 0.5,
      })
    }

    // Obter transações recentes
    const { data: recentTransactionsData, error: recentTransactionsError } = await supabase
      .from("properties")
      .select(`
        id,
        title,
        location,
        images,
        price,
        updated_at,
        sold,
        brokers (
          name,
          creci
        )
      `)
      .eq("sold", true)
      .order("updated_at", { ascending: false })
      .limit(5)
    if (recentTransactionsError) throw recentTransactionsError

    const formattedTransactions = recentTransactionsData.map((property) => ({
      id: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage:
        property.images && property.images.length > 0 ? property.images[0] : null,
      brokerName: Array.isArray(property.brokers) && property.brokers.length > 0 ? property.brokers[0].name : "N/A",
      brokerCreci: Array.isArray(property.brokers) && property.brokers.length > 0 ? property.brokers[0].creci : "N/A",
      value: parseFloat(property.price),
      date: property.updated_at,
      status: property.sold ? "sold" : "available",
    }))

    // Dados de resumo
    const { count: totalProperties, error: totalPropertiesError } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
    if (totalPropertiesError) throw totalPropertiesError

    const { count: soldProperties, error: soldPropertiesError } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("sold", true)
    if (soldPropertiesError) throw soldPropertiesError

    // Cálculo da média de preço (buscando todos os registros – cuidado com performance em tabelas grandes)
    const { data: allPropertiesData, error: allPropertiesError } = await supabase
      .from("properties")
      .select("price")
    if (allPropertiesError) throw allPropertiesError

    const totalPrice = allPropertiesData.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    )
    const avgPrice =
      allPropertiesData.length > 0 ? totalPrice / allPropertiesData.length : 0

    // Dados mock para tempo médio no mercado e taxa de conversão (essas métricas podem vir de outros acompanhamentos)
    const avgTimeOnMarket = 45
    const conversionRate = {
      value: 24,
      trend: 3,
    }

    const dashboardData = {
      kpis: {
        monthlySales: {
          count: currentPeriodSales,
          trend: salesTrend,
        },
        totalRevenue: {
          value: currentRevenueValue,
          trend: revenueTrend,
        },
        conversionRate,
      },
      salesTrend: {
        labels,
        sales: salesData,
        revenue: revenueDataArray,
      },
      periodComparison: periodComparisonData,
      brokerPerformance: formattedBrokerPerformance,
      locationData: {
        points: locationPoints,
      },
      summary: {
        totalProperties,
        avgTimeOnMarket,
        avgPrice,
        soldProperties,
      },
      recentTransactions: {
        transactions: formattedTransactions,
      },
    }

    res.status(200).json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    res
      .status(500)
      .json({ 
        message: "Error fetching dashboard data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      })
  }
}