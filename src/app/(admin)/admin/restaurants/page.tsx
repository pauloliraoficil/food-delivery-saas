'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<any[]>([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })
      setRestaurants(data || [])
    }
    fetchRestaurants()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Restaurantes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <Badge variant={restaurant.is_open ? 'default' : 'secondary'}>
                  {restaurant.is_open ? 'Aberto' : 'Fechado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">{restaurant.cuisine_type}</p>
              <p className="text-sm">{restaurant.city}, {restaurant.state}</p>
              <div className="flex justify-between text-sm">
                <span>Avaliação: ⭐ {restaurant.rating?.toFixed(1) || '0.0'}</span>
                <span>Plano: {restaurant.subscription_plan}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
