// pages/api/featured-locations.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: locationsData, error: locationsError } = await supabase
      .from('properties')
      .select('location')

    if (locationsError) throw locationsError

    const distinctLocations = [...new Set(locationsData.map(item => item.location))].filter(Boolean)

    const fetchPropertiesByLocationAndType = async (location: string, keyword: string) => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, images')
        .ilike('location', `%${location}%`)
        .ilike('title', `%${keyword}%`)
        .limit(1)
        .single()

      if (error || !data) return null
      return data
    }

    const featuredLocations = await Promise.all(
      distinctLocations.map(async (location) => {
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
