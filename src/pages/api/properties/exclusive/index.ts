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
      .select('id, exclusive')
      .eq('id', propertyId)
      .single()

    if (selectError) {
      throw selectError
    }
    if (!currentProperty) {
      return res.status(404).json({ error: 'Property not found' })
    }

    // 2) Atualiza o campo exclusive (toggle)
    const { data: updatedProperty, error: updateError } = await supabase
      .from('properties')
      .update({
        exclusive: !currentProperty.exclusive
      })
      .eq('id', propertyId)

    if (updateError) {
      throw updateError
    }

    return res.status(200).json({
      message: `Property exclusive status updated successfully`,
      data: updatedProperty,
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
