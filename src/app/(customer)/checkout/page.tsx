'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CreditCard, Banknote, QrCode } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, restaurantId, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'cash'>('card')
  const [loading, setLoading] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = 5.00
  const total = subtotal + deliveryFee

  const handleCheckout = async () => {
    if (!restaurantId || items.length === 0) return

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.promotional_price || item.product.price,
            quantity: item.quantity,
          })),
          restaurantId,
          addressId: 'default-address',
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.orderId) {
        clearCart()
        router.push(`/orders/${data.orderId}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500">Seu carrinho está vazio</p>
        <Button
          className="mt-4 bg-orange-500 hover:bg-orange-600"
          onClick={() => router.push('/')}
        >
          Ver restaurantes
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Finalizar Pedido</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.product.name}</span>
              <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="accent-orange-500"
              />
              <Label className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-5 w-5" />
                Cartão de Crédito/Débito
              </Label>
            </label>
            <label
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === 'pix' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="accent-orange-500"
              />
              <Label className="flex items-center gap-2 cursor-pointer">
                <QrCode className="h-5 w-5" />
                PIX
              </Label>
            </label>
            <label
              className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="accent-orange-500"
              />
              <Label className="flex items-center gap-2 cursor-pointer">
                <Banknote className="h-5 w-5" />
                Dinheiro
              </Label>
            </label>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full bg-orange-500 hover:bg-orange-600"
        size="lg"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processando...' : `Pagar R$ ${total.toFixed(2)}`}
      </Button>
    </div>
  )
}
