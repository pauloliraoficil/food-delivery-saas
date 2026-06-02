'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, ClipboardList, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/menu', label: 'Cardápio', icon: UtensilsCrossed },
  { href: '/orders', label: 'Pedidos', icon: ClipboardList },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-orange-500">FoodDelivery</h2>
        <p className="text-xs text-gray-500">Painel do Restaurante</p>
      </div>
      <nav className="mt-4">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                pathname === link.href
                  ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
