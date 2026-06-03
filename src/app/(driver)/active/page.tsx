'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, CheckCircle } from 'lucide-react'

export default function ActiveDeliveryPage() {
  const [activeOrder, setActiveOrder] = useState<any>(null)

  useEffect(() => {
    const fetchActive = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('orders')
        .select('*, restaurants(name, address, phone), addresses(street, number, neighborhood, city)')
        .eq('driver_id', user.id)
        .eq('status', 'picked_up')
        .single()

      setActiveOrder(data)
    }

    fetchActive()
  }, [])

  const completeDelivery = async () => {
    if (!activeOrder) return
    const supabase = createClient()
    await supabase
      .from('orders')
      .update({ status: 'delivered', actual_delivery: new Date().toISOString() })
      .eq('id', activeOrder.id)
    setActiveOrder(null)
  }

  if (!activeOrder) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma entrega em andamento</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Entrega em Andamento</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedido #{activeOrder.order_number}</CardTitle>
            <Badge className="bg-purple-100 text-purple-800">A caminho</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Buscar em</p>
            <p className="font-medium">{activeOrder.restaurants?.name}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{activeOrder.restaurants?.address}</span>
            </div>
            {activeOrder.restaurants?.phone && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Phone className="h-4 w-4" />
                <span>{activeOrder.restaurants?.phone}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Entregar em</p>
            <p className="font-medium">
              {activeOrder.addresses?.street}, {activeOrder.addresses?.number}
            </p>
            <p className="text-sm text-gray-500">
              {activeOrder.addresses?.neighborhood}, {activeOrder.addresses?.city}
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Pagamento</p>
            <p className="font-medium">R$ {activeOrder.total.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {activeOrder.payment_method === 'cash' ? 'Dinheiro' : activeOrder.payment_method === 'pix' ? 'PIX' : 'Cartão'}
            </p>
          </div>

          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={completeDelivery}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Entrega
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}