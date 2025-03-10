// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const { data, error } = await supabase
        .from('users')      // Nome da tabela no Supabase
        .select('*')

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.status(200).json(data)
    }

    case 'POST': {
      // Aqui esperamos algo como { name, email, password } no corpo
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' })
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password }])
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
