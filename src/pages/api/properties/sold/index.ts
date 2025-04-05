import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { propertyId } = req.body

  if (!propertyId) {
    return res.status(400).json({ error: 'Property ID is required' })
  }

  try {
    // 1) Busca a propriedade atual
    const { data: currentProperty, error: selectError } = await supabase
      .from('properties')
      .select('id, sold')
      .eq('id', propertyId)
      .single()

    if (selectError) {
      throw selectError
    }
    if (!currentProperty) {
      return res.status(404).json({ error: 'Property not found' })
    }

    // 2) Verifica se está vendida ou não, para decidir como atualizar
    const isCurrentlySold = currentProperty.sold === true

    const { data: updatedData, error: updateError } = await supabase
      .from('properties')
      .update({
        sold: !isCurrentlySold,
        sell_date: isCurrentlySold ? null : new Date(),
        status: isCurrentlySold ? 'disponível' : 'vendido',
      })
      .eq('id', propertyId)

    if (updateError) {
      throw updateError
    }

    // 3) Retorna resultado
    return res.status(200).json({
      message: `Property ${
        isCurrentlySold ? 'unmarked as sold' : 'marked as sold'
      } successfully`,
      data: updatedData,
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
