'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'

export default function DriverHomePage() {
  const [availableOrders, setAvailableOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ todayDeliveries: 0, todayEarnings: 0 })
  const [isOnline, setIsOnline] = useState(false)

  const fetchAvailable = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, restaurants(name, address, city)')
      .eq('status', 'ready')
      .is('driver_id', null)

    setAvailableOrders(data || [])
  }

  useEffect(() => {
    fetchAvailable()
  }, [])

  const acceptOrder = async (orderId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('orders')
      .update({ driver_id: user.id, status: 'picked_up' })
      .eq('id', orderId)

    fetchAvailable()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Entregas Disponíveis</h1>
        <Button
          onClick={() => setIsOnline(!isOnline)}
          className={isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}
        >
          {isOnline ? '🟢 Online' : '⚫ Offline'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Entregas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayDeliveries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ganhos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.todayEarnings.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {availableOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhuma entrega disponível no momento
            </CardContent>
          </Card>
        ) : (
          availableOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Pronto para buscar</Badge>
                    </div>
                    <p className="font-medium">{order.restaurants?.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{order.restaurants?.address}, {order.restaurants?.city}</span>
                    </div>
                    <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
                  </div>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => acceptOrder(order.id)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Aceitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}