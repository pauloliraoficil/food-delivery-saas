'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Novo',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Pronto',
  picked_up: 'A caminho',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  const fetchOrders = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!restaurant) return

    const { data } = await supabase
      .from('orders')
      .select('*, profiles!orders_customer_id_fkey(full_name)')
      .eq('restaurant_id', restaurant.id)
      .order('created_at', { ascending: false })

    setOrders(data || [])
  }

  useEffect(() => {
    fetchOrders()

    const supabase = createClient()
    const channel = supabase
      .channel('restaurant-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = createClient()
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    fetchOrders()
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pedidos</h1>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'preparing', 'ready'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className={filter === f ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            {f === 'all' ? 'Todos' : STATUS_LABELS[f]}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">#{order.order_number}</CardTitle>
                <Badge className={STATUS_COLORS[order.status]}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{order.profiles?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Itens</p>
                <p className="font-medium">R$ {order.total.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    >
                      Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    >
                      Rejeitar
                    </Button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    Preparar
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    Pronto
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
