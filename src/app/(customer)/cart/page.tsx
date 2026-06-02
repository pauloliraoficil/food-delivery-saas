'use client'

import { useCart } from '@/hooks/useCart'
import { CartItem } from '@/components/customer/CartItem'
import { CartSummary } from '@/components/customer/CartSummary'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { items, clearCart } = useCart()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meu Carrinho</h1>
        {items.length > 0 && (
          <Button variant="ghost" onClick={clearCart}>
            Limpar carrinho
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver restaurantes
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}
