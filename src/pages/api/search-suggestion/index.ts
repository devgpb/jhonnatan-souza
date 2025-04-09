import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query
  
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ suggestions: [] })
    }
  
    try {
      const { data, error } = await supabase
        .from("properties") // sua tabela de imóveis
        .select("title, location")
        .ilike("title", `%${query}%`) // busca no título
        .limit(5)
  
      if (error) throw error
  
      // Monta lista de sugestões únicas
      const suggestionsSet = new Set<string>()
  
      data.forEach(item => {
        suggestionsSet.add(item.title)
        suggestionsSet.add(item.location)
      })
  
      const suggestions = Array.from(suggestionsSet).filter(Boolean)
  
      return res.status(200).json({ suggestions })
    } catch (err) {
      console.error("Erro na busca automática:", err)
      return res.status(500).json({ suggestions: [] })
    }
  }
