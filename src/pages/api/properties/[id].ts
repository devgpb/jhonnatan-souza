// pages/api/properties/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  const propertyId = Number(id)
  if (!propertyId) {
    return res.status(400).json({ error: 'ID inválido ou ausente.' })
  }

  switch (method) {
    case 'GET': {
      // Detalhe da propriedade
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (error || !data) {
        return res.status(404).json({ error: error?.message || 'Propriedade não encontrada.' })
      }

      return res.status(200).json(data)
    }

    case 'PUT': {
      // Atualizar propriedade
      // Exemplo: { address, price, broker_id }
      const { address, price, broker_id } = req.body
      const fieldsToUpdate: Record<string, unknown> = {}
      if (address) fieldsToUpdate.address = address
      if (price) fieldsToUpdate.price = price
      if (broker_id !== undefined) fieldsToUpdate.broker_id = broker_id

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'Nada para atualizar.' })
      }

      const { data, error } = await supabase
        .from('properties')
        .update(fieldsToUpdate)
        .eq('id', propertyId)
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'DELETE': {
      // Excluir propriedade
      const { data, error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
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
