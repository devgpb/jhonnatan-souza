// pages/api/brokers/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  const broker_id = Number(id)
  if (!broker_id) {
    return res.status(400).json({ error: 'ID inválido ou ausente.' })
  }

  switch (method) {
    case 'GET': {
      // Detalhe do Broker
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('id', broker_id)
        .single()

      if (error || !data) {
        return res.status(404).json({ error: error?.message || 'Broker não encontrado.' })
      }

      return res.status(200).json(data)
    }

    case 'PUT': {
      // Atualizar Broker
      const { name, creci } = req.body
      const fieldsToUpdate: Record<string, unknown> = {}
      if (name) fieldsToUpdate.name = name
      if (creci) fieldsToUpdate.creci = creci

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nada para atualizar.' })
      }

      const { data, error } = await supabase
        .from('brokers')
        .update(fieldsToUpdate)
        .eq('id', broker_id)
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'DELETE': {
      // Excluir Broker
      const { data, error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', broker_id)
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    default:
      return res.status(405).json({ error: 'Método não suportado' })
  }
}
