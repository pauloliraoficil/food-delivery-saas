import { createServerSupabase } from '@/lib/supabase/server'
import { RestaurantCard } from '@/components/customer/RestaurantCard'
import { CategoryFilter } from '@/components/customer/CategoryFilter'

const MOCK_RESTAURANTS = [
  { id: '1', name: 'Pizza Hut', description: 'Pizzas tradicionais e especiais', category: 'Pizza', image_url: null, rating: 4.8, delivery_time: 30, delivery_fee: 8.00, is_open: true, address: 'Av. Paulista, 1000' },
  { id: '2', name: 'Burger King', description: 'Hambúrgueres e combos', category: 'Hambúrguer', image_url: null, rating: 4.6, delivery_time: 20, delivery_fee: 6.00, is_open: true, address: 'Rua Augusta, 500' },
  { id: '3', name: 'Sushi Express', description: 'Sushi e comida japonesa', category: 'Japonesa', image_url: null, rating: 4.9, delivery_time: 35, delivery_fee: 10.00, is_open: true, address: 'Rua Liberdade, 200' },
  { id: '4', name: 'Cantina Bella', description: 'Massas e comida italiana', category: 'Italiana', image_url: null, rating: 4.7, delivery_time: 25, delivery_fee: 7.00, is_open: true, address: 'Rua Oscar Freire, 300' },
  { id: '5', name: 'Açaí do Pará', description: 'Açaí e acompanhamentos', category: 'Brasileira', image_url: null, rating: 4.5, delivery_time: 15, delivery_fee: 5.00, is_open: true, address: 'Av. Brigadeiro, 800' },
  { id: '6', name: 'Arabia Food', description: 'Comida árabe e esfihas', category: 'Árabe', image_url: null, rating: 4.4, delivery_time: 30, delivery_fee: 7.50, is_open: true, address: 'Rua 25 de Março, 150' },
]

export default async function HomePage() {
  let restaurants: any[] = []
  let usingMock = false

  try {
    const supabase = await createServerSupabase()
    const { data } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('rating', { ascending: false })
    restaurants = data || []
    if (restaurants.length === 0) {
      restaurants = MOCK_RESTAURANTS
      usingMock = true
    }
  } catch (err) {
    console.warn('Supabase unavailable, using mock data:', err)
    restaurants = MOCK_RESTAURANTS
    usingMock = true
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo!</h1>
        <p className="text-gray-500">Os melhores restaurantes perto de você</p>
        {usingMock && (
          <p className="text-xs text-amber-600 mt-1">⚠️ Banco de dados não configurado — dados de demonstração</p>
        )}
      </div>

      <CategoryFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant: any) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  )
}
