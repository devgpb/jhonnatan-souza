// pages/api/featured-locations.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Buscar todas as locations existentes
    const { data: locationsData, error: locationsError } = await supabase
      .from('properties')
      .select('location')

    if (locationsError) throw locationsError

    // Limpar dados: remove duplicados e entradas nulas ou vazias
    const distinctLocations = [
      ...new Set(
        locationsData
          .map(item => typeof item.location === 'string' ? item.location.trim() : null)
          .filter(Boolean)
      )
    ]

    // Função para buscar imóveis por location e tipo
    const fetchPropertiesByLocationAndType = async (location: string, keyword: string) => {
      const safeLocation = typeof location === 'string' ? location.trim() : ''
      const safeKeyword = typeof keyword === 'string' ? keyword.trim() : ''

      const { data, error } = await supabase
        .from('properties')
        .select('id, images')
        .ilike('location', `%${safeLocation}%`)
        .ilike('title', `%${safeKeyword}%`)
        .limit(1)
        .single()

      if (error || !data) return null
      return data
    }

    // Montar estrutura final de bairros com imóveis
    const featuredLocations = await Promise.all(
      distinctLocations.map(async (locationRaw) => {
        const location = String(locationRaw)
    
        const principal = await fetchPropertiesByLocationAndType(location, location)
        const apartamento = await fetchPropertiesByLocationAndType(location, 'Apartamento')
        const casa = await fetchPropertiesByLocationAndType(location, 'Casa')
        const cobertura = await fetchPropertiesByLocationAndType(location, 'Cobertura')
    
        return {
          location,
          description: `Explore as melhores opções em ${location}.`,
          principal,
          apartamento,
          casa,
          cobertura,
        }
      })
    )

    return res.status(200).json(featuredLocations)
  } catch (error) {
    console.error('Erro ao buscar bairros destacados:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
