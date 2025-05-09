// pages/api/brokers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET': {
      // Listar todos os Brokers (somente os que NÃO foram soft-deletados)
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .is('deleted_at', null) // <- filtra apenas quem tem deleted_at = NULL

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'POST': {
      // Criar novo Broker
      // updated_at e created_at têm default no banco.
      const { data, error } = await supabase
        .from('brokers')
        .insert([req.body]) // O req.body deve conter name, creci, etc.
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
