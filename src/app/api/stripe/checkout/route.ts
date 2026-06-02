import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { items, restaurantId, addressId, paymentMethod } = body

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, stripe_account_id')
    .eq('id', restaurantId)
    .single()

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  )
  const deliveryFee = 5.00
  const total = subtotal + deliveryFee

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      restaurant_id: restaurantId,
      address_id: addressId,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      payment_method: paymentMethod,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }))

  await supabase.from('order_items').insert(orderItems)

  if (paymentMethod === 'card' || paymentMethod === 'pix') {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === 'pix' ? ['pix'] : ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${order.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      metadata: {
        orderId: order.id,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  }

  return NextResponse.json({ orderId: order.id })
}
