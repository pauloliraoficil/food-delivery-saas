'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Product } from '@/types'

interface MenuItemProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function MenuItem({ product, onAddToCart }: MenuItemProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <h3 className="font-semibold">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {product.promotional_price ? (
              <>
                <span className="text-lg font-bold text-green-600">
                  R$ {product.promotional_price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  R$ {product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">
                R$ {product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="relative w-32 h-32 bg-gray-200 flex-shrink-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              🍽️
            </div>
          )}
          <Button
            size="icon"
            className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 rounded-full h-8 w-8"
            onClick={() => onAddToCart(product)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
