// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET': {
      // Retorna só os bairros distintos
        const { data, error } = await supabase
          .from('properties')
          .select('location')

        if (error) {
          return res.status(400).json({ error: error.message })
        }

        // Remove duplicados, nulos, etc.
        const distinctLocations = [
          ...new Set(data.map((item) => item.location)),
        ].filter(Boolean)

        return res.status(200).json(distinctLocations)
    }

    default:
      return res.status(405).json({ error: 'Método não suportado' })
  }
}
