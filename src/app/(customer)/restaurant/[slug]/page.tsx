import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Star, Clock, MapPin } from 'lucide-react'
import { MenuSection } from './MenuSection'

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!restaurant) notFound()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('display_order')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('is_available', true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200">
        {restaurant.cover_url ? (
          <img
            src={restaurant.cover_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
            🍕
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-sm">({restaurant.total_ratings})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.estimated_delivery_time || 30} min</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.city}, {restaurant.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <MenuSection
        categories={categories || []}
        products={products || []}
        restaurantId={restaurant.id}
      />
    </div>
  )
}
