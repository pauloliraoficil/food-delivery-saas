'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/hooks/useCart'

export function CartSummary() {
  const router = useRouter()
  const { items, getSubtotal, getItemCount } = useCart()

  const subtotal = getSubtotal()
  const deliveryFee = items.length > 0 ? 5.00 : 0
  const total = subtotal + deliveryFee

  if (items.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({getItemCount()} itens)</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push('/checkout')}
        >
          Finalizar Pedido
        </Button>
      </CardContent>
    </Card>
  )
}
