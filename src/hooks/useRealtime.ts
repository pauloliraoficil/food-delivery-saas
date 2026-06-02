'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useOrderRealtime(
  orderId: string,
  onStatusChange: (status: string) => void
) {
  useEffect(() => {
    const supabase = createClient()

    const channel: RealtimeChannel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (payload.new && payload.new.status) {
            onStatusChange(payload.new.status as string)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, onStatusChange])
}
