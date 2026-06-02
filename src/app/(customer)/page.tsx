import { createServerSupabase } from '@/lib/supabase/server'
import { RestaurantCard } from '@/components/customer/RestaurantCard'
import { CategoryFilter } from '@/components/customer/CategoryFilter'

export default async function HomePage() {
  const supabase = await createServerSupabase()

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_open', true)
    .order('rating', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo!</h1>
        <p className="text-gray-500">Os melhores restaurantes perto de você</p>
      </div>

      <CategoryFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant as any} />
        ))}
      </div>

      {(!restaurants || restaurants.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum restaurante encontrado</p>
        </div>
      )}
    </div>
  )
}
