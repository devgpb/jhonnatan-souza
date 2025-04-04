// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const { page = 1, limit = 6 } = req.query

      const offset = (Number(page) - 1) * Number(limit)
      // Listar todas as propriedades
      const { data, error } = await supabase
        .from('properties')
        .select('*, brokers(*)') 
        .range(offset, offset + Number(limit) - 1)
      console.log(data)
      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'POST': {
      // Criar nova propriedade
      // Exemplo: { address, price, broker_id }
      const { data, error } = await supabase
        .from('properties')
        .insert([req.body])
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(201).json(data)
    }

    default:
      return res.status(405).json({ error: 'Método não suportado' })
  }
}
