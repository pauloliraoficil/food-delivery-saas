'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const ROLE_LABELS: Record<string, string> = {
  customer: 'Cliente',
  restaurant_owner: 'Restaurante',
  driver: 'Entregador',
  admin: 'Admin',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data || [])
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Usuários</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.phone || 'Sem telefone'}</p>
                </div>
                <Badge>{ROLE_LABELS[user.role] || user.role}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
