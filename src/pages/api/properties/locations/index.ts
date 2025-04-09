// pages/api/featured-locations.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não suportado' })
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  const locations = [...new Set(data.map((item) => item.location))].filter(Boolean)

  const response = locations.map((location) => {
    const propertiesInLocation = data.filter((item) => item.location === location)

    const getRandom = (list: any[]) => list[Math.floor(Math.random() * list.length)]

    const principal = getRandom(propertiesInLocation)
    const apartamento = getRandom(propertiesInLocation.filter((item) => item.title.toLowerCase().includes('apartamento')))
    const casa = getRandom(propertiesInLocation.filter((item) => item.title.toLowerCase().includes('casa')))
    const cobertura = getRandom(propertiesInLocation.filter((item) => item.title.toLowerCase().includes('cobertura')))

    return {
      location,
      description: `Explore imóveis em ${location}, descubra as melhores opções de moradia na região.`,
      principal,
      apartamento,
      casa,
      cobertura,
    }
  })

  return res.status(200).json(response)
}
