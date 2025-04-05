// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET': {
      const { page = 1, limit = 20, property, location, broker, type, status } = req.query;
    
      const offset = (Number(page) - 1) * Number(limit);
    
      // Base da query
      let baseQuery = supabase
        .from('properties')
        .select('*, brokers(*)');
    
      // Aplicando filtros
      if (property) {
        baseQuery = baseQuery.or(`id.ilike.%${property}%,title.ilike.%${property}%`);
      }
    
      if (location) {
        baseQuery = baseQuery.ilike('location', `%${location}%`);
      }
    
      if (broker) {
        baseQuery = baseQuery.eq('broker_id', broker);
      }
    
      if (type) {
        baseQuery = baseQuery.eq('type', type);
      }
    
      if (status) {
        baseQuery = baseQuery.ilike('status', `%${status}%`);
      }
    
      // Fazendo a contagem total (sem range e sem order)
      const countQuery = supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
    
      // Reaplica os filtros na contagem
      if (property) {
        countQuery.or(`id.ilike.%${property}%,title.ilike.%${property}%`);
      }
    
      if (location) {
        countQuery.ilike('location', `%${location}%`);
      }
    
      if (broker) {
        countQuery.eq('broker_id', broker);
      }
    
      if (type) {
        countQuery.eq('type', type);
      }
    
      if (status) {
        countQuery.ilike('status', `%${status}%`);
      }
    
      const { count, error: countError } = await countQuery;
    
      if (countError) {
        return res.status(400).json({ error: countError.message });
      }
    
      // Aplicando ordenação e paginação
      const { data, error } = await baseQuery
        .order('updated_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);
    
      if (error) {
        console.log(req.query)
        console.log(error)
        return res.status(400).json({ error: error.message });
      }
    
      // Estruturando resposta
      const totalPages = Math.ceil((count ?? 0) / Number(limit));
    
      return res.status(200).json({
        total: count,
        currentPage: Number(page),
        lastPage: totalPages,
        data,
      });
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
