import { createServerSupabase } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Star, Clock, MapPin } from 'lucide-react'
import { MenuSection } from './MenuSection'

const MOCK_DB: Record<string, any> = {
  'pizza-hut': {
    id: '1', slug: 'pizza-hut', name: 'Pizza Hut', rating: 4.8, total_ratings: 234, estimated_delivery_time: 30, city: 'São Paulo', state: 'SP', cover_url: null,
    categories: [
      { id: 'c1', name: 'Pizzas Tradicionais', display_order: 1, restaurant_id: '1', is_active: true },
      { id: 'c2', name: 'Bebidas', display_order: 2, restaurant_id: '1', is_active: true },
    ],
    products: [
      { id: 'p1', name: 'Pizza Margherita', description: 'Molho de tomate, mozzarella, manjericão', price: 28.00, category_id: 'c1', restaurant_id: '1', is_available: true, image_url: null },
      { id: 'p2', name: 'Pizza 4 Queijos', description: 'Mozzarella, provolone, parmesão, gorgonzola', price: 42.00, category_id: 'c1', restaurant_id: '1', is_available: true, image_url: null },
      { id: 'p3', name: 'Pizza Pepperoni', description: 'Molho de tomate, mozzarella, pepperoni', price: 36.00, category_id: 'c1', restaurant_id: '1', is_available: true, image_url: null },
      { id: 'p4', name: 'Coca-Cola 2L', description: 'Refrigerante gelado', price: 12.00, category_id: 'c2', restaurant_id: '1', is_available: true, image_url: null },
    ]
  },
  'burger-king': {
    id: '2', slug: 'burger-king', name: 'Burger King', rating: 4.6, total_ratings: 189, estimated_delivery_time: 20, city: 'São Paulo', state: 'SP', cover_url: null,
    categories: [
      { id: 'c5', name: 'Hambúrgueres', display_order: 1, restaurant_id: '2', is_active: true },
    ],
    products: [
      { id: 'p5', name: 'Whopper', description: 'Pão, carne, alface, tomate, cebola, picles', price: 25.00, category_id: 'c5', restaurant_id: '2', is_available: true, image_url: null },
      { id: 'p6', name: 'Big King', description: 'Dois hambúrgueres, queijo, alface, molho especial', price: 22.00, category_id: 'c5', restaurant_id: '2', is_available: true, image_url: null },
    ]
  },
  'sushi-express': {
    id: '3', slug: 'sushi-express', name: 'Sushi Express', rating: 4.9, total_ratings: 312, estimated_delivery_time: 35, city: 'São Paulo', state: 'SP', cover_url: null,
    categories: [
      { id: 'c7', name: 'Sashimi', display_order: 1, restaurant_id: '3', is_active: true },
    ],
    products: [
      { id: 'p7', name: 'Sashimi Salmão 10un', description: '10 fatias de salmão fresco', price: 45.00, category_id: 'c7', restaurant_id: '3', is_available: true, image_url: null },
      { id: 'p8', name: 'Combo Sushi 20 peças', description: 'Sushi variado com 20 peças', price: 65.00, category_id: 'c7', restaurant_id: '3', is_available: true, image_url: null },
    ]
  }
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let restaurant: any = null
  let categories: any[] = []
  let products: any[] = []

  try {
    const supabase = await createServerSupabase()
    const { data: rest } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .single()

    if (rest) {
      restaurant = rest
      const { data: cats } = await supabase.from('categories').select('*').eq('restaurant_id', rest.id).eq('is_active', true).order('display_order')
      const { data: prods } = await supabase.from('products').select('*').eq('restaurant_id', rest.id).eq('is_available', true)
      categories = cats || []
      products = prods || []
    } else {
      const mock = MOCK_DB[slug]
      if (mock) {
        restaurant = mock
        categories = mock.categories
        products = mock.products
      }
    }
  } catch (err) {
    console.warn('Supabase unavailable, using mock data:', err)
    const mock = MOCK_DB[slug]
    if (mock) {
      restaurant = mock
      categories = mock.categories
      products = mock.products
    }
  }

  if (!restaurant) notFound()

  return (
    <div className="space-y-6">
      <div className="relative h-64 rounded-lg overflow-hidden bg-gray-200">
        {restaurant.cover_url ? (
          <img src={restaurant.cover_url} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">🍕</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400" />
              <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
              <span className="text-sm">({restaurant.total_ratings || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.estimated_delivery_time || 30} min</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.city || 'São Paulo'}, {restaurant.state || 'SP'}</span>
            </div>
          </div>
        </div>
      </div>

      <MenuSection categories={categories} products={products} restaurantId={restaurant.id} />
    </div>
  )
}
