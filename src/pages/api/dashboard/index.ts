// pages/api/dashboard/index.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { DashboardData } from '@/types/dashboard'
// Inicializa o Prisma Client.
// Em produção, convém instanciar apenas uma vez, usando padrão Singleton.
const prisma = new PrismaClient()


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Exemplo de datas para cálculo de "este mês" e "mês passado"
    // Ajuste conforme sua preferência (por ex. usando dayjs ou date-fns).
    const now = new Date()
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    )
    const lastDayLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    )

    // -- 1) Quantidade de vendas do mês atual --
    const currentMonthSales = await prisma.properties.count({
      where: {
        sold: true,
        sell_date: {
          gte: firstDayCurrentMonth, // a partir do início do mês atual
          lte: now,
        },
      },
    })

    // -- 2) Quantidade de vendas do mês anterior --
    const lastMonthSales = await prisma.properties.count({
      where: {
        sold: true,
        sell_date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
    })

    // Exemplo simples de variação em relação ao mês anterior
    const monthlySalesPercentageChange =
      lastMonthSales === 0
        ? 100 // se o mês anterior era zero, e agora tem vendas
        : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100

    // -- 3) Total de vendas em valor (receita total) --
    // Exemplo: soma de todos os preços das propriedades vendidas, independente de data
    const totalRevenueAllTime = await prisma.properties.aggregate({
      where: {
        sold: true,
      },
      _sum: {
        price: true,
      },
    })

    const totalRevenueValue = totalRevenueAllTime._sum.price ?? 0

    // Para pegar a receita deste mês (para comparar com a do mês passado):
    const currentMonthRevenue = await prisma.properties.aggregate({
      where: {
        sold: true,
        sell_date: {
          gte: firstDayCurrentMonth,
          lte: now,
        },
      },
      _sum: {
        price: true,
      },
    })

    const currentMonthRevenueValue = currentMonthRevenue._sum.price ?? 0

    const lastMonthRevenue = await prisma.properties.aggregate({
      where: {
        sold: true,
        sell_date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
      _sum: {
        price: true,
      },
    })

    const lastMonthRevenueValue = lastMonthRevenue._sum.price ?? 0

    const totalRevenuePercentageChange =
      lastMonthRevenueValue === 0
        ? 100
        : ((Number(currentMonthRevenueValue) - Number(lastMonthRevenueValue)) /
            Number(lastMonthRevenueValue)) *
          100

    // -- 4) Taxa de conversão (exemplo) --
    // Supomos conversão como: (propriedades vendidas / total de propriedades) * 100
    // É só um exemplo, adapte de acordo com sua lógica real de negócio.
    const totalPropertiesCount = await prisma.properties.count()
    const totalPropertiesSoldCount = await prisma.properties.count({
      where: {
        sold: true,
      },
    })
    const conversionRatePercentage =
      totalPropertiesCount === 0
        ? 0
        : (totalPropertiesSoldCount / totalPropertiesCount) * 100

    // Para variar em relação ao mês anterior, podemos fazer algo parecido.
    // Aqui vamos apenas manter um valor fictício.
    const conversionRatePercentageChange = 5 // Exemplo fixo

    // -- 5) Tempo médio de mercado (averageMarketTime) --
    // Exemplo: diferença entre created_at e sell_date para as propriedades vendidas.
    // Lembrando que sell_date é DateTime?. Se não existir, significa não vendida.
    // Precisamos pegar a média em dias.
    const soldProperties = await prisma.properties.findMany({
      where: {
        sold: true,
        sell_date: {
          not: null,
        },
      },
      select: {
        created_at: true,
        sell_date: true,
      },
    })

    let totalDaysDiff = 0
    soldProperties.forEach((prop) => {
      const createdAt = prop.created_at ?? new Date()
      const soldAt = prop.sell_date ?? new Date()
      const diffInMs = soldAt.getTime() - createdAt.getTime()
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
      totalDaysDiff += diffInDays
    })

    const averageMarketTimeDays =
      soldProperties.length === 0
        ? 0
        : parseFloat((totalDaysDiff / soldProperties.length).toFixed(2))

    // -- 6) Preço médio (todas as propriedades) --
    const averagePriceAllProps = await prisma.properties.aggregate({
      _avg: {
        price: true,
      },
    })
    const averagePrice = averagePriceAllProps._avg.price ?? 0

    // -- 7) Total de propriedades vendidas (todas) --
    const propertiesSold = totalPropertiesSoldCount

    // -- 8) Transações recentes (exemplo) --
    // Vamos pegar as 5 mais recentes propriedades vendidas, ordenando por sell_date desc
    // e montar um array de Transaction
    const recentSoldProperties = await prisma.properties.findMany({
      where: {
        sold: true,
      },
      orderBy: {
        sell_date: 'desc',
      },
      take: 5,
      include: {
        brokers: true,
      },
    })

    const recentTransactions = recentSoldProperties.map((prop) => ({
      property: prop.title,
      agent: prop.brokers?.name ?? 'Sem corretor',
      value: Number(prop.price),
      date: prop.sell_date?.toISOString() ?? '',
      status: prop.status,
    }))

    // Monta objeto final
    const dashboardData: DashboardData = {
      kpis:{
        monthlySales: {
          value: currentMonthSales,
          percentageChange: parseFloat(monthlySalesPercentageChange.toFixed(2)),
        },
        totalRevenue: {
          value: parseFloat(totalRevenueValue.toFixed(2)),
          percentageChange: parseFloat(totalRevenuePercentageChange.toFixed(2)),
        },
        conversionRate: {
          percentage: parseFloat(conversionRatePercentage.toFixed(2)),
          percentageChange: parseFloat(conversionRatePercentageChange.toFixed(2)),
        },
      },
      summary: {
        totalProperties: totalPropertiesCount,
        averageMarketTime: {
          days: averageMarketTimeDays,
        },
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        soldProperties: propertiesSold,
      },
      recentTransactions,
    }

    return res.status(200).json(dashboardData)
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
