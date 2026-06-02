'use client'

import { useState } from 'react'
import { MenuItem } from '@/components/customer/MenuItem'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { Category, Product } from '@/types'

interface MenuSectionProps {
  categories: Category[]
  products: Product[]
  restaurantId: string
}

export function MenuSection({ categories, products, restaurantId }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories[0]?.id || null
  )
  const { addItem } = useCart()

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products

  const handleAddToCart = (product: Product) => {
    addItem(product)
  }

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className={`whitespace-nowrap ${
              selectedCategory === category.id ? 'bg-orange-500 hover:bg-orange-600' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Products */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <MenuItem
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Nenhum item encontrado nesta categoria
        </p>
      )}
    </div>
  )
}
