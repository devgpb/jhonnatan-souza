// pages/api/properties/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query
  
  if (!id) {
    return res.status(400).json({ error: 'ID inválido ou ausente.' })
  }

  switch (method) {
    case 'GET': {
      // Detalhe da propriedade
      const { data, error } = await supabase
        .from('properties')
        .select('*, brokers(*)')
        .eq('id', id)
        .single()

      if (error || !data) {
        return res.status(404).json({ error: error?.message || 'Propriedade não encontrada.' })
      }

      return res.status(200).json(data)
    }

    case 'PUT': {
      const propertyData = req.body
    
      if (!propertyData || Object.keys(propertyData).length === 0) {
        return res.status(400).json({ error: 'Nada para atualizar.' })
      }
    
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .single()
    
      if (error) {
        console.log(error)
        console.log(req.body)
        return res.status(400).json({ error: error.message })
      }
    
      return res.status(200).json(data)
    }
    

    case 'DELETE': {
      // Excluir propriedade
      console.log(id)
      const { data, error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
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
