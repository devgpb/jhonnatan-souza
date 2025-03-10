// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  // Se o id não for numérico, tratar erro ou converter
  const userId = Number(id)
  if (!userId) {
    return res.status(400).json({ error: 'ID inválido' })
  }

  switch (method) {
    case 'GET': {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return res.status(404).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'PUT': {
      const { name, email, password } = req.body
      if (!name && !email && !password) {
        return res.status(400).json({ error: 'Nada para atualizar.' })
      }

      const fieldsToUpdate: any = {}
      if (name) fieldsToUpdate.name = name
      if (email) fieldsToUpdate.email = email
      if (password) fieldsToUpdate.password = password

      const { data, error } = await supabase
        .from('users')
        .update(fieldsToUpdate)
        .eq('id', userId)
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'DELETE': {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
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
