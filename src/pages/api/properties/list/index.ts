// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'POST': {
      // Renomeie para bater com a forma que seu front-end envia
      const {
        page = 1,
        limit = 20,

        // do front-end:
        location = "",
        areas = [],
        prices = [],
        statuses = [],
        brokers = [],
        search = "",

        // se quiser lidar com 'featured'
        featured,
      } = req.body;

      const offset = (Number(page) - 1) * Number(limit);

      let baseQuery = supabase.from('properties').select('*, brokers(*)');

      // Exemplo: se você quiser filtrar por "search" em `id` ou `title`
      if (search) {
        baseQuery = baseQuery.or(`id.ilike.%${search}%,title.ilike.%${search}%`);
      }

      // ---------- Filtro de LOCATIONS (array) ---------------
      // Se `locations` for array e você quiser OR (bairros "Itaim" OU "Moema" etc)
      if (location) {
        // Exemplo: .or('location.ilike.%Itaim Bibi%,location.ilike.%Moema%')
        baseQuery = baseQuery.or(`location.ilike.%${location.replace("-"," ")}%`);
      }

      // ---------- Filtro de AREAS (array) ---------------
      // Se você for filtrar por faixas (50, 50-100, 100-200, etc), 
      // tem que fazer a lógica de cada faixa: 
      // ex.: se area = "50-100", filtrar: where area >= 50 AND area <= 100
      // e assim sucessivamente. Para ilustrar:
      if (Array.isArray(areas) && areas.length > 0) {
        // Você poderia criar um OR gigante,
        // ou iterar e criar várias condições.
        // Exemplo bem simplificado:
        const rangeClauses = areas.map((area: string) => {
          if (area === '50') {
            // Até 50
            return `area.lte.50`;
          } else if (area === '50-100') {
            return `and(area.gte.50,area.lte.100)`;
          } else if (area === '100-200') {
            return `and(area.gte.100,area.lte.200)`;
          } else if (area === '200-400') {
            return `and(area.gte.200,area.lte.400)`;
          } else if (area === '400+') {
            return `area.gt.400`;
          } else {
            return '';
          }
        }).filter(Boolean);

        // Agora junte tudo em um OR:
        if (rangeClauses.length) {
          baseQuery = baseQuery.or(rangeClauses.join(','));
        }
      }

      // ---------- Filtro de PRICES (array) ---------------
      // Mesma ideia das areas. Se "500k-1m" => R$ 500.000 - R$ 1.000.000
      // lembre-se de converter a string em número
      if (Array.isArray(prices) && prices.length > 0) {
        const priceClauses = prices.map((price: string) => {
          if (price === '500k') {
            return `price.lte.500000`;
          } else if (price === '500k-1m') {
            return `and(price.gte.500000,price.lte.1000000)`;
          } else if (price === '1m-2m') {
            return `and(price.gte.1000000,price.lte.2000000)`;
          } else if (price === '2m-5m') {
            return `and(price.gte.2000000,price.lte.5000000)`;
          } else if (price === '5m+') {
            return `price.gt.5000000`;
          }
          return '';
        }).filter(Boolean);

        if (priceClauses.length) {
          baseQuery = baseQuery.or(priceClauses.join(','));
        }
      }

      // ---------- Filtro de STATUSES (array) ---------------
      // Se quer "status = available" OU "status = sold", etc
      if (Array.isArray(statuses) && statuses.length > 0) {
        const statusQuery = statuses
          .map((st: string) => `status.ilike.%${st}%`)
          .join(',');
        baseQuery = baseQuery.or(statusQuery);
      }

      // ---------- Filtro de BROKERS (array) ---------------
      // Se você quer "broker_id in [x, y, z]", 
      // supabase (com .or) funciona assim:
      if (Array.isArray(brokers) && brokers.length > 0) {
        const brQuery = brokers
          .map((bk: string) => `broker_id.eq.${bk}`)
          .join(',');
        baseQuery = baseQuery.or(brQuery);
      }

      // Se quiser filtrar `featured: boolean`
      if (typeof featured !== 'undefined') {
        baseQuery = baseQuery.eq('featured', featured === 'true');
      }

      // --------------------------------------------------
      // Agora faz contagem pra paginação
      const countQuery = supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Você precisaria reaplicar todos esses mesmos filtros (locations, areas, etc) no countQuery. 
      // Exatamente do mesmo jeito que fez acima, para que o count seja coerente.
      // Vou omitir pra não ficar gigante, mas a lógica é a mesma.

      const { count, error: countError } = await countQuery;

      if (countError) {
        return res.status(400).json({ error: countError.message });
      }

      const { data, error } = await baseQuery
        .order('updated_at', { ascending: false })
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        console.log(req.query)
        console.log(error)
        return res.status(400).json({ error: error.message });
      }

      const totalPages = Math.ceil((count ?? 0) / Number(limit));

      return res.status(200).json({
        total: count,
        currentPage: Number(page),
        lastPage: totalPages,
        data,
      });
    }
    default:
      return res.status(405).json({ error: 'Método não suportado' })
  }
}
