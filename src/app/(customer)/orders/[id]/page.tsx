'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OrderStatus } from '@/components/customer/OrderStatus'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrderRealtime } from '@/hooks/useRealtime'
import type { Order } from '@/types'

const STATUS_STEPS = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'picked_up',
  'delivered',
]

export default function OrderTrackingPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const fetchOrder = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setOrder(data as Order)
      setCurrentStep(STATUS_STEPS.indexOf(data.status))
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleStatusChange = useCallback((status: string) => {
    setCurrentStep(STATUS_STEPS.indexOf(status))
  }, [])

  useOrderRealtime(id as string, handleStatusChange)

  if (!order) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Pedido #{order.order_number}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Status do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatus currentStep={currentStep} steps={STATUS_STEPS} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de entrega</span>
            <span>R$ {order.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
