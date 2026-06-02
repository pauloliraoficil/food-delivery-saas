'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductAddon } from '@/types'

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addItem: (product: Product, addons?: ProductAddon[], notes?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (product, addons = [], notes) => {
        const { items, restaurantId } = get()

        if (restaurantId && restaurantId !== product.restaurant_id) {
          if (!confirm('Adicionar item de outro restaurante? O carrinho será limpo.')) {
            return
          }
          set({ items: [], restaurantId: product.restaurant_id })
        }

        const existingItem = items.find(
          (item) => item.product.id === product.id
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...get().items, { product, quantity: 1, addons, notes }],
            restaurantId: product.restaurant_id,
          })
        }
      },

      removeItem: (productId) => {
        const items = get().items.filter(
          (item) => item.product.id !== productId
        )
        set({ items })
        if (items.length === 0) {
          set({ restaurantId: null, restaurantName: null })
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [], restaurantId: null, restaurantName: null })
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => {
          const addonsPrice = item.addons.reduce(
            (a, addon) => a + addon.price,
            0
          )
          return sum + (item.product.price + addonsPrice) * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'food-delivery-cart',
    }
  )
)
