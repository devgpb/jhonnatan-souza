import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { propertyId } = req.body

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' })
    }

    try {
      const { data: currentProperty, error: selectError } = await supabase
        .from('properties')
        .select('id, exclusive')
        .eq('id', propertyId)
        .single()

      if (selectError) throw selectError
      if (!currentProperty) return res.status(404).json({ error: 'Property not found' })

      const { data: updatedProperty, error: updateError } = await supabase
        .from('properties')
        .update({
          exclusive: !currentProperty.exclusive
        })
        .eq('id', propertyId)

      if (updateError) throw updateError

      return res.status(200).json({
        message: 'Property exclusive status updated successfully',
        data: updatedProperty,
      })
    } catch (error: any) {
      console.error(error)
      return res.status(500).json({ error: error.message })
    }

  } else if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          price,
          area,
          suites,
          parking,
          images,
          location,
          title,
          brokers (
            name,
            company,
            avatar
          )
        `)
        .eq('exclusive', true)
        .limit(10)

      if (error) throw error

      return res.status(200).json(data)
    } catch (error: any) {
      console.error(error)
      return res.status(500).json({ error: error.message })
    }

  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
