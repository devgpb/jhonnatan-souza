// pages/api/properties/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('featured', true)
          // .eq('delete_at', false)
          .eq('sold', false)

        if (error) throw error

        return res.status(200).json({ data })
      } catch (error: any) {
        console.error('Error fetching featured properties:', error)
        return res.status(500).json({ error: error.message })
      }

    case 'POST': {
      const { propertyId } = req.body

      if (!propertyId) {
        return res.status(400).json({ error: 'Property ID is required' })
      }

      try {
        // 1) Busca a propriedade atual
        const { data: currentProperty, error: selectError } = await supabase
          .from('properties')
          .select('id, featured')
          .eq('id', propertyId)
          .single()

        if (selectError) throw selectError
        if (!currentProperty) {
          return res.status(404).json({ error: 'Property not found' })
        }

        // 2) Alterna o status de destaque
        const isCurrentlyFeatured = currentProperty.featured === true

        const { data: updatedData, error: updateError } = await supabase
          .from('properties')
          .update({ featured: !isCurrentlyFeatured })
          .eq('id', propertyId)

        if (updateError) throw updateError

        // 3) Retorna o resultado
        return res.status(200).json({
          message: `Property ${isCurrentlyFeatured ? 'unmarked as featured' : 'marked as featured'} successfully`,
          data: updatedData,
        })
      } catch (error: any) {
        return res.status(500).json({ error: error.message })
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}
