import Link from 'next/link'
import { Star, Clock, Truck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          {restaurant.cover_url ? (
            <img
              src={restaurant.cover_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🍕</span>
            </div>
          )}
          {!restaurant.is_open && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Fechado</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">{restaurant.cuisine_type}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.estimated_delivery_time || 30} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>
                {restaurant.delivery_fee > 0
                  ? `R$ ${restaurant.delivery_fee.toFixed(2)}`
                  : 'Grátis'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
